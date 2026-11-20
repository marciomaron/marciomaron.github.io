// Cartão de compartilhamento (Open Graph, 1200×630) com o título composto em
// Playfair Display, a fonte dos títulos do site, gerado na compilação.
import { readFile } from "node:fs/promises";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { author, site } from "../config";

// O Satori não lê WOFF2; estas são instâncias TTF da mesma fonte do site.
const fonte = (peso: number) =>
  readFile(new URL(`../assets/og/playfair-display-${peso}.ttf`, `file://${process.cwd()}/src/lib/`));

let fontes: Promise<{ name: string; data: Buffer; weight: 400 | 600; style: "normal" }[]> | undefined;
const carregarFontes = () =>
  (fontes ??= Promise.all([fonte(400), fonte(600)]).then(([regular, semibold]) => [
    { name: "Playfair Display", data: regular, weight: 400, style: "normal" },
    { name: "Playfair Display", data: semibold, weight: 600, style: "normal" },
  ]));

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({
  type,
  props: { style, children },
});

export async function cartaoOg(titulo: string, rodape = `${author.jobTitle} · ${author.city}`) {
  const tamanho = titulo.length > 110 ? 54 : titulo.length > 70 ? 62 : titulo.length > 40 ? 72 : 84;
  const LARGURA = 1200 - 2 * 84;
  const arvore = el(
    "div",
    {
      width: 1200,
      height: 630,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "64px 84px 56px",
      background: "#fbfaf7",
      color: "#1c1b19",
      fontFamily: "Playfair Display",
    },
    [
      el("div", { display: "flex", width: LARGURA, fontSize: 26, letterSpacing: 4, color: "#6b6862" }, site.name.toUpperCase()),
      el(
        "div",
        { display: "flex", width: LARGURA, fontSize: tamanho, fontWeight: 400, lineHeight: 1.15 },
        titulo,
      ),
      el(
        "div",
        {
          display: "flex",
          width: LARGURA,
          justifyContent: "space-between",
          borderTop: "2px solid #1c1b19",
          paddingTop: 22,
          fontSize: 26,
          color: "#4a4844",
        },
        [
          el("div", { display: "flex" }, rodape),
          el("div", { display: "flex" }, site.url.replace("https://", "")),
        ],
      ),
    ],
  );
  const svg = await satori(arvore as never, { width: 1200, height: 630, fonts: await carregarFontes() });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
}
