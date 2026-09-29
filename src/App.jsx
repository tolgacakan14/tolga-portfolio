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
    roles: ["Industrial engineer", "Process & operations", "Product", "Marketing & PR", "Web product builder"],
    about: [
      "I studied industrial engineering at Istanbul Bilgi University and graduated in June 2026. What I like most is finding where a system breaks and then fixing it, whether that turns out to be a factory floor, a product or a spreadsheet nobody wants to open.",
      "My work spans engineering, product, design, operations and research, and I have worked alongside people from across Europe on programmes in Estonia and Czechia. I am most useful when a problem is still vague and somebody has to turn it into something people can actually use.",
      "Away from all that: drums and making songs.",
    ],
    expIntro: "Before I graduated I had worked in Toyota's assembly logistics, at a crypto exchange and at a sports marketing agency. Each taught a different part of the same job: how work really flows, how a product team decides what matters and how something gets sold.",
    jobs: [
      { when: "Mar–Jul 2025", what: "Sports Marketing Intern, De Marke Agency", note: "At De Marke I learned sports marketing where the stakes are highest: UEFA-level sponsorship for a global brand, and international football tournaments where content has to be made live, on the day. I worked in the PR team on site at the UEFA Nations League Finals and UEFA Women's EURO 2025, which showed me how much planning sits behind a few minutes of live content. For Carlsberg's UEFA sponsorship I contributed activation ideas, such as a \u201cVAR Room by Carlsberg\u201d and fan commentary from local pubs. I also wrote the monthly social media report for Sosyal Lig, a football fantasy game with about 115K Instagram followers, and benchmarked the Basketbol Süper Ligi's Instagram against the NBA and EuroLeague to build its content plan." },
      { when: "Jan–Feb 2025", what: "Product Intern, BTCTurk Technology", note: "At BTCTurk Technology I spent four weeks in the Product Management team of one of Turkey's largest crypto exchanges, and learned how a product team really runs: standups, sprint planning, reviews and retros, with the backlog, user stories and roadmap kept in Jira and Confluence. My main work was a competitive benchmark of BtcTurk against leading Turkish and global exchanges, including a screen-by-screen teardown of Binance in Figma. The gaps it showed, from self-custody wallets to DeFi and airdrops, became recommendations I presented to the product team. I also looked into why margin trading isn't offered in Turkey, built dashboards and market-trend reports, and worked with IT on an inventory of the company's apps and tools." },
      { when: "Jun–Jul 2024", what: "Engineering Intern, Toyota Motor Manufacturing Turkey", note: "At Toyota's Sakarya plant, where the Corolla and C-HR are built, I learned the Toyota Production System where it happens: on the gemba. In Assembly Logistics I followed parts from dock receiving through imported-parts ordering, Devan and SPS (set parts supply) line feeding, and saw JIT, Jidoka, Kaizen, Kanban and standard work in daily practice. With two fellow interns I turned those tools on our own internship programme: we measured its efficiency at 61% against an 82% ideal and used a 4M fishbone to trace the gap to its root causes. We proposed a standard programme flow and a standard work form (İSF, İş Standart Formu), wrote a TPS handbook for future interns, and presented it all to management." },
    ],
    skills: [
      ["Product", "Competitive benchmarking and app teardowns · market research · backlog and user stories · roadmap prioritisation · dashboards and reporting · Scrum"],
      ["Operations", "Lean and TPS (Kaizen, 5S, JIT, Jidoka) · root cause analysis (4M fishbone) · Pareto and ABC analysis · MTM · RULA · NIOSH · preventive maintenance · warehouse layout · supplier and production coordination · event operations"],
      ["Data & tools", "Excel (VBA) · SQL · Python · JavaScript · TypeScript · React · Next.js · Blender · Figma · Jira · Confluence · LLM-assisted workflows · prompt design"],
      ["Domain", "Crypto exchanges and DeFi · published blockchain research · NFC and QR systems in hospitality"],
      ["Languages", "Turkish (native) · English (professional)"],
    ],
    ors: {
      heading: "Industry project",
      title: "ÖRS Textile · senior design project",
      meta: "2025–2026 · team of five · Best Senior Design Project Award",
      intro: "With a team of five, I worked inside ÖRS Textile, a custom sock maker, to find out why so much of its output ended up as scrap, fix the biggest causes, and reorganise its labelling station and warehouse. We divided the work and shared it, and the plant put our changes into practice. What I took from it: in a real factory, careful measurement goes further than any clever idea. Every change below started as a number on the floor.",
      facts: [
        ["Scrap", "Pareto analysis traced most of the scrap (87.8%) to three causes: needle breakage, yarn moisture and machine faults"],
        ["Maintenance", "Needle care moved from run-to-failure to preventive maintenance, cutting its cost by more than half"],
        ["Moisture", "A yarn moisture meter against the second-largest cause, paying for itself in about 40 days"],
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
    workIntro: "TAB Marketing started because I kept seeing the same gap in the cafés, restaurants and hotels around me: owners had no simple way to hear from their guests or to be found by new ones. So in 2026 I put together a small team with two friends to offer a solution-focused, CRM-style service, and we take it on project by project as work comes in. We design NFC and QR review stands, feedback cards that get guest complaints to the owner the moment they happen, QR and digital menus, brand-matched print and visuals, websites, and the PR work around them. Clients include Pehlivan Et Lokantası, İtalyan İşi, BREAK, Soft Coffee Lounge, Elbis Hotel and Cabir Deluxe; we found every one of them ourselves and have delivered more than 250 custom pieces to over 15 venues across Istanbul, Sakarya and beyond. I lead design, supplier production and on-site setup, and I build the websites.",
    tabLink: "See the website",
    sites: "Sites built through TAB",
    own: "Own projects",
    rows: [
      { title: "Franco Coffee & Gelato", note: "I built a mobile-first digital menu for a café in Serdivan, which staff update from a Google Sheet. Guests get a three-question taste quiz, a build-your-own gelato picker with a match score, pairings and saved favourites. Next.js, TypeScript.", href: "https://francoserdivan.com", label: "francoserdivan.com" },
      { title: "Diş Hekimi Melis Çakan", note: "I built a calm, mobile-first site for a dental practice in Sakarya: six treatment pages, a symptom picker that points patients to the right one, FAQ, WhatsApp booking and structured data for search.", href: "https://dishekimimeliscakan.com", label: "dishekimimeliscakan.com" },
    ],
    projects: [
      { title: "Krone", tag: "PERSONAL PROJECT · PLAYABLE", note: "I built a mobile party game with nine mini-games, from reflex and colour tests to golf and a maze of arrows. Friends join a room with a code, everyone starts on the same server-timed 3-2-1, and scores go to a shared board. A Daily Challenge uses the date as a random seed, so every player in the world gets the same five games that day. I built it to play with my friends; the first version took six days. React, TypeScript, Supabase.", href: "https://innerclock.vercel.app", label: "Play Krone" },
      { title: "Feed Detox", note: "Feed Detox lets you type what you want to see online and get a pack of creators, searches and mute keywords for X, Instagram, TikTok and YouTube. It pulls real results from the YouTube API and web search, ranks them for relevance and noise, and shares the pack as a link. I built it bilingual (EN/TR) in Next.js." },
      { title: "NICOTINE", tag: "IN PROGRESS", note: "I am building a storefront for an Istanbul streetwear label: a figure that dresses layer by layer as you scroll, drops and an archive, and a points club that rewards returning buyers. Next.js, GSAP." },
    ],
    bg: {
      education: "Education",
      edu: [["Istanbul Bilgi University", ", BSc Industrial Engineering. Graduated June 2026"], ["Serdivan Fen Lisesi", " (science high school), Sakarya, Turkey"], ["Military service", ": deferred until 2029"]],
      international: "International",
      intl: [
        ["HeForShe", ", Erasmus+ Youth Exchange in Saaremaa, Estonia (December 2023). I spent a week with an international group on gender equality and how it tracks with a country's development. Hosted by Artemis Women's Power MTÜ; Youthpass certified."],
        ["European Summer School", ", Blockchain to Financial Markets, Prague, Czechia (2025). Over a week, I studied where distributed ledgers meet market infrastructure: settlement, tokenised assets and the regulation around them."],
      ],
      involvement: "Involvement",
      inv: [
        ["Editorial Director", ", Bilgi Blockchain Club (2021–2024). I ran the club's editorial side: I commissioned and edited what it published and shaped the programme of its forums and speaker evenings. That work led to my own research on blockchain in the entertainment industry, published as a book chapter in 2022."],
        ["Vice President & Operations Lead", ", Atatürkçü Düşünce Kulübü, Bilgi University (2021–2024). I ran more than 10 forums and conferences for students across Istanbul; the largest, a live panel, drew more than 4,000 people."],
      ],
      publication: "Publication",
      pub: "Chapter XI, \u201cBlockchain ve E\u011flence Sekt\u00f6r\u00fc\u201d (Blockchain and the Entertainment Industry), in ",
      pubBook: "Blockchain Teknolojileri ve Sektörel Etkileri",
      pubLink: "Nobel Akademik Yayıncılık, 2022",
      pubMeta: "I wrote it as an independent researcher; published as Mehmet Tolga Çakan · ISBN 978-625-433-825-0 · ORCID 0000-0001-7444-9079",
      programmes: "Awards, programmes & certificates",
      prog: [
        ["Best Senior Design Project Award", ", Department of Industrial Engineering, Istanbul Bilgi University (2026), for the ÖRS Textile project described under Work. Selected among the top five projects of its term; also presented at CSRP 2026."],
        ["FlyRank AI Internship", " (July–August 2026). A remote, unpaid educational programme built around shipping real work rather than coursework; I completed five reviewed assignments and a capstone accepted by the FlyRank team."],
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
      note: "The same record, written four ways. Pick the one closest to the role.",
      items: [
        { slug: "operations", label: "Operations & Process Improvement" },
        { slug: "product", label: "Product & Technology" },
        { slug: "marketing", label: "Marketing, Brand & Sports" },
        { slug: "commercial", label: "Commercial & Business Analysis" },
      ],
    },
    cv: "Download CV ↓",
    verify: "verify ↗",
    setIn: "Set in Newsreader",
    updated: "Updated September 2026",
  },

  tr: {
    nav: { about: "Hakkımda", experience: "Deneyim", skills: "Yetkinlikler", work: "İşler", background: "Geçmiş", contact: "İletişim" },
    place: "İstanbul, Türkiye",
    roles: ["Endüstri mühendisi", "Süreç ve operasyon", "Ürün", "Pazarlama ve PR", "Web ürünleri geliştiren"],
    about: [
      "İstanbul Bilgi Üniversitesi'nde endüstri mühendisliği okudum, Haziran 2026'da mezun oldum. En sevdiğim şey bir sistemin nerede aksadığını bulup düzeltmek; bu bir üretim sahası da olabilir, bir ürün de, kimsenin açmak istemediği bir tablo da.",
      "Mühendislik, ürün, tasarım, operasyon ve araştırma arasında çalışıyorum; Estonya ve Çekya'daki programlarda Avrupa'nın dört bir yanından insanlarla birlikte çalıştım. En çok, bir problem henüz belirsizken ve birinin onu insanların gerçekten kullanabileceği bir şeye dönüştürmesi gerekirken işe yarıyorum.",
      "Bunların dışında: davul çalmak ve şarkı yazmak.",
    ],
    expIntro: "Mezun olmadan önce Toyota'nın montaj lojistiğinde, bir kripto borsasında ve bir spor pazarlama ajansında çalışmıştım. Her biri bana aynı işin farklı bir parçasını öğretti: işin gerçekte nasıl aktığını, bir ürün ekibinin neye öncelik verdiğini ve bir şeyin nasıl satıldığını.",
    jobs: [
      { when: "Mar–Tem 2025", what: "Spor Pazarlama Stajyeri, De Marke Ajansı", note: "Spor pazarlamasını en üst seviyede öğrendim: küresel bir markanın UEFA sponsorluğu ve içeriğin o gün, canlı üretilmesi gereken uluslararası futbol turnuvaları. UEFA Nations League Finals ve UEFA Women's EURO 2025'te sahada PR ekibinde çalıştım; birkaç dakikalık canlı içeriğin arkasında ne kadar planlama olduğunu orada gördüm. Carlsberg'in UEFA sponsorluğu için \u201cVAR Room by Carlsberg\u201d ve mahalle pub'larından taraftar spikerliği gibi aktivasyon fikirleriyle katkı sundum. Ayrıca yaklaşık 115 bin Instagram takipçili futbol menajerlik oyunu Sosyal Lig'in aylık sosyal medya raporunu hazırladım ve Basketbol Süper Ligi'nin Instagram'ını NBA ve EuroLeague ile kıyaslayarak içerik planını oluşturdum." },
      { when: "Oca–Şub 2025", what: "Ürün Stajyeri, BTCTurk Teknoloji", note: "BTCTurk Teknoloji'de, Türkiye'nin en büyük kripto borsalarından birinin Product Management ekibinde dört hafta geçirdim ve bir ürün ekibinin gerçekte nasıl çalıştığını öğrendim: standup'lar, sprint planning, review ve retro toplantıları; Jira ve Confluence'ta backlog, user story ve roadmap. Asıl işim, BtcTurk'ü önde gelen yerli ve küresel borsalarla karşılaştıran bir benchmarking çalışmasıydı; Binance'in Figma'da ekran ekran incelenmesi de buna dâhildi. Ortaya çıkan eksikleri (self-custody cüzdan, DeFi, airdrop) önerilere dönüştürüp ürün ekibine sundum. Bunun yanında margin trading'in Türkiye'de neden sunulmadığını inceledim, dashboard'lar ve piyasa trend raporları hazırladım, IT ekibiyle uygulama ve araç envanterini analiz ettim." },
      { when: "Haz–Tem 2024", what: "Mühendislik Stajyeri, Toyota Otomotiv Sanayi Türkiye", note: "Toyota Otomotiv Sanayi Türkiye'nin, Corolla ve C-HR'ın üretildiği Sakarya fabrikasında Toyota Üretim Sistemi'ni (TPS) yerinde, gemba'da öğrendim. Assembly Logistics'te parçaların yolunu dock receiving'den ithal parça siparişine, Devan'dan SPS ile hat beslemeye kadar izledim; JIT, Jidoka, Kaizen, Kanban ve standart işin günlük pratikte nasıl işlediğini gördüm. İki stajyer arkadaşımla bu araçları kendi staj programımıza uyguladık: verimliliği ideal olan %82'ye karşı %61 olarak ölçtük ve 4M fishbone ile root cause analysis yaparak farkın kök nedenlerini belirledik. Standart bir program akışı ve İş Standart Formu (İSF) önerdik, gelecek stajyerler için bir TPS el kitabı yazdık ve hepsini yönetime sunduk." },
    ],
    skills: [
      ["Ürün", "Benchmarking ve uygulama incelemeleri · market research · backlog ve user story · roadmap önceliklendirme · dashboard ve raporlama · Scrum"],
      ["Operasyon", "Lean ve TPS (Kaizen, 5S, JIT, Jidoka) · root cause analysis (4M balık kılçığı) · Pareto ve ABC analizi · MTM · RULA · NIOSH · preventive maintenance · depo yerleşimi · tedarikçi ve üretim koordinasyonu · etkinlik operasyonları"],
      ["Veri & araçlar", "Excel (VBA) · SQL · Python · JavaScript · TypeScript · React · Next.js · Blender · Figma · Jira · Confluence · LLM destekli workflow'lar · prompt design"],
      ["Alan bilgisi", "Kripto borsaları ve DeFi · yayımlanmış blockchain araştırması · konaklama ve yeme içme sektöründe NFC ve QR sistemleri"],
      ["Diller", "Türkçe (ana dili) · İngilizce (profesyonel)"],
    ],
    ors: {
      heading: "Endüstri projesi",
      title: "ÖRS Tekstil · bitirme projesi",
      meta: "2025–2026 · beş kişilik ekip · En İyi Bitirme Projesi Ödülü",
      intro: "Beş kişilik ekibimle, siparişe özel çorap üreten ÖRS Tekstil'in içinde çalıştım: üretimin neden bu kadarının fireye gittiğini bulduk, en büyük nedenleri çözdük, etiketleme istasyonunu ve depoyu yeniden düzenledik. İşi aramızda bölüp paylaştık; fabrika da değişikliklerimizi uygulamaya aldı. Bundan aldığım ders şu: gerçek bir fabrikada dikkatli ölçüm, en parlak fikirden daha ileri götürüyor. Aşağıdaki her değişiklik sahada ölçülen bir sayıyla başladı.",
      facts: [
        ["Fire", "Pareto analizi firenin büyük kısmını (%87,8) üç nedene bağladı: iğne kırılması, iplik nemi ve makine arızaları"],
        ["Bakım", "İğne bakımı run-to-failure'dan preventive maintenance'a geçti; maliyet yarıdan fazla azaldı"],
        ["Nem", "İkinci büyük nedene karşı bir iplik nemölçeri; kendini yaklaşık 40 günde amorti etti"],
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
    workIntro: "TAB Marketing, çevremdeki kafe, restoran ve otellerde hep aynı eksiği görmemle başladı: işletme sahiplerinin misafirlerini dinlemek ve yeni müşteriler tarafından bulunmak için basit bir yolu yoktu. 2026'da iki arkadaşımla çözüm odaklı, CRM benzeri bir hizmet sunan küçük bir ekip kurdum; işleri proje bazında, iş geldikçe yürütüyoruz. NFC ve QR yorum standları, misafir şikâyetlerini işletme sahibine anında ileten geri bildirim kartları, QR ve dijital menüler, markaya uygun baskı ve görseller, web siteleri ve bunların etrafındaki PR çalışmalarını tasarlıyoruz. Pehlivan Et Lokantası, İtalyan İşi, BREAK, Soft Coffee Lounge, Elbis Hotel ve Cabir Deluxe gibi işletmelerle çalıştık; müşterilerin hepsini kendimiz bulduk ve İstanbul, Sakarya ve başka şehirlerde 15'ten fazla işletmeye 250'den fazla özel tasarım ürün teslim ettik. Tasarımı, tedarikçilerle üretimi ve sahadaki kurulumu ben yürütüyorum; web sitelerini de ben geliştiriyorum.",
    tabLink: "Siteye git",
    sites: "TAB kapsamında yaptığım siteler",
    own: "Kendi projelerim",
    rows: [
      { title: "Franco Coffee & Gelato", note: "Serdivan'daki bir kafe için mobile-first bir dijital menü yaptım; personel menüyü bir Google Sheet'ten güncelliyor. Misafirler üç soruluk bir lezzet quiz'i, uyum puanı gösteren “kendi dondurmanı yap” seçicisi, eşleştirme önerileri ve favorilerini kaydetme özelliği buluyor. Next.js, TypeScript.", href: "https://francoserdivan.com", label: "francoserdivan.com" },
      { title: "Diş Hekimi Melis Çakan", note: "Sakarya'daki bir diş kliniği için sakin, mobile-first bir site yaptım: altı tedavi sayfası, hastayı doğru sayfaya yönlendiren bir belirti seçici, SSS, WhatsApp'tan randevu ve arama motorları için yapılandırılmış veri.", href: "https://dishekimimeliscakan.com", label: "dishekimimeliscakan.com" },
    ],
    projects: [
      { title: "Krone", tag: "KİŞİSEL PROJE · OYNANABİLİR", note: "Dokuz mini oyundan oluşan mobil bir parti oyunu yaptım: refleks ve renk testlerinden golfe, ok labirentine kadar. Arkadaşlar kodla aynı odaya giriyor, herkes sunucu zamanlı aynı 3-2-1 geri sayımıyla başlıyor, skorlar ortak tabloya düşüyor. Günlük Meydan Okuma'da tarih, rastgele sayı üretecine seed olarak veriliyor; böylece dünyadaki herkes o gün aynı beş oyunu oynuyor. Arkadaşlarımla oynamak için yaptım; ilk sürüm altı gün sürdü. React, TypeScript, Supabase.", href: "https://innerclock.vercel.app", label: "Krone'u oyna" },
      { title: "Feed Detox", note: "Feed Detox'u yaptım: internette ne görmek istediğini yazıyorsun, uygulama da X, Instagram, TikTok ve YouTube için takip edilecek hesapları, aramaları ve susturulacak kelimeleri bir paket hâlinde çıkarıyor. Sonuçları YouTube API'si ve web aramasından canlı çekip alaka ve gürültüye göre sıralıyor, paketi bir linkle paylaşmanı sağlıyor. Türkçe ve İngilizce. Next.js." },
      { title: "NICOTINE", tag: "GELİŞTİRİLİYOR", note: "İstanbul'daki bir streetwear markası için bir vitrin geliştiriyorum: scroll ettikçe bir figür katman katman giyiniyor; drop'lar, arşiv ve geri gelen alıcıyı ödüllendiren puanlı bir kulüp. Next.js, GSAP." },
    ],
    bg: {
      education: "Eğitim",
      edu: [["İstanbul Bilgi Üniversitesi", ", Endüstri Mühendisliği (Lisans). Haziran 2026 mezunu"], ["Serdivan Fen Lisesi", ", Sakarya"], ["Askerlik", ": 2029'a kadar tecilli"]],
      international: "Uluslararası",
      intl: [
        ["HeForShe", ", Erasmus+ Youth Exchange, Saaremaa, Estonya (Aralık 2023). Uluslararası bir grupla bir hafta boyunca toplumsal cinsiyet eşitliğini ve bunun bir ülkenin gelişmişliğiyle ilişkisini ele aldık. Artemis Women's Power MTÜ'nün ev sahipliğinde; Youthpass sertifikalı."],
        ["European Summer School", ", Blockchain to Financial Markets. Prag, Çekya (2025). Distributed ledger teknolojilerinin piyasa altyapısıyla kesiştiği yer üzerine bir hafta çalıştım: settlement, tokenized assets ve bunları çevreleyen regülasyon."],
      ],
      involvement: "Kulüpler & topluluk",
      inv: [
        ["Yayın Yönetmeni", ", Bilgi Blockchain Kulübü (2021–2024). Kulübün yayın tarafını yürüttüm: kulübün yayımladığı içerikleri belirleyip düzenledim, forumların ve konuşmacı akşamlarının programını şekillendirdim. Bu dönemde eğlence sektöründe blockchain üzerine kendi araştırmamı yaptım; araştırma 2022'de kitap bölümü olarak yayımlandı."],
        ["Başkan Yardımcısı & Operasyon Lideri", ", Atatürkçü Düşünce Kulübü, Bilgi Üniversitesi (2021–2024). İstanbul'daki öğrenciler için 10'dan fazla forum ve konferans düzenledim; en büyüğü 4.000'den fazla kişilik canlı paneldi."],
      ],
      publication: "Yayın",
      pub: "XI. Bölüm: “Blockchain ve Eğlence Sektörü”, ",
      pubAfter: " içinde",
      pubBook: "Blockchain Teknolojileri ve Sektörel Etkileri",
      pubLink: "Nobel Akademik Yayıncılık, 2022",
      pubMeta: "Bağımsız araştırmacı olarak yazdım; Mehmet Tolga Çakan adıyla yayımlandı · ISBN 978-625-433-825-0 · ORCID 0000-0001-7444-9079",
      programmes: "Ödüller, programlar & sertifikalar",
      prog: [
        ["En İyi Bitirme Projesi Ödülü", ", Endüstri Mühendisliği Bölümü, İstanbul Bilgi Üniversitesi (2026), İşler bölümünde anlatılan ÖRS Tekstil projesiyle. Dönemin en iyi beş projesi arasına seçildi; ayrıca CSRP 2026'da sunuldu."],
        ["FlyRank AI Internship", " (Temmuz–Ağustos 2026). Ders çözmek yerine gerçek iş çıkarmaya dayanan, uzaktan ve ücretsiz bir eğitim programı; değerlendirmeden geçen beş ödevi ve FlyRank ekibince kabul edilen bir bitirme projesini tamamladım."],
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
      note: "Aynı geçmiş, dört farklı rol için dört ayrı CV (İngilizce). İlana en uygun olanı seçin.",
      items: [
        { slug: "operations", label: "Operasyon ve Süreç İyileştirme" },
        { slug: "product", label: "Ürün ve Teknoloji" },
        { slug: "marketing", label: "Pazarlama, Marka ve Spor" },
        { slug: "commercial", label: "Ticari ve İş Analizi" },
      ],
    },
    cv: "CV indir ↓",
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

const cvHref = (slug) => "/cv/tolga-cakan-cv-" + slug + ".pdf";

const SECTION_IDS = ["about", "experience", "skills", "work", "background", "contact"];

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

/* ÖRS project: results, Pareto and the A3 view */
.ors { margin: 6px 0 10px; }
.ors-meta { font-size: 11px; color: var(--ink-faint); letter-spacing: .03em; margin: 0 0 14px; }
.ors-actions { display: flex; gap: 18px; align-items: center; flex-wrap: wrap; margin: 16px 0 0; }
.pareto { margin: 22px 0 0; }
.pareto svg { width: 100%; height: auto; display: block; }
.pareto-bar rect { fill: color-mix(in srgb, var(--ink-faint) 45%, transparent); transition: fill .2s ease; cursor: pointer; }
.pareto-bar[data-on="true"] rect, .pareto-bar:hover rect { fill: var(--accent); }
.pareto-bar text { font: 10px 'JetBrains Mono', monospace; fill: var(--ink-soft); }
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
.cv-picks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 14px; }
.cv-pick {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
  padding: 13px 14px; border: 1px solid var(--rule); font-size: 15px; color: var(--ink);
  transition: border-color .25s ease, color .25s ease, background .25s ease;
}
.cv-pick .mono { font-size: 10px; letter-spacing: .08em; color: var(--ink-faint); white-space: nowrap; }
.cv-pick:hover { border-color: var(--accent); color: var(--accent); background: color-mix(in srgb, var(--paper-2) 60%, transparent); }
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

function CommandMenu({ open, onClose, onTheme, onLang, t, lang }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const ref = useRef(null);

  const items = [
    ...SECTION_IDS.slice(1).map((id) => ({ k: id, label: t.nav[id], hint: lang === "tr" ? "Bölüm" : "Section", run: () => go(id) })),
    { k: "lang", label: lang === "en" ? "Türkçe'ye geç" : "Switch to English", hint: lang === "tr" ? "Dil" : "Language", run: onLang },
    { k: "theme", label: lang === "tr" ? "Paleti değiştir" : "Switch palette", hint: lang === "tr" ? "Görünüm" : "View", run: onTheme },
    ...t.cvs.items.map((c) => ({ k: "cv-" + c.slug, label: (lang === "tr" ? "İşe alım · " : "Hiring · ") + c.label, hint: "CV", run: () => { window.open(cvHref(c.slug), "_blank", "noreferrer"); } })),
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
          <a href={LINKEDIN} target="_blank" rel="noreferrer">linkedin.com/in/mehmettolgacakan</a>
          <a href="https://github.com/tolgacakan14" target="_blank" rel="noreferrer">github.com/tolgacakan14</a>
        </div>
        <div className="tools">
          <a className="chip chip-cv" href="#cv" onClick={(e) => { e.preventDefault(); go("cv"); }}>{t.cv}</a>
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

function Experience({ t }) {
  return (
    <section className="sec" id="experience">
      <div className="wrap">
        <SecHead num="02" title={t.nav.experience} id="experience" />
        <p className="p rise">{withTab(t.expIntro)}</p>
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

/** Pareto of the ÖRS scrap causes: bars by pairs, cumulative share as a line. */
function Pareto({ o }) {
  const [on, setOn] = useState(0);
  const total = o.causes.reduce((a, [, n]) => a + n, 0);
  const max = o.causes[0][1];
  const W = 560, H = 200, pad = 28, bw = (W - pad * 2) / o.causes.length;
  let run = 0;
  const pts = o.causes.map(([, n], i) => {
    run += n;
    return [pad + bw * i + bw / 2, H - pad - (run / total) * (H - pad * 2)];
  });
  const fmt = (n) => n.toLocaleString(o.pairs === "çift" ? "tr-TR" : "en-GB");
  return (
    <figure className="pareto rise">
      <figcaption className="h3">{o.paretoTitle}</figcaption>
      <svg viewBox={"0 0 " + W + " " + H} role="img" aria-label={o.paretoTitle}>
        {o.causes.map(([label, n], i) => {
          const h = (n / max) * (H - pad * 2) * 0.62;
          return (
            <g key={label} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onClick={() => setOn(i)} tabIndex={0} className="pareto-bar" data-on={i === on ? "true" : "false"}>
              <rect x={pad + bw * i + 8} y={H - pad - h} width={bw - 16} height={h} />
              <text x={pad + bw * i + bw / 2} y={H - 10} textAnchor="middle">{label}</text>
            </g>
          );
        })}
        <polyline points={pts.map((p) => p.join(",")).join(" ")} className="pareto-line" />
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" className="pareto-dot" />)}
      </svg>
      <p className="pareto-read">
        <b>{o.causes[on][0]}</b> · {fmt(o.causes[on][1])} {o.pairs} ({Math.round((o.causes[on][1] / total) * 1000) / 10}%) · {o.causes[on][2]}
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
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
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

function Work({ t }) {
  return (
    <section className="sec" id="work">
      <div className="wrap">
        <SecHead num="04" title={t.nav.work} id="work" />
        <OrsBlock o={t.ors} />
        <h3 className="h3 rise" style={{ marginTop: 40 }}>TAB Marketing</h3>
        <p className="p rise" style={{ "--i": 1 }}>{withTab(t.workIntro)}</p>
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

function Background({ t }) {
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

function Contact({ t }) {
  return (
    <section className="sec" id="contact">
      <div className="wrap">
        <SecHead num="06" title={t.nav.contact} id="contact" />
        <p className="p rise" style={{ "--i": 1 }}>{t.contactText}</p>
        <div className="meta mono rise" style={{ "--i": 2 }}>
          <ContactLine href={"mailto:" + EMAIL}>{EMAIL}</ContactLine>
          <ContactLine href={PHONE_HREF}>{PHONE_DISPLAY}</ContactLine>
          <a href={LINKEDIN} target="_blank" rel="noreferrer">linkedin.com/in/mehmettolgacakan</a>
          <a href="https://github.com/tolgacakan14" target="_blank" rel="noreferrer">github.com/tolgacakan14</a>
        </div>
        <div className="cv-block rise" id="cv" style={{ "--i": 3 }}>
          <h3 className="h3">{t.cvs.heading}</h3>
          <p className="p">{t.cvs.note}</p>
          <div className="cv-picks">
            {t.cvs.items.map((c) => (
              <a key={c.slug} className="cv-pick" href={cvHref(c.slug)} download>
                <span>{c.label}</span><span className="mono">PDF ↓</span>
              </a>
            ))}
          </div>
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
      if (next === "en") url.searchParams.delete("lang");
      else url.searchParams.set("lang", next);
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
            <span>{t.updated} · {t.setIn}</span>
          </footer>
        </main>
      </div>

      <CommandMenu open={menu} onClose={() => setMenu(false)} onTheme={flip} onLang={flipLang} t={t} lang={lang} />
      <Analytics />
    </div>
  );
}
