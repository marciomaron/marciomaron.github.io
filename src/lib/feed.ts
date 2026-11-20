import { render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { author, site } from "../config";
import { getArtigos, urlDoArtigo } from "./artigos";
import { nomeDoTema } from "./taxonomia";

const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);

const absolutizar = (html: string) =>
  html.replace(/\b(href|src)="\/(?!\/)([^"]*)"/g, (_, attr, rest) => `${attr}="${site.url}/${rest}"`);

/** RSS 2.0 com o texto integral dos artigos (alimenta a newsletter). */
export async function gerarRss(selfPath: string) {
  const artigos = await getArtigos();
  const container = await AstroContainer.create();
  const itens = [];
  for (const artigo of artigos.slice(0, 50)) {
    const { Content } = await render(artigo);
    const html = absolutizar(await container.renderToString(Content));
    const link = urlDoArtigo(artigo);
    itens.push(`    <item>
      <title>${escapeXml(artigo.data.titulo)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${new Date(`${artigo.data.data}T12:00:00-03:00`).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(author.name)}</dc:creator>
${artigo.data.tema.map((t) => `      <category>${escapeXml(nomeDoTema(t))}</category>`).join("\n")}
      <description>${escapeXml(artigo.data.descricao)}</description>
      <content:encoded><![CDATA[${html.replaceAll("]]>", "]]]]><![CDATA[>")}]]></content:encoded>
    </item>`);
  }
  const ultima = artigos.map((a) => a.data.atualizado).sort().at(-1);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <description>${escapeXml(site.description)}</description>
    <link>${site.url}/</link>
    <language>pt-BR</language>
    <atom:link href="${site.url}${selfPath}" rel="self" type="application/rss+xml"/>
${ultima ? `    <lastBuildDate>${new Date(`${ultima}T12:00:00-03:00`).toUTCString()}</lastBuildDate>\n` : ""}${itens.join("\n")}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
