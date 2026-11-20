#!/bin/zsh
# Publicação automática do blog, executada pelo macOS às 12h e às 19h
# (agendamento em ~/Library/LaunchAgents/br.com.marciomaron.publicacao.plist).
#
# O que faz:
#   1. traz do GitHub o que tiver sido editado pelo site (git pull);
#   2. separa os artigos novos ou alterados em src/content/artigos/ e os
#      arquivos de public/; artigos com "rascunho: true" ficam só no Mac,
#      porque o repositório no GitHub é público;
#   3. compila o site; se houver erro, não envia nada e avisa;
#   4. envia ao GitHub (commit + push), que publica o site em cerca de um minuto;
#   5. mostra uma notificação no Mac com o resultado.
#
# Outras alterações (layout, configuração etc.) não são enviadas por aqui.
# Registro: ~/Library/Logs/publicacao-blog.log
# Teste sem enviar nada: scripts/publicar-automatico.sh --teste

set -u
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export LANG="pt_BR.UTF-8" LC_ALL="pt_BR.UTF-8"

REPO="${0:A:h:h}"
LOG="$HOME/Library/Logs/publicacao-blog.log"
PASTAS=(src/content/artigos public)
TESTE=0
[[ "${1:-}" == "--teste" ]] && TESTE=1

log() { print -r -- "$(date '+%Y-%m-%d %H:%M') $*" >> "$LOG" }
avisar() {
  osascript -e 'on run {titulo, texto}' -e 'display notification texto with title titulo' -e 'end run' \
    "$1" "$2" >/dev/null 2>&1
}
falhar() { log "ERRO: $1"; avisar "Blog: nada foi publicado" "$1"; exit 1 }

# Mantém o registro curto.
if [[ -f "$LOG" ]] && (( $(wc -l < "$LOG") > 1000 )); then
  tail -n 500 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi

cd "$REPO" || falhar "Pasta do site não encontrada."
if (( TESTE )); then log "Início (teste, nada será enviado)"; else log "Início"; fi

# 1. Atualiza a cópia local com o que estiver no GitHub.
git pull --rebase --autostash -q >> "$LOG" 2>&1 \
  || falhar "Não consegui atualizar a cópia local (git pull). Veja o registro."

# 2. Separa o que publicar.
eh_rascunho() {
  awk '{ sub(/\r$/, "") }
       NR == 1 && $0 != "---" { exit }
       NR > 1 && $0 == "---" { exit }
       /^rascunho:[ \t]*true[ \t]*$/ { achou = 1; exit }
       END { exit !achou }' "$1"
}

typeset -U alterados
alterados=(
  ${(0)"$(git diff -z --name-only HEAD -- $PASTAS)"}
  ${(0)"$(git ls-files -z -o --exclude-standard -- $PASTAS)"}
)
publicar=()
rascunhos=()
for f in $alterados; do
  if [[ -f "$f" && "$f" == src/content/artigos/*.md ]] && eh_rascunho "$f"; then
    rascunhos+=("$f")
  else
    publicar+=("$f")
  fi
done

(( ${#rascunhos} )) && log "Rascunhos mantidos só no Mac: ${(j:, :)${rascunhos:t}}"
if (( ${#publicar} == 0 )); then
  log "Nada novo para publicar."
  (( TESTE )) || exit 0
fi
(( ${#publicar} )) && log "A publicar: ${(j:, :)${publicar:t}}"

# 3. Compila o site para conferir se não há erro.
SAIDA="$(mktemp -t publicacao-blog)"
if ! npm run build > "$SAIDA" 2>&1; then
  { print -- "----- saída da compilação -----"; grep -v '^\s*$' "$SAIDA" | tail -n 40; print -- "-----" } >> "$LOG"
  rm -f "$SAIDA"
  falhar "Há um erro em algum artigo. Detalhes em Registros › publicacao-blog.log."
fi
rm -f "$SAIDA"

if (( TESTE )); then
  git push --dry-run -q >> "$LOG" 2>&1 || falhar "Teste: o GitHub recusou o acesso (git push)."
  log "Teste concluído: compilação e acesso ao GitHub funcionando."
  avisar "Blog: teste concluído" "Compilação e acesso ao GitHub funcionando. Nada foi enviado."
  exit 0
fi

# 4. Envia ao GitHub só os arquivos separados acima.
nomes="${(j:, :)${${publicar:t}%.md}}"
git add -A -- $publicar >> "$LOG" 2>&1 || falhar "Não consegui preparar os arquivos (git add)."
git commit -q -m "Publicação automática: $nomes" -- $publicar >> "$LOG" 2>&1 \
  || falhar "Não consegui registrar as alterações (git commit). Veja o registro."
git push -q >> "$LOG" 2>&1 || falhar "Não consegui enviar ao GitHub (git push). Veja o registro."

# 5. Avisa.
log "Enviado ao GitHub: $nomes"
avisar "Blog: enviado ao GitHub" "${#publicar} arquivo(s). O site se atualiza em cerca de um minuto."
