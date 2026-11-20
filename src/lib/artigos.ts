import { getCollection, type CollectionEntry } from "astro:content";
import { selectPublished } from "./publication.mjs";
import { site } from "../config";
import { slugDoTribunal } from "./taxonomia";

export type Artigo = CollectionEntry<"artigos">;

/** Artigos visíveis. Na visualização local, inclui rascunhos e agendados. */
export async function getArtigos(): Promise<Artigo[]> {
  return selectPublished(await getCollection("artigos"), {
    includeAll: import.meta.env.DEV,
  });
}

export const caminhoDoArtigo = (a: Artigo) => `/artigos/${a.id}/`;
export const urlDoArtigo = (a: Artigo) => `${site.url}${caminhoDoArtigo(a)}`;
export const caminhoDoTema = (tema: string) => `/temas/${tema}/`;
export const caminhoDoTribunal = (tribunal: string) =>
  `/tribunais/${slugDoTribunal(tribunal)}/`;

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** "2026-04-03" → "3 de abril de 2026". */
export function dataPorExtenso(iso: string) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return `${dia} de ${MESES[mes - 1]} de ${ano}`;
}

/** "2026-04-03" → "03/04". */
export const diaMes = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

/** Data com horário e fuso de Brasília, para JSON-LD e metadados. */
export const dataHoraBrasilia = (iso: string) => `${iso}T00:00:00-03:00`;

/** Todos os temas em uso, com a contagem de artigos. */
export function temasEmUso(artigos: Artigo[]) {
  const contagem = new Map<string, number>();
  for (const a of artigos)
    for (const t of a.data.tema) contagem.set(t, (contagem.get(t) ?? 0) + 1);
  return [...contagem.entries()].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0], "pt-BR"));
}

/** Todos os tribunais em uso (nome como escrito no primeiro artigo). */
export function tribunaisEmUso(artigos: Artigo[]) {
  const nomes = new Map<string, string>();
  for (const a of artigos)
    if (a.data.tribunal) {
      const slug = slugDoTribunal(a.data.tribunal);
      if (!nomes.has(slug)) nomes.set(slug, a.data.tribunal);
    }
  return [...nomes.entries()].sort((x, y) => x[1].localeCompare(y[1], "pt-BR"));
}
