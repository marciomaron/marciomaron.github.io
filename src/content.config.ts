import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import {
  isCalendarDate,
  slugFromFilename,
  toIsoDate,
} from "./lib/publication.mjs";

// Data no formato AAAA-MM-DD, com ou sem aspas no cabeçalho.
const dataAAAAMMDD = z.preprocess(
  toIsoDate,
  z
    .string()
    .refine(
      isCalendarDate,
      "Data inválida. Use o formato AAAA-MM-DD, por exemplo 2026-11-20.",
    ),
);

// Campo opcional deixado em branco no cabeçalho (ex.: "tribunal:") vale como ausente.
const vazio = (value: unknown) =>
  value === null || (typeof value === "string" && value.trim() === "");
const emBranco = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (vazio(value) ? undefined : value), schema);

// Temas: aceita um só (tema: carf) ou uma lista (tema: [pis-cofins, carf]).
const listaDeTemas = z.preprocess(
  (value) => (typeof value === "string" ? [value] : value),
  z
    .array(
      z
        .string()
        .trim()
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Tema inválido. Use letras minúsculas sem acento e hífens, por exemplo reforma-tributaria.",
        ),
    )
    .min(1, "Informe ao menos um tema."),
);

const artigos = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/artigos",
    generateId: ({ entry }) => slugFromFilename(entry),
  }),
  schema: z
    .object({
      titulo: z.string().trim().min(1, "Informe o título."),
      descricao: z
        .string()
        .trim()
        .min(1, "Informe a descrição (uma frase com o fato central).")
        .max(320, "A descrição deve ter no máximo 320 caracteres."),
      data: dataAAAAMMDD,
      atualizado: emBranco(dataAAAAMMDD.optional()),
      tema: listaDeTemas,
      tribunal: emBranco(z.string().trim().min(1).optional()),
      // Cada fonte pode ser só o endereço ou "Nome | endereço". Linhas em branco são ignoradas.
      fontes: z.preprocess(
        (value) =>
          vazio(value)
            ? undefined
            : Array.isArray(value)
              ? value.filter((item) => !vazio(item))
              : value,
        z
          .array(
            z.string().transform((valor, ctx) => {
              const [nome, url] = valor.includes(" | ")
                ? valor.split(" | ").map((p) => p.trim())
                : [undefined, valor.trim()];
              if (!z.url().safeParse(url).success) {
                ctx.addIssue({
                  code: "custom",
                  message: `Fonte inválida: "${valor}". Use o endereço completo (https://...) ou "Nome | https://...".`,
                });
                return z.NEVER;
              }
              return { nome, url };
            }),
          )
          .default([]),
      ),
      tipo: emBranco(
        z
          .enum(["analise", "noticia"], {
            error: "Tipo inválido. Use analise ou noticia.",
          })
          .default("analise"),
      ),
      rascunho: emBranco(z.boolean().default(false)),
    })
    .transform((d) => ({ ...d, atualizado: d.atualizado ?? d.data }))
    .refine((d) => d.atualizado >= d.data, {
      message:
        "A data de atualização não pode ser anterior à data de publicação.",
      path: ["atualizado"],
    }),
});

export const collections = { artigos };
