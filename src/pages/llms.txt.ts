// llms.txt: índice em texto para sistemas de IA. Custo baixo, efeito incerto.
import { author, site } from "../config";
import { getArtigos, urlDoArtigo } from "../lib/artigos";

export async function GET() {
  const artigos = await getArtigos();
  const texto = `# ${site.name}

> ${site.description}

Autor: ${author.name}, ${author.jobTitle.toLowerCase()}, ${author.worksFor.name}, ${author.city}/${author.region}. Perfil: ${author.url}

## Artigos

${artigos.map((a) => `- [${a.data.titulo}](${urlDoArtigo(a)}): ${a.data.descricao}`).join("\n")}
`;
  return new Response(texto, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
