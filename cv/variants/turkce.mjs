// Turkish CV: general, for Turkish employers and graduate programmes.
export default {
  slug: "turkce",
  lang: "tr",
  photo: true,
  label: { en: "Turkish (Türkçe)", tr: "Türkçe CV" },
  title: "Endüstri Mühendisliği Mezunu · Operasyon, Ürün ve Veri",
  profile: "Haziran 2026'da İstanbul Bilgi Üniversitesi Endüstri Mühendisliği'nden mezun oldum. Toyota fabrikasında, bir fintech ürün ekibinde ve bir spor pazarlama ajansında üç farklı staj yaptım. Çok yönlüyüm; yeni teknolojileri yakından takip ediyor ve hızla öğreniyorum, kendi web ürünlerimi yapay zekâ araçlarıyla geliştiriyorum. Ödüllü bir bitirme projesinin ekibinde yer aldım. Operasyon, ürün, pazarlama veya ticari rollerde sorumluluk alarak öğrenmek ve değer katmak istiyorum.",
  links: ["linkedin", "github"],
  experience: ["demarke", "btcturk", "toyota"],
  projects: ["ors", "tab", "krone"],
  points: {
    demarke: [
      "UEFA Nations League Finals (Almanya) ve Women's EURO 2025'te (İsviçre) sahada PR ekibinde çalıştım.",
      "Basketbol Süper Ligi'nin Instagram hesabını NBA ve EuroLeague ile kıyaslayıp içerik planı önerdim.",
      "Büyük sosyal medya hesapları (115 bine varan takipçi) için aylık KPI raporları ve planlar hazırladım.",
    ],
    btcturk: [
      "Scrum ekibinde sprint planlama, backlog, user story ve roadmap önceliklendirmesine katıldım.",
      "BtcTurk uygulamasını önde gelen yerli ve küresel borsalarla ekran ekran kıyasladım.",
      "Dashboard ve piyasa trend raporları hazırladım; tespit ettiğim eksiklere yönelik öneriler sundum.",
    ],
    toyota: [
      "Montaj Lojistiği biriminde TPS'yi sahada öğrendim: JIT, Jidoka, Kanban ve mal kabulden hatta parça akışı.",
      "İki stajyer arkadaşımla bir Kaizen fikri geliştirip projeye dönüştürdük ve yönetime sunduk.",
    ],
    ors: [
      "Firenin %87,8'ini Pareto ile üç nedene bağladık; iğne bakım maliyetini yarıdan fazla azalttık.",
      "Yaklaşık %800 getirili, kendini 40 günde amorti eden iplik nemölçerini devreye aldık.",
      "MTM ile etiketlemede parça başı süreyi %43 kısalttık; depoyu dijital ikizde ABC ile düzenledik.",
      "QR koli izlenebilirlikli ISO 2859-1 giriş kalite kontrol uygulamasını React/TypeScript ile yazdık.",
    ],
    tab: [
      "Mekânların misafirini dinleyecek basit bir yolu yoktu; iki arkadaşımla NFC/QR çözümleri sunuyoruz.",
      "Kendi bulduğumuz 15'ten fazla işletmede tasarım, üretim ve kurulumu yürütüyor, siteler yapıyorum.",
    ],
    krone: [
      "Arkadaşların kodla aynı odaya girip yarıştığı dokuz mini oyunlu bir mobil oyun geliştirdim.",
    ],
  },
  skills: [
    ["Analiz", "Root cause analysis (Pareto, 4M) · maliyet-fayda ve geri ödeme süresi · KPI raporlama · benchmarking"],
    ["Operasyon", "Yalın üretim ve TPS (Kaizen, 5S, JIT, Kanban) · MTM · ABC analizi · ISO 2859-1 · ergonomi"],
    ["Ürün", "Scrum · backlog ve user story · roadmap · uygulama kıyaslamaları · Jira · Confluence"],
    ["Pazarlama", "Sosyal medya raporlama · içerik planlama · aktivasyon fikirleri · PR ve etkinlik desteği"],
    ["Veri & araçlar", "Excel (VBA) · Power BI · SQL · Python · React · TypeScript · Next.js · Git · LLM araçları"],
    ["Diller", "Türkçe (ana dil) · İngilizce (profesyonel)"],
  ],
  awards: ["award", "flyrank", "aiff", "aifb"],
  leadership: ["editorial", "international", "adk", "music"],
  publication: "short",
  text: {
    place: "İstanbul",
    born: "Doğum yılı: 2002 · Askerlik: 2029'a kadar tecilli",
    experience: {
      demarke: { when: "Mar–Tem 2025", what: "Pazarlama Stajyeri, De Marke Ajansı" },
      btcturk: { when: "Oca–Şub 2025", what: "Ürün Stajyeri, BTCTurk Teknoloji" },
      toyota: { when: "Haz–Tem 2024", what: "Mühendislik Stajyeri, Toyota Otomotiv Sanayi Türkiye", sub: "Sakarya" },
    },
    projects: {
      ors: { when: "2025–2026", what: "Bitirme projesi, ÖRS Tekstil", sub: "5 kişilik ekip · ödüllü" },
      tab: { when: "2026–", what: "Kurucu ortak, TAB Marketing", sub: "[tab-marketing-site.vercel.app](https://tab-marketing-site.vercel.app)" },
      krone: { when: "2026", what: "Krone", sub: "[innerclock.vercel.app](https://innerclock.vercel.app) · kişisel proje, oynanabilir" },
    },
    degree: { when: "Haz 2026", what: "Endüstri Mühendisliği (Lisans), İstanbul Bilgi Üniversitesi", line: "Serdivan Fen Lisesi, Sakarya (2020)" },
    awards: {
      award: ["En İyi Bitirme Projesi Ödülü", ", İstanbul Bilgi Üniversitesi (2026): dönemin en iyi beş projesinden biri; CSRP 2026'da sunuldu"],
      flyrank: ["FlyRank AI", ", yapay zekâ mühendisliği programı (Tem–Ağu 2026): beş ödev ve bir bitirme projesi tamamlandı"],
      aiff: ["[AI Fluency: Framework & Foundations](https://verify.skilljar.com/c/xvnv3q5pttvf)", ", Anthropic (Tem 2026)"],
      aifb: ["AI Fluency for Builders", ", Anthropic (2026)"],
    },
    publication: { short: ["Kitap bölümü", ", “Blockchain ve Eğlence Sektörü”, *Blockchain Teknolojileri ve Sektörel Etkileri*, Nobel Akademik Yayıncılık, 2022"] },
    leadership: {
      editorial: ["Yayın Yönetmeni", ", Bilgi Blockchain Kulübü (2021–2024): yayınların editörlüğünü yaptım, forum programını şekillendirdim"],
      international: ["Uluslararası:", " European Summer School, Blockchain to Financial Markets, Prag (2025) · HeForShe Erasmus+, Estonya (2023)"],
      adk: ["Başkan Yardımcısı ve Sosyal Medya Sorumlusu", ", BilgiADK (2021–2024): 10'dan fazla forum düzenledik; en büyük panele 4.000'i aşkın kişi katıldı"],
      music: ["Davul ve şarkı yazarlığı", ", *son sek'* grubu: bir albüm, iki single, canlı performanslar ([Spotify](https://open.spotify.com/intl-tr/artist/1ILN8doPYd0l4l9ME6Rtce))"],
    },
  },
};
