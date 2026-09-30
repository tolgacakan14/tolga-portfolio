// Everything the CV variants share. A variant (cv/variants/*.mjs) picks the
// title, profile, links, order, bullet wording and skills for one kind of role;
// the facts below stay the same in every CV.
// Inline markup allowed in strings: *italic* and [text](url).

export const common = {
  name: "Tolga Çakan",
  place: "Istanbul, Turkey",
  email: "tolgacakan@gmail.com",
  phone: { label: "+90 542 262 00 42", href: "tel:+905422620042" },
  portfolio: { label: "tolgacakan.vercel.app", href: "https://tolgacakan.vercel.app" },
  links: [
    { key: "linkedin", label: "linkedin.com/in/mehmettolgacakan", href: "https://www.linkedin.com/in/mehmettolgacakan" },
    { key: "github", label: "github.com/tolgacakan14", href: "https://github.com/tolgacakan14" },
  ],

  experience: {
    flyrank: { when: "Jul–Aug 2026", what: "AI Engineering Intern, FlyRank AI", sub: "remote" },
    demarke: { when: "Mar–Jul 2025", what: "Sports Marketing Intern, De Marke Agency" },
    btcturk: { when: "Jan–Feb 2025", what: "Product Intern, BTCTurk Technology" },
    toyota: { when: "Jun–Jul 2024", what: "Engineering Intern, Toyota Motor Manufacturing Turkey", sub: "Sakarya" },
  },

  projects: {
    ors: { when: "2025–2026", what: "Senior design project, ÖRS Textile", sub: "team of 5 · award-winning" },
    tab: { when: "2026–present", what: "Co-founder, TAB Marketing", sub: "[tab-marketing-site.vercel.app](https://tab-marketing-site.vercel.app)" },
    krone: { when: "2026", what: "Krone", sub: "[innerclock.vercel.app](https://innerclock.vercel.app) · personal project, fully playable" },
    feeddetox: { when: "2026", what: "Feed Detox", sub: "Next.js · EN/TR" },
  },

  degree: { when: "Jun 2026", what: "BSc Industrial Engineering, Istanbul Bilgi University", line: "Serdivan Fen Lisesi (science high school), Sakarya" },

  // keyed so each variant can choose and order them
  awards: {
    award: ["Best Senior Design Project Award", ", Istanbul Bilgi University (2026): chosen from the top five of the term; presented at CSRP 2026"],
    flyrank: ["FlyRank AI", ", AI engineering programme (Jul–Aug 2026): five reviewed assignments and a capstone"],
    aiff: ["[AI Fluency: Framework & Foundations](https://verify.skilljar.com/c/xvnv3q5pttvf)", ", Anthropic (Jul 2026)"],
    aifb: ["AI Fluency for Builders", ", Anthropic (2026)"],
  },

  publication: {
    full: ["Chapter XI", ", “Blockchain ve Eğlence Sektörü”, in *Blockchain Teknolojileri ve Sektörel Etkileri*. Nobel Akademik Yayıncılık, 2022, as an independent researcher"],
    short: ["Book chapter", ", “Blockchain ve Eğlence Sektörü”, Nobel Akademik Yayıncılık, 2022"],
  },

  leadership: {
    editorial: ["Editorial Director", ", Bilgi Blockchain Club (2021–2024): commissioned and edited its publications and forum programme"],
    international: ["International:", " European Summer School, Blockchain to Financial Markets, Prague (2025) · HeForShe Erasmus+ Youth Exchange, Estonia (Dec 2023)"],
    adk: ["Vice President & Operations Lead", ", Atatürkçü Düşünce Kulübü (2021–2024): ran 10+ forums; largest panel drew 4,000+"],
    music: ["Drums & songwriting", ", *son sek'*. One album, two singles, live shows ([Spotify](https://open.spotify.com/intl-tr/artist/1ILN8doPYd0l4l9ME6Rtce))"],
  },

  // used when a variant does not set its own order
  defaults: {
    awards: ["award", "flyrank", "aiff", "aifb"],
    leadership: ["editorial", "international", "adk", "music"],
    publication: "full",
  },
};

import general from "./variants/general.mjs";
import operations from "./variants/operations.mjs";
import product from "./variants/product.mjs";
import marketing from "./variants/marketing.mjs";
import commercial from "./variants/commercial.mjs";

// the first one is also published as the default /tolga-cakan-cv.pdf
export const variants = [general, operations, product, marketing, commercial];
