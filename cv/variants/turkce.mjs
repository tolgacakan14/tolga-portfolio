// Turkish CV: general, for Turkish employers and graduate programmes.
export default {
  slug: "turkce",
  lang: "tr",
  photo: true,
  label: { en: "Turkish (Türkçe)", tr: "Türkçe CV" },
  title: "Endüstri Mühendisliği Mezunu · Operasyon, Ürün ve Veri",
  profile: "Haziran 2026'da İstanbul Bilgi Üniversitesi Endüstri Mühendisliği'nden mezun oldum. Toyota fabrikasında, bir fintech ürün ekibinde ve bir spor pazarlama ajansında üç farklı staj yaptım. Çok yönlüyüm; kendi web ürünlerimi geliştirerek yeni araçları hızla öğreniyorum ve ödüllü bir bitirme projesinin ekibinde yer aldım. Operasyon, ürün, pazarlama veya ticari rollerde hızlı öğrenmek, sorumluluk almak ve değer katmak istiyorum.",
  links: ["linkedin", "github"],
  experience: ["demarke", "btcturk", "toyota"],
  projects: ["ors", "tab", "krone"],
  points: {
    demarke: [
      "UEFA Nations League Finals ve UEFA Women's EURO 2025'te sahada PR ekibinde çalıştım.",
      "Basketbol Süper Ligi'nin Instagram'ını NBA ve EuroLeague ile kıyaslayıp içerik planı önerdim.",
      "Sosyal Lig'in (115 bin Instagram takipçisi) aylık KPI raporunu ve önerilerini hazırladım.",
    ],
    btcturk: [
      "Ürün ekibinin Scrum'la nasıl çalıştığını öğrendim: backlog, user story, roadmap, önceliklendirme.",
      "BtcTurk uygulamasını rakiplerle kıyasladım; Binance'i Figma'da ekran ekran inceledim.",
      "Dashboard'lar ve piyasa trend raporları hazırladım; eksiklere dair önerileri ürün ekibine sundum.",
    ],
    toyota: [
      "Montaj Lojistiği'nde TPS'yi sahada öğrendim; parça akışını mal kabulden hatta kadar izledim.",
      "İki stajyer arkadaşımla yürüttüğüm Kaizen'de programın %61 verimini tespit edip yönetime sunduk.",
    ],
    ors: [
      "Firenin %87,8'ini Pareto ile üç nedene bağladık; iğne bakım maliyetini yarıdan fazla azalttık.",
      "Kendini 40 günde amorti eden, yılda 692,6 bin TL fireyi önleyen nemölçeri devreye aldık.",
      "MTM ile etiketlemede parça başı süreyi %43 kısalttık; depoyu dijital ikizde ABC ile düzenledik.",
      "QR izlenebilirlikli ISO 2859-1 giriş kalite kontrol uygulamasını (React/TypeScript) birlikte yazdık.",
    ],
    tab: [
      "İşletmelerin misafirini dinlemesi zordu; bu boşluğu iki arkadaşımla NFC/QR çözümleriyle kapatıyoruz.",
      "Kendi bulduğumuz 15+ işletmede tasarım, üretim ve kurulumu yürütüyor, web sitelerini geliştiriyorum.",
    ],
    krone: [
      "Supabase ile canlı çok oyunculu odaları olan dokuz mini oyunluk bir parti oyunu geliştirdim.",
    ],
  },
  skills: [
    ["Analiz", "Root cause analysis (Pareto, 4M) · maliyet–fayda ve geri ödeme · KPI raporlama · benchmarking"],
    ["Operasyon", "Yalın üretim ve TPS (Kaizen, 5S, JIT, Kanban) · MTM · ABC analizi · ISO 2859-1 · ergonomi"],
    ["Ürün", "Scrum · backlog ve user story · roadmap · uygulama incelemeleri (Figma) · Jira · Confluence"],
    ["Pazarlama", "Sosyal medya raporlama · içerik planlama · aktivasyon fikirleri · PR ve etkinlik desteği"],
    ["Veri & araçlar", "Excel (VBA) · Power BI · SQL · Python · React · TypeScript · Next.js · Git · LLM araçları"],
    ["Diller", "Türkçe (ana dil) · İngilizce (profesyonel)"],
  ],
  awards: ["award", "flyrank", "aiff", "aifb"],
  leadership: ["editorial", "international", "adk", "music"],
  publication: "short",
  text: {
    place: "İstanbul",
    born: "Doğum yılı: 2002",
    experience: {
      demarke: { when: "Mar–Tem 2025", what: "Spor Pazarlama Stajyeri, De Marke Ajansı" },
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
      award: ["En İyi Bitirme Projesi Ödülü", ", İstanbul Bilgi Üniversitesi (2026): dönemin en iyi beş projesi arasından; CSRP 2026'da sunuldu"],
      flyrank: ["FlyRank AI", ", yapay zekâ mühendisliği programı (Tem–Ağu 2026): değerlendirilen beş ödev ve bir bitirme projesi"],
      aiff: ["[AI Fluency: Framework & Foundations](https://verify.skilljar.com/c/xvnv3q5pttvf)", ", Anthropic (Temmuz 2026)"],
      aifb: ["AI Fluency for Builders", ", Anthropic (2026)"],
    },
    publication: { short: ["Kitap bölümü", ", “Blockchain ve Eğlence Sektörü”, Nobel Akademik Yayıncılık, 2022"] },
    leadership: {
      editorial: ["Yayın Yönetmeni", ", Bilgi Blockchain Kulübü (2021–2024): yayınları ve forum programını belirleyip düzenledim"],
      international: ["Uluslararası:", " European Summer School, Blockchain to Financial Markets, Prag (2025) · HeForShe Erasmus+, Estonya (2023)"],
      adk: ["Başkan Yardımcısı ve Operasyon Lideri", ", BilgiADK (2021–2024): 10'dan fazla forum; en büyük panel 4.000+ kişi"],
      music: ["Davul ve şarkı yazarlığı", ", *son sek'* grubu: bir albüm, iki single, canlı performanslar ([Spotify](https://open.spotify.com/intl-tr/artist/1ILN8doPYd0l4l9ME6Rtce))"],
    },
  },
};
