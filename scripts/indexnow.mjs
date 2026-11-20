// IndexNow: avisa Bing, Yandex e outros buscadores sobre páginas novas ou
// atualizadas, comparando o sitemap recém-compilado com o que está no ar.
//
//   node scripts/indexnow.mjs comparar   → grava a lista em indexnow-urls.txt
//   node scripts/indexnow.mjs enviar     → envia a lista ao IndexNow
import { readFile, writeFile, appendFile, readdir } from "node:fs/promises";

const SITE = "https://marciomaron.com.br";
const LISTA = "indexnow-urls.txt";

const lerSitemap = (xml) => {
  const mapa = new Map();
  for (const [, bloco] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>(.*?)<\/loc>/.exec(bloco)?.[1]?.trim();
    const lastmod = /<lastmod>(.*?)<\/lastmod>/.exec(bloco)?.[1]?.trim() ?? "";
    if (loc) mapa.set(loc, lastmod.slice(0, 10));
  }
  return mapa;
};

async function saida(chave, valor) {
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `${chave}=${valor}\n`);
}

async function comparar() {
  const novo = lerSitemap(await readFile("dist/sitemap.xml", "utf8"));
  let atual = new Map();
  try {
    const resposta = await fetch(`${SITE}/sitemap.xml`, { headers: { "cache-control": "no-cache" } });
    if (resposta.ok) atual = lerSitemap(await resposta.text());
  } catch (erro) {
    console.log(`Não foi possível ler o sitemap no ar (${erro.message}). Todas as páginas serão consideradas novas.`);
  }
  const alteradas = [...novo.entries()]
    .filter(([url, lastmod]) => !atual.has(url) || atual.get(url) !== lastmod)
    .map(([url]) => url);
  await writeFile(LISTA, alteradas.join("\n"));
  console.log(alteradas.length ? `Páginas novas ou atualizadas:\n${alteradas.join("\n")}` : "Nenhuma página nova ou atualizada.");
  await saida("changed", alteradas.length > 0 ? "true" : "false");
}

async function enviar() {
  const urlList = (await readFile(LISTA, "utf8")).split("\n").filter(Boolean);
  if (urlList.length === 0) return console.log("Nada a enviar.");
  const chave = (await readdir("public")).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))?.replace(".txt", "");
  if (!chave) throw new Error("Arquivo de chave do IndexNow não encontrado em public/.");
  const resposta = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: chave,
      keyLocation: `${SITE}/${chave}.txt`,
      urlList,
    }),
  });
  console.log(`IndexNow respondeu ${resposta.status} para ${urlList.length} endereço(s).`);
  if (resposta.status >= 400) process.exitCode = 1;
}

const comando = process.argv[2];
if (comando === "comparar") await comparar();
else if (comando === "enviar") await enviar();
else {
  console.error("Uso: node scripts/indexnow.mjs comparar|enviar");
  process.exitCode = 1;
}
