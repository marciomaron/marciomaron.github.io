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
  worksFor: organizacao(),
});

export const organizacao = () => ({
  "@type": "LegalService",
  "@id": `${author.worksFor.url}#organizacao`,
  name: author.worksFor.name,
  url: author.worksFor.url,
  telephone: author.worksFor.telefone,
  email: author.worksFor.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: author.worksFor.endereco,
    addressLocality: `${author.worksFor.bairro}, ${author.worksFor.cidade}`,
    addressRegion: author.worksFor.uf,
    addressCountry: "BR",
  },
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

/** Trilha de navegação: [["Principal", "/"], ["Temas", "/temas/"], ...]. */
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
