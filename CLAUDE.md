# Contexto para o Claude Code

Blog de notícias e análises tributárias de Márcio Maron (advogado tributarista, OAB/DF 32.631, Advocacia Dias de Souza). Público jurídico, texto em português do Brasil. O autor não é programador: explique em linguagem simples e prefira mudanças pequenas.

## Arquitetura

- Astro 7, saída estática, processador de Markdown Sätteri (`@astrojs/markdown-satteri`). Base: tema PlainBlog, muito modificado.
- Hospedagem: GitHub Pages (repositório `marciomaron/marciomaron.github.io`, branch `main`, domínio `marciomaron.com.br`). Publicação pelo workflow `.github/workflows/publicar.yml` (push em `main` + duas execuções diárias para artigos agendados; nas agendadas, só publica se o sitemap mudou).
- Artigos: `src/content/artigos/AAAA-MM-DD-slug.md` → `/artigos/slug/`. Esquema em `src/content.config.ts` (campos em português: `titulo`, `descricao`, `data`, `atualizado`, `tema`, `tribunal`, `fontes`, `tipo`, `rascunho`). Mensagens de validação em português.
- Filtro de publicação em `src/lib/publication.mjs`: oculta rascunhos e datas futuras (fuso de Brasília) no build; `npm run dev` mostra tudo com aviso.
- Siglas em versaletes: plugin HAST `src/lib/siglas.mjs` (envolve maiúsculas em `<abbr class="sigla">`, ignora numerais romanos válidos e código).
- SEO: JSON-LD em `src/lib/jsonld.ts`; sitemap próprio em `src/pages/sitemap.xml.ts` (com `lastmod` de `atualizado`); RSS em `/rss.xml` e `/feed.xml`; `llms.txt`; cartão OG via Satori + resvg (`src/lib/og.ts`, `src/pages/og/[slug].png.ts`); IndexNow em `scripts/indexnow.mjs` (compara o sitemap novo com o do ar).
- Busca: Pagefind roda após o `astro build` (`npm run build`). Só indexa `[data-pagefind-body]` (corpo dos artigos).
- Fontes: Source Serif 4 variável (wght + opsz), subconjunto latino gerado com `pyftsubset` a partir do release oficial da Adobe, mantendo `smcp`, `c2sc`, `tnum`, `lnum`, `onum`. Os subconjuntos do Fontsource não têm versaletes. Fontes reserva com `size-adjust` em `global.css`.
- Redirecionamentos de endereços antigos (site Publii) em `public/*.html` com meta refresh (GitHub Pages não faz 301).

## Cuidados

- Depois de mudar plugins de Markdown, apague `.astro/` e `node_modules/.astro/`: o Astro guarda o HTML dos artigos em cache.
- No Satori, use `boxSizing: "border-box"` no contêiner raiz; sem isso o padding é somado às dimensões e o rodapé sai do cartão.
- Não renomear artigos publicados (muda a URL).
- Cópia de segurança do site anterior (Publii): `~/Documents/Márcio Maron/backup-site-publii-2026-11-20/`.

## Pendências registradas

- Search Console e Bing Webmaster Tools.
- Newsletter (Buttondown ou MailerLite) pelo RSS.
- Pages CMS para edição pelo navegador.
- Política de robôs de treinamento de IA: hoje liberados em `public/robots.txt`.
