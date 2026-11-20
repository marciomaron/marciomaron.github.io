// Endereço do feed do site anterior (Publii), mantido para quem já assinava.
import { gerarRss } from "../lib/feed";

export const GET = () => gerarRss("/feed.xml");
