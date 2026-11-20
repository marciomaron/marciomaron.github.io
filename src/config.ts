// Identidade do site e do autor. Alterar aqui reflete em todas as páginas,
// no RSS, no sitemap e nos dados estruturados (JSON-LD).

export const site = {
  url: "https://marciomaron.com.br",
  name: "Márcio Maron",
  tagline: "Análises e notícias de direito tributário",
  description:
    "Análises e notícias sobre tributos federais, contencioso administrativo e judicial e reforma tributária, por Márcio Maron, advogado tributarista em Brasília.",
  lang: "pt-BR",
  locale: "pt_BR",
  // Google Analytics. Deixe "" para desativar.
  googleAnalyticsId: "G-RFB75SV3LR",
  nav: [
    { label: "Temas", href: "/temas/" },
    { label: "Contato", href: "/contato/" },
    { label: "Busca", href: "/busca/" },
  ],
};

export const author = {
  name: "Márcio Maron",
  jobTitle: "Advogado tributarista",
  city: "Brasília",
  region: "DF",
  // O perfil do autor fica na página inicial.
  url: `${site.url}/`,
  id: `${site.url}/#marcio-maron`,
  email: "marcio.maron@marciomaron.com.br",
  whatsapp:
    "https://wa.me/5561999346785?text=Ol%C3%A1%2C%20consegui%20o%20seu%20contato%20pelo%20seu%20site.%20Preciso%20falar%20com%20voc%C3%AA.",
  linkedin: "https://www.linkedin.com/in/marciomaron",
  sameAs: ["https://www.linkedin.com/in/marciomaron"],
  knowsAbout: [
    "Direito tributário",
    "IRPJ",
    "CSLL",
    "PIS",
    "COFINS",
    "IPI",
    "Contencioso administrativo tributário",
    "CARF",
    "Reforma tributária",
    "IBS",
    "CBS",
    "Imposto Seletivo",
  ],
  worksFor: {
    name: "Advocacia Dias de Souza",
    url: "https://www.advds.com.br/",
    contato: "https://www.advds.com.br/contato",
    endereco: "SHIS QI 15, Conjunto 02, Casa 01",
    bairro: "Lago Sul",
    cidade: "Brasília",
    uf: "DF",
    telefone: "+55 (61) 3329-9400",
    telefoneLink: "tel:+556133299400",
    email: "advds@advds.com.br",
  },
};
