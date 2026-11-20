// Sitemap com a data de atualização real de cada página (campo "atualizado").
import { site } from "../config";
import {
  getArtigos,
  caminhoDoArtigo,
  caminhoDoTema,
  temasEmUso,
  tribunaisEmUso,
} from "../lib/artigos";

export async function GET() {
  const artigos = await getArtigos();
  const maisRecente = (lista: typeof artigos) =>
    lista.map((a) => a.data.atualizado).sort().at(-1);

  const urls: { caminho: string; lastmod?: string }[] = [
    { caminho: "/", lastmod: maisRecente(artigos) },
    { caminho: "/contato/" },
    { caminho: "/artigos/", lastmod: maisRecente(artigos) },
    { caminho: "/temas/", lastmod: maisRecente(artigos) },
    ...artigos.map((a) => ({ caminho: caminhoDoArtigo(a), lastmod: a.data.atualizado })),
    ...temasEmUso(artigos).map(([t]) => ({
      caminho: caminhoDoTema(t),
      lastmod: maisRecente(artigos.filter((a) => a.data.tema.includes(t))),
    })),
    ...tribunaisEmUso(artigos).map(([slug, nome]) => ({
      caminho: `/tribunais/${slug}/`,
      lastmod: maisRecente(artigos.filter((a) => a.data.tribunal === nome)),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${site.url}${u.caminho}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`,
  )
  .join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
