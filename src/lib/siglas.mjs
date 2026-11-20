// Plugin do Markdown: envolve siglas (CARF, STJ, PIS/COFINS) em
// <abbr class="sigla">, para que o CSS as componha em versaletes.
// Numerais romanos (I, II, LIV) e trechos de código ficam de fora.

const SIGLA = /(?<![\p{L}\p{N}])(\p{Lu}{2,})(?![\p{L}\p{N}])/gu;
// Só numerais romanos válidos (LIV, LV, II); "LC" não é numeral e vira sigla.
const ROMANO = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
const IGNORAR = new Set(["code", "pre", "abbr", "script", "style", "kbd", "samp"]);

export const siglas = {
  name: "siglas-em-versaletes",
  text(node, ctx) {
    const parent = ctx.parent(node);
    if (parent?.type === "element" && IGNORAR.has(parent.tagName)) return;
    const value = node.value;
    if (!/\p{Lu}{2}/u.test(value)) return;

    const parts = [];
    let last = 0;
    for (const match of value.matchAll(SIGLA)) {
      const word = match[1];
      if (ROMANO.test(word)) continue;
      if (match.index > last)
        parts.push({ type: "text", value: value.slice(last, match.index) });
      parts.push({
        type: "element",
        tagName: "abbr",
        properties: { className: ["sigla"] },
        children: [{ type: "text", value: word }],
      });
      last = match.index + word.length;
    }
    if (parts.length === 0) return;
    if (last < value.length)
      parts.push({ type: "text", value: value.slice(last) });
    ctx.replaceNode(node, parts);
  },
};
