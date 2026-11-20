import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import { siglas } from "./src/lib/siglas.mjs";

export default defineConfig({
  site: "https://marciomaron.com.br",
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  markdown: {
    processor: satteri({
      hastPlugins: [siglas],
      features: {
        gfm: {
          footnotes: {
            label: "Notas",
            backLabel: "Voltar à referência {reference}",
          },
        },
      },
    }),
  },
  image: { service: { entrypoint: "astro/assets/services/noop" } },
  devToolbar: { enabled: false },
});
