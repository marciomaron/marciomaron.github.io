// Nomes de exibição dos temas e tribunais. O cabeçalho do artigo usa o
// identificador (à esquerda); a página mostra o nome (à direita).
// Tema novo sem entrada aqui também funciona: o nome é derivado do
// identificador ("lucro-presumido" vira "Lucro presumido").

export const temas: Record<string, { nome: string; descricao?: string }> = {
  "reforma-tributaria": {
    nome: "Reforma tributária",
    descricao: "IBS, CBS, Imposto Seletivo e a transição do sistema de tributação do consumo.",
  },
  carf: { nome: "CARF", descricao: "Decisões e jurisprudência do Conselho Administrativo de Recursos Fiscais." },
  "pis-cofins": { nome: "PIS/COFINS" },
  ipi: { nome: "IPI" },
  "irpj-csll": { nome: "IRPJ e CSLL" },
  "devedor-contumaz": {
    nome: "Devedor contumaz",
    descricao: "O regime do devedor contumaz instituído pela LC 225/2026.",
  },
  "codigo-de-defesa-do-contribuinte": {
    nome: "Código de Defesa do Contribuinte",
    descricao: "A Lei Complementar 225/2026 e seus desdobramentos.",
  },
  "processo-administrativo-fiscal": {
    nome: "Processo administrativo fiscal",
    descricao: "Impugnação, recursos e garantias do contribuinte na esfera administrativa.",
  },
};

const capitalizar = (texto: string) =>
  texto.charAt(0).toUpperCase() + texto.slice(1);

export const nomeDoTema = (id: string) =>
  temas[id]?.nome ?? capitalizar(id.replace(/-/g, " "));

export const descricaoDoTema = (id: string) => temas[id]?.descricao;

/** "CSRF" → "csrf"; "TRF 1ª Região" → "trf-1a-regiao". */
export const slugDoTribunal = (nome: string) =>
  nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ª|º/g, "a")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
