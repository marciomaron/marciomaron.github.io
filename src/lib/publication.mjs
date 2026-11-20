// Regras de publicação: validação de datas e nomes de arquivo, e filtro de
// rascunhos e de artigos agendados (data futura).

export function isCalendarDate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)
  )
    return false;
  const [year, month, day] = value.split("-").map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= days[month - 1];
}

/** Converte o valor do cabeçalho (texto ou data YAML) em "AAAA-MM-DD". */
export function toIsoDate(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf()))
    return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value.trim() : value;
}

/**
 * Nome do arquivo → endereço do artigo.
 * "2026-04-03-devedor-contumaz.md" → "devedor-contumaz".
 */
export function slugFromFilename(entry) {
  if (entry.includes("/"))
    throw new Error(
      `O artigo deve ficar direto em src/content/artigos, sem subpastas: ${entry}`,
    );
  const name = entry.replace(/\.md$/, "");
  const match = /^(\d{4}-\d{2}-\d{2})-(.+)$/.exec(name);
  if (!match)
    throw new Error(
      `Nome de arquivo inválido: "${entry}". Use o formato AAAA-MM-DD-titulo-curto.md (por exemplo, 2026-11-20-carf-frete-insumos.md).`,
    );
  const slug = match[2];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new Error(
      `Nome de arquivo inválido: "${entry}". Depois da data, use só letras minúsculas sem acento, números e hífens.`,
    );
  return slug;
}

/** Data de hoje no fuso de Brasília, em "AAAA-MM-DD". */
export function todayInBrasilia(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Artigos visíveis, do mais recente ao mais antigo. Em produção, oculta
 * rascunhos e artigos com data futura. Na visualização local (`npm run dev`),
 * mostra todos, para revisão.
 */
export function selectPublished(posts, { includeAll = false } = {}) {
  const today = todayInBrasilia();
  return posts
    .filter(
      (post) =>
        includeAll || (post.data.rascunho !== true && post.data.data <= today),
    )
    .sort(
      (a, b) =>
        b.data.data.localeCompare(a.data.data) ||
        a.id.localeCompare(b.id, "pt-BR"),
    );
}

/** Situação do artigo, para avisos na visualização local. */
export function statusOf(post) {
  if (post.data.rascunho) return "rascunho";
  if (post.data.data > todayInBrasilia()) return "agendado";
  return "publicado";
}
