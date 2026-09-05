import { useCallback, useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

/* ------------------------------------------------------------------ *
 * A quiet one-page CV. Oxford restraint on the surface; the modern
 * parts (palette, command menu, scroll state) stay out of the way.
 * ------------------------------------------------------------------ */

const LANGS = ["en", "tr"];

const COPY = {
  en: {
    nav: { about: "About", experience: "Experience", skills: "Skills", work: "Work", background: "Background", contact: "Contact" },
    place: "Istanbul, Turkey",
    roles: ["Industrial engineer", "Product manager", "Blockchain researcher", "Builder", "Drummer & songwriter"],
    about: [
      "I read industrial engineering at Istanbul Bilgi University: the study of where a system gives way, and what it costs to put right. I am not a designer by trade — I am an engineer who can specify a product and then build it.",
      "Today I co-run TAB Marketing, where a physical touch becomes a digital result: tap a card and a review page opens, scan a table and the menu loads. Seven products, more than fifteen businesses across Istanbul and Sakarya.",
    ],
    expIntro: "Before I finished my degree I had worked a Toyota assembly line, a crypto exchange, a digital agency and an AI platform. Each taught a different part of the same job: how work really flows, how a product team decides what matters, how a thing gets sold, and how to put AI to work without hand-waving.",
    jobs: [
      { when: "Mar — Jul 2025", what: "Intern, De Marke Agency", note: "Digital marketing, and running the on-site organisation at international tournaments." },
      { when: "Jan — Feb 2025", what: "Product Intern, BTCTurk Technology", note: "Where I learned product management properly: benchmarking, market research and user testing, alongside the internal dashboards and reporting the team read every day." },
      { when: "Jun — Jul 2024", what: "Engineering Intern, Toyota Motor Manufacturing Turkey", note: "Assembly line logistics and Kaizen projects. On-site, Sakarya." },
    ],
    skills: [
      ["Product management", "Benchmarking · market and competitor research · user testing · scoping and requirements · dashboards and reporting"],
      ["Engineering", "Python · SQL · React · TypeScript · Next.js · Vite · Git · Vercel"],
      ["Analysis & tools", "Excel and VBA · Figma · Kaizen and process improvement · vendor and production logistics"],
      ["AI in practice", "LLM-assisted workflows · prompt design and iteration · Anthropic tooling"],
      ["Blockchain & Web3", "Protocol and token economics · exchange and DeFi mechanics · wallets and on-chain fundamentals · sector research, published · club and community leadership"],
      ["Events & operations", "Large-scale forums and conferences · programme and speaker planning · sponsorship · budget · venue logistics · on-the-day operations and teams"],
      ["Physical × digital", "NFC and QR systems · print and production · rollouts across cafés, restaurants and hotels"],
      ["Languages", "Turkish (native) · English (professional)"],
    ],
    workIntro: "Most of it runs through TAB Marketing: NFC review cards, QR menus, hotel key cards and feedback cards for cafés, restaurants and hotels — each one made for a particular business, from the brief through design and production to the site behind it.",
    tabLink: "tab-marketing-site.vercel.app",
    sites: "Sites",
    own: "Own projects",
    rows: [
      { title: "Franco Coffee & Gelato", note: "A digital menu with a build-your-own gelato flavour picker.", href: "https://francoserdivan.com", label: "francoserdivan.com" },
      { title: "Diş Hekimi Melis Çakan", note: "A calm, mobile-first site for a dental practice in Sakarya.", href: "https://dishekimimeliscakan.com", label: "dishekimimeliscakan.com" },
    ],
    projects: [
      { title: "Krone", note: "A web game for the phone: mini-games, rooms, daily challenges, leaderboards.", href: "https://innerclock.vercel.app", label: "innerclock.vercel.app" },
      { title: "FeedDetox", tag: "IN PROGRESS", note: "Taking back your own feed algorithm: seeing what it has learned, and pointing it elsewhere." },
    ],
    bg: {
      education: "Education",
      edu: [["Istanbul Bilgi University", " — Industrial Engineering"], ["Fen Lisesi", " — Sakarya, Turkey"]],
      international: "International",
      intl: [
        ["He For She", ", Erasmus+ Youth Exchange — Saaremaa, Estonia (December 2023). A week with an international group on gender equality and how it tracks with a country's development. Hosted by Artemis Women's Power MTÜ; Youthpass certified."],
        ["European Summer School", ", Blockchain to Financial Markets — Prague, Czechia (2025). A week on where distributed ledgers meet market infrastructure: settlement, tokenised assets and the regulation around them."],
      ],
      involvement: "Involvement",
      inv: [
        ["Vice President & Operations Lead", ", Atatürkçü Düşünce Kulübü, Bilgi University (2021—2024). Ran the club's largest events end to end — forums, panels and conferences — from programme and speakers to sponsorship, budget, venue logistics and the team working the floor on the day."],
        ["Editorial Director", ", Bilgi Blockchain Club (2021—2024). Commissioned and edited what the club published, and helped put together its forums and speaker evenings."],
      ],
      publication: "Publication",
      pub: "Chapter XI, \u201cBlockchain ve E\u011flence Sekt\u00f6r\u00fc\u201d (Blockchain and the Entertainment Industry), in ",
      pubBook: "Blockchain Teknolojileri ve Sektörel Etkileri",
      pubLink: "Nobel, 2022",
      pubMeta: "Written as an independent researcher, published as Mehmet Tolga Çakan · ISBN 978-625-433-825-0 · ORCID 0000-0001-7444-9079",
      programmes: "Awards, programmes & certificates",
      prog: [
        ["Best Senior Design Project Award", ", Department of Industrial Engineering, Istanbul Bilgi University (2026) — for \u201cImprovement of Precision, Quality and Worker Well-Being in Sock Manufacturing: Case of \u00d6RS Textile\u201d. Selected among the top five projects of its term; also presented at CSRP 2026, the 4th Conference on Student Research Projects."],
        ["AI Engineering Internship", ", FlyRank AI (2026) — a remote, project-based programme: five reviewed assignments and a capstone, built around shipping real work rather than coursework."],
        ["AI Fluency: Framework & Foundations", ", Anthropic Education (July 2026)", "https://verify.skilljar.com/c/xvnv3q5pttvf"],
        ["Claude 101", ", Anthropic Education (July 2026)", "https://verify.skilljar.com/c/j8cq55wxfnwn"],
      ],
      music: "Music",
      musicText: "Drums and songwriting in ",
      band: "son sek'",
      musicRest: " — one album, two singles, a handful of live shows.",
    },
    contactText: "Based in Istanbul, open to new projects and roles.",
    cv: "CV ↓",
    verify: "verify ↗",
    setIn: "Set in Newsreader",
  },

  tr: {
    nav: { about: "Hakkımda", experience: "Deneyim", skills: "Yetkinlikler", work: "İşler", background: "Geçmiş", contact: "İletişim" },
    place: "İstanbul, Türkiye",
    roles: ["Endüstri mühendisi", "Ürün yöneticisi", "Blockchain araştırmacısı", "Geliştirici", "Davulcu & söz yazarı"],
    about: [
      "İstanbul Bilgi Üniversitesi'nde endüstri mühendisliği okudum: bir sistemin nerede tıkandığını ve bunu düzeltmenin neye mal olduğunu inceleyen bir disiplin. Mesleğim tasarımcılık değil — bir ürünü tanımlayıp sonra onu kurabilen bir mühendisim.",
      "Bugün TAB Marketing'i ortaklarımla yürütüyorum: fiziksel bir temasın dijital bir sonuca döndüğü yer. Karta dokunuyorsunuz, yorum sayfası açılıyor; masayı okutuyorsunuz, menü geliyor. Yedi ürün, İstanbul ve Sakarya'da on beşten fazla işletme.",
    ],
    expIntro: "Mezun olmadan önce bir Toyota montaj hattında, bir kripto borsasında, bir dijital ajansta ve bir yapay zekâ platformunda çalışmıştım. Her biri aynı işin farklı bir parçasını öğretti: işin gerçekte nasıl aktığını, bir ürün ekibinin neye öncelik verdiğini, bir şeyin nasıl satıldığını ve yapay zekânın laf kalabalığı olmadan nasıl işe koşulacağını.",
    jobs: [
      { when: "Mar — Tem 2025", what: "Stajyer, De Marke Ajans", note: "Dijital pazarlama ve uluslararası turnuvalarda saha organizasyonunun yürütülmesi." },
      { when: "Oca — Şub 2025", what: "Ürün Stajyeri, BTCTurk Teknoloji", note: "Ürün yönetimini asıl burada öğrendim: kıyaslama, pazar araştırması ve kullanıcı testleri; bir yandan da ekibin her gün baktığı iç panolar ve raporlama." },
      { when: "Haz — Tem 2024", what: "Mühendislik Stajyeri, Toyota Motor Manufacturing Türkiye", note: "Montaj hattı lojistiği ve Kaizen projeleri. Sahada, Sakarya." },
    ],
    skills: [
      ["Ürün yönetimi", "Benchmarking · market ve competitor research · user testing · scoping ve requirements · dashboard ve raporlama"],
      ["Mühendislik", "Python · SQL · React · TypeScript · Next.js · Vite · Git · Vercel"],
      ["Analiz & araçlar", "Excel ve VBA · Figma · Kaizen ve süreç iyileştirme · tedarikçi ve üretim lojistiği · supply chain"],
      ["Pratikte yapay zekâ", "LLM destekli workflow'lar · prompt design ve iterasyon · Anthropic araçları"],
      ["Blockchain & Web3", "Protokol ve token economics · exchange ve DeFi mekanikleri · wallet'lar ve on-chain temeller · yayımlanmış sektör araştırması · kulüp ve topluluk liderliği"],
      ["Etkinlik & operasyon", "Büyük ölçekli forum ve konferanslar · program ve konuşmacı planlaması · sponsorluk · bütçe · venue lojistiği · gün içi operasyon ve ekip yönetimi"],
      ["Fiziksel × dijital", "NFC ve QR sistemleri · baskı ve üretim · kafe, restoran ve otellerde saha kurulumu"],
      ["Diller", "Türkçe (ana dil) · İngilizce (profesyonel)"],
    ],
    workIntro: "İşlerin çoğu TAB Marketing üzerinden yürüyor: kafeler, restoranlar ve oteller için NFC yorum kartları, QR menüler, otel oda kartları ve geri bildirim kartları — her biri belirli bir işletme için, brief'ten tasarıma, üretimden arkasındaki siteye kadar.",
    tabLink: "tab-marketing-site.vercel.app",
    sites: "Siteler",
    own: "Kendi projelerim",
    rows: [
      { title: "Franco Coffee & Gelato", note: "Kendi dondurmanı kurabildiğin aroma seçicili dijital menü.", href: "https://francoserdivan.com", label: "francoserdivan.com" },
      { title: "Diş Hekimi Melis Çakan", note: "Sakarya'daki bir diş kliniği için sakin, mobil öncelikli bir site.", href: "https://dishekimimeliscakan.com", label: "dishekimimeliscakan.com" },
    ],
    projects: [
      { title: "Krone", note: "Telefon için bir web oyunu: mini oyunlar, odalar, günlük görevler, liderlik tabloları.", href: "https://innerclock.vercel.app", label: "innerclock.vercel.app" },
      { title: "FeedDetox", tag: "GELİŞTİRİLİYOR", note: "Kendi feed algoritmanı geri almak: senin hakkında ne öğrendiğini görmek ve onu başka bir yöne çevirmek." },
    ],
    bg: {
      education: "Eğitim",
      edu: [["İstanbul Bilgi Üniversitesi", " — Endüstri Mühendisliği"], ["Fen Lisesi", " — Sakarya"]],
      international: "Uluslararası",
      intl: [
        ["He For She", ", Erasmus+ Youth Exchange — Saaremaa, Estonya (Aralık 2023). Uluslararası bir grupla bir hafta: toplumsal cinsiyet eşitliği ve bunun bir ülkenin gelişmişliğiyle ilişkisi. Artemis Women's Power MTÜ ev sahipliğinde; Youthpass sertifikalı."],
        ["European Summer School", ", Blockchain to Financial Markets — Prag, Çekya (2025). Distributed ledger teknolojilerinin piyasa altyapısıyla kesiştiği yer üzerine bir hafta: settlement, tokenized assets ve bunları çevreleyen regülasyon."],
      ],
      involvement: "Kulüpler & topluluk",
      inv: [
        ["Başkan Yardımcısı & Operasyon Lideri", ", Atatürkçü Düşünce Kulübü, Bilgi Üniversitesi (2021—2024). Kulübün en büyük etkinliklerini baştan sona yürüttüm — forumlar, paneller ve konferanslar — programdan konuşmacılara, sponsorluktan bütçeye, mekân lojistiğinden gün içinde sahada çalışan ekibe kadar."],
        ["Yayın Direktörü", ", Bilgi Blockchain Kulübü (2021—2024). Kulübün yayımladığı içeriği yönlendirdim ve düzenledim; forumlarının ve konuşmacı akşamlarının kurgusunda yer aldım."],
      ],
      publication: "Yayın",
      pub: "Bölüm XI, “Blockchain ve Eğlence Sektörü” — ",
      pubBook: "Blockchain Teknolojileri ve Sektörel Etkileri",
      pubLink: "Nobel, 2022",
      pubMeta: "Bağımsız araştırmacı olarak yazıldı, Mehmet Tolga Çakan adıyla yayımlandı · ISBN 978-625-433-825-0 · ORCID 0000-0001-7444-9079",
      programmes: "Ödüller, programlar & sertifikalar",
      prog: [
        ["En İyi Bitirme Projesi Ödülü", ", Endüstri Mühendisliği Bölümü, İstanbul Bilgi Üniversitesi (2026) — \u201cImprovement of Precision, Quality and Worker Well-Being in Sock Manufacturing: Case of \u00d6RS Textile\u201d çalışmasıyla. Dönemin en iyi beş projesi arasına seçildi; ayrıca CSRP 2026\u2019da (4th Conference on Student Research Projects) sunuldu."],
        ["Yapay Zekâ Mühendisliği Stajı", ", FlyRank AI (2026) — uzaktan, proje temelli bir program: değerlendirilen beş ödev ve bir bitirme projesi; ders çözmek yerine gerçek iş çıkarmak üzerine kurulu."],
        ["AI Fluency: Framework & Foundations", ", Anthropic Education (July 2026)", "https://verify.skilljar.com/c/xvnv3q5pttvf"],
        ["Claude 101", ", Anthropic Education (July 2026)", "https://verify.skilljar.com/c/j8cq55wxfnwn"],
      ],
      music: "Müzik",
      musicText: "",
      band: "son sek'",
      musicRest: " grubunda davul çalıyor ve şarkıları yazıyorum — bir albüm, iki single ve birkaç canlı sahne.",
    },
    contactText: "İstanbul'da yaşıyorum, yeni projelere ve rollere açığım.",
    cv: "CV ↓",
    verify: "doğrula ↗",
    setIn: "Newsreader ile dizildi",
  },
};

const SECTION_IDS = ["about", "experience", "skills", "work", "background", "contact"];

const PHONE_DISPLAY = "+90 542 262 00 42";
const PHONE_HREF = "tel:+905422620042";
const EMAIL = "tolgacakan@gmail.com";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300&family=JetBrains+Mono:wght@400;500&display=swap');

.cv {
  --paper: #fcfbf8;
  --paper-2: #f5f2eb;
  --ink: #171613;
  --ink-soft: #56534c;
  --ink-faint: #8d887e;
  --rule: #e2ddd2;
  --accent: #1d3c5a;
  color-scheme: light;

  background: var(--paper);
  color: var(--ink);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 17px;
  line-height: 1.62;
  min-height: 100vh;
  overflow-x: clip;
  transition: background .4s ease, color .4s ease;
}
.cv[data-theme="night"] {
  --paper: #14140f;
  --paper-2: #1b1a15;
  --ink: #ebe7dc;
  --ink-soft: #a09a8d;
  --ink-faint: #6b665c;
  --rule: #2b2921;
  --accent: #8fb8dd;
  color-scheme: dark;
}
.cv *, .cv *::before, .cv *::after { box-sizing: border-box; }
.cv a { color: inherit; text-decoration: none; }
.mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }

.wrap { max-width: 660px; margin: 0 auto; padding: 0 28px; }

/* split: a fixed identity panel, a scrolling record beside it */
.split {
  display: grid; grid-template-columns: minmax(330px, 40%) 1fr;
  max-width: 1280px; margin: 0 auto; align-items: start;
}
.pane-left {
  position: sticky; top: 0; height: 100vh;
  display: flex; flex-direction: column; justify-content: center;
  gap: 22px; padding: 40px 40px 40px 34px;
  border-right: 1px solid var(--rule);
  overflow-y: auto; scrollbar-width: none;
}
.pane-left::-webkit-scrollbar { display: none; }
.pane-right { padding: 0 34px 0 40px; min-width: 0; }
.pane-right .wrap { max-width: none; margin: 0; padding: 0; }

.id-row { display: flex; align-items: center; gap: 18px; }
.tag {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: .18em;
  text-transform: uppercase; color: var(--ink-faint); margin: 0;
}

/* the roles type themselves, as before */
.role-slot {
  font-size: 15px; color: var(--accent); margin: 4px 0 0;
  font-family: 'JetBrains Mono', monospace; letter-spacing: -.01em;
  min-height: 1.5em;
}
.caret {
  display: inline-block; width: 1px; height: .95em; background: var(--accent);
  margin-left: 3px; vertical-align: -.12em; animation: blink 1.05s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0 } }

/* left-hand index */
.pane-nav { display: flex; flex-direction: column; gap: 1px; margin: 4px 0; }
.pane-nav a {
  display: flex; align-items: baseline; gap: 10px; padding: 5px 0;
  font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .07em;
  color: var(--ink-faint); transition: color .25s ease, padding-left .3s cubic-bezier(.2,.8,.2,1);
}
.pane-nav a:hover { color: var(--ink-soft); padding-left: 5px; }
.pane-nav a[data-on="true"] { color: var(--ink); }
.pane-nav a[data-on="true"] .pane-nav-num { color: var(--accent); }
.pane-nav-num { color: var(--ink-faint); transition: color .25s ease; }
.pane-nav-rule {
  flex: 1; height: 1px; background: var(--rule); align-self: center;
  transform: scaleX(0); transform-origin: 0 50%; transition: transform .35s cubic-bezier(.2,.8,.2,1);
}
.pane-nav a[data-on="true"] .pane-nav-rule { transform: scaleX(1); background: var(--accent); opacity: .5; }

.pane-foot { display: flex; flex-direction: column; gap: 14px; margin-top: 4px; }
.tools { display: flex; gap: 6px; }

/* progress rail at the top of the scrolling column */
.rail {
  position: sticky; top: 0; z-index: 20;
  background: color-mix(in srgb, var(--paper) 92%, transparent);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  padding: 14px 0 10px; margin-bottom: -4px;
}
.rail-line { height: 1px; background: var(--rule); position: relative; overflow: hidden; }
.rail-fill {
  position: absolute; inset: 0; background: var(--accent); transform-origin: 0 50%;
  transition: transform .12s linear;
}
.rail-meta {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
  margin-top: 7px; font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-faint);
}
.rail-meta b { color: var(--ink-soft); font-weight: 400; }

/* pointer snaps to whatever it is over */
.snap {
  position: fixed; top: 0; left: 0; z-index: 50; pointer-events: none;
  opacity: 0; will-change: transform, width, height;
  transition: opacity .2s ease, transform .17s cubic-bezier(.2,.9,.25,1),
              width .17s cubic-bezier(.2,.9,.25,1), height .17s cubic-bezier(.2,.9,.25,1);
}
.snap i { position: absolute; width: 5px; height: 5px; border: 1px solid var(--accent); opacity: .75; }
.snap i:nth-child(1) { top: 0; left: 0; border-right: 0; border-bottom: 0; }
.snap i:nth-child(2) { top: 0; right: 0; border-left: 0; border-bottom: 0; }
.snap i:nth-child(3) { bottom: 0; left: 0; border-right: 0; border-top: 0; }
.snap i:nth-child(4) { bottom: 0; right: 0; border-left: 0; border-top: 0; }
@media (hover: none), (pointer: coarse) { .snap { display: none; } }

@media (max-width: 900px) {
  .split { grid-template-columns: 1fr; }
  .pane-left {
    position: static; height: auto; justify-content: flex-start;
    padding: 34px 24px 30px; border-right: 0; border-bottom: 1px solid var(--rule);
  }
  .pane-right { padding: 0 24px; }
}

/* controls */
.chip {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .08em;
  color: var(--ink-faint); background: none; border: 1px solid var(--rule);
  padding: 5px 8px; cursor: pointer; transition: color .25s, border-color .25s;
}
.chip:hover { color: var(--ink); border-color: var(--ink-faint); }
a.chip { display: inline-flex; align-items: center; text-decoration: none; }

/* identity */
.name {
  font-size: clamp(27px, 2.6vw, 33px); font-weight: 400; letter-spacing: -.015em;
  line-height: 1.12; margin: 0;
}
.meta {
  display: flex; flex-direction: column; gap: 7px;
  font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .02em;
}
.meta a, .meta span { color: var(--ink-soft); }

/* sections */
.sec { padding: 40px 0; border-top: 1px solid var(--rule); }
.pane-right .sec:first-of-type { border-top: 0; padding-top: 26px; }
.sec-head { display: flex; align-items: baseline; gap: 12px; margin: 0 0 20px; }
.sec-num {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .1em;
  color: var(--ink-faint); padding-top: 3px;
}
.h2 { font-size: 20px; font-weight: 500; letter-spacing: -.01em; margin: 0; }
.h3 {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .16em;
  text-transform: uppercase; color: var(--ink-faint); margin: 26px 0 10px;
}
.h3:first-of-type { margin-top: 0; }
.p { color: var(--ink-soft); margin: 0 0 14px; }
.p:last-child { margin-bottom: 0; }
.p em { color: var(--ink); }

/* portrait */
.about-top { display: flex; gap: 24px; align-items: flex-start; margin-bottom: 14px; }
.pane-left .p { font-size: 15px; margin-bottom: 12px; }
.portrait {
  flex: 0 0 92px; width: 92px; height: 92px; border-radius: 50%;
  overflow: hidden; position: relative;
  background: radial-gradient(circle at 50% 34%, var(--paper-2) 0%, transparent 72%);
  box-shadow: inset 0 0 0 1px var(--rule);
  transition: box-shadow .4s ease;
}
.portrait::after {
  content: ''; position: absolute; inset: 0; border-radius: 50%;
  box-shadow: inset 0 -14px 22px -18px rgba(0,0,0,.35);
  pointer-events: none;
}
.portrait img { width: 100%; height: 100%; object-fit: cover; display: block; }
.about-top:hover .portrait { box-shadow: inset 0 0 0 1px var(--ink-faint); }
@media (max-width: 560px) {
  .about-top { flex-direction: column; gap: 18px; }
}

/* entries */
.entry {
  display: grid; grid-template-columns: 128px 1fr; gap: 20px;
  padding: 13px 0; border-bottom: 1px solid var(--rule);
}
.entry:last-child { border-bottom: 0; padding-bottom: 0; }
.entry-when {
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .02em;
  color: var(--ink-faint); padding-top: 5px;
}
.entry-what { font-size: 16px; margin: 0 0 2px; }
.entry-note { font-size: 14.5px; color: var(--ink-soft); margin: 0; }

/* plain list */
.list { list-style: none; margin: 0; padding: 0; }
.list li {
  font-size: 15px; color: var(--ink-soft); padding: 6px 0 6px 16px; position: relative;
}
.list li::before {
  content: '·'; position: absolute; left: 3px; color: var(--ink-faint);
}
.list li b { font-weight: 400; color: var(--ink); }

.verify {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: .08em;
  color: var(--ink-faint); border-bottom: 1px solid var(--rule); padding-bottom: 1px;
  white-space: nowrap; transition: color .25s ease, border-color .25s ease;
}
.verify:hover { color: var(--accent); border-color: var(--accent); }

/* links */
.link {
  display: inline-flex; align-items: baseline; gap: 6px;
  font-size: 14.5px; color: var(--ink);
  border-bottom: 1px solid var(--rule); padding-bottom: 1px;
  transition: color .25s ease, border-color .25s ease, gap .25s ease;
}
.link:hover { color: var(--accent); border-color: var(--accent); gap: 10px; }
.link-mono { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }

/* work rows */
.row {
  padding: 15px 0; border-bottom: 1px solid var(--rule);
  display: flex; align-items: baseline; justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.row:last-of-type { border-bottom: 0; }
.row-main { flex: 1 1 300px; }
.row-title { font-size: 16px; margin: 0 0 3px; }
.row-note { font-size: 14.5px; color: var(--ink-soft); margin: 0 0 8px; }

.strip-note {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .08em;
  color: var(--ink-faint); margin: 12px 0 18px;
}

/* reveal — barely there */
.rise {
  opacity: 0; transform: translateY(8px);
  transition: opacity .55s ease, transform .55s cubic-bezier(.2,.7,.2,1);
  transition-delay: calc(var(--i, 0) * 45ms);
}
.rise.on { opacity: 1; transform: none; }

/* footer */
.foot {
  padding: 34px 0 46px; border-top: 1px solid var(--rule);
  display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .06em;
  color: var(--ink-faint);
}

/* contact lines */
.contact-link {
  color: var(--ink-soft); border-bottom: 1px solid transparent;
  transition: color .25s ease, border-color .25s ease;
}
.contact-link:hover { color: var(--accent); border-color: var(--accent); }

/* section anchors */
.anchor {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--ink-faint);
  opacity: 0; margin-left: 8px; transition: opacity .25s ease, color .25s ease;
}
.sec-head:hover .anchor { opacity: .6; }
.anchor:hover { opacity: 1 !important; color: var(--accent); }

/* skills rows respond to the cursor */
.entry { transition: border-color .3s ease; }
#skills .entry { transition: background .3s ease, padding-left .3s ease; }
#skills .entry:hover {
  background: color-mix(in srgb, var(--paper-2) 70%, transparent);
  padding-left: 8px;
}

/* keyboard focus */
.cv a:focus-visible, .cv button:focus-visible {
  outline: 1px solid var(--accent); outline-offset: 3px; border-radius: 1px;
}

/* print — the page becomes a clean CV sheet */
@media print {
  .nav, .cmd-bg, .chip, .anchor, .foot { display: none !important; }
  .cv { background: #fff; color: #000; font-size: 11pt; }
  .cv[data-theme="night"] { --paper: #fff; --ink: #000; --ink-soft: #333; --rule: #ccc; }
  .wrap { max-width: 100%; padding: 0; }
  .split { display: block; }
  .pane-left {
    position: static; height: auto; border-right: 0; padding: 0 0 12pt;
    border-bottom: 1pt solid #ccc;
  }
  .pane-right { padding: 0; }
  .pane-nav, .snap, .rail { display: none !important; }
  .sec { padding: 14pt 0; break-inside: avoid; }
  .rise { opacity: 1 !important; transform: none !important; }
  .strip { display: none; }
  .portrait { filter: grayscale(1); }
  .head { padding: 0 0 14pt; }
  a { color: #000 !important; }
}

/* command menu */
.cmd-bg {
  position: fixed; inset: 0; z-index: 60; display: grid; place-items: start center;
  padding-top: 16vh; background: color-mix(in srgb, var(--paper) 62%, transparent);
  backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
  animation: fade .18s ease;
}
@keyframes fade { from { opacity: 0 } }
.cmd {
  width: min(440px, 90vw); background: var(--paper);
  border: 1px solid var(--ink-faint); box-shadow: 0 30px 60px -34px rgba(0,0,0,.4);
  animation: pop .2s cubic-bezier(.2,.9,.3,1);
}
@keyframes pop { from { opacity: 0; transform: translateY(-8px) } }
.cmd input {
  width: 100%; border: 0; border-bottom: 1px solid var(--rule); background: none;
  padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px;
  color: var(--ink); outline: none;
}
.cmd ul { list-style: none; margin: 0; padding: 5px; max-height: 44vh; overflow-y: auto; }
.cmd button {
  width: 100%; text-align: left; background: none; border: 0; cursor: pointer;
  padding: 9px 11px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px;
  letter-spacing: .04em; color: var(--ink-soft);
  display: flex; justify-content: space-between; gap: 12px;
  transition: background .15s, color .15s;
}
.cmd button[data-on="true"], .cmd button:hover { background: var(--paper-2); color: var(--ink); }
.cmd button span:last-child { color: var(--ink-faint); font-size: 9.5px; }
.cmd-foot {
  border-top: 1px solid var(--rule); padding: 8px 13px; display: flex; gap: 14px;
  font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .1em; color: var(--ink-faint);
}

@media (max-width: 640px) {
  .nav-links { display: none; }
  .entry { grid-template-columns: 1fr; gap: 3px; }
  .head { padding: 48px 0 34px; }
}

@media (prefers-reduced-motion: reduce) {
  .cv *, .cv *::before, .cv *::after {
    animation-duration: .001ms !important; transition-duration: .001ms !important;
  }
  .rise { opacity: 1; transform: none; }
}
`;

/* ---------------------------------------------------------------- */

function useRise(dep) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".rise").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

function useScrollState(ids) {
  const [s, setS] = useState({ i: 0, p: 0 });
  useEffect(() => {
    let queued = false;
    const measure = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      const line = window.scrollY + window.innerHeight * 0.3;
      let i = 0;
      ids.forEach((id, n) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= line) i = n;
      });
      setS((prev) => (prev.i === i && Math.abs(prev.p - p) < 0.004 ? prev : { i, p }));
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(measure); } };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);
  return s;
}

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/** Roles that type themselves in and out, one after another. */
function RoleTicker({ roles }) {
  const [text, setText] = useState("");
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      return undefined;
    }
    setStill(false);
    setText("");
    let role = 0;
    let pos = 0;
    let deleting = false;
    let timer = 0;
    const step = () => {
      const full = roles[role];
      pos += deleting ? -1 : 1;
      setText(full.slice(0, pos));
      let wait = deleting ? 30 : 58;
      if (!deleting && pos === full.length) { deleting = true; wait = 1900; }
      else if (deleting && pos === 0) { deleting = false; role = (role + 1) % roles.length; wait = 300; }
      timer = window.setTimeout(step, wait);
    };
    timer = window.setTimeout(step, 700);
    return () => window.clearTimeout(timer);
  }, [roles]);

  return (
    <p className="role-slot" aria-hidden={still ? undefined : "true"}>
      {still ? roles.join(" · ") : text}
      {!still && <span className="caret" />}
    </p>
  );
}

/** The pointer gains corner brackets that snap onto whatever it is over. */
function SnapCursor() {
  const box = useRef(null);
  const target = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const SELECTOR = "a, button, .entry, .row-main";

    const paint = () => {
      const el = box.current;
      const t = target.current;
      if (!el) return;
      if (!t || !t.isConnected) { el.style.opacity = "0"; return; }
      const r = t.getBoundingClientRect();
      el.style.opacity = "1";
      el.style.transform = "translate(" + (r.left - 5) + "px," + (r.top - 5) + "px)";
      el.style.width = (r.width + 10) + "px";
      el.style.height = (r.height + 10) + "px";
    };

    const onMove = (e) => {
      const next = e.target instanceof Element ? e.target.closest(SELECTOR) : null;
      if (next === target.current) return;
      target.current = next;
      paint();
    };
    const onOut = () => { target.current = null; paint(); };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onOut);
    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", paint);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onOut);
      window.removeEventListener("scroll", paint);
      window.removeEventListener("resize", paint);
    };
  }, []);

  return <div className="snap" ref={box} aria-hidden="true"><i /><i /><i /><i /></div>;
}

function ContactLine({ href, children }) {
  return (
    <a className="contact-link" href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}>
      {children}
    </a>
  );
}

function SecHead({ num, title, id }) {
  return (
    <div className="sec-head rise">
      <span className="sec-num">{num}</span>
      <h2 className="h2">
        {title}
        <a className="anchor" href={"#" + id} aria-label={title}
          onClick={(e) => { e.preventDefault(); go(id); history.replaceState(null, "", "#" + id); }}>§</a>
      </h2>
    </div>
  );
}

function CommandMenu({ open, onClose, onTheme, onLang, t, lang }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const ref = useRef(null);

  const items = [
    ...SECTION_IDS.slice(1).map((id) => ({ k: id, label: t.nav[id], hint: lang === "tr" ? "Bölüm" : "Section", run: () => go(id) })),
    { k: "lang", label: lang === "en" ? "Türkçe'ye geç" : "Switch to English", hint: lang === "tr" ? "Dil" : "Language", run: onLang },
    { k: "theme", label: lang === "tr" ? "Paleti değiştir" : "Switch palette", hint: lang === "tr" ? "Görünüm" : "View", run: onTheme },
    { k: "cv", label: lang === "tr" ? "CV indir (PDF)" : "Download CV (PDF)", hint: lang === "tr" ? "Dosya" : "File", run: () => { window.location.href = "/tolga-cakan-cv.pdf"; } },
    { k: "mail", label: lang === "tr" ? "E-posta yaz" : "Write an email", hint: lang === "tr" ? "İletişim" : "Contact", run: () => { window.location.href = "mailto:" + EMAIL; } },
    { k: "print", label: lang === "tr" ? "Sayfayı yazdır" : "Print this page", hint: lang === "tr" ? "Sayfa" : "Page", run: () => window.print() },
  ];
  const hits = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (open) { setQ(""); setSel(0); window.setTimeout(() => ref.current?.focus(), 25); }
  }, [open]);

  if (!open) return null;

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((x) => (x + 1) % Math.max(hits.length, 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((x) => (x - 1 + hits.length) % Math.max(hits.length, 1)); }
    else if (e.key === "Enter") { e.preventDefault(); hits[sel]?.run(); onClose(); }
    else if (e.key === "Escape") onClose();
  };

  return (
    <div className="cmd-bg" onClick={onClose} role="presentation">
      <div className="cmd" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Menu">
        <input ref={ref} value={q} placeholder={lang === "tr" ? "git…" : "jump to…"} onKeyDown={onKey}
          onChange={(e) => { setQ(e.target.value); setSel(0); }} />
        <ul>
          {hits.map((it, n) => (
            <li key={it.k}>
              <button type="button" data-on={n === sel ? "true" : "false"}
                onMouseEnter={() => setSel(n)} onClick={() => { it.run(); onClose(); }}>
                <span>{it.label}</span><span>{it.hint}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="cmd-foot"><span>↑↓</span><span>↵</span><span>esc</span></div>
      </div>
    </div>
  );
}

function ProgressRail({ progress, label }) {
  const pct = Math.round(progress * 100);
  return (
    <div className="rail" aria-hidden="true">
      <div className="rail-line">
        <span className="rail-fill" style={{ transform: "scaleX(" + progress + ")" }} />
      </div>
      <div className="rail-meta">
        <b>{label}</b>
        <span>{String(pct).padStart(3, "0")}%</span>
      </div>
    </div>
  );
}

function LeftPane({ active, theme, onTheme, onMenu, onLang, t, lang }) {
  return (
    <aside className="pane-left" id="about">
      <div className="id-row rise">
        <div className="portrait">
          <img src="/tolga.png" alt="Tolga Çakan" width="560" height="560" />
        </div>
        <div>
          <p className="tag">{t.place}</p>
          <h1 className="name">Tolga Çakan</h1>
          <RoleTicker roles={t.roles} />
        </div>
      </div>

      <div className="rise" style={{ "--i": 1 }}>
        {t.about.map((para, n) => <p className="p" key={n}>{para}</p>)}
      </div>

      <nav className="pane-nav rise" style={{ "--i": 2 }}>
        {SECTION_IDS.slice(1).map((id, n) => (
          <a key={id} href={"#" + id} data-on={SECTION_IDS[active] === id ? "true" : "false"}
            onClick={(e) => { e.preventDefault(); go(id); }}>
            <span className="pane-nav-num">{String(n + 2).padStart(2, "0")}</span>
            <span>{t.nav[id]}</span>
            <span className="pane-nav-rule" />
          </a>
        ))}
      </nav>

      <div className="pane-foot rise" style={{ "--i": 3 }}>
        <div className="meta mono">
          <ContactLine href={"mailto:" + EMAIL}>{EMAIL}</ContactLine>
          <ContactLine href={PHONE_HREF}>{PHONE_DISPLAY}</ContactLine>
          <a href="https://github.com/tolgacakan14" target="_blank" rel="noreferrer">github.com/tolgacakan14</a>
        </div>
        <div className="tools">
          <button type="button" className="chip" onClick={onMenu} aria-label="Menu">⌘K</button>
          <button type="button" className="chip" onClick={onLang} aria-label="Change language">
            {lang === "en" ? "TR" : "EN"}
          </button>
          <button type="button" className="chip" onClick={onTheme} aria-label="Switch palette">
            {theme === "night" ? (lang === "tr" ? "Gündüz" : "Day") : (lang === "tr" ? "Gece" : "Night")}
          </button>
          <a className="chip" href="/tolga-cakan-cv.pdf" download>{t.cv}</a>
        </div>
      </div>
    </aside>
  );
}

function Experience({ t }) {
  return (
    <section className="sec" id="experience">
      <div className="wrap">
        <SecHead num="02" title={t.nav.experience} id="experience" />
        <p className="p rise">{t.expIntro}</p>
        {t.jobs.map((r, n) => (
          <div className="entry rise" key={r.what} style={{ "--i": n + 2 }}>
            <span className="entry-when">{r.when}</span>
            <div>
              <p className="entry-what">{r.what}</p>
              <p className="entry-note">{r.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Skills({ t }) {
  return (
    <section className="sec" id="skills">
      <div className="wrap">
        <SecHead num="03" title={t.nav.skills} id="skills" />
        {t.skills.map(([key, val], n) => (
          <div className="entry rise" key={key} style={{ "--i": n + 1 }}>
            <span className="entry-when">{key}</span>
            <p className="entry-note">{val}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Work({ t }) {
  return (
    <section className="sec" id="work">
      <div className="wrap">
        <SecHead num="04" title={t.nav.work} id="work" />
        <p className="p rise" style={{ "--i": 1 }}>{t.workIntro}</p>
        <p className="strip-note rise" style={{ "--i": 2 }}>
          <a className="link link-mono" href="https://tab-marketing-site.vercel.app/#top" target="_blank" rel="noreferrer">
            {t.tabLink} <span>→</span>
          </a>
        </p>

        <h3 className="h3 rise" style={{ "--i": 3 }}>{t.sites}</h3>
        {t.rows.map((r, n) => (
          <div className="row rise" key={r.title} style={{ "--i": n + 4 }}>
            <div className="row-main">
              <p className="row-title">{r.title}</p>
              <p className="row-note">{r.note}</p>
              <a className="link link-mono" href={r.href} target="_blank" rel="noreferrer">{r.label} <span>→</span></a>
            </div>
          </div>
        ))}

        <h3 className="h3 rise" style={{ "--i": 6 }}>{t.own}</h3>
        {t.projects.map((r, n) => (
          <div className="row rise" key={r.title} style={{ "--i": n + 7 }}>
            <div className="row-main">
              <p className="row-title">
                {r.title}
                {r.tag && <span className="mono" style={{ fontSize: 10, letterSpacing: ".1em", color: "var(--ink-faint)", marginLeft: 8 }}>{r.tag}</span>}
              </p>
              <p className="row-note">{r.note}</p>
              {r.href && <a className="link link-mono" href={r.href} target="_blank" rel="noreferrer">{r.label} <span>→</span></a>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Background({ t }) {
  const b = t.bg;
  const list = (items, base) => (
    <ul className="list rise" style={{ "--i": base }}>
      {items.map(([lead, rest, href], n) => (
        <li key={n}>
          <b>{lead}</b>{rest}
          {href && (
            <>
              {" "}
              <a className="verify" href={href} target="_blank" rel="noreferrer">{t.verify}</a>
            </>
          )}
        </li>
      ))}
    </ul>
  );
  return (
    <section className="sec" id="background">
      <div className="wrap">
        <SecHead num="05" title={t.nav.background} id="background" />

        <h3 className="h3 rise">{b.education}</h3>
        {list(b.edu, 1)}

        <h3 className="h3 rise" style={{ "--i": 2 }}>{b.international}</h3>
        {list(b.intl, 3)}

        <h3 className="h3 rise" style={{ "--i": 4 }}>{b.involvement}</h3>
        {list(b.inv, 5)}

        <h3 className="h3 rise" style={{ "--i": 6 }}>{b.publication}</h3>
        <div className="rise" style={{ "--i": 7 }}>
          <p className="p">
            {b.pub}<em>{b.pubBook}</em>.{" "}
            <a className="link link-mono" href="https://www.nobelyayin.com/blockchain-teknolojileri-ve-sektorel-etkileri-19020.html" target="_blank" rel="noreferrer">
              {b.pubLink} <span>→</span>
            </a>
            <br />
            <span className="mono" style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: ".02em" }}>{b.pubMeta}</span>
          </p>
        </div>

        <h3 className="h3 rise" style={{ "--i": 8 }}>{b.programmes}</h3>
        {list(b.prog, 9)}

        <h3 className="h3 rise" style={{ "--i": 10 }}>{b.music}</h3>
        <p className="p rise" style={{ "--i": 11 }}>
          {b.musicText}<em>{b.band}</em>{b.musicRest}{" "}
          <a className="link link-mono" href="https://open.spotify.com/intl-tr/artist/1ILN8doPYd0l4l9ME6Rtce" target="_blank" rel="noreferrer">
            Spotify <span>→</span>
          </a>
        </p>
      </div>
    </section>
  );
}

function Contact({ t }) {
  return (
    <section className="sec" id="contact">
      <div className="wrap">
        <SecHead num="06" title={t.nav.contact} id="contact" />
        <p className="p rise" style={{ "--i": 1 }}>{t.contactText}</p>
        <div className="meta mono rise" style={{ "--i": 2 }}>
          <ContactLine href={"mailto:" + EMAIL}>{EMAIL}</ContactLine>
          <ContactLine href={PHONE_HREF}>{PHONE_DISPLAY}</ContactLine>
          <a href="https://github.com/tolgacakan14" target="_blank" rel="noreferrer">github.com/tolgacakan14</a>
        </div>
      </div>
    </section>
  );
}

export default function CV() {
  const [theme, setTheme] = useState("paper");
  const [lang, setLang] = useState("en");
  const [menu, setMenu] = useState(false);
  const { i, p } = useScrollState(SECTION_IDS);
  const t = COPY[lang];

  useRise(lang);

  // palette: stored choice, else the reader's system setting
  useEffect(() => {
    let saved = null;
    try { saved = window.localStorage.getItem("cv-theme"); } catch (err) { /* blocked */ }
    if (saved === "night" || saved === "paper") { setTheme(saved); return; }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("night");
  }, []);

  // language: ?lang= wins, then a stored choice, then the browser's
  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get("lang");
    if (LANGS.includes(asked)) { setLang(asked); return; }
    let saved = null;
    try { saved = window.localStorage.getItem("cv-lang"); } catch (err) { /* blocked */ }
    if (LANGS.includes(saved)) { setLang(saved); return; }
    if ((navigator.language || "").toLowerCase().startsWith("tr")) setLang("tr");
  }, []);

  // keep <html lang> honest for screen readers and search engines
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const flip = useCallback(() => {
    const swap = () => setTheme((x) => {
      const next = x === "paper" ? "night" : "paper";
      try { window.localStorage.setItem("cv-theme", next); } catch (err) { /* ignore */ }
      return next;
    });
    if (document.startViewTransition) document.startViewTransition(swap);
    else swap();
  }, []);

  const flipLang = useCallback(() => {
    const swap = () => setLang((x) => {
      const next = x === "en" ? "tr" : "en";
      try { window.localStorage.setItem("cv-lang", next); } catch (err) { /* ignore */ }
      const url = new URL(window.location.href);
      if (next === "en") url.searchParams.delete("lang");
      else url.searchParams.set("lang", next);
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      return next;
    });
    if (document.startViewTransition) document.startViewTransition(swap);
    else swap();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setMenu((m) => !m); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // the address bar follows the section in view
  useEffect(() => {
    const id = SECTION_IDS[i];
    if (!id) return;
    const url = new URL(window.location.href);
    url.hash = i === 0 ? "" : id;
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, [i]);

  // arriving on a #hash lands on that section
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) window.setTimeout(() => el.scrollIntoView({ behavior: "auto", block: "start" }), 60);
  }, []);

  return (
    <div className="cv" data-theme={theme}>
      <style>{STYLES}</style>
      <SnapCursor />

      <div className="split">
        <LeftPane active={i} theme={theme} lang={lang} t={t}
          onTheme={flip} onLang={flipLang} onMenu={() => setMenu(true)} />

        <main className="pane-right">
          <ProgressRail progress={p} label={t.nav[SECTION_IDS[i]] ?? t.nav.about} />
          <Experience t={t} />
          <Skills t={t} />
          <Work t={t} />
          <Background t={t} />
          <Contact t={t} />

          <footer className="foot">
            <span>© {new Date().getFullYear()} Tolga Çakan</span>
            <span>{t.setIn}</span>
          </footer>
        </main>
      </div>

      <CommandMenu open={menu} onClose={() => setMenu(false)} onTheme={flip} onLang={flipLang} t={t} lang={lang} />
      <Analytics />
    </div>
  );
}
