import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

/* ------------------------------------------------------------------ *
 * A quiet one-page CV. Oxford restraint on the surface; the modern
 * parts (palette, command menu, scroll state) stay out of the way.
 * ------------------------------------------------------------------ */

const LANGS = ["en", "tr"];

const COPY = {
  en: {
    nav: { about: "About", experience: "Experience", project: "Project", skills: "Skills", work: "Work", background: "Background", contact: "Contact" },
    place: "Istanbul, Turkey",
    roles: ["Industrial engineer", "Process & operations", "Product", "Marketing & PR", "Blockchain researcher", "Web product builder"],
    about: [
      "I was born in Sakarya in 2002 and graduated in industrial engineering from Istanbul Bilgi University in June 2026. I'm at the start of my career, looking for a place to learn fast, take on real work and grow.",
      "I'm versatile and quick to pick up new tools, from lean methods on a factory floor to product software and AI. Internships at Toyota, BTCTurk Technology and De Marke, and an award-winning senior design project, taught me to measure a problem before solving it.",
      "I want to be effective and add value wherever I work. Outside work I build small web products, run a side venture with friends and play drums in son sek'.",
    ],
    expIntro: "Before graduating I did three internships. Each taught a different part of the same job: how work really flows, how a product team decides what matters and how something gets sold.",
    jobs: [
      { when: "Mar–Jul 2025", what: "Marketing Intern, De Marke Agency", lead: "At a sports marketing agency, I learned how a global sponsor's UEFA plans and live tournament content come together.", points: ["Worked in the PR team on site at the UEFA Nations League Finals and UEFA Women's EURO 2025.", "Contributed activation ideas to the Carlsberg UEFA project, such as “VAR Room by Carlsberg” and fan commentary from local pubs.", "Wrote monthly KPI reports and plans for large social media accounts (up to 115K followers); built a BSL content plan from an NBA/EuroLeague Instagram benchmark."] },
      { when: "Jan–Feb 2025", what: "Product Intern, BTCTurk Technology", lead: "In the Product Management team of one of Turkey's largest crypto exchanges, I learned how a product team runs Scrum, from sprint planning to retros.", points: ["Worked with the backlog, user stories with acceptance criteria and the roadmap in Jira and Confluence.", "Benchmarked the BtcTurk app screen by screen against leading Turkish and global exchanges across seven areas; presented the gaps as recommendations.", "Built dashboards and crypto market-trend reports, analysed margin-trading regulation in Turkey and helped IT inventory company apps and tools."] },
      { when: "Jun–Jul 2024", what: "Engineering Intern, Toyota Motor Manufacturing Turkey", lead: "At the Sakarya plant (Corolla, C-HR), I learned the Toyota Production System on the gemba: JIT, Jidoka, Kaizen, Kanban and standard work.", points: ["Followed the Assembly Logistics flow from dock receiving and imported-parts ordering to Devan and SPS (set parts supply) line feeding.", "Developed a Kaizen idea on the internship programme with two fellow interns and turned it into a project: 61% efficiency vs 82% ideal, gap traced by 4M fishbone.", "Proposed a standard programme flow and İSF standard work form; wrote a TPS handbook for future interns; presented them to management."] },
    ],
    skills: [
      ["Product", "Competitive benchmarking and screen-by-screen app reviews · market research · backlog and user stories · roadmap prioritisation · dashboards and reporting · Scrum"],
      ["Operations", "Lean and TPS (Kaizen, 5S, JIT, Jidoka) · root cause analysis (4M fishbone) · Pareto and ABC analysis · MTM · RULA · NIOSH · preventive maintenance · warehouse layout · supplier and production coordination · event operations"],
      ["Data & tools", "Excel (VBA) · SQL · Python · JavaScript · TypeScript · React · Next.js · Blender · Jira · Confluence · LLM-assisted workflows · prompt design"],
      ["Domain", "Crypto exchanges and DeFi · published blockchain research · NFC and QR systems in hospitality"],
      ["Languages", "Turkish (native) · English (professional)"],
    ],
    ors: {
      heading: "Industry project",
      title: "ÖRS Textile · senior design project",
      meta: "2025–2026 · team of five · Best Senior Design Project Award",
      intro: "With a team of five, I worked inside ÖRS Textile, a custom sock maker. We found out why so much output ended up as scrap, fixed the biggest causes and reorganised the labelling station and warehouse. The plant put our changes into practice. What I took from it: on a real factory floor, careful measurement goes further than any clever idea.",
      facts: [
        ["Scrap", "Pareto analysis traced most of the scrap (87.8%) to three causes: needle breakage, yarn moisture and machine faults"],
        ["Maintenance", "Needle care moved from run-to-failure to preventive maintenance, cutting its cost by more than half"],
        ["Moisture", "A yarn moisture meter against the second-largest cause, paying for itself in about 40 days"],
        ["Return", "The business case for the moisture meter shows about 800% ROI"],
        ["Labelling", "The station redesigned with MTM, each piece now 43% faster"],
        ["Warehouse", "Both floors redesigned in a Blender and Python digital twin with ABC slotting; lower-floor storage more than doubled"],
        ["Quality", "An ISO 2859-1 incoming quality control app and QR carton traceability"],
        ["Ergonomics", "Heart-rate, RULA and NIOSH studies behind a worker rotation plan and a lifting aid"],
      ],
      paretoTitle: "Where the scrap came from",
      paretoNote: "120,794 scrapped pairs by cause. Point at a bar.",
      causes: [
        ["Needle breakage", 53687, "Moved to preventive maintenance: cost more than halved"],
        ["Yarn moisture", 32212, "Moisture meter at yarn intake: paid back in about 40 days"],
        ["Machine faults", 20132, "Third of the three causes behind 87.8% of the scrap"],
        ["Yarn stains", 8053, "A smaller cause, kept on watch"],
        ["Machine settings", 6710, "A smaller cause, kept on watch"],
      ],
      pairs: "pairs",
      open: "Open the A3 report",
      poster: "View the poster",
      close: "Close",
      a3Title: "ÖRS Textile · A3 report",
      a3Team: "Team of five · supervised by Prof. Dr. Fatma Canan Çilingir and Dr. Ergun Arı · Istanbul Bilgi University, 2026",
      a3: [
        ["Background", "ÖRS Textile makes custom socks for Europe and North America. In the period we studied it produced 2.68 million pairs and scrapped 4.5% of them: 120,794 pairs."],
        ["Current condition", "Three causes made up 87.8% of the scrap. Labelling was slow and manual, both warehouse floors were cramped, and warehouse work was the heaviest job on site."],
        ["Target", "Cut scrap at its source, speed up labelling, free up warehouse space and make lifting safer."],
        ["Root causes", "Needles were replaced only after they broke. Yarn moisture was never measured at intake. The labelling station wasted motion. Storage had no slotting logic. Loads of 18–23 kg were lifted against a recommended limit under 5 kg."],
        ["Countermeasures", "Preventive maintenance for needles; a yarn moisture meter; a labelling station redesigned with MTM; an ABC-slotted layout tested in a Blender and Python digital twin; an ISO 2859-1 incoming quality control app with QR carton traceability; a worker rotation plan and a lifting aid."],
        ["Results", "Needle maintenance cost down 57.7%. The moisture meter paid for itself in about 40 days. Labelling 43% faster per piece. Lower-floor storage volume up 112%."],
        ["Next", "Keep the Pareto running month by month and take on the next causes."],
      ],
    },
    workIntro: "TAB Marketing is a side venture I started with two friends after seeing venues had no easy way to hear from guests. Project by project, we make NFC/QR review stands, feedback cards, menus, websites and PR: 250+ custom pieces for 15+ self-sourced venues. I lead design, suppliers and on-site setup, and build the sites.",
    tabHeading: "Side venture · TAB Marketing (2026–)",
    tabClients: "Clients include Pehlivan Et Lokantası, İtalyan İşi, BREAK, Soft Coffee Lounge, Elbis Hotel and Cabir Deluxe.",
    hire: {
      label: "Hiring for",
      all: "All roles",
      cvFor: "Download the CV for this role",
      roles: {
        operations: { name: "Operations", intro: "I bring lean operations thinking: TPS on Toyota's gemba, and an ÖRS scrap study with a team of five that more than halved needle-care costs." },
        product: { name: "Product", intro: "I learned how product teams run at BTCTurk Technology, benchmark competitors screen by screen and build working apps like Krone and Feed Detox." },
        marketing: { name: "Marketing", intro: "I bring sports marketing from De Marke: on-site PR at two UEFA tournaments, activation ideas for the Carlsberg UEFA project and monthly social media reporting." },
        commercial: { name: "Commercial", intro: "I turn analysis into cases people act on: at ÖRS, with my team, a moisture meter that paid back in about 40 days; for my side venture, 15+ venues won." },
      },
    },
    tabLink: "See the website",
    sites: "Sites built through TAB",
    own: "Own projects",
    rows: [
      { title: "Franco Coffee & Gelato", note: "I built a mobile-first digital menu for a café in Serdivan, which staff update from a Google Sheet. Guests get a three-question taste quiz, a build-your-own gelato picker with a match score, pairings and saved favourites. Next.js, TypeScript.", href: "https://francoserdivan.com", label: "francoserdivan.com" },
      { title: "Diş Hekimi Melis Çakan", note: "I built a calm, mobile-first site for a dental practice in Sakarya: six treatment pages, a symptom picker that points patients to the right one, FAQ, WhatsApp booking and structured data for search.", href: "https://dishekimimeliscakan.com", label: "dishekimimeliscakan.com" },
    ],
    projects: [
      { title: "Krone", tag: "PERSONAL PROJECT · PLAYABLE", note: "I built a mobile party game with nine mini-games, from reflex and colour tests to golf and a maze of arrows. Friends join a room by code, start on the same server-timed 3-2-1 and share one scoreboard. A Daily Challenge seeds on the date, so every player in the world gets the same five games that day. I made it for my friends. React and TypeScript.", href: "https://innerclock.vercel.app", label: "Play Krone" },
      { title: "Feed Detox", note: "Type what you want to see online and Feed Detox returns a pack of creators, searches and mute keywords for X, Instagram, TikTok and YouTube. It pulls real results from the YouTube API and web search, ranks them for relevance and noise, and shares the pack as a link. I built it bilingual (EN/TR) in Next.js." },
    ],
    bg: {
      education: "Education",
      edu: [["Istanbul Bilgi University", ", BSc Industrial Engineering. Graduated June 2026"], ["Serdivan Fen Lisesi", " (science high school), Sakarya, Turkey. Graduated 2020"]],
      international: "International",
      intl: [
        ["HeForShe", ", Erasmus+ Youth Exchange in Saaremaa, Estonia (December 2023). I spent a week with an international group on gender equality and how it tracks with a country's development. Hosted by Artemis Women's Power MTÜ; Youthpass certified."],
        ["European Summer School", ", Blockchain to Financial Markets, Prague, Czechia (2025), at the French Institute. Over a week, I studied where distributed ledgers meet market infrastructure: settlement, tokenised assets and the regulation around them. I built a project on the topic and presented it to students and researchers from many countries; certificate received."],
      ],
      involvement: "Involvement",
      inv: [
        ["Editorial Director", ", Bilgi Blockchain Club (2021–2024). I ran the club's editorial side, commissioning and editing what it published and shaping its forums and speaker evenings. That work led to my own research on blockchain in the entertainment industry, published as a book chapter in 2022."],
        ["Vice President & Social Media Lead", ", BilgiADK, Bilgi University student club (2021–2024). I ran more than 10 forums and conferences for students across Istanbul; the largest, a live panel, drew more than 4,000 people."],
      ],
      publication: "Publication",
      pub: "Chapter XI, \u201cBlockchain ve E\u011flence Sekt\u00f6r\u00fc\u201d (Blockchain and the Entertainment Industry), in ",
      pubBook: "Blockchain Teknolojileri ve Sektörel Etkileri",
      pubLink: "Nobel Akademik Yayıncılık, 2022",
      pubMeta: "I wrote it as an independent researcher; published as Mehmet Tolga Çakan · ISBN 978-625-433-825-0 · ORCID 0000-0001-7444-9079",
      programmes: "Awards, programmes & certificates",
      prog: [
        ["Best Senior Design Project Award", ", Department of Industrial Engineering, Istanbul Bilgi University (2026), for the ÖRS Textile project in the Project section. Selected among the top five projects of its term; also presented at CSRP 2026."],
        ["FlyRank AI", ", AI engineering programme (July–August 2026): five reviewed assignments and a capstone, built around shipping real work rather than coursework."],
        ["AI Fluency: Framework & Foundations", ", Anthropic Education (July 2026)", "https://verify.skilljar.com/c/xvnv3q5pttvf"],
        ["AI Fluency for Builders", ", Anthropic Education (2026)"],
      ],
      music: "Music",
      musicText: "I play drums and write songs in ",
      band: "son sek'",
      musicRest: ": one album, two singles and a handful of live shows so far.",
    },
    contactText: "I am based in Istanbul and open to new projects and roles.",
    cvs: {
      heading: "Download a CV",
      note: "One general CV, four written for specific kinds of role, and a Turkish CV. Pick the one closest to the ad.",
      items: [
        { slug: "general", label: "General (all roles)" },
        { slug: "operations", label: "Operations & Process Improvement" },
        { slug: "product", label: "Product & Technology" },
        { slug: "marketing", label: "Marketing & Brand" },
        { slug: "commercial", label: "Commercial & Business Analysis" },
        { slug: "turkce", label: "Turkish CV (Türkçe, with photo)" },
      ],
    },
    cv: "Download CV ↓",
    verify: "verify ↗",
    setIn: "Set in Newsreader",
    updated: "Updated September 2026",
  },

  tr: {
    nav: { about: "Hakkımda", experience: "Deneyim", project: "Proje", skills: "Yetkinlikler", work: "İşler", background: "Geçmiş", contact: "İletişim" },
    place: "İstanbul, Türkiye",
    roles: ["Endüstri mühendisi", "Süreç ve operasyon", "Ürün", "Pazarlama ve PR", "Blockchain araştırmacısı", "Web ürünleri geliştiren"],
    about: [
      "2002'de Sakarya'da doğdum, Haziran 2026'da İstanbul Bilgi Üniversitesi Endüstri Mühendisliği'nden mezun oldum. Kariyerimin başındayım; hızlı öğrenebileceğim, gerçek işler üstlenip gelişebileceğim bir yer arıyorum.",
      "Çok yönlüyüm ve yeni araçlara çabuk uyum sağlarım: fabrika sahasındaki yalın yöntemlerden ürün yazılımlarına ve yapay zekâya kadar. Toyota, BTCTurk Teknoloji ve De Marke stajlarım ile ödüllü bitirme projem bana bir problemi çözmeden önce ölçmeyi öğretti.",
      "Çalıştığım her yerde etkin olmak ve değer üretmek istiyorum. İş dışında küçük web ürünleri geliştiriyor, arkadaşlarımla bir yan girişim yürütüyor ve son sek' grubunda davul çalıyorum.",
    ],
    expIntro: "Mezun olmadan önce üç staj yaptım. Her biri bana aynı işin farklı bir parçasını öğretti: işin gerçekte nasıl aktığını, bir ürün ekibinin neye öncelik verdiğini ve bir şeyin nasıl satıldığını.",
    jobs: [
      { when: "Mar–Tem 2025", what: "Pazarlama Stajyeri, De Marke Ajansı", lead: "Bir spor pazarlama ajansında, küresel bir sponsorun UEFA planlarının ve canlı turnuva içeriğinin nasıl bir araya geldiğini öğrendim.", points: ["UEFA Nations League Finals ve UEFA Women's EURO 2025'te sahada PR ekibinde çalıştım.", "Carlsberg UEFA projesine “VAR Room by Carlsberg” ve pub'larda taraftar spikerliği gibi aktivasyon fikirleriyle katkıda bulundum.", "Büyük sosyal medya hesapları (115 bine varan takipçi) için aylık KPI raporları ve planlar hazırladım; NBA/EuroLeague Instagram benchmark'ıyla BSL için içerik planı oluşturdum."] },
      { when: "Oca–Şub 2025", what: "Ürün Stajyeri, BTCTurk Teknoloji", lead: "Türkiye'nin en büyük kripto borsalarından birinin Product Management ekibinde, bir ürün ekibinin sprint planning'den retro'ya Scrum'la nasıl çalıştığını öğrendim.", points: ["Jira ve Confluence'ta backlog, acceptance criteria içeren user story'ler ve roadmap üzerinde çalıştım.", "BtcTurk uygulamasını önde gelen yerli ve küresel borsalarla yedi alanda ekran ekran kıyasladım; eksikleri önerilere dönüştürüp sundum.", "Dashboard'lar ve kripto piyasa trend raporları hazırladım, margin trading'in Türkiye'deki yasal çerçevesini analiz ettim, IT ile araç envanterini çıkardım."] },
      { when: "Haz–Tem 2024", what: "Mühendislik Stajyeri, Toyota Otomotiv Sanayi Türkiye", lead: "Corolla ve C-HR'ın üretildiği Sakarya fabrikasında Toyota Üretim Sistemi'ni (TPS) gemba'da öğrendim: JIT, Jidoka, Kaizen, Kanban ve standart iş.", points: ["Assembly Logistics'te parça akışını dock receiving ve ithal parça siparişinden Devan'a, SPS ile hat beslemeye kadar izledim.", "İki stajyer arkadaşımla staj programı üzerine bir Kaizen fikri geliştirip projeye dönüştürdük: ideal %82'ye karşı %61 verimlilik; farkı 4M fishbone ile çözümledik.", "Standart program akışı ve İş Standart Formu (İSF) önerdik, gelecek stajyerler için TPS el kitabı yazdık ve yönetime sunduk."] },
    ],
    skills: [
      ["Ürün", "Benchmarking ve uygulama incelemeleri · market research · backlog ve user story · roadmap önceliklendirme · dashboard ve raporlama · Scrum"],
      ["Operasyon", "Lean ve TPS (Kaizen, 5S, JIT, Jidoka) · root cause analysis (4M balık kılçığı) · Pareto ve ABC analizi · MTM · RULA · NIOSH · preventive maintenance · depo yerleşimi · tedarikçi ve üretim koordinasyonu · etkinlik operasyonları"],
      ["Veri & araçlar", "Excel (VBA) · SQL · Python · JavaScript · TypeScript · React · Next.js · Blender · Jira · Confluence · LLM destekli workflow'lar · prompt design"],
      ["Alan bilgisi", "Kripto borsaları ve DeFi · yayımlanmış blockchain araştırması · konaklama ve yeme içme sektöründe NFC ve QR sistemleri"],
      ["Diller", "Türkçe (ana dili) · İngilizce (profesyonel)"],
    ],
    ors: {
      heading: "Endüstri projesi",
      title: "ÖRS Tekstil · bitirme projesi",
      meta: "2025–2026 · beş kişilik ekip · En İyi Bitirme Projesi Ödülü",
      intro: "Beş kişilik ekibimle, siparişe özel çorap üreten ÖRS Tekstil'in içinde çalıştım. Üretimin neden bu kadarının fireye gittiğini bulduk, en büyük nedenleri çözdük, etiketleme istasyonunu ve depoyu yeniden düzenledik. Fabrika değişikliklerimizi uygulamaya aldı. Bundan aldığım ders: gerçek bir fabrikada dikkatli ölçüm, en parlak fikirden daha ileri götürüyor.",
      facts: [
        ["Fire", "Pareto analizi firenin büyük kısmını (%87,8) üç nedene bağladı: iğne kırılması, iplik nemi ve makine arızaları"],
        ["Bakım", "İğne bakımı run-to-failure'dan preventive maintenance'a geçti; maliyet yarıdan fazla azaldı"],
        ["Nem", "İkinci büyük nedene karşı bir iplik nemölçeri; kendini yaklaşık 40 günde amorti etti"],
        ["Getiri", "Nemölçerin iş gerekçesi yaklaşık %800 yatırım getirisi gösteriyor"],
        ["Etiketleme", "MTM ile yeniden tasarlanan istasyonda parça başı süre %43 kısaldı"],
        ["Depo", "İki kat, Blender ve Python ile kurulan dijital ikizde ABC analizine göre yeniden yerleştirildi; alt katın depolama hacmi iki katından fazlasına çıktı"],
        ["Kalite", "ISO 2859-1 tabanlı giriş kalite kontrol uygulaması ve QR ile koli izlenebilirliği"],
        ["Ergonomi", "Kalp atış hızı, RULA ve NIOSH çalışmalarına dayanan bir rotasyon planı ve kaldırma yardımcısı"],
      ],
      paretoTitle: "Fire nereden geliyordu",
      paretoNote: "Nedene göre 120.794 çift fire. Bir çubuğun üzerine gelin.",
      causes: [
        ["İğne kırılması", 53687, "Preventive maintenance'a geçildi: maliyet yarıdan fazla azaldı"],
        ["İplik nemi", 32212, "İplik girişinde nemölçer: yaklaşık 40 günde amorti etti"],
        ["Makine arızası", 20132, "Firenin %87,8'ini oluşturan üç nedenin üçüncüsü"],
        ["İplik lekesi", 8053, "Daha küçük bir neden, takipte"],
        ["Makine ayarı", 6710, "Daha küçük bir neden, takipte"],
      ],
      pairs: "çift",
      open: "A3 raporunu aç",
      poster: "Posteri gör",
      close: "Kapat",
      a3Title: "ÖRS Tekstil · A3 raporu",
      a3Team: "Beş kişilik ekip · danışmanlar Prof. Dr. Fatma Canan Çilingir ve Dr. Ergun Arı · İstanbul Bilgi Üniversitesi, 2026",
      a3: [
        ["Arka plan", "ÖRS Tekstil, Avrupa ve Kuzey Amerika için siparişe özel çorap üretiyor. İncelediğimiz dönemde 2,68 milyon çift üretti ve bunun %4,5'i, yani 120.794 çift fireye gitti."],
        ["Mevcut durum", "Firenin %87,8'i üç nedenden geliyordu. Etiketleme yavaş ve elle yapılıyordu, iki depo katı da sıkışıktı; depo işi sahadaki en ağır işti."],
        ["Hedef", "Fireyi kaynağında azaltmak, etiketlemeyi hızlandırmak, depoda yer açmak ve kaldırma işini güvenli hâle getirmek."],
        ["Kök nedenler", "İğneler ancak kırıldıktan sonra değiştiriliyordu. İplik nemi girişte hiç ölçülmüyordu. Etiketleme istasyonunda gereksiz hareket vardı. Depolamada bir yerleşim mantığı yoktu. Önerilen sınır 5 kg'ın altındayken 18–23 kg'lık yükler kaldırılıyordu."],
        ["Önlemler", "İğneler için preventive maintenance; iplik nemölçeri; MTM ile yeniden tasarlanan etiketleme istasyonu; Blender ve Python dijital ikizinde test edilen ABC yerleşimi; QR koli izlenebilirliğiyle ISO 2859-1 giriş kalite kontrol uygulaması; rotasyon planı ve kaldırma yardımcısı."],
        ["Sonuçlar", "İğne bakım maliyeti %57,7 azaldı. Nemölçer kendini yaklaşık 40 günde amorti etti. Etiketleme parça başı %43 hızlandı. Alt katın depolama hacmi %112 arttı."],
        ["Sırada", "Pareto'yu her ay sürdürmek ve sıradaki nedenleri ele almak."],
      ],
    },
    workIntro: "TAB Marketing, iki arkadaşımla kurduğum bir yan girişim; işletmelerin misafirlerini dinlemenin kolay bir yolu olmadığını görünce başladık. Proje bazında NFC/QR yorum standları, geri bildirim kartları, menüler, web siteleri ve PR hazırlıyoruz: kendi bulduğumuz 15'ten fazla işletmeye 250'den fazla özel ürün. Tasarımı, tedarikçileri ve kurulumu ben yürütüyor, siteleri ben geliştiriyorum.",
    tabHeading: "Yan girişim · TAB Marketing (2026–)",
    tabClients: "Müşterilerimizden bazıları: Pehlivan Et Lokantası, İtalyan İşi, BREAK, Soft Coffee Lounge, Elbis Hotel ve Cabir Deluxe.",
    hire: {
      label: "Hangi rol için?",
      all: "Tüm roller",
      cvFor: "Bu rolün CV'sini indir",
      roles: {
        operations: { name: "Operasyon", intro: "Yalın operasyon bakışı getiriyorum: Toyota'da gemba'da TPS ve ÖRS'te beş kişilik ekiple, iğne bakım maliyetini yarıdan fazla düşüren fire çalışması." },
        product: { name: "Ürün", intro: "Ürün ekiplerinin nasıl çalıştığını BTCTurk Teknoloji'de öğrendim; rakipleri ekran ekran kıyaslıyor, Krone ve Feed Detox gibi çalışan uygulamalar geliştiriyorum." },
        marketing: { name: "Pazarlama", intro: "De Marke'den spor pazarlaması deneyimi getiriyorum: iki UEFA turnuvasında sahada PR, Carlsberg UEFA projesi için aktivasyon fikirleri ve aylık sosyal medya raporlaması." },
        commercial: { name: "Ticari roller", intro: "Analizi, karar aldıran iş gerekçelerine çeviriyorum: ÖRS'te ekibimle, yaklaşık 40 günde kendini amorti eden nemölçer; yan girişimim için kazandığım 15'ten fazla işletme." },
      },
    },
    tabLink: "Siteye git",
    sites: "TAB kapsamında yaptığım siteler",
    own: "Kendi projelerim",
    rows: [
      { title: "Franco Coffee & Gelato", note: "Serdivan'daki bir kafe için mobile-first bir dijital menü yaptım; personel menüyü bir Google Sheet'ten güncelliyor. Misafirler üç soruluk bir lezzet quiz'i, uyum puanı gösteren “kendi dondurmanı yap” seçicisi, eşleştirme önerileri ve favorilerini kaydetme özelliği buluyor. Next.js, TypeScript.", href: "https://francoserdivan.com", label: "francoserdivan.com" },
      { title: "Diş Hekimi Melis Çakan", note: "Sakarya'daki bir diş kliniği için sakin, mobile-first bir site yaptım: altı tedavi sayfası, hastayı doğru sayfaya yönlendiren bir belirti seçici, SSS, WhatsApp'tan randevu ve arama motorları için yapılandırılmış veri.", href: "https://dishekimimeliscakan.com", label: "dishekimimeliscakan.com" },
    ],
    projects: [
      { title: "Krone", tag: "KİŞİSEL PROJE · OYNANABİLİR", note: "Dokuz mini oyunlu mobil bir parti oyunu yaptım: refleks ve renk testlerinden golfe, ok labirentine kadar. Arkadaşlar kodla aynı odaya giriyor, sunucu zamanlı aynı 3-2-1 ile başlıyor, skorlar ortak tabloya düşüyor. Günlük Meydan Okuma tarihi seed olarak kullanıyor; böylece dünyadaki herkes o gün aynı beş oyunu oynuyor. Arkadaşlarım için yaptım. React ve TypeScript.", href: "https://innerclock.vercel.app", label: "Krone'u oyna" },
      { title: "Feed Detox", note: "Feed Detox'ta internette ne görmek istediğini yazıyorsun; uygulama X, Instagram, TikTok ve YouTube için takip edilecek hesapları, aramaları ve susturulacak kelimeleri bir paket hâlinde çıkarıyor. Sonuçları YouTube API'si ve web aramasından canlı çekip alaka ve gürültüye göre sıralıyor, paketi bir linkle paylaşıyor. Türkçe ve İngilizce olarak Next.js ile yaptım." },
    ],
    bg: {
      education: "Eğitim",
      edu: [["İstanbul Bilgi Üniversitesi", ", Endüstri Mühendisliği (Lisans). Haziran 2026 mezunu"], ["Serdivan Fen Lisesi", ", Sakarya. 2020 mezunu"]],
      international: "Uluslararası",
      intl: [
        ["HeForShe", ", Erasmus+ Youth Exchange, Saaremaa, Estonya (Aralık 2023). Uluslararası bir grupla bir hafta boyunca toplumsal cinsiyet eşitliğini ve bunun bir ülkenin gelişmişliğiyle ilişkisini ele aldık. Artemis Women's Power MTÜ'nün ev sahipliğinde; Youthpass sertifikalı."],
        ["European Summer School", ", Blockchain to Financial Markets. Prag, Çekya (2025), Fransız Enstitüsü. Distributed ledger teknolojilerinin piyasa altyapısıyla kesiştiği yer üzerine bir hafta çalıştım: settlement, tokenized assets ve bunları çevreleyen regülasyon. Konuyla ilgili bir proje hazırlayıp birçok ülkeden öğrenci ve araştırmacıya sundum; sertifika aldım."],
      ],
      involvement: "Kulüpler & topluluk",
      inv: [
        ["Yayın Yönetmeni", ", Bilgi Blockchain Kulübü (2021–2024). Kulübün yayın tarafını yürüttüm: yayımlanan içerikleri belirleyip düzenledim, forumların ve konuşmacı akşamlarının programını şekillendirdim. Bu çalışma beni eğlence sektöründe blockchain üzerine kendi araştırmama götürdü; araştırma 2022'de kitap bölümü olarak yayımlandı."],
        ["Başkan Yardımcısı ve Sosyal Medya Sorumlusu", ", BilgiADK, Bilgi Üniversitesi öğrenci kulübü (2021–2024). İstanbul'daki öğrenciler için 10'dan fazla forum ve konferans düzenledim; en büyüğü 4.000'den fazla kişilik canlı paneldi."],
      ],
      publication: "Yayın",
      pub: "XI. Bölüm: “Blockchain ve Eğlence Sektörü”, ",
      pubAfter: " içinde",
      pubBook: "Blockchain Teknolojileri ve Sektörel Etkileri",
      pubLink: "Nobel Akademik Yayıncılık, 2022",
      pubMeta: "Bağımsız araştırmacı olarak yazdım; Mehmet Tolga Çakan adıyla yayımlandı · ISBN 978-625-433-825-0 · ORCID 0000-0001-7444-9079",
      programmes: "Ödüller, programlar & sertifikalar",
      prog: [
        ["En İyi Bitirme Projesi Ödülü", ", Endüstri Mühendisliği Bölümü, İstanbul Bilgi Üniversitesi (2026), Proje bölümündeki ÖRS Tekstil projesiyle. Dönemin en iyi beş projesi arasına seçildi; CSRP 2026'da da sunuldu."],
        ["FlyRank AI", ", yapay zekâ mühendisliği programı (Temmuz–Ağustos 2026): ders çözmek yerine gerçek iş çıkarmaya dayanan, değerlendirmeden geçen beş ödev ve bir bitirme projesi."],
        ["AI Fluency: Framework & Foundations", ", Anthropic Education (Temmuz 2026)", "https://verify.skilljar.com/c/xvnv3q5pttvf"],
        ["AI Fluency for Builders", ", Anthropic Education (2026)"],
      ],
      music: "Müzik",
      musicText: "",
      band: "son sek'",
      musicRest: " grubunda davul çalıyor, şarkı yazıyorum. Şimdiye kadar bir albüm, iki single ve birkaç canlı performansımız oldu.",
    },
    contactText: "İstanbul'da yaşıyorum, yeni projelere ve rollere açığım.",
    cvs: {
      heading: "CV indir",
      note: "Bir genel CV, belirli rol türleri için dört CV (İngilizce) ve bir Türkçe CV. İlana en uygun olanı seçin.",
      items: [
        { slug: "general", label: "Genel (tüm roller)" },
        { slug: "operations", label: "Operasyon ve Süreç İyileştirme" },
        { slug: "product", label: "Ürün ve Teknoloji" },
        { slug: "marketing", label: "Pazarlama ve Marka" },
        { slug: "commercial", label: "Ticari ve İş Analizi" },
        { slug: "turkce", label: "Türkçe CV (fotoğraflı)" },
      ],
    },
    cv: "CV'yi indir ↓",
    verify: "doğrula ↗",
    setIn: "Yazı tipi: Newsreader",
    updated: "Güncelleme: Eylül 2026",
  },
};

const TAB_URL = "https://tab-marketing-site.vercel.app/#top";

/** Running text in which every "TAB Marketing" links to its site. */
function withTab(text) {
  const parts = text.split("TAB Marketing");
  return parts.flatMap((part, n) => n === 0 ? [part] : [
    <a key={n} className="link link-inline" href={TAB_URL} target="_blank" rel="noreferrer">TAB Marketing</a>, part,
  ]);
}

// Role CVs are archived: visitors see one CV (the general one) and no role switch.
// Set to true to bring back the switch and the CV picker.
const SHOW_ROLE_CVS = false;
const CV_HREF = "/tolga-cakan-cv.pdf";
const cvHref = (slug) => "/cv/tolga-cakan-cv-" + slug + ".pdf";

const ROLES = ["operations", "product", "marketing", "commercial"];

// Experience and the ÖRS project always come first; the rest follows the role.
const ORDER = {
  all: ["experience", "project", "work", "skills", "background", "contact"],
  operations: ["experience", "project", "skills", "work", "background", "contact"],
  product: ["experience", "project", "work", "skills", "background", "contact"],
  marketing: ["experience", "project", "work", "background", "skills", "contact"],
  commercial: ["experience", "project", "work", "skills", "background", "contact"],
};
// jobs are listed De Marke, BTCTurk, Toyota; a role puts its closest one first
const JOB_ORDER = { all: [0, 1, 2], operations: [2, 1, 0], product: [1, 2, 0], marketing: [0, 1, 2], commercial: [0, 1, 2] };
// skill rows are Product, Operations, Data & tools, Domain, Languages
const SKILL_ORDER = { all: [0, 1, 2, 3, 4], operations: [1, 2, 0, 3, 4], product: [0, 2, 3, 1, 4], marketing: [0, 3, 2, 1, 4], commercial: [0, 2, 1, 3, 4] };

const PHONE_DISPLAY = "+90 542 262 00 42";
const PHONE_HREF = "tel:+905422620042";
const EMAIL = "tolgacakan@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/mehmettolgacakan";

const STYLES = `

.cv {
  --paper: #fcfbf8;
  --paper-2: #f5f2eb;
  --ink: #171613;
  --ink-soft: #56534c;
  --ink-faint: #6f6a60;
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
}
.cv[data-theme="night"] {
  --paper: #14140f;
  --paper-2: #1b1a15;
  --ink: #ebe7dc;
  --ink-soft: #a09a8d;
  --ink-faint: #8a8478;
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
  .chip { padding: 12px 13px; font-size: 11px; }
  .tools { gap: 8px; flex-wrap: wrap; }
  .pane-nav a { padding: 9px 0; }
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

/* measured results under a list item, e.g. the award-winning project */
.facts { margin: 10px 0 4px; display: grid; gap: 0; border-top: 1px solid var(--rule); }
.facts div { display: grid; grid-template-columns: minmax(0, 150px) 1fr; gap: 14px; padding: 7px 0; border-bottom: 1px solid var(--rule); }
.facts dt { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent); padding-top: 2px; }
.facts dd { margin: 0; font-size: 14.5px; }
@media (max-width: 560px) { .facts div { grid-template-columns: 1fr; gap: 1px; } }

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
.link-inline { display: inline; font-size: inherit; }

/* work: sites that sit under TAB */
.under {
  margin-left: 14px; padding-left: 20px; border-left: 1px solid var(--rule);
  position: relative;
}
.under::before {
  content: ''; position: absolute; left: -1px; top: 0; width: 1px; height: 22px;
  background: var(--accent); opacity: .45;
}
.under .h3 { margin-top: 18px; }
@media (max-width: 560px) { .under { margin-left: 4px; padding-left: 14px; } }

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

/* reveal, barely there */
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

/* hiring-for switch */
.hire { padding: 22px 0 6px; }
.hire-row { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.hire-label { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-faint); margin-right: 6px; }
.hire .chip[aria-pressed="true"] { color: var(--paper); background: var(--accent); border-color: var(--accent); }
.hire-intro { font-size: 15px; color: var(--ink-soft); margin: 12px 0 0; max-width: 62ch; }
.entry-lead { font-size: 15px; color: var(--ink); margin: 2px 0 6px; }
.entry-points { list-style: none; margin: 0; padding: 0; }
.entry-points li { font-size: 14.5px; color: var(--ink-soft); padding: 2px 0 2px 14px; position: relative; }
.entry-points li::before { content: '·'; position: absolute; left: 2px; color: var(--ink-faint); }
.cv-pick[data-on="true"] { border-color: var(--accent); color: var(--accent); }

/* ÖRS project: results, Pareto and the A3 view */
.ors { margin: 6px 0 10px; }
.ors-meta { font-size: 11px; color: var(--ink-faint); letter-spacing: .03em; margin: 0 0 14px; }
.ors-actions { display: flex; gap: 18px; align-items: center; flex-wrap: wrap; margin: 16px 0 0; }
.pareto { margin: 22px 0 0; }
.pareto svg { width: 100%; height: auto; display: block; }
.pareto-bar rect { fill: color-mix(in srgb, var(--ink-faint) 45%, transparent); transition: fill .2s ease; cursor: pointer; }
.pareto-bar[data-on="true"] rect, .pareto-bar:hover rect { fill: var(--accent); }
.pareto-axis { font: 10px 'JetBrains Mono', monospace; fill: var(--ink-faint); }
.pareto-mark { font: 11px 'JetBrains Mono', monospace; fill: var(--accent); }
.pareto-80 { stroke: var(--ink-faint); stroke-dasharray: 3 3; stroke-width: .8; }
.pareto-labels { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-top: 4px; }
.pareto-labels button { background: none; border: 0; padding: 2px 0; cursor: pointer; font: 11px/1.3 'JetBrains Mono', monospace; color: var(--ink-soft); text-align: center; }
.pareto-labels button[data-on="true"] { color: var(--accent); }
.pareto-bar:focus { outline: none; }
.pareto-bar:focus-visible rect { stroke: var(--accent); stroke-width: 1; }
.pareto-line { fill: none; stroke: var(--accent); stroke-width: 1.2; }
.pareto-dot { fill: var(--paper); stroke: var(--accent); stroke-width: 1.2; }
.pareto-read { font-size: 14.5px; color: var(--ink-soft); margin: 8px 0 0; min-height: 1.6em; }
.pareto-read b { font-weight: 500; color: var(--ink); }
.chip-cv { color: var(--accent); border-color: var(--accent); }
.chip-cv:hover { background: color-mix(in srgb, var(--accent) 8%, transparent); color: var(--accent); }
.a3-bg {
  position: fixed; inset: 0; z-index: 70; display: grid; place-items: center; padding: 3vh 3vw;
  background: color-mix(in srgb, var(--paper) 70%, transparent);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); animation: fade .18s ease;
}
.a3 {
  width: min(1100px, 100%); max-height: 94vh; overflow-y: auto; background: var(--paper);
  border: 1px solid var(--ink-faint); box-shadow: 0 30px 60px -34px rgba(0,0,0,.4); padding: 22px 24px;
}
.a3-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-bottom: 1px solid var(--rule); padding-bottom: 12px; }
.a3-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; margin-top: 4px; }
.a3-cell { padding: 14px 16px 14px 0; border-bottom: 1px solid var(--rule); }
.a3-k { font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); margin: 0 0 6px; }
.a3-v { font-size: 14.5px; line-height: 1.55; margin: 0; }
.a3-poster { grid-row: span 3; grid-column: 3; }
.a3-poster img { width: 100%; height: auto; display: block; border: 1px solid var(--rule); }
.a3-team { font-size: 11px; color: var(--ink-faint); margin: 12px 0 0; }
@media (max-width: 760px) {
  .a3-grid { grid-template-columns: 1fr; }
  .a3-poster { grid-row: auto; grid-column: auto; }
}

/* CV picker: one PDF per kind of role */
.cv-block { margin-top: 30px; }
.cv-one { display: inline-flex; margin-top: 4px; }
.cv-picks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 14px; }
.cv-pick {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
  padding: 13px 14px; border: 1px solid var(--rule); font-size: 15px; color: var(--ink);
  transition: border-color .25s ease, color .25s ease, background .25s ease;
}
.cv-pick .mono { font-size: 10px; letter-spacing: .08em; color: var(--ink-faint); white-space: nowrap; }
.cv-pick:hover { border-color: var(--accent); color: var(--accent); background: color-mix(in srgb, var(--paper-2) 60%, transparent); }
.cv-pick:first-child, .cv-pick:last-child { grid-column: 1 / -1; }
@media (max-width: 560px) { .cv-picks { grid-template-columns: 1fr; } }

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

/* print: the page becomes a clean CV sheet */
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
    <>
    {!still && <span className="sr">{roles.join(", ")}</span>}
    <p className="role-slot" aria-hidden={still ? undefined : "true"}>
      {still ? roles.join(" · ") : text}
      {!still && <span className="caret" />}
    </p>
    </>
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

function CommandMenu({ open, onClose, onTheme, onLang, t, lang, ids }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const ref = useRef(null);

  const items = [
    ...ids.slice(1).map((id) => ({ k: id, label: t.nav[id], hint: lang === "tr" ? "Bölüm" : "Section", run: () => go(id) })),
    { k: "lang", label: lang === "en" ? "Türkçe'ye geç" : "Switch to English", hint: lang === "tr" ? "Dil" : "Language", run: onLang },
    { k: "theme", label: lang === "tr" ? "Paleti değiştir" : "Switch palette", hint: lang === "tr" ? "Görünüm" : "View", run: onTheme },
    ...(SHOW_ROLE_CVS ? [] : [{ k: "cv", label: lang === "tr" ? "CV indir (PDF)" : "Download CV (PDF)", hint: "CV", run: () => { window.location.href = CV_HREF; } }]),
    ...(SHOW_ROLE_CVS ? t.cvs.items : []).map((c) => ({ k: "cv-" + c.slug, label: (lang === "tr" ? "İşe alım · " : "Hiring · ") + c.label, hint: "CV", run: () => { window.open(cvHref(c.slug), "_blank", "noreferrer"); } })),
    { k: "tab", label: lang === "tr" ? "TAB Marketing sitesi" : "TAB Marketing site", hint: "Link", run: () => { window.open(TAB_URL, "_blank", "noreferrer"); } },
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
      <div className="cmd" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Menu">
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

/** "Hiring for" switch: reorders the page, swaps the intro and points at the matching CV. */
function HireSwitch({ t, role, setRole }) {
  const h = t.hire;
  return (
    <div className="hire rise on">
      <div className="hire-row" role="group" aria-label={h.label}>
        <span className="mono hire-label">{h.label}</span>
        <button type="button" className="chip" aria-pressed={!role} onClick={() => setRole(null)}>{h.all}</button>
        {ROLES.map((k) => (
          <button type="button" key={k} className="chip" aria-pressed={role === k} onClick={() => setRole(k)}>{h.roles[k].name}</button>
        ))}
      </div>
      {role && (
        <p className="hire-intro" aria-live="polite">
          {h.roles[role].intro}{" "}
          <a className="link link-mono" href={cvHref(role)} target="_blank" rel="noreferrer">{h.cvFor} <span>↓</span></a>
        </p>
      )}
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

function LeftPane({ active, theme, onTheme, onMenu, onLang, t, lang, ids, role }) {
  return (
    <aside className="pane-left" id="about">
      <div className="id-row rise">
        <div className="portrait">
          <img src="/tolga.webp" alt="Tolga Çakan" width="92" height="92" />
        </div>
        <div>
          <p className="tag">{t.place}</p>
          <h1 className="name">Tolga Çakan</h1>
          <RoleTicker roles={t.roles} />
        </div>
      </div>

      <div className="rise" style={{ "--i": 1 }}>
        {t.about.map((para, n) => <p className="p" key={n}>{para}</p>)}
        {!SHOW_ROLE_CVS && <a className="chip chip-cv cv-one" href={CV_HREF} download>{t.cv}</a>}
      </div>

      <nav className="pane-nav rise" style={{ "--i": 2 }}>
        {ids.slice(1).map((id, n) => (
          <a key={id} href={"#" + id} data-on={ids[active] === id ? "true" : "false"}
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
          <a href={LINKEDIN} target="_blank" rel="noreferrer">linkedin.com/in/mehmettolgacakan</a>
          <a href="https://github.com/tolgacakan14" target="_blank" rel="noreferrer">github.com/tolgacakan14</a>
        </div>
        <div className="tools">
          {SHOW_ROLE_CVS && (role
            ? <a className="chip chip-cv" href={cvHref(role)} target="_blank" rel="noreferrer">{t.hire.cvFor} ↓</a>
            : <a className="chip chip-cv" href="#cv" onClick={(e) => { e.preventDefault(); go("cv"); }}>{t.cv}</a>)}
          <button type="button" className="chip" onClick={onMenu} aria-label="Menu">⌘K</button>
          <button type="button" className="chip" onClick={onLang} aria-label="Change language">
            {lang === "en" ? "TR" : "EN"}
          </button>
          <button type="button" className="chip" onClick={onTheme} aria-label="Switch palette">
            {theme === "night" ? (lang === "tr" ? "Gündüz" : "Day") : (lang === "tr" ? "Gece" : "Night")}
          </button>
        </div>
      </div>
    </aside>
  );
}

function Experience({ t, num, role }) {
  return (
    <section className="sec" id="experience">
      <div className="wrap">
        <SecHead num={num} title={t.nav.experience} id="experience" />
        <p className="p rise">{withTab(t.expIntro)}</p>
        {JOB_ORDER[role || "all"].map((k, n) => {
          const r = t.jobs[k];
          return (
            <div className="entry rise" key={r.what} style={{ "--i": n + 2 }}>
              <span className="entry-when">{r.when}</span>
              <div>
                <p className="entry-what">{r.what}</p>
                <p className="entry-lead">{r.lead}</p>
                <ul className="entry-points">
                  {r.points.map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Skills({ t, num, role }) {
  return (
    <section className="sec" id="skills">
      <div className="wrap">
        <SecHead num={num} title={t.nav.skills} id="skills" />
        {SKILL_ORDER[role || "all"].map((k) => t.skills[k]).map(([key, val], n) => (
          <div className="entry rise" key={key} style={{ "--i": n + 1 }}>
            <span className="entry-when">{key}</span>
            <p className="entry-note">{val}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Pareto of the ÖRS scrap causes: bars by pairs, cumulative share as a line
 * against a right-hand % axis, with the usual 80% guide. */
function Pareto({ o }) {
  const [on, setOn] = useState(0);
  const total = o.causes.reduce((a, [, n]) => a + n, 0);
  const max = o.causes[0][1];
  const W = 560, H = 190, L = 8, R = 40, T = 12, B = 8;
  const bw = (W - L - R) / o.causes.length;
  const y = (share) => T + (1 - share) * (H - T - B);
  let run = 0;
  const pts = o.causes.map(([, n], i) => { run += n; return [L + bw * i + bw / 2, y(run / total), run / total]; });
  const tr = o.pairs === "çift";
  const fmt = (n) => n.toLocaleString(tr ? "tr-TR" : "en-GB");
  const pct = (x) => (tr ? "%" + (Math.round(x * 1000) / 10).toLocaleString("tr-TR") : Math.round(x * 1000) / 10 + "%");
  return (
    <figure className="pareto rise">
      <figcaption className="h3">{o.paretoTitle}</figcaption>
      <svg viewBox={"0 0 " + W + " " + H} role="img" aria-label={o.paretoTitle}>
        {[0, 0.5, 1].map((v) => (
          <text key={v} x={W - R + 6} y={y(v) + 3} className="pareto-axis">{pct(v)}</text>
        ))}
        <line x1={L} x2={W - R} y1={y(0.8)} y2={y(0.8)} className="pareto-80" />
        <text x={W - R + 6} y={y(0.8) + 3} className="pareto-axis">{pct(0.8)}</text>
        {o.causes.map(([label, n], i) => {
          const h = (n / max) * (H - T - B) * 0.62;
          return (
            <g key={label} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onClick={() => setOn(i)}
              tabIndex={0} role="button" aria-label={label + ", " + fmt(n) + " " + o.pairs + ", " + pct(n / total)}
              className="pareto-bar" data-on={i === on ? "true" : "false"}>
              <rect x={L + bw * i + 8} y={H - B - h} width={bw - 16} height={h} />
            </g>
          );
        })}
        <polyline points={pts.map(([x, yy]) => x + "," + yy).join(" ")} className="pareto-line" />
        {pts.map(([x, yy], i) => <circle key={i} cx={x} cy={yy} r="2.5" className="pareto-dot" />)}
        <text x={pts[2][0]} y={pts[2][1] - 8} textAnchor="middle" className="pareto-mark">{pct(pts[2][2])}</text>
      </svg>
      <div className="pareto-labels" style={{ paddingRight: (R / W) * 100 + "%" }}>
        {o.causes.map(([label], i) => (
          <button type="button" key={label} data-on={i === on ? "true" : "false"} onClick={() => setOn(i)}>{label}</button>
        ))}
      </div>
      <p className="pareto-read" aria-live="polite">
        <b>{o.causes[on][0]}</b> · {fmt(o.causes[on][1])} {o.pairs} ({pct(o.causes[on][1] / total)}) · {o.causes[on][2]}
      </p>
      <p className="strip-note">{o.paretoNote}</p>
    </figure>
  );
}

/** The award-winning factory project, with its results and an A3 view. */
function OrsBlock({ o }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const openRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const box = document.querySelector(".a3");
        const f = box ? [...box.querySelectorAll("a[href], button")] : [];
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); openRef.current?.focus(); };
  }, [open]);
  return (
    <div className="ors">
      <h3 className="h3 rise">{o.heading}</h3>
      <p className="row-title rise">{o.title}</p>
      <p className="mono ors-meta rise">{o.meta}</p>
      <p className="p rise">{o.intro}</p>
      <dl className="facts rise">
        {o.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
      <Pareto o={o} />
      <p className="ors-actions rise">
        <button type="button" className="chip chip-cv" ref={openRef} onClick={() => setOpen(true)}>{o.open} ↗</button>
        <a className="link link-mono" href="/ors/poster.webp" target="_blank" rel="noreferrer">{o.poster} <span>→</span></a>
      </p>
      {open && (
        <div className="a3-bg" onClick={() => setOpen(false)} role="presentation">
          <div className="a3" role="dialog" aria-modal="true" aria-label={o.a3Title} onClick={(e) => e.stopPropagation()}>
            <header className="a3-head">
              <div>
                <p className="h3" style={{ margin: 0 }}>A3</p>
                <p className="row-title">{o.a3Title}</p>
              </div>
              <button type="button" className="chip" ref={closeRef} onClick={() => setOpen(false)}>{o.close} ✕</button>
            </header>
            <div className="a3-grid">
              {o.a3.map(([k, v], i) => (
                <section key={k} className="a3-cell">
                  <p className="mono a3-k">{String(i + 1).padStart(2, "0")} · {k}</p>
                  <p className="a3-v">{v}</p>
                </section>
              ))}
              <section className="a3-cell a3-poster">
                <a href="/ors/poster.webp" target="_blank" rel="noreferrer">
                  <img src="/ors/poster.webp" alt={o.poster} loading="lazy" />
                </a>
              </section>
            </div>
            <p className="mono a3-team">{o.a3Team}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Project({ t, num }) {
  return (
    <section className="sec" id="project">
      <div className="wrap">
        <SecHead num={num} title={t.nav.project} id="project" />
        <OrsBlock o={t.ors} />
      </div>
    </section>
  );
}

function Work({ t, num }) {
  return (
    <section className="sec" id="work">
      <div className="wrap">
        <SecHead num={num} title={t.nav.work} id="work" />
        <h3 className="h3 rise">{t.tabHeading.split("TAB Marketing").flatMap((x, n) => (n ? [<span key={n} lang="en">TAB Marketing</span>, x] : [x]))}</h3>
        <p className="p rise" style={{ "--i": 1 }}>{withTab(t.workIntro)}</p>
        <p className="strip-note rise" style={{ "--i": 1 }}>{t.tabClients}</p>
        <p className="strip-note rise" style={{ "--i": 2 }}>
          <a className="link link-mono" href={TAB_URL} target="_blank" rel="noreferrer">
            {t.tabLink} <span>→</span>
          </a>
        </p>

        <div className="under">
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
        </div>

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

function Background({ t, num }) {
  const b = t.bg;
  const list = (items, base) => (
    <ul className="list rise" style={{ "--i": base }}>
      {items.map(([lead, rest, href, points], n) => (
        <li key={n}>
          <b>{lead}</b>{rest}
          {href && (
            <>
              {" "}
              <a className="verify" href={href} target="_blank" rel="noreferrer">{t.verify}</a>
            </>
          )}
          {points && (
            <dl className="facts">
              {points.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          )}
        </li>
      ))}
    </ul>
  );
  return (
    <section className="sec" id="background">
      <div className="wrap">
        <SecHead num={num} title={t.nav.background} id="background" />

        <h3 className="h3 rise">{b.education}</h3>
        {list(b.edu, 1)}

        <h3 className="h3 rise" style={{ "--i": 2 }}>{b.international}</h3>
        {list(b.intl, 3)}

        <h3 className="h3 rise" style={{ "--i": 4 }}>{b.involvement}</h3>
        {list(b.inv, 5)}

        <h3 className="h3 rise" style={{ "--i": 6 }}>{b.publication}</h3>
        <div className="rise" style={{ "--i": 7 }}>
          <p className="p">
            {b.pub}<em>{b.pubBook}</em>{b.pubAfter}.{" "}
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

function Contact({ t, num, role }) {
  return (
    <section className="sec" id="contact">
      <div className="wrap">
        <SecHead num={num} title={t.nav.contact} id="contact" />
        <p className="p rise" style={{ "--i": 1 }}>{t.contactText}</p>
        <div className="meta mono rise" style={{ "--i": 2 }}>
          <ContactLine href={"mailto:" + EMAIL}>{EMAIL}</ContactLine>
          <ContactLine href={PHONE_HREF}>{PHONE_DISPLAY}</ContactLine>
          <a href={LINKEDIN} target="_blank" rel="noreferrer">linkedin.com/in/mehmettolgacakan</a>
          <a href="https://github.com/tolgacakan14" target="_blank" rel="noreferrer">github.com/tolgacakan14</a>
        </div>
        {SHOW_ROLE_CVS && <div className="cv-block rise" id="cv" style={{ "--i": 3 }}>
          <h3 className="h3">{t.cvs.heading}</h3>
          <p className="p">{t.cvs.note}</p>
          <div className="cv-picks">
            {t.cvs.items.map((c) => (
              <a key={c.slug} className="cv-pick" href={cvHref(c.slug)} target="_blank" rel="noreferrer" data-on={c.slug === (role || "general") ? "true" : "false"}>
                <span>{c.label}</span><span className="mono">PDF ↓</span>
              </a>
            ))}
          </div>
        </div>}
      </div>
    </section>
  );
}

export default function CV() {
  const [theme, setTheme] = useState("paper");
  const [lang, setLang] = useState("en");
  const [menu, setMenu] = useState(false);
  const [role, setRoleState] = useState(null);
  const ids = useMemo(() => ["about", ...ORDER[role || "all"]], [role]);
  const { i, p } = useScrollState(ids);
  const t = COPY[lang];
  const num = (id) => String(ids.indexOf(id) + 1).padStart(2, "0");

  // role: ?for= wins, then a stored choice
  useEffect(() => {
    if (!SHOW_ROLE_CVS) {
      try { window.localStorage.removeItem("cv-role"); } catch (err) { /* ignore */ }
      return;
    }
    const asked = new URLSearchParams(window.location.search).get("for");
    if (ROLES.includes(asked)) { setRoleState(asked); return; }
    let saved = null;
    try { saved = window.localStorage.getItem("cv-role"); } catch (err) { /* blocked */ }
    if (ROLES.includes(saved)) setRoleState(saved);
  }, []);

  const setRole = useCallback((next) => {
    setRoleState(next);
    try { next ? window.localStorage.setItem("cv-role", next) : window.localStorage.removeItem("cv-role"); } catch (err) { /* ignore */ }
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("for", next); else url.searchParams.delete("for");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, []);

  useRise(lang + role);

  // palette: stored choice, else the reader's system setting
  useEffect(() => {
    let saved = null;
    try { saved = window.localStorage.getItem("cv-theme"); } catch (err) { /* blocked */ }
    if (saved === "night" || saved === "paper") { setTheme(saved); return; }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("night");
  }, []);

  // language: ?lang= wins, then a stored choice, then the browser's
  useEffect(() => {
    if (window.location.pathname.startsWith("/tr")) { setLang("tr"); return; }
    const asked = new URLSearchParams(window.location.search).get("lang");
    if (LANGS.includes(asked)) { setLang(asked); return; }
    let saved = null;
    try { saved = window.localStorage.getItem("cv-lang"); } catch (err) { /* blocked */ }
    if (LANGS.includes(saved)) { setLang(saved); return; }
    if ((navigator.language || "").toLowerCase().startsWith("tr")) setLang("tr");
  }, []);

  // keep <html lang> honest for screen readers and search engines
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "tr"
      ? "Tolga Çakan — Endüstri mühendisi: operasyon, ürün ve pazarlama"
      : "Tolga Çakan — Industrial engineer: operations, product and marketing";
    document.querySelector('meta[name="description"]')?.setAttribute("content", lang === "tr"
      ? "İstanbul'da endüstri mühendisliği mezunu. Toyota, BTCTurk ve UEFA turnuvaları stajları, ödüllü bir fabrika iyileştirme projesi ve kendi küçük girişimi."
      : "Industrial engineering graduate in Istanbul. Toyota, BTCTurk and UEFA tournament internships, an award-winning factory improvement project, and a small venture of his own.");
  }, [lang]);

  // a note for whoever opens the console
  useEffect(() => {
    console.log("%cHello, curious one.", "font: 15px Georgia, serif");
    console.log("This site is React and Vite; the four CVs are built from one source by cv/build.mjs. Say hi: tolgacakan@gmail.com");
  }, []);

  // paint the page background behind the app, so overscroll matches the theme
  useEffect(() => {
    const paper = theme === "night" ? "#14140f" : "#fcfbf8";
    document.documentElement.style.background = paper;
    document.body.style.background = paper;
    const meta = document.querySelector('meta[name="theme-color"]:not([media])')
      || (() => { const m = document.createElement("meta"); m.name = "theme-color"; document.head.appendChild(m); return m; })();
    meta.setAttribute("content", paper);
  }, [theme]);

  const flip = useCallback(() => {
    const swap = () => setTheme((x) => {
      const next = x === "paper" ? "night" : "paper";
      try { window.localStorage.setItem("cv-theme", next); } catch (err) { /* ignore */ }
      return next;
    });
    swap();
  }, []);

  const flipLang = useCallback(() => {
    const swap = () => setLang((x) => {
      const next = x === "en" ? "tr" : "en";
      try { window.localStorage.setItem("cv-lang", next); } catch (err) { /* ignore */ }
      const url = new URL(window.location.href);
      url.searchParams.delete("lang");
      url.pathname = next === "tr" ? "/tr/" : "/";
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      return next;
    });
    swap();
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
    const id = ids[i];
    if (!id) return;
    const url = new URL(window.location.href);
    url.hash = i === 0 ? "" : id;
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, [i, ids]);

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
        <LeftPane active={i} theme={theme} lang={lang} t={t} ids={ids} role={role}
          onTheme={flip} onLang={flipLang} onMenu={() => setMenu(true)} />

        <main className="pane-right">
          <ProgressRail progress={p} label={t.nav[ids[i]] ?? t.nav.about} />
          {SHOW_ROLE_CVS && <HireSwitch t={t} role={role} setRole={setRole} />}
          {ORDER[role || "all"].map((id) => {
            const props = { t, num: num(id), role };
            if (id === "experience") return <Experience key={id} {...props} />;
            if (id === "project") return <Project key={id} {...props} />;
            if (id === "skills") return <Skills key={id} {...props} />;
            if (id === "work") return <Work key={id} {...props} />;
            if (id === "background") return <Background key={id} {...props} />;
            return <Contact key={id} {...props} />;
          })}

          <footer className="foot">
            <span>© {new Date().getFullYear()} Tolga Çakan</span>
            <span>{t.updated} · {t.setIn}</span>
          </footer>
        </main>
      </div>

      <CommandMenu open={menu} onClose={() => setMenu(false)} onTheme={flip} onLang={flipLang} t={t} lang={lang} ids={ids} />
      <Analytics />
    </div>
  );
}
