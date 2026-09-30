// After `vite build`, writes dist/tr/index.html: the same app with Turkish
// metadata, so search engines and link previews see a real Turkish page.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TITLE = "Tolga Çakan — Endüstri mühendisi: operasyon, ürün ve pazarlama";
const DESC = "İstanbul'da endüstri mühendisliği mezunu. Toyota, BTCTurk ve UEFA turnuvaları stajları, ödüllü bir fabrika iyileştirme projesi ve kendi küçük girişimi.";
const EN_TITLE = "Tolga Çakan — Industrial engineer: operations, product and marketing";

let html = readFileSync("dist/index.html", "utf8");
const swaps = [
  ['<html lang="en">', '<html lang="tr">'],
  [`<title>${EN_TITLE}</title>`, `<title>${TITLE}</title>`],
  [/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${DESC}" />`],
  ['<link rel="canonical" href="https://tolgacakan.vercel.app/" />', '<link rel="canonical" href="https://tolgacakan.vercel.app/tr/" />'],
  [/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${TITLE}" />`],
  [/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${DESC}" />`],
  ['<meta property="og:url" content="https://tolgacakan.vercel.app/" />', '<meta property="og:url" content="https://tolgacakan.vercel.app/tr/" />'],
  ['https://tolgacakan.vercel.app/og.png', 'https://tolgacakan.vercel.app/og-tr.png'],
  ['<meta property="og:locale" content="en_GB" />', '<meta property="og:locale" content="tr_TR" />'],
  ['<meta property="og:locale:alternate" content="tr_TR" />', '<meta property="og:locale:alternate" content="en_GB" />'],
  [/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${TITLE}" />`],
  [/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${DESC}" />`],
];
for (const [from, to] of swaps) {
  const before = html;
  html = typeof from === "string" ? html.split(from).join(to) : html.replace(from, to);
  if (html === before) throw new Error("tr-page: nothing replaced for " + from);
}
mkdirSync("dist/tr", { recursive: true });
writeFileSync("dist/tr/index.html", html);
console.log("dist/tr/index.html");
