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
    // LinkedIn is left out until its address is known
    { key: "github", label: "github.com/tolgacakan14", href: "https://github.com/tolgacakan14" },
  ],

  experience: {
    flyrank: { when: "Jul–Aug 2026", what: "AI Engineering Intern, FlyRank AI", sub: "remote" },
    demarke: { when: "Mar–Jul 2025", what: "Sports Marketing Intern, De Marke Agency" },
    btcturk: { when: "Jan–Feb 2025", what: "Product Intern, BTCTurk Technology" },
    toyota: { when: "Jun–Jul 2024", what: "Engineering Intern, Toyota Motor Manufacturing Turkey", sub: "Sakarya" },
  },

  projects: {
    ors: { when: "2025–2026", what: "Industry project, ÖRS Textile", sub: "senior design · team of 5 · Best Senior Design Project Award" },
    tab: { when: "2026–present", what: "Co-founder, TAB Marketing", sub: "[tab-marketing-site.vercel.app](https://tab-marketing-site.vercel.app)" },
    krone: { when: "2026", what: "Krone", sub: "[innerclock.vercel.app](https://innerclock.vercel.app) · unreleased, fully playable" },
    feeddetox: { when: "2026", what: "Feed Detox", sub: "Next.js · EN/TR" },
  },

  education: [
    ["Istanbul Bilgi University", ", BSc Industrial Engineering (2026)"],
    ["Serdivan Fen Lisesi", " (science high school), Sakarya"],
    ["Military service", ": deferred until 2029"],
  ],

  awards: [
    ["Best Senior Design Project Award", ", Industrial Engineering, Istanbul Bilgi University (2026), for the ÖRS Textile project. Top five of its term; presented at CSRP 2026"],
    ["AI Engineering Internship", ", FlyRank AI (2026). Remote and project-based: five reviewed assignments and a capstone", "flyrank"],
    ["AI Fluency: Framework & Foundations", ", Anthropic Education (Jul 2026) · [verify](https://verify.skilljar.com/c/xvnv3q5pttvf)"],
    ["AI Fluency for Builders", ", Anthropic Education (2026)"],
  ],

  publication: [
    ["Chapter XI", ", “Blockchain ve Eğlence Sektörü”, in *Blockchain Teknolojileri ve Sektörel Etkileri*. Nobel Bilimsel Eserler, 2022, as an independent researcher"],
  ],

  leadership: [
    ["Editorial Director", ", Bilgi Blockchain Club (2021–2024). Commissioned and edited the club's publications and shaped its forum and speaker programme"],
    ["International:", " European Summer School, Blockchain to Financial Markets, Prague (2025) · HeForShe Erasmus+ Youth Exchange, Estonia (Dec 2023)"],
    ["Vice President & Operations Lead", ", Atatürkçü Düşünce Kulübü (2021–2024). Ran 10+ forums; largest panel drew 4,000+"],
    ["Drums & songwriting", ", *son sek'*. One album, two singles, live shows ([Spotify](https://open.spotify.com/intl-tr/artist/1ILN8doPYd0l4l9ME6Rtce))"],
  ],
};

import operations from "./variants/operations.mjs";
import product from "./variants/product.mjs";
import marketing from "./variants/marketing.mjs";
import commercial from "./variants/commercial.mjs";

// the first one is also published as the default /tolga-cakan-cv.pdf
export const variants = [operations, product, marketing, commercial];
