# Guia de publicação – marciomaron.com.br

O site é gerado pelo Astro a partir de arquivos de texto (Markdown). Cada envio ao GitHub (`git push`) recompila e publica o site sozinho, em cerca de um minuto.

A pasta do projeto no Mac é:

```
~/Sites/marciomaron.com.br
```

Há um atalho para ela em `Documentos/Márcio Maron/marciomaron.com.br`. A pasta fica fora de Documentos porque o macOS não deixa tarefas agendadas mexerem em Documentos, e para o iCloud não sincronizar os arquivos técnicos do site.

## 1. Publicar um artigo novo

1. Copie o arquivo `modelos/artigo.md` para a pasta `src/content/artigos/`.
2. Renomeie a cópia com a data e um título curto, só com letras minúsculas sem acento, números e hífens:
   `2026-11-20-carf-frete-insumos.md`
   O endereço do artigo será `marciomaron.com.br/artigos/carf-frete-insumos/`. A data do nome não aparece no endereço.
3. Preencha o cabeçalho (entre as linhas `---`) e escreva o texto abaixo dele.
4. Quando estiver pronto, troque `rascunho: true` por `rascunho: false`.
5. Pronto. O Mac envia sozinho ao GitHub às 12h e às 19h (seção 4). Se quiser publicar na hora, use a opção A ou B da seção 4.

### Campos do cabeçalho

| Campo | Obrigatório | O que é |
| --- | --- | --- |
| `titulo` | sim | Título do artigo. Use aspas se tiver dois-pontos. |
| `descricao` | sim | Uma frase com o fato central (até 320 caracteres). Aparece no Google, no compartilhamento e no RSS. |
| `data` | sim | Data de publicação, no formato `AAAA-MM-DD`. |
| `atualizado` | não | Data da última correção relevante. Sem ele, vale a `data`. |
| `tema` | sim | Um ou mais temas: `tema: carf` ou `tema: [pis-cofins, carf]`. |
| `tribunal` | não | `CARF`, `CSRF`, `STJ`, `STF`, `TRF1`... Gera a página do tribunal. |
| `fontes` | não | Links das fontes primárias, um por linha. Pode ser só o endereço ou `Nome | endereço`. |
| `tipo` | não | `analise` (padrão) ou `noticia`. |
| `rascunho` | não | `true` esconde o artigo do site publicado. |

### Temas

Os temas usam identificadores curtos (`reforma-tributaria`, `pis-cofins`, `carf`). O nome que aparece no site fica em `src/lib/taxonomia.ts`. Um tema novo funciona sem cadastro: `lucro-presumido` aparece como "Lucro presumido". Para mudar o nome exibido (por exemplo, `irpj-csll` → "IRPJ e CSLL") ou acrescentar uma descrição, inclua o tema nesse arquivo.

### Formatação do texto

- Parágrafo: deixe uma linha em branco entre parágrafos.
- Intertítulo: `## Intertítulo`.
- Negrito: `**texto**`. Itálico: `*texto*`.
- Citação recuada: comece a linha com `> `.
- Link: `[texto do link](https://endereco)`.
- Nota de rodapé: `[^1]` no ponto da chamada e, no fim do texto, `[^1]: Texto da nota.`
- Siglas em maiúsculas (CARF, STJ, PIS/COFINS) viram versaletes automaticamente.

## 2. Agendar um artigo

Basta colocar no campo `data` uma data futura e `rascunho: false`. O artigo fica oculto até o dia indicado. O GitHub recompila o site duas vezes por dia (00h10 e 07h10, horário de Brasília) e publica o que tiver chegado à data.

Observação: o GitHub suspende rotinas agendadas em repositórios sem nenhuma alteração por 60 dias. Se isso ocorrer, ele envia um e-mail; basta reativar em **Actions → Publicar site → Enable workflow**.

## 3. Corrigir um artigo publicado

Edite o arquivo, altere o campo `atualizado` para a data de hoje e envie ao GitHub. A data de atualização aparece no artigo, no sitemap e nos dados para o Google.

Não renomeie o arquivo de um artigo já publicado: o endereço mudaria e os links antigos deixariam de funcionar.

## 4. Enviar ao GitHub (publicar)

### Automático – todos os dias às 12h e às 19h

O Mac verifica a pasta `src/content/artigos/` (e `public/`) duas vezes por dia. Se houver artigo novo ou alterado, ele:

1. traz antes o que você tiver editado pelo site do GitHub;
2. compila o site para conferir se não há erro;
3. envia ao GitHub, que publica em cerca de um minuto;
4. mostra uma notificação no canto da tela com o resultado.

Cuidados:

- **Rascunhos ficam só no Mac.** Artigo com `rascunho: true` não é enviado, porque o repositório no GitHub é público e qualquer pessoa poderia ler o texto ali. Quando trocar para `rascunho: false`, ele vai no envio seguinte. Artigo com data futura é enviado e fica oculto no site até a data, mas o texto já pode ser lido no GitHub.
- **Se houver erro, nada é enviado.** A notificação avisa, e a mensagem completa fica no registro: abra o app **Console**, clique em **Registros** e depois em `publicacao-blog.log` (ou abra `~/Library/Logs/publicacao-blog.log`). Corrija o arquivo; o envio sai no horário seguinte.
- **O Mac precisa estar ligado.** Se estiver dormindo no horário, o envio acontece quando ele acordar. Se estiver desligado, fica para o próximo horário.
- Só artigos e a pasta `public/` são enviados automaticamente. Mudanças em layout, cores ou configuração precisam da opção A.

Para testar sem enviar nada (compila e confere o acesso ao GitHub):

```bash
~/Sites/marciomaron.com.br/scripts/publicar-automatico.sh --teste
```

Para desligar o envio automático:

```bash
launchctl bootout gui/$(id -u)/br.com.marciomaron.publicacao
```

Para religar:

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/br.com.marciomaron.publicacao.plist
```

### Opção A – pelo Terminal, na hora

```bash
cd ~/Sites/marciomaron.com.br
```

```bash
git add -A
```

```bash
git commit -m "Novo artigo: título curto"
```

```bash
git push
```

### Opção B – pelo site do GitHub, sem Terminal

1. Abra https://github.com/marciomaron/marciomaron.github.io/tree/main/src/content/artigos
2. Clique em **Add file → Create new file** (ou abra um artigo e clique no lápis para editar).
3. Escreva o nome do arquivo e o texto, e clique em **Commit changes**.

Se você usar a opção B, antes de editar no Mac de novo, atualize a cópia local:

```bash
git pull
```

### Acompanhar a publicação

Em https://github.com/marciomaron/marciomaron.github.io/actions cada envio aparece como uma execução de **Publicar site**. Verde: publicado. Vermelho: houve erro; clique na execução e depois em **Compilar o site** para ler a mensagem. As mensagens de erro do cabeçalho estão em português e indicam o arquivo e o campo.

## 5. Ver o site no seu Mac antes de publicar

```bash
cd ~/Sites/marciomaron.com.br
```

```bash
npm run dev
```

Abra http://localhost:4321 no navegador. A página se atualiza a cada vez que você salva o arquivo. Na visualização local aparecem também os rascunhos e os agendados, com um aviso. Para encerrar, tecle `Ctrl + C` no Terminal.

(A busca só funciona no site publicado ou depois de `npm run build` seguido de `npm run preview`.)

## 6. O que o site gera sozinho

- Página do artigo, com autor, datas, fontes e temas.
- Listas por ano (início), por tema (`/temas/...`) e por tribunal (`/tribunais/...`).
- RSS em `/rss.xml` (e no endereço antigo `/feed.xml`), com o texto integral.
- Sitemap em `/sitemap.xml`, com as datas de atualização.
- Dados estruturados (JSON-LD) de artigo, autor, escritório e trilha de navegação.
- Imagem de compartilhamento (1200×630) com o título de cada artigo.
- Índice da busca interna.
- Aviso ao Bing e a outros buscadores (IndexNow) das páginas novas ou atualizadas.

## 7. Onde mudar outras coisas

| O quê | Arquivo |
| --- | --- |
| Nome do site, descrição, menu, Google Analytics | `src/config.ts` |
| Dados do autor, contatos, endereço do escritório | `src/config.ts` |
| Perfil (texto da página inicial) | `src/textos/perfil.md` |
| Página de contato | `src/pages/contato.astro` |
| Nomes e descrições dos temas | `src/lib/taxonomia.ts` |
| Cores, tamanhos, espaçamentos | `src/styles/global.css` |
| Robôs de busca e de IA | `public/robots.txt` |

## 8. Pendências para depois

- Cadastrar o site no Google Search Console e no Bing Webmaster Tools, e enviar o sitemap `https://marciomaron.com.br/sitemap.xml`.
- Newsletter (Buttondown ou MailerLite), alimentada pelo RSS.
- Editor pelo navegador (Pages CMS), se quiser escrever sem Terminal e sem o editor do GitHub.
