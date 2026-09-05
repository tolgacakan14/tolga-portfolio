import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * A quiet one-page CV. Oxford restraint on the surface; the modern
 * parts (palette, command menu, scroll state) stay out of the way.
 * ------------------------------------------------------------------ */

const SECTIONS = [
  { id: "top", label: "Top" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "background", label: "Background" },
  { id: "contact", label: "Contact" },
];

const SKILLS = [
  ["Product management", "Benchmarking · market and competitor research · user testing · scoping and requirements · dashboards and reporting"],
  ["Engineering", "Python · SQL · React · TypeScript · Next.js · Vite · Git · Vercel"],
  ["Analysis & tools", "Excel and VBA · Figma · Kaizen and process improvement · vendor and production logistics"],
  ["AI in practice", "LLM-assisted workflows · prompt design and iteration · Anthropic tooling"],
  ["Physical × digital", "NFC and QR systems · print and production · rollouts across cafés, restaurants and hotels"],
  ["Domains", "Fintech and crypto exchange · blockchain · hospitality, retail and clinics"],
  ["Languages", "Turkish (native) · English (professional)"],
];

const PHONE_DISPLAY = "+90 542 262 00 42";
const PHONE_HREF = "tel:+905422620042";
const EMAIL = "tolga@tolgacakan.dev";

const TAB_PRODUCTS = [
  { src: "/work/tab-main-card.png", label: "Google review card", alt: "TAB Marketing NFC Google review card" },
  { src: "/work/italyanisi-menu-card.jpg", label: "QR menu + NFC", alt: "Tabletop QR menu and NFC review card" },
  { src: "/work/pehlivan-gold.webp", label: "NFC stand", alt: "Black and gold NFC review stand" },
  { src: "/work/loren-nfc-stand.jpg", label: "Framed stand", alt: "Framed burgundy and gold NFC stand" },
  { src: "/work/hotel-cabir.jpg", label: "Hotel key card", alt: "Hotel room key card with NFC" },
  { src: "/work/soft-feedback.png", label: "Feedback card", alt: "Private feedback NFC card" },
];

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

/* nav */
.nav {
  position: sticky; top: 0; z-index: 30;
  background: color-mix(in srgb, var(--paper) 90%, transparent);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--rule);
}
.nav-in {
  max-width: 660px; margin: 0 auto; padding: 13px 28px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.nav-name { font-size: 15px; letter-spacing: .01em; }
.nav-links { display: flex; gap: 18px; list-style: none; margin: 0; padding: 0; }
.nav-links a {
  font-size: 11px; letter-spacing: .11em; text-transform: uppercase;
  color: var(--ink-faint); padding-bottom: 2px; border-bottom: 1px solid transparent;
  transition: color .25s ease, border-color .25s ease;
}
.nav-links a:hover { color: var(--ink); }
.nav-links a[data-on="true"] { color: var(--ink); border-color: var(--accent); }
.nav-tools { display: flex; gap: 6px; }
.chip {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .08em;
  color: var(--ink-faint); background: none; border: 1px solid var(--rule);
  padding: 5px 8px; cursor: pointer; transition: color .25s, border-color .25s;
}
.chip:hover { color: var(--ink); border-color: var(--ink-faint); }
.bar { height: 1px; background: var(--accent); transform-origin: 0 50%; opacity: .5; }

/* header */
.head { padding: 68px 0 44px; }
.eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .16em;
  text-transform: uppercase; color: var(--ink-faint); margin: 0 0 18px;
}
.name {
  font-size: clamp(34px, 5.4vw, 46px); font-weight: 400; letter-spacing: -.015em;
  line-height: 1.1; margin: 0 0 8px;
}
.role { font-size: 18px; color: var(--ink-soft); font-style: italic; margin: 0 0 26px; }
.meta {
  display: flex; flex-wrap: wrap; gap: 6px 20px;
  font-family: 'JetBrains Mono', monospace; font-size: 11.5px; letter-spacing: .02em;
  padding-top: 18px; border-top: 1px solid var(--rule);
}
.meta a, .meta span { color: var(--ink-soft); }
.meta a { border-bottom: 1px solid transparent; transition: color .25s, border-color .25s; }
.meta a:hover { color: var(--accent); border-color: var(--accent); }

/* sections */
.sec { padding: 40px 0; border-top: 1px solid var(--rule); }
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
.portrait {
  flex: 0 0 116px; width: 116px; height: 116px; border-radius: 50%;
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

/* compact product strip */
.strip {
  display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin: 16px 0 14px;
}
.strip figure { margin: 0; overflow: hidden; border: 1px solid var(--rule); background: var(--paper-2); }
.strip img {
  width: 100%; height: 74px; object-fit: cover; display: block;
  transition: transform .5s cubic-bezier(.2,.8,.2,1), opacity .4s ease;
  opacity: .93;
}
.strip figure:hover img { transform: scale(1.06); opacity: 1; }
.strip-note {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .08em;
  color: var(--ink-faint); margin: 0 0 16px;
}
@media (max-width: 620px) {
  .strip { grid-template-columns: repeat(3, 1fr); }
  .strip img { height: 88px; }
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

/* contact line + copy button */
.contact { display: inline-flex; align-items: center; gap: 5px; }
.contact > a {
  color: var(--ink-soft); border-bottom: 1px solid transparent;
  transition: color .25s ease, border-color .25s ease;
}
.contact > a:hover { color: var(--accent); border-color: var(--accent); }
.contact-copy {
  background: none; border: 0; padding: 1px 2px; cursor: pointer; position: relative;
  color: var(--ink-faint); opacity: .45; line-height: 0;
  transition: opacity .25s ease, color .25s ease;
}
.contact:hover .contact-copy { opacity: .85; }
.contact-copy:hover { color: var(--accent); opacity: 1; }
.copy-flag {
  position: absolute; left: 50%; bottom: calc(100% + 6px); transform: translateX(-50%) translateY(3px);
  font-family: 'JetBrains Mono', monospace; font-size: 8.5px; letter-spacing: .12em; text-transform: uppercase;
  background: var(--ink); color: var(--paper); padding: 3px 6px; white-space: nowrap; line-height: 1.4;
  opacity: 0; pointer-events: none; transition: opacity .2s ease, transform .2s ease;
}
.contact-copy:hover .copy-flag,
.contact-copy[data-copied="true"] .copy-flag { opacity: 1; transform: translateX(-50%) translateY(0); }

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
  .nav, .cmd-bg, .chip, .anchor, .foot, .contact-copy { display: none !important; }
  .cv { background: #fff; color: #000; font-size: 11pt; }
  .cv[data-theme="night"] { --paper: #fff; --ink: #000; --ink-soft: #333; --rule: #ccc; }
  .wrap { max-width: 100%; padding: 0; }
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

function useRise() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".rise").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
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

/** Clipboard with a fallback for browsers that refuse the async API. */
async function writeToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-999px;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (err2) {
      return false;
    }
  }
}

/** A contact line: the link behaves normally, a small button copies it. */
function ContactLine({ value, href, children }) {
  const [done, setDone] = useState(false);
  const copy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await writeToClipboard(value);
    if (!ok) return;
    setDone(true);
    window.setTimeout(() => setDone(false), 1400);
  };
  return (
    <span className="contact">
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}>{children}</a>
      <button type="button" className="contact-copy" onClick={copy}
        data-copied={done ? "true" : "false"} aria-label={"Copy " + value}>
        <span className="copy-flag">{done ? "copied" : "copy"}</span>
        <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
          <rect x="3.2" y="3.2" width="7" height="7" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M8.4 1.8H2.4c-.55 0-1 .45-1 1v6" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>
    </span>
  );
}

function SecHead({ num, title, id }) {
  return (
    <div className="sec-head rise">
      <span className="sec-num">{num}</span>
      <h2 className="h2">
        {title}
        <a className="anchor" href={"#" + id} aria-label={"Link to " + title}
          onClick={(e) => { e.preventDefault(); go(id); history.replaceState(null, "", "#" + id); }}>§</a>
      </h2>
    </div>
  );
}

function CommandMenu({ open, onClose, onTheme }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const ref = useRef(null);

  const items = [
    ...SECTIONS.slice(1).map((s) => ({ k: s.id, label: s.label, hint: "Section", run: () => go(s.id) })),
    { k: "theme", label: "Switch palette", hint: "View", run: onTheme },
    { k: "mail", label: "Write an email", hint: "Contact", run: () => { window.location.href = "mailto:" + EMAIL; } },
    { k: "tel", label: "Call", hint: "Contact", run: () => { window.location.href = PHONE_HREF; } },
    { k: "print", label: "Save as PDF", hint: "Page", run: () => window.print() },
  ];
  const hits = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (open) { setQ(""); setSel(0); window.setTimeout(() => ref.current?.focus(), 25); }
  }, [open]);

  if (!open) return null;

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => (s + 1) % Math.max(hits.length, 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => (s - 1 + hits.length) % Math.max(hits.length, 1)); }
    else if (e.key === "Enter") { e.preventDefault(); hits[sel]?.run(); onClose(); }
    else if (e.key === "Escape") onClose();
  };

  return (
    <div className="cmd-bg" onClick={onClose} role="presentation">
      <div className="cmd" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Menu">
        <input ref={ref} value={q} placeholder="jump to…" onKeyDown={onKey}
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
        <div className="cmd-foot"><span>↑↓</span><span>↵ open</span><span>esc</span></div>
      </div>
    </div>
  );
}

function Head({ index }) {
  return (
    <header className="head" id="top">
      <div className="wrap">
        <p className="eyebrow rise">Istanbul, Turkey</p>
        <h1 className="name rise" style={{ "--i": 1 }}>Tolga Çakan</h1>
        <p className="role rise" style={{ "--i": 2 }}>
          Industrial engineer — product and systems, built end to end
        </p>
        <div className="meta mono rise" style={{ "--i": 3 }}>
          <ContactLine value={EMAIL} href={"mailto:" + EMAIL}>{EMAIL}</ContactLine>
          <ContactLine value="+905422620042" href={PHONE_HREF}>{PHONE_DISPLAY}</ContactLine>
          <a href="https://github.com/tolgacakan14" target="_blank" rel="noreferrer">github.com/tolgacakan14</a>
        </div>
      </div>
    </header>
  );
}

function About() {
  return (
    <section className="sec" id="about">
      <div className="wrap">
        <SecHead num="01" title="About" id="about" />

        <div className="about-top rise" style={{ "--i": 1 }}>
          <div className="portrait">
            <img src="/tolga.png" alt="Tolga Çakan" width="560" height="560" />
          </div>
          <p className="p">
            I read industrial engineering at Istanbul Bilgi University: the study of where a system
            gives way, and what it costs to put right. I am not a designer by trade — I am an
            engineer who can specify a product and then build it, which turns out to be the useful
            combination when a business needs the thing to actually work.
          </p>
        </div>

        <p className="p rise" style={{ "--i": 2 }}>
          Before I finished I had worked a Toyota assembly line, a crypto exchange, a digital
          agency and an AI platform. Each taught a different part of the same job: how work really
          flows, how a product team decides what matters, how a thing gets sold, and how to put AI
          to work without hand-waving.
        </p>
        <p className="p rise" style={{ "--i": 3 }}>
          Today I co-run <em>TAB Marketing</em>, a small studio building the layer where a physical
          touch becomes a digital result: tap a card and a review page opens, scan a table and the
          menu loads. I carry those from the brief through the design and production to the site
          behind them — seven products, more than fifteen businesses across Istanbul and Sakarya.
        </p>
        <p className="p rise" style={{ "--i": 4 }}>
          What is left of the week goes to my own projects, and to the drums.
        </p>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="sec" id="skills">
      <div className="wrap">
        <SecHead num="03" title="Skills" id="skills" />
        {SKILLS.map(([key, val], n) => (
          <div className="entry rise" key={key} style={{ "--i": n + 1 }}>
            <span className="entry-when">{key}</span>
            <p className="entry-note">{val}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  const rows = [
    { when: "Mar — Jul 2025", what: "Intern, De Marke Agency", note: "Digital marketing, and the on-site organisation at international tournaments." },
    { when: "Jan — Feb 2025", what: "Product Intern, BTCTurk Technology", note: "Where I learned product management properly: benchmarking, market research and user testing, alongside the internal dashboards and reporting the team read every day." },
    { when: "Jun — Jul 2024", what: "Product Engineering Intern, Toyota Motor Manufacturing Turkey", note: "Assembly line logistics and Kaizen projects. On-site, Sakarya." },
  ];
  return (
    <section className="sec" id="experience">
      <div className="wrap">
        <SecHead num="02" title="Experience" id="experience" />
        {rows.map((r, n) => (
          <div className="entry rise" key={r.what} style={{ "--i": n + 1 }}>
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

function Work() {
  return (
    <section className="sec" id="work">
      <div className="wrap">
        <SecHead num="04" title="Work" id="work" />

        <p className="p rise" style={{ "--i": 1 }}>
          Most of it runs through <em>TAB Marketing</em>: NFC review cards, QR menus, hotel key
          cards and feedback cards for cafés, restaurants and hotels — each one made for a
          particular business.
        </p>

        <div className="strip rise" style={{ "--i": 2 }}>
          {TAB_PRODUCTS.map((p) => (
            <figure key={p.src}>
              <img src={p.src} alt={p.alt} title={p.label} loading="lazy" />
            </figure>
          ))}
        </div>
        <p className="strip-note rise" style={{ "--i": 3 }}>
          <a className="link link-mono" href="https://tab-marketing-site.vercel.app/#top" target="_blank" rel="noreferrer">
            tab-marketing-site.vercel.app <span>→</span>
          </a>
        </p>

        <h3 className="h3 rise" style={{ "--i": 4 }}>Sites</h3>
        <div className="row rise" style={{ "--i": 5 }}>
          <div className="row-main">
            <p className="row-title">Franco Coffee &amp; Gelato</p>
            <p className="row-note">A digital menu with a build-your-own gelato flavour picker.</p>
            <a className="link link-mono" href="https://francoserdivan.com" target="_blank" rel="noreferrer">
              francoserdivan.com <span>→</span>
            </a>
          </div>
        </div>
        <div className="row rise" style={{ "--i": 6 }}>
          <div className="row-main">
            <p className="row-title">Diş Hekimi Melis Çakan</p>
            <p className="row-note">A calm, mobile-first site for a dental practice in Sakarya.</p>
            <a className="link link-mono" href="https://dishekimimeliscakan.com" target="_blank" rel="noreferrer">
              dishekimimeliscakan.com <span>→</span>
            </a>
          </div>
        </div>

        <h3 className="h3 rise" style={{ "--i": 7 }}>Own projects</h3>
        <div className="row rise" style={{ "--i": 8 }}>
          <div className="row-main">
            <p className="row-title">Krone</p>
            <p className="row-note">A web game for the phone: mini-games, rooms, daily challenges, leaderboards.</p>
            <a className="link link-mono" href="https://innerclock.vercel.app" target="_blank" rel="noreferrer">
              innerclock.vercel.app <span>→</span>
            </a>
          </div>
        </div>
        <div className="row rise" style={{ "--i": 9 }}>
          <div className="row-main">
            <p className="row-title">FeedDetox <span className="mono" style={{ fontSize: 10, letterSpacing: ".1em", color: "var(--ink-faint)" }}>IN PROGRESS</span></p>
            <p className="row-note">Taking back your own feed algorithm: seeing what it has learned, and pointing it elsewhere.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Background() {
  return (
    <section className="sec" id="background">
      <div className="wrap">
        <SecHead num="05" title="Background" id="background" />

        <h3 className="h3 rise">Education</h3>
        <ul className="list rise" style={{ "--i": 1 }}>
          <li><b>Istanbul Bilgi University</b> — Industrial Engineering</li>
          <li><b>Fen Lisesi</b> — Sakarya, Turkey</li>
        </ul>

        <h3 className="h3 rise" style={{ "--i": 2 }}>International</h3>
        <ul className="list rise" style={{ "--i": 3 }}>
          <li><b>Volunteer researcher</b>, He For She / Erasmus+ — Saaremaa, Estonia (2023—2024)</li>
          <li><b>European Summer School</b>, Blockchain to Financial Markets — Prague, Czechia (2025)</li>
        </ul>

        <h3 className="h3 rise" style={{ "--i": 4 }}>Involvement</h3>
        <ul className="list rise" style={{ "--i": 5 }}>
          <li><b>Editorial Director</b>, Bilgi Blockchain Club (2021—2024)</li>
          <li><b>Vice President</b>, Atatürkçü Düşünce Kulübü, Bilgi University (2022—2024)</li>
        </ul>

        <h3 className="h3 rise" style={{ "--i": 6 }}>Publication</h3>
        <p className="p rise" style={{ "--i": 7 }}>
          Chapter on blockchain and the entertainment industry in{" "}
          <em>Blockchain Teknolojileri ve Sektörel Etkileri</em>.{" "}
          <a className="link link-mono" href="https://www.nobelyayin.com/blockchain-teknolojileri-ve-sektorel-etkileri-19020.html" target="_blank" rel="noreferrer">
            Nobel, 2022 <span>→</span>
          </a>
          <br />
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: ".02em" }}>
            Published as Mehmet Tolga Çakan · ISBN 978-625-433-825-0
          </span>
        </p>

        <h3 className="h3 rise" style={{ "--i": 8 }}>Programmes &amp; certificates</h3>
        <ul className="list rise" style={{ "--i": 9 }}>
          <li><b>AI Engineering Internship</b>, FlyRank AI (2026) — remote, project-based</li>
          <li><b>AI Fluency: Framework &amp; Foundations</b>, Anthropic (2026)</li>
          <li><b>Claude 101</b>, Anthropic (2026)</li>
          <li><b>Award</b>, ÖRS Textile senior design project, CSRP (2026)</li>
        </ul>

        <h3 className="h3 rise" style={{ "--i": 10 }}>Music</h3>
        <p className="p rise" style={{ "--i": 11 }}>
          Drums and songwriting in <em>son sek'</em> — one album, two singles, a handful of live
          shows.{" "}
          <a className="link link-mono" href="https://open.spotify.com/intl-tr/artist/1ILN8doPYd0l4l9ME6Rtce" target="_blank" rel="noreferrer">
            Spotify <span>→</span>
          </a>
        </p>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="sec" id="contact">
      <div className="wrap">
        <SecHead num="06" title="Contact" id="contact" />
        <p className="p rise" style={{ "--i": 1 }}>
          Based in Istanbul, open to new projects and roles.
        </p>
        <div className="meta mono rise" style={{ "--i": 2, borderTop: 0, paddingTop: 0 }}>
          <ContactLine value={EMAIL} href={"mailto:" + EMAIL}>{EMAIL}</ContactLine>
          <ContactLine value="+905422620042" href={PHONE_HREF}>{PHONE_DISPLAY}</ContactLine>
          <a href="https://github.com/tolgacakan14" target="_blank" rel="noreferrer">github.com/tolgacakan14</a>
        </div>
      </div>
    </section>
  );
}

export default function CV() {
  const [theme, setTheme] = useState("paper");
  const [menu, setMenu] = useState(false);
  const { i, p } = useScrollState(SECTIONS.map((s) => s.id));
  useRise();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("cv-theme");
      if (saved === "night" || saved === "paper") setTheme(saved);
    } catch (err) { /* storage unavailable */ }
  }, []);

  const flip = useCallback(() => {
    const swap = () => setTheme((t) => {
      const next = t === "paper" ? "night" : "paper";
      try { window.localStorage.setItem("cv-theme", next); } catch (err) { /* ignore */ }
      return next;
    });
    // cross-fade the whole page where the browser supports it
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

  return (
    <div className="cv" data-theme={theme}>
      <style>{STYLES}</style>

      <nav className="nav">
        <div className="nav-in">
          <a className="nav-name" href="#top" onClick={(e) => { e.preventDefault(); go("top"); }}>
            Tolga Çakan
          </a>
          <ul className="nav-links">
            {SECTIONS.slice(1).map((s) => (
              <li key={s.id}>
                <a href={"#" + s.id} data-on={SECTIONS[i]?.id === s.id ? "true" : "false"}
                  onClick={(e) => { e.preventDefault(); go(s.id); }}>{s.label}</a>
              </li>
            ))}
          </ul>
          <div className="nav-tools">
            <button type="button" className="chip" onClick={() => setMenu(true)} aria-label="Open menu">⌘K</button>
            <button type="button" className="chip" onClick={flip} aria-label="Switch palette">
              {theme === "night" ? "Day" : "Night"}
            </button>
            <button type="button" className="chip" onClick={() => window.print()} aria-label="Print or save as PDF">
              PDF
            </button>
          </div>
        </div>
        <div className="bar" style={{ transform: "scaleX(" + p + ")" }} />
      </nav>

      <main>
        <Head index={i} />
        <About />
        <Experience />
        <Skills />
        <Work />
        <Background />
        <Contact />
      </main>

      <footer className="foot">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: 10 }}>
          <span>© {new Date().getFullYear()} Tolga Çakan</span>
          <span>Set in Newsreader</span>
        </div>
      </footer>

      <CommandMenu open={menu} onClose={() => setMenu(false)} onTheme={flip} />
    </div>
  );
}
