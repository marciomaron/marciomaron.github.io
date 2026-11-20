import type { APIRoute } from "astro";
import { site } from "../../config";
import { getArtigos } from "../../lib/artigos";
import { cartaoOg } from "../../lib/og";

export async function getStaticPaths() {
  const artigos = await getArtigos();
  return [
    { params: { slug: "padrao" }, props: { titulo: site.tagline } },
    ...artigos.map((a) => ({ params: { slug: a.id }, props: { titulo: a.data.titulo } })),
  ];
}

export const GET: APIRoute = ({ props }) => cartaoOg(props.titulo as string);
