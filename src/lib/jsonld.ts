// Dados estruturados (schema.org) usados pelo Google e por buscadores com IA.
import { author, site } from "../config";

export const pessoa = () => ({
  "@type": "Person",
  "@id": author.id,
  name: author.name,
  url: author.url,
  jobTitle: author.jobTitle,
  email: `mailto:${author.email}`,
  sameAs: author.sameAs,
  knowsAbout: author.knowsAbout,
  address: {
    "@type": "PostalAddress",
    addressLocality: author.city,
    addressRegion: author.region,
    addressCountry: "BR",
  },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "Inscrição profissional de advogado",
    name: author.oab,
    recognizedBy: { "@type": "Organization", name: author.oabSeccional },
  },
  worksFor: organizacao(),
});

export const organizacao = () => ({
  "@type": "Organization",
  "@id": `${author.worksFor.url}#organizacao`,
  name: author.worksFor.name,
  url: author.worksFor.url,
});

export const referenciaAoAutor = () => ({ "@type": "Person", "@id": author.id, name: author.name, url: author.url });

export const siteWeb = () => ({
  "@type": "WebSite",
  "@id": `${site.url}/#site`,
  url: `${site.url}/`,
  name: site.name,
  description: site.description,
  inLanguage: site.lang,
  publisher: referenciaAoAutor(),
});

/** Trilha de navegação: [["Início", "/"], ["Temas", "/temas/"], ...]. */
export const trilha = (itens: { nome: string; caminho: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: itens.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.nome,
    item: `${site.url}${item.caminho}`,
  })),
});

export const grafo = (...nos: object[]) => ({
  "@context": "https://schema.org",
  "@graph": nos,
});
