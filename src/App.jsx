import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * TYPEWRITER ENGINE — an interactive portfolio
 * Paper and ribbon on the surface, a real animation engine underneath.
 * ------------------------------------------------------------------ */

const SECTIONS = [
  { id: "hero", label: "INTRO" },
  { id: "about", label: "ABOUT" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "work", label: "CLIENT WORK" },
  { id: "projects", label: "PROJECTS" },
  { id: "background", label: "BACKGROUND" },
  { id: "music", label: "MUSIC" },
  { id: "contact", label: "CONTACT" },
];

const ROLES = [
  "Industrial Engineer",
  "Co-founder, TAB Marketing",
  "Web Builder",
  "Drummer & Songwriter",
];

const INK_RGB = { paper: "24, 21, 17", carbon: "228, 223, 210" };

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=JetBrains+Mono:wght@300;400;500&family=Special+Elite&display=swap');

.tc-root {
  --paper: #f6f3ec;
  --paper-2: #efeae0;
  --paper-3: #e6e0d3;
  --ink: #181511;
  --ink-soft: #6d665c;
  --ink-faint: #a49c8f;
  --ribbon: #c03a28;
  --volt: #1d7a6c;
  --rule: #d9d2c4;
  --shadow: rgba(24, 21, 17, 0.09);
  --grain: 0.045;
  color-scheme: light;

  background: var(--paper);
  color: var(--ink);
  font-family: 'Courier Prime', 'Courier New', monospace;
  min-height: 100vh;
  line-height: 1.6;
  position: relative;
  overflow-x: clip;
  transition: background .5s ease, color .5s ease;
}
.tc-root[data-theme="carbon"] {
  --paper: #0e0d0c;
  --paper-2: #16151300;
  --paper-2: #161513;
  --paper-3: #1f1d1a;
  --ink: #e4dfd2;
  --ink-soft: #8f887b;
  --ink-faint: #5c564c;
  --ribbon: #ff5f45;
  --volt: #4ade80;
  --rule: #2a2724;
  --shadow: rgba(0, 0, 0, 0.5);
  --grain: 0.07;
  color-scheme: dark;
}
.tc-root *, .tc-root *::before, .tc-root *::after { box-sizing: border-box; }
.tc-root a { color: inherit; text-decoration: none; }
.tc-mono { font-family: 'JetBrains Mono', 'Courier Prime', monospace; }
.tc-display { font-family: 'Special Elite', 'Courier New', monospace; }
.tc-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }
.tc-container { max-width: 780px; margin: 0 auto; padding: 0 28px; position: relative; }

/* ---------- fixed layers ---------- */
.tc-ink-canvas {
  position: fixed; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 1;
}
.tc-grain {
  position: fixed; inset: -50%; z-index: 2; pointer-events: none;
  opacity: var(--grain);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: tc-grain-shift 700ms steps(2) infinite;
}
@keyframes tc-grain-shift {
  0% { transform: translate(0,0); }
  50% { transform: translate(-1.5%, 1%); }
  100% { transform: translate(1%, -1.5%); }
}
.tc-vignette {
  position: fixed; inset: 0; z-index: 2; pointer-events: none;
  background: radial-gradient(ellipse at 50% 40%, transparent 55%, var(--shadow) 130%);
}

/* ---------- custom cursor ---------- */
.tc-cursor-dot, .tc-cursor-ring {
  position: fixed; top: 0; left: 0; z-index: 90; pointer-events: none;
  border-radius: 50%; mix-blend-mode: difference;
}
.tc-cursor-dot { width: 6px; height: 6px; background: #fff; margin: -3px 0 0 -3px; }
.tc-cursor-ring {
  width: 34px; height: 34px; margin: -17px 0 0 -17px;
  border: 1px solid rgba(255,255,255,.55);
  transition: width .25s ease, height .25s ease, margin .25s ease, border-color .25s ease, border-radius .25s ease;
}
.tc-cursor-ring[data-hot="true"] {
  width: 54px; height: 54px; margin: -27px 0 0 -27px;
  border-color: #fff; border-radius: 4px;
}
@media (hover: none), (pointer: coarse) { .tc-cursor-dot, .tc-cursor-ring { display: none; } }

/* ---------- boot ---------- */
.tc-boot {
  position: fixed; inset: 0; z-index: 120;
  background: var(--paper); display: grid; place-items: center;
  transition: opacity .5s ease, transform .7s cubic-bezier(.7,0,.2,1);
}
.tc-boot[data-done="true"] { opacity: 0; transform: translateY(-100%); pointer-events: none; }
.tc-boot-inner { width: min(420px, 84vw); }
.tc-boot-line { font-size: 12px; letter-spacing: .08em; color: var(--ink-soft); margin: 0 0 7px; display: flex; gap: 10px; }
.tc-boot-line b { color: var(--volt); font-weight: 400; }
.tc-boot-bar { height: 2px; background: var(--rule); margin-top: 18px; overflow: hidden; }
.tc-boot-bar span { display: block; height: 100%; background: var(--ribbon); width: 0; transition: width .25s linear; }
.tc-boot-skip {
  margin-top: 16px; font-size: 11px; letter-spacing: .1em; color: var(--ink-faint);
  background: none; border: 0; cursor: pointer; padding: 0; font-family: inherit;
}
.tc-boot-skip:hover { color: var(--ribbon); }

/* ---------- nav ---------- */
.tc-nav {
  position: sticky; top: 0; z-index: 40;
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  backdrop-filter: blur(14px) saturate(1.1);
  -webkit-backdrop-filter: blur(14px) saturate(1.1);
  border-bottom: 1px solid var(--rule);
}
.tc-nav-in {
  max-width: 1080px; margin: 0 auto; padding: 14px 28px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.tc-nav-name { font-family: 'Special Elite', monospace; font-size: 14px; letter-spacing: .04em; white-space: nowrap; }
.tc-nav-name i { color: var(--ribbon); font-style: normal; }
.tc-nav-links { display: flex; gap: 4px; list-style: none; margin: 0; padding: 0; flex-wrap: wrap; }
.tc-nav-links a {
  font-size: 11px; letter-spacing: .08em; color: var(--ink-soft);
  padding: 5px 9px; border: 1px solid transparent; position: relative;
  font-family: 'JetBrains Mono', monospace; transition: color .2s, border-color .2s, background .2s;
}
.tc-nav-links a:hover { color: var(--ink); border-color: var(--rule); }
.tc-nav-links a[data-active="true"] { color: var(--ribbon); border-color: var(--ribbon); }
.tc-nav-tools { display: flex; align-items: center; gap: 8px; }
.tc-chip {
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .08em;
  color: var(--ink-soft); background: none; border: 1px solid var(--rule);
  padding: 6px 9px; cursor: pointer; transition: color .2s, border-color .2s, transform .2s;
}
.tc-chip:hover { color: var(--ribbon); border-color: var(--ribbon); transform: translateY(-1px); }
.tc-narrow-only { display: none; }
.tc-progress { height: 2px; background: transparent; }
.tc-progress span { display: block; height: 100%; background: linear-gradient(90deg, var(--ribbon), var(--volt)); transform-origin: 0 50%; }

/* ---------- rail ---------- */
.tc-rail {
  position: fixed; right: 20px; top: 50%; transform: translateY(-50%);
  z-index: 35; display: flex; flex-direction: column; gap: 9px; align-items: flex-end;
}
.tc-rail button {
  display: flex; align-items: center; gap: 9px; background: none; border: 0;
  cursor: pointer; padding: 2px 0; font-family: 'JetBrains Mono', monospace;
}
.tc-rail-tag {
  font-size: 9.5px; letter-spacing: .1em; color: var(--ink-faint);
  opacity: 0; transform: translateX(6px); transition: opacity .25s, transform .25s;
}
.tc-rail button:hover .tc-rail-tag, .tc-rail button[data-active="true"] .tc-rail-tag { opacity: 1; transform: none; }
.tc-rail button[data-active="true"] .tc-rail-tag { color: var(--ribbon); }
.tc-rail-line { width: 14px; height: 2px; background: var(--ink-faint); transition: width .3s cubic-bezier(.2,.8,.2,1), background .3s; }
.tc-rail button[data-active="true"] .tc-rail-line { width: 34px; background: var(--ribbon); }
@media (max-width: 900px) { .tc-rail { display: none; } }

/* ---------- reveal ---------- */
.tc-reveal {
  opacity: 0; transform: translateY(18px);
  transition: opacity .75s cubic-bezier(.2,.75,.2,1), transform .75s cubic-bezier(.2,.75,.2,1);
  transition-delay: calc(var(--i, 0) * 65ms);
}
.tc-reveal.is-in { opacity: 1; transform: none; }
.tc-strike {
  position: relative; display: inline-block;
  clip-path: inset(0 100% 0 0); transition: clip-path .8s cubic-bezier(.15,.8,.25,1);
  transition-delay: calc(var(--i, 0) * 65ms);
}
.is-in .tc-strike, .tc-strike.is-in { clip-path: inset(0 0 0 0); }

/* ---------- hero ---------- */
.tc-hero { padding: 92px 0 64px; position: relative; z-index: 3; }
.tc-hero-eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .22em;
  color: var(--ink-faint); margin: 0 0 20px; display: flex; align-items: center; gap: 10px;
}
.tc-dot-live { width: 6px; height: 6px; border-radius: 50%; background: var(--volt); animation: tc-pulse 2s ease-in-out infinite; }
@keyframes tc-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.75); } }
.tc-hero-name {
  font-size: clamp(40px, 9vw, 82px); margin: 0 0 8px; line-height: 1.02;
  letter-spacing: -.01em; display: flex; flex-wrap: wrap;
}
.tc-char { display: inline-block; animation: tc-strike-in .42s cubic-bezier(.2,1.5,.35,1) backwards; will-change: transform; }
@keyframes tc-strike-in {
  0% { opacity: 0; transform: translateY(-16px) rotate(-7deg) scale(1.25); }
  60% { opacity: 1; transform: translateY(2px) rotate(1.5deg) scale(.98); }
  100% { opacity: 1; transform: none; }
}
.tc-caret {
  display: inline-block; width: .06em; min-width: 3px; height: .82em; background: var(--ribbon);
  margin-left: .08em; align-self: center; animation: tc-blink 1.05s steps(1) infinite;
}
@keyframes tc-blink { 50% { opacity: 0; } }
.tc-role-slot {
  font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2vw, 15px);
  color: var(--ribbon); margin: 0 0 26px; height: 1.6em; letter-spacing: .02em;
}
.tc-hero-sub { font-size: 16px; color: var(--ink-soft); max-width: 54ch; margin: 0 0 34px; }
.tc-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.tc-btn {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: .09em;
  padding: 13px 20px; border: 1px solid var(--ink); position: relative; overflow: hidden;
  display: inline-flex; align-items: center; gap: 9px; background: none; color: var(--ink);
  cursor: pointer; transition: color .3s ease;
}
.tc-btn::before {
  content: ''; position: absolute; inset: 0; background: var(--ink);
  transform: translateY(101%); transition: transform .38s cubic-bezier(.2,.8,.2,1); z-index: -1;
}
.tc-btn:hover { color: var(--paper); }
.tc-btn:hover::before { transform: translateY(0); }
.tc-btn > * { position: relative; z-index: 1; }
.tc-btn--ribbon { border-color: var(--ribbon); color: var(--ribbon); }
.tc-btn--ribbon::before { background: var(--ribbon); }

/* ---------- typewriter deck ---------- */
.tc-deck { margin-top: 52px; position: relative; }
.tc-deck-head {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .14em;
  color: var(--ink-faint); margin-bottom: 10px; flex-wrap: wrap;
}
.tc-deck-paper {
  background: var(--paper-2); border: 1px solid var(--rule);
  box-shadow: 0 18px 40px -28px var(--shadow); position: relative;
  padding: 22px 22px 16px; transition: border-color .3s, box-shadow .3s;
}
.tc-deck-paper:focus-within { border-color: var(--ribbon); box-shadow: 0 22px 50px -26px var(--shadow); }
.tc-deck-paper::before {
  content: ''; position: absolute; left: 0; right: 0; top: -7px; height: 6px;
  background: repeating-linear-gradient(90deg, var(--rule) 0 6px, transparent 6px 12px);
}
.tc-deck-input {
  width: 100%; min-height: 92px; resize: vertical; background: transparent; border: 0;
  color: var(--ink); font-family: 'Courier Prime', monospace; font-size: 15.5px;
  line-height: 30px; outline: none; letter-spacing: .02em;
  background-image: repeating-linear-gradient(transparent 0 29px, var(--rule) 29px 30px);
}
.tc-deck-input::placeholder { color: var(--ink-faint); }
.tc-deck-paper[data-jitter="true"] { animation: tc-jitter .09s ease; }
@keyframes tc-jitter { 50% { transform: translate(-1px, 1px); } }
.tc-deck-foot {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  margin-top: 12px; font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: .1em; color: var(--ink-faint); flex-wrap: wrap;
}
.tc-bell { color: var(--ribbon); opacity: 0; transition: opacity .18s; }
.tc-bell[data-on="true"] { opacity: 1; }

/* ---------- marquee ---------- */
.tc-marquee {
  border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule);
  overflow: hidden; padding: 12px 0; background: var(--paper-2); position: relative; z-index: 3;
}
.tc-marquee-track { display: flex; gap: 44px; width: max-content; animation: tc-slide 34s linear infinite; }
.tc-marquee:hover .tc-marquee-track { animation-play-state: paused; }
.tc-marquee span {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .18em;
  color: var(--ink-faint); white-space: nowrap;
}
.tc-marquee span b { color: var(--ribbon); font-weight: 400; }
@keyframes tc-slide { to { transform: translateX(-50%); } }

/* ---------- sections ---------- */
.tc-section { padding: 76px 0; position: relative; z-index: 3; }
.tc-sec-head { display: flex; align-items: baseline; gap: 14px; margin-bottom: 34px; padding-bottom: 14px; border-bottom: 1px solid var(--rule); }
.tc-sec-num { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ribbon); letter-spacing: .1em; }
.tc-h2 { font-size: clamp(24px, 4vw, 34px); margin: 0; letter-spacing: -.01em; }
.tc-h3 {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; margin: 34px 0 14px;
  text-transform: uppercase; letter-spacing: .16em; color: var(--ink-faint);
}
.tc-h3:first-child { margin-top: 0; }
.tc-p { font-size: 15.5px; color: var(--ink-soft); max-width: 62ch; margin: 0 0 18px; }
.tc-p:last-child { margin-bottom: 0; }
.tc-p strong { color: var(--ink); font-weight: 400; }
.tc-p em { font-style: italic; color: var(--ink); }

.tc-list { list-style: none; margin: 0; padding: 0; }
.tc-list li {
  font-size: 14.5px; padding: 9px 0 9px 24px; position: relative;
  border-bottom: 1px solid var(--rule); transition: padding-left .3s, color .3s;
}
.tc-list li::before {
  content: '/'; position: absolute; left: 4px; color: var(--ink-faint);
  transition: color .3s, transform .3s;
}
.tc-list li:hover { padding-left: 32px; color: var(--ink); }
.tc-list li:hover::before { color: var(--ribbon); transform: translateX(3px); }

/* timeline */
.tc-timeline { list-style: none; margin: 0; padding: 0; }
.tc-tl-item {
  display: grid; grid-template-columns: 148px 1fr; gap: 22px; padding: 20px 14px 20px 0;
  border-bottom: 1px solid var(--rule); position: relative; transition: background .35s, padding-left .35s;
}
.tc-tl-item::after {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
  background: var(--ribbon); transform: scaleY(0); transform-origin: 50% 0; transition: transform .4s cubic-bezier(.2,.8,.2,1);
}
.tc-tl-item:hover { background: var(--paper-2); padding-left: 16px; }
.tc-tl-item:hover::after { transform: scaleY(1); }
.tc-tl-period { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--ink-faint); letter-spacing: .04em; padding-top: 3px; }
.tc-tl-role { font-size: 15.5px; margin: 0 0 5px; }
.tc-tl-note { font-size: 13.5px; color: var(--ink-soft); margin: 0; max-width: 52ch; }

/* cards */
.tc-card {
  border: 1px solid var(--rule); background: var(--paper-2); padding: 24px;
  margin-bottom: 18px; position: relative; overflow: hidden;
  transition: transform .35s cubic-bezier(.2,.8,.2,1), border-color .35s, box-shadow .35s;
  transform-style: preserve-3d;
}
.tc-card { --accent: var(--ribbon); }
.tc-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--accent); transform: scaleX(0); transform-origin: 0 50%;
  transition: transform .45s cubic-bezier(.2,.8,.2,1);
}
.tc-card:hover::before { transform: scaleX(1); }
.tc-card:hover { border-color: var(--accent); box-shadow: 0 26px 50px -34px var(--shadow); }
.tc-card:hover .tc-card-title { color: var(--accent); }
.tc-card-title { transition: color .3s ease; }
.tc-card-top { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
.tc-card-title { font-size: 17px; margin: 0; }
.tc-card-desc { font-size: 14px; color: var(--ink-soft); margin: 0 0 16px; max-width: 56ch; }
.tc-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: .12em;
  color: var(--ribbon); border: 1px solid var(--ribbon); padding: 3px 7px;
}
.tc-tag--soft { color: var(--ink-faint); border-color: var(--rule); }
.tc-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.tc-link {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: .05em;
  display: inline-flex; align-items: center; gap: 7px; color: var(--ink);
  border-bottom: 1px solid var(--rule); padding-bottom: 3px; transition: color .25s, border-color .25s, gap .25s;
}
.tc-link:hover { color: var(--ribbon); border-color: var(--ribbon); gap: 12px; }
.tc-shot {
  width: 100%; display: block; border: 1px solid var(--rule); margin-bottom: 16px;
  transition: transform .6s cubic-bezier(.2,.8,.2,1), box-shadow .5s ease;
}
.tc-shot-frame { overflow: hidden; border: 1px solid var(--rule); margin-bottom: 16px; position: relative; }
.tc-shot-frame .tc-shot { border: 0; margin: 0; }
.tc-shot-frame:hover .tc-shot { transform: scale(1.03); }

/* product mosaic */
.tc-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
  gap: 10px; margin: 22px 0 8px;
}
.tc-grid figure {
  margin: 0; position: relative; overflow: hidden;
  border: 1px solid var(--rule); background: var(--paper-2);
}
.tc-grid img {
  width: 100%; height: 176px; object-fit: cover; display: block;
  transition: transform .6s cubic-bezier(.2,.8,.2,1);
}
.tc-grid figure:hover img { transform: scale(1.07); }
.tc-grid figcaption {
  position: absolute; left: 0; right: 0; bottom: 0; padding: 22px 11px 9px;
  font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .12em;
  color: #fff; background: linear-gradient(transparent, rgba(0,0,0,.8));
  opacity: 0; transform: translateY(5px); transition: opacity .3s ease, transform .3s ease;
}
.tc-grid figure:hover figcaption, .tc-grid figure:focus-within figcaption { opacity: 1; transform: none; }
.tc-grid-note {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .1em;
  color: var(--ink-faint); margin: 0 0 26px;
}

/* music */
.tc-music { display: flex; align-items: center; gap: 22px; margin-top: 24px; flex-wrap: wrap; }
.tc-vinyl { flex-shrink: 0; color: var(--ink-soft); transition: color .3s ease, transform .3s ease; }
.tc-music:hover .tc-vinyl { color: var(--ink); animation: tc-thump 1.1s ease-in-out infinite; }
@keyframes tc-thump { 0%,100% { transform: scale(1); } 22% { transform: scale(1.05); } 40% { transform: scale(.99); } }
.tc-music-links { display: flex; flex-direction: column; gap: 10px; }

/* footer */
.tc-footer { padding: 76px 0 108px; position: relative; z-index: 3; border-top: 1px solid var(--rule); }
.tc-foot-links { display: flex; gap: 12px; flex-wrap: wrap; margin: 26px 0 40px; }
.tc-foot-bottom {
  display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ink-faint); letter-spacing: .06em;
}

/* ---------- status bar ---------- */
.tc-status {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 45;
  background: color-mix(in srgb, var(--paper) 90%, transparent);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--rule); padding: 8px 20px;
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .1em; color: var(--ink-faint);
}
.tc-status b { color: var(--ink); font-weight: 400; }
.tc-status-mid { display: flex; gap: 16px; }
@media (max-width: 700px) { .tc-status-mid { display: none; } }

/* ---------- command palette ---------- */
.tc-cmd-wrap {
  position: fixed; inset: 0; z-index: 110; display: grid; place-items: start center;
  padding-top: 14vh; background: color-mix(in srgb, var(--paper) 55%, transparent);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  animation: tc-fade .2s ease;
}
@keyframes tc-fade { from { opacity: 0; } }
.tc-cmd {
  width: min(520px, 90vw); background: var(--paper); border: 1px solid var(--ink-faint);
  box-shadow: 0 40px 80px -40px var(--shadow); animation: tc-cmd-in .24s cubic-bezier(.2,.9,.3,1);
}
@keyframes tc-cmd-in { from { opacity: 0; transform: translateY(-12px) scale(.98); } }
.tc-cmd-input {
  width: 100%; border: 0; border-bottom: 1px solid var(--rule); background: none;
  padding: 16px 18px; font-family: 'JetBrains Mono', monospace; font-size: 13px;
  color: var(--ink); outline: none; letter-spacing: .04em;
}
.tc-cmd-list { list-style: none; margin: 0; padding: 6px; max-height: 46vh; overflow-y: auto; }
.tc-cmd-list li { }
.tc-cmd-list button {
  width: 100%; text-align: left; background: none; border: 0; cursor: pointer;
  padding: 10px 12px; font-family: 'JetBrains Mono', monospace; font-size: 12px;
  color: var(--ink-soft); letter-spacing: .06em; display: flex; justify-content: space-between; gap: 12px;
  transition: background .15s, color .15s;
}
.tc-cmd-list button[data-sel="true"], .tc-cmd-list button:hover { background: var(--paper-3); color: var(--ink); }
.tc-cmd-list button span:last-child { color: var(--ink-faint); font-size: 10px; }
.tc-cmd-foot {
  border-top: 1px solid var(--rule); padding: 9px 14px; display: flex; gap: 16px;
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: .1em; color: var(--ink-faint);
}

/* ---------- responsive ---------- */
@media (max-width: 820px) {
  .tc-nav-links { display: none; }
  .tc-wide-only { display: none; }
  .tc-narrow-only { display: inline; }
  .tc-hero { padding: 64px 0 48px; }
  .tc-section { padding: 56px 0; }
  .tc-tl-item { grid-template-columns: 1fr; gap: 6px; }
  .tc-container { padding: 0 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .tc-root *, .tc-root *::before, .tc-root *::after {
    animation-duration: .001ms !important; animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
  }
  .tc-reveal { opacity: 1; transform: none; }
  .tc-strike { clip-path: none; }
  .tc-grain { display: none; }
}
`;

/* ================================================================== *
 * hooks
 * ================================================================== */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Reveals children once they scroll into view. */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".tc-reveal, .tc-strike");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useScrollState(ids) {
  const [state, setState] = useState({ index: 0, progress: 0 });
  useEffect(() => {
    let ticking = false;
    const measure = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      const line = window.scrollY + window.innerHeight * 0.35;
      let index = 0;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= line) index = i;
      });
      setState((prev) => (prev.index === index && Math.abs(prev.progress - progress) < 0.002 ? prev : { index, progress }));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measure);
      }
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);
  return state;
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ================================================================== *
 * engine layers
 * ================================================================== */

/** Canvas ink trail — ink beads that follow the pointer and dry out. */
function InkField({ theme, reduced }) {
  const ref = useRef(null);
  useEffect(() => {
    if (reduced) return undefined;
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const beads = [];
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let lastX = null;
    let lastY = null;
    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      if (lastX === null) {
        lastX = x;
        lastY = y;
        return;
      }
      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist < 14) return;
      lastX = x;
      lastY = y;
      beads.push({
        x, y,
        r: 1.1 + Math.random() * 2.6,
        life: 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3 + 0.16,
      });
      if (beads.length > 90) beads.shift();
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const rgb = INK_RGB[theme] || INK_RGB.paper;
      for (let i = beads.length - 1; i >= 0; i -= 1) {
        const b = beads[i];
        b.life -= 0.0125;
        if (b.life <= 0) {
          beads.splice(i, 1);
          continue;
        }
        b.x += b.vx;
        b.y += b.vy;
        b.r *= 1.006;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + rgb + ", " + (b.life * 0.17).toFixed(3) + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [theme, reduced]);

  return <canvas className="tc-ink-canvas" ref={ref} aria-hidden="true" />;
}

/** Two-part cursor: a hard dot and a lagging ring that swells over links. */
function Cursor({ reduced }) {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    if (reduced || window.matchMedia("(pointer: coarse)").matches) return undefined;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = "translate(" + x + "px," + y + "px)";
      const hot = e.target instanceof Element && e.target.closest("a, button, textarea, .tc-card");
      if (ring.current) ring.current.dataset.hot = hot ? "true" : "false";
    };
    const tick = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = "translate(" + rx + "px," + ry + "px)";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <>
      <div className="tc-cursor-dot" ref={dot} aria-hidden="true" />
      <div className="tc-cursor-ring" ref={ring} aria-hidden="true" />
    </>
  );
}

/** Boot sequence — the machine warming up before the page loads. */
function Boot({ onDone, reduced }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const lines = [
    ["LOAD", "ribbon.sys ................ ok"],
    ["MOUNT", "paper.tray ................ ok"],
    ["CAL", "carriage return ........... ok"],
    ["INIT", "typewriter engine v2.0"],
  ];

  const finish = useCallback(() => {
    setDone(true);
    window.setTimeout(onDone, 620);
  }, [onDone]);

  useEffect(() => {
    if (reduced) {
      finish();
      return undefined;
    }
    if (step >= lines.length) {
      const t = window.setTimeout(finish, 340);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 230);
    return () => window.clearTimeout(t);
  }, [step, reduced, finish, lines.length]);

  if (reduced) return null;

  return (
    <div className="tc-boot" data-done={done ? "true" : "false"} aria-hidden="true">
      <div className="tc-boot-inner tc-mono">
        {lines.slice(0, step).map((l) => (
          <p className="tc-boot-line" key={l[0]}>
            <b>{l[0]}</b>
            <span>{l[1]}</span>
          </p>
        ))}
        <div className="tc-boot-bar">
          <span style={{ width: (step / lines.length) * 100 + "%" }} />
        </div>
        <button type="button" className="tc-boot-skip" onClick={finish}>
          [ SKIP ]
        </button>
      </div>
    </div>
  );
}

/** ⌘K palette for jumping between sections. */
function CommandPalette({ open, onClose, onJump, onToggleTheme }) {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  const commands = [
    ...SECTIONS.map((s) => ({ key: s.id, label: "Go to " + s.label, hint: "SECTION", run: () => onJump(s.id) })),
    { key: "theme", label: "Toggle carbon mode", hint: "THEME", run: onToggleTheme },
    { key: "mail", label: "Send an email", hint: "CONTACT", run: () => { window.location.href = "mailto:tolga@tolgacakan.dev"; } },
  ];
  const results = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (open) {
      setQuery("");
      setSel(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  if (!open) return null;

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => (s + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => (s - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[sel]?.run();
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="tc-cmd-wrap" onClick={onClose} role="presentation">
      <div className="tc-cmd" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Command palette">
        <input
          ref={inputRef}
          className="tc-cmd-input"
          placeholder="type a command…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSel(0); }}
          onKeyDown={onKeyDown}
        />
        <ul className="tc-cmd-list">
          {results.map((c, i) => (
            <li key={c.key}>
              <button
                type="button"
                data-sel={i === sel ? "true" : "false"}
                onMouseEnter={() => setSel(i)}
                onClick={() => { c.run(); onClose(); }}
              >
                <span>{c.label}</span>
                <span>{c.hint}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li><button type="button" disabled><span>no match</span><span /></button></li>
          )}
        </ul>
        <div className="tc-cmd-foot">
          <span>↑↓ MOVE</span>
          <span>↵ SELECT</span>
          <span>ESC CLOSE</span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== *
 * content pieces
 * ================================================================== */

function StruckName({ text, reduced }) {
  const chars = Array.from(text);
  return (
    <h1 className="tc-display tc-hero-name">
      <span aria-hidden="true" style={{ display: "contents" }}>
        {chars.map((ch, i) => (
          <span
            className="tc-char"
            key={i}
            style={reduced ? undefined : { animationDelay: 320 + i * 55 + "ms" }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
        <span className="tc-caret" />
      </span>
      <span className="tc-sr-only">{text}</span>
    </h1>
  );
}

/** Roles that type themselves in and delete themselves out, forever. */
function RoleTicker({ reduced }) {
  const [text, setText] = useState(reduced ? ROLES[0] : "");
  useEffect(() => {
    if (reduced) return undefined;
    let role = 0;
    let pos = 0;
    let deleting = false;
    let timer = 0;
    const step = () => {
      const full = ROLES[role];
      pos += deleting ? -1 : 1;
      setText(full.slice(0, pos));
      let delay = deleting ? 32 : 62;
      if (!deleting && pos === full.length) {
        deleting = true;
        delay = 1700;
      } else if (deleting && pos === 0) {
        deleting = false;
        role = (role + 1) % ROLES.length;
        delay = 320;
      }
      timer = window.setTimeout(step, delay);
    };
    timer = window.setTimeout(step, 1500);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return (
    <p className="tc-role-slot" aria-hidden="true">
      {text}
      <span className="tc-caret" style={{ height: "1em", verticalAlign: "-0.14em" }} />
    </p>
  );
}

/** A real sheet of paper the visitor can type on. */
function TypeDeck() {
  const [value, setValue] = useState("");
  const [jitter, setJitter] = useState(false);
  const [bell, setBell] = useState(false);
  const paperRef = useRef(null);

  const onKeyDown = (e) => {
    setJitter(true);
    window.setTimeout(() => setJitter(false), 90);
    if (e.key === "Enter") {
      setBell(true);
      window.setTimeout(() => setBell(false), 420);
    }
  };

  const lines = value ? value.split("\n").length : 1;

  return (
    <div className="tc-deck tc-reveal" style={{ "--i": 6 }}>
      <div className="tc-deck-head">
        <span>SHEET 01 — LOADED</span>
        <span>TYPE ANYTHING. NOTHING IS SENT.</span>
      </div>
      <div className="tc-deck-paper" ref={paperRef} data-jitter={jitter ? "true" : "false"}>
        <textarea
          className="tc-deck-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Say hello, leave a note, or just listen to the keys…"
          aria-label="Scratch paper — type anything, nothing is sent"
          spellCheck="false"
        />
      </div>
      <div className="tc-deck-foot">
        <span>CHARS {String(value.length).padStart(3, "0")} · LINES {String(lines).padStart(2, "0")}</span>
        <span className="tc-bell" data-on={bell ? "true" : "false"}>♪ CARRIAGE RETURN</span>
      </div>
    </div>
  );
}

function Marquee() {
  const items = [
    ["TAB MARKETING", "NFC · QR · WEB"],
    ["REACT", "VITE"],
    ["ISTANBUL", "SAKARYA"],
    ["INDUSTRIAL ENGINEERING", "BILGI UNIVERSITY"],
    ["SON SEK'", "DRUMS & SONGWRITING"],
    ["BLOCKCHAIN", "PUBLISHED 2022"],
  ];
  const doubled = [...items, ...items];
  return (
    <div className="tc-marquee" aria-hidden="true">
      <div className="tc-marquee-track">
        {doubled.map((it, i) => (
          <span key={i}>
            <b>◆</b> {it[0]} <span style={{ opacity: 0.5 }}>/ {it[1]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionHead({ index, title }) {
  return (
    <div className="tc-sec-head tc-reveal">
      <span className="tc-sec-num">{String(index).padStart(2, "0")}</span>
      <h2 className="tc-display tc-h2">{title}</h2>
    </div>
  );
}

/** Card that tilts toward the pointer. */
function TiltCard({ children, reduced, style }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform =
      "perspective(900px) rotateX(" + (-py * 3.2).toFixed(2) + "deg) rotateY(" + (px * 3.6).toFixed(2) + "deg) translateY(-2px)";
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <article className="tc-card tc-reveal" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={style}>
      {children}
    </article>
  );
}

/* ================================================================== *
 * sections
 * ================================================================== */

function Hero({ reduced }) {
  return (
    <header className="tc-hero" id="hero">
      <div className="tc-container">
        <p className="tc-hero-eyebrow tc-mono">
          <span className="tc-dot-live" />
          ISTANBUL, TURKEY — AVAILABLE FOR WORK
        </p>
        <StruckName text="Tolga Çakan" reduced={reduced} />
        <RoleTicker reduced={reduced} />
        <p className="tc-hero-sub tc-reveal" style={{ "--i": 2 }}>
          Industrial engineering taught me to find the constraint in a system. I use that on the
          web now — building the products, sites, and NFC systems that small businesses in
          Istanbul and Sakarya run on every day.
        </p>
        <div className="tc-hero-actions tc-reveal" style={{ "--i": 3 }}>
          <button type="button" className="tc-btn tc-btn--ribbon" onClick={() => scrollToId("work")}>
            <span>CLIENT WORK</span><span>→</span>
          </button>
          <a className="tc-btn" href="mailto:tolga@tolgacakan.dev">
            <span>GET IN TOUCH</span><span>→</span>
          </a>
        </div>
        <TypeDeck />
      </div>
    </header>
  );
}

function About() {
  return (
    <section className="tc-section" id="about">
      <div className="tc-container">
        <SectionHead index={1} title="About" />
        <p className="tc-p tc-reveal" style={{ "--i": 1 }}>
          I studied Industrial Engineering at Istanbul Bilgi University. Before I finished, I had
          already worked on a Toyota assembly line, inside a crypto exchange, at a digital agency,
          and on an AI platform. It reads like a strange list, but each one taught me something
          the others could not — how a line actually moves, how a product team decides, how a
          brand gets sold.
        </p>
        <p className="tc-p tc-reveal" style={{ "--i": 2 }}>
          Most of my time now goes to <strong>TAB Marketing</strong>, the studio I co-founded with
          Burak Akkaya and Atahan Yüksel. We build the layer where a physical touch turns into a
          digital result: tap a card and a Google review page opens, scan a table and the menu
          loads. Seven products, fifteen-plus businesses across Istanbul and Sakarya.
        </p>
        <p className="tc-p tc-reveal" style={{ "--i": 3 }}>
          The rest goes to things I build for myself, and to the drums.
        </p>
      </div>
    </section>
  );
}

function Experience() {
  const roles = [
    {
      period: "Jul 2026 — Aug 2026",
      role: "AI Intern, FlyRank AI",
      note: "Remote, on the AI side of the product.",
    },
    {
      period: "Mar 2025 — Jul 2025",
      role: "Intern, De Marke Agency",
      note: "Digital marketing, and running the on-site organization at international tournaments.",
    },
    {
      period: "Jan 2025 — Feb 2025",
      role: "Product Intern, BTCTurk Technology",
      note: "Built the internal dashboards and reporting tools the team used to see what was actually happening.",
    },
    {
      period: "Jun 2024 — Jul 2024",
      role: "Product Engineering Intern, Toyota Motor Manufacturing Turkey",
      note: "Assembly line logistics and Kaizen projects — my first real look at how a factory floor keeps moving. On-site, Sakarya.",
    },
  ];
  return (
    <section className="tc-section" id="experience">
      <div className="tc-container">
        <SectionHead index={2} title="Experience" />
        <ul className="tc-timeline">
          {roles.map((r, i) => (
            <li className="tc-tl-item tc-reveal" key={r.role} style={{ "--i": i + 1 }}>
              <span className="tc-tl-period">{r.period}</span>
              <div>
                <p className="tc-tl-role">{r.role}</p>
                <p className="tc-tl-note">{r.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const TAB_PRODUCTS = [
  { src: "/work/tab-main-card.png", label: "GOOGLE REVIEW NFC / TAB MAIN CARD", alt: "TAB Marketing NFC Google review card, front and back" },
  { src: "/work/italyanisi-menu-card.jpg", label: "QR MENU + NFC / İTALYAN İŞİ", alt: "İtalyan İşi tabletop QR menu and NFC review card" },
  { src: "/work/pehlivan-gold.webp", label: "NFC STAND / PEHLIVAN ET LOKANTASI", alt: "Black and gold NFC review stand for Pehlivan Et Lokantası" },
  { src: "/work/loren-nfc-stand.jpg", label: "FRAMED NFC STAND / LOREN", alt: "Framed burgundy and gold NFC review stand for Loren" },
  { src: "/work/hotel-cabir.jpg", label: "HOTEL KEY CARD / CABIR DELUXE", alt: "Hotel room key card with NFC for Cabir Deluxe" },
  { src: "/work/soft-feedback.png", label: "FEEDBACK CARD / SOFT COFFEE LOUNGE", alt: "Private feedback NFC card for Soft Coffee Lounge" },
];

function ClientWork({ reduced }) {
  return (
    <section className="tc-section" id="work">
      <div className="tc-container">
        <SectionHead index={3} title="Client work" />

        <p className="tc-p tc-reveal" style={{ "--i": 1 }}>
          Most of my client work runs through <strong>TAB Marketing</strong>. We design and
          produce the physical-meets-digital layer for cafes, restaurants, and hotels: NFC review
          cards, QR menus, hotel key cards, feedback cards, and the websites behind them. Every
          piece below is a real product, made for a real business.
        </p>

        <div className="tc-grid tc-reveal" style={{ "--i": 2 }}>
          {TAB_PRODUCTS.map((prod) => (
            <figure key={prod.src}>
              <img src={prod.src} alt={prod.alt} loading="lazy" />
              <figcaption>{prod.label}</figcaption>
            </figure>
          ))}
        </div>
        <p className="tc-grid-note tc-reveal" style={{ "--i": 3 }}>
          SEVEN PRODUCTS · 15+ BUSINESSES · ISTANBUL &amp; SAKARYA
        </p>

        <a
          className="tc-link tc-reveal"
          style={{ "--i": 4 }}
          href="https://tab-marketing-site.vercel.app/#top"
          target="_blank"
          rel="noreferrer"
        >
          See the full TAB Marketing showroom <span>→</span>
        </a>

        <h3 className="tc-h3 tc-reveal" style={{ "--i": 5 }}>Selected web builds</h3>
        <p className="tc-p tc-reveal" style={{ "--i": 5 }}>
          The sites I design and build myself, start to finish.
        </p>

        <TiltCard reduced={reduced} style={{ "--i": 6, "--accent": "#d97706" }}>
          <div className="tc-shot-frame">
            <img
              className="tc-shot"
              src="/work/franco-cover.png"
              alt="Franco Coffee & Gelato digital menu"
              loading="lazy"
            />
          </div>
          <div className="tc-card-top">
            <h4 className="tc-card-title">Franco Coffee &amp; Gelato</h4>
            <span className="tc-tag tc-tag--soft">LIVE</span>
          </div>
          <div className="tc-tags">
            <span className="tc-tag tc-tag--soft">DIGITAL MENU</span>
            <span className="tc-tag tc-tag--soft">FLAVOR PICKER</span>
          </div>
          <p className="tc-card-desc">
            A digital menu with a build-your-own gelato flavor picker. It is the feature customers
            ask about by name.
          </p>
          <a className="tc-link" href="https://francoserdivan.com" target="_blank" rel="noreferrer">
            francoserdivan.com <span>→</span>
          </a>
        </TiltCard>

        <TiltCard reduced={reduced} style={{ "--i": 7, "--accent": "#2563eb" }}>
          <div className="tc-shot-frame">
            <img
              className="tc-shot"
              src="/work/melis-klinik.jpg"
              alt="Diş Hekimi Melis Çakan dental clinic team"
              loading="lazy"
            />
          </div>
          <div className="tc-card-top">
            <h4 className="tc-card-title">Diş Hekimi Melis Çakan</h4>
            <span className="tc-tag tc-tag--soft">LIVE</span>
          </div>
          <div className="tc-tags">
            <span className="tc-tag tc-tag--soft">CLINIC SITE</span>
            <span className="tc-tag tc-tag--soft">SEO</span>
          </div>
          <p className="tc-card-desc">
            A calm, mobile-first site for a Sakarya dental practice running since 2003. Built
            around trust, clear treatment pages, and one-tap contact.
          </p>
          <a className="tc-link" href="https://dishekimimeliscakan.com" target="_blank" rel="noreferrer">
            dishekimimeliscakan.com <span>→</span>
          </a>
        </TiltCard>
      </div>
    </section>
  );
}

function Projects({ reduced }) {
  return (
    <section className="tc-section" id="projects">
      <div className="tc-container">
        <SectionHead index={4} title="Personal projects" />

        <TiltCard reduced={reduced} style={{ "--i": 1, "--accent": "#7c3aed" }}>
          <div className="tc-card-top">
            <h4 className="tc-card-title">Krone</h4>
            <span className="tc-tag tc-tag--soft">LIVE</span>
          </div>
          <div className="tc-tags">
            <span className="tc-tag tc-tag--soft">REACT</span>
            <span className="tc-tag tc-tag--soft">TYPESCRIPT</span>
            <span className="tc-tag tc-tag--soft">MULTIPLAYER</span>
          </div>
          <p className="tc-card-desc">
            A web game built for the phone: a handful of mini-games, rooms you can play with
            friends, daily challenges, and leaderboards.
          </p>
          <a className="tc-link" href="https://innerclock.vercel.app" target="_blank" rel="noreferrer">
            innerclock.vercel.app <span>→</span>
          </a>
        </TiltCard>

        <TiltCard reduced={reduced} style={{ "--i": 2, "--accent": "#0d9488" }}>
          <div className="tc-card-top">
            <h4 className="tc-card-title">FeedDetox</h4>
            <span className="tc-tag">IN DEVELOPMENT</span>
          </div>
          <p className="tc-card-desc">
            A tool for taking back your own feed algorithm — seeing what it has learned about you,
            and pointing it somewhere better. Still finding its final shape, no live link yet.
          </p>
        </TiltCard>
      </div>
    </section>
  );
}

function Background() {
  return (
    <section className="tc-section" id="background">
      <div className="tc-container">
        <SectionHead index={5} title="Background" />

        <h3 className="tc-h3 tc-reveal">Education</h3>
        <ul className="tc-list tc-reveal" style={{ "--i": 1 }}>
          <li>Istanbul Bilgi University, Industrial Engineering</li>
          <li>Fen Lisesi, Sakarya</li>
        </ul>

        <h3 className="tc-h3 tc-reveal" style={{ "--i": 2 }}>International</h3>
        <ul className="tc-list tc-reveal" style={{ "--i": 3 }}>
          <li>Volunteer researcher, He For She / Erasmus+, Saaremaa, Estonia (2023—2024)</li>
          <li>Participant, European Summer School "Blockchain to Financial Markets," Prague (2025)</li>
        </ul>

        <h3 className="tc-h3 tc-reveal" style={{ "--i": 4 }}>Involvement</h3>
        <ul className="tc-list tc-reveal" style={{ "--i": 5 }}>
          <li>Editorial Director, Bilgi Blockchain Club (2021—2024)</li>
          <li>Vice President, Atatürkçü Düşünce Kulübü, Bilgi University (2022—2024)</li>
        </ul>

        <h3 className="tc-h3 tc-reveal" style={{ "--i": 6 }}>Publication</h3>
        <div className="tc-reveal" style={{ "--i": 7 }}>
          <p className="tc-p">
            Co-authored a chapter on blockchain and the entertainment industry in{" "}
            <em>Blockchain Teknolojileri ve Sektörel Etkileri</em>, an edited volume examining
            blockchain's impact sector by sector.
          </p>
          <p className="tc-p tc-mono" style={{ fontSize: 12.5, letterSpacing: ".03em" }}>
            Nobel Bilimsel Eserler · October 2022 · 302 pp. · ISBN 978-625-433-825-0
          </p>
          <a
            className="tc-link"
            href="https://www.nobelyayin.com/blockchain-teknolojileri-ve-sektorel-etkileri-19020.html"
            target="_blank"
            rel="noreferrer"
          >
            View at publisher <span>→</span>
          </a>
        </div>

        <h3 className="tc-h3 tc-reveal" style={{ "--i": 8 }}>Certificates &amp; awards</h3>
        <ul className="tc-list tc-reveal" style={{ "--i": 9 }}>
          <li>AI Fluency: Framework &amp; Foundations, Anthropic (2026)</li>
          <li>Claude 101, Anthropic (2026)</li>
          <li>Award, ÖRS Textile senior design project, CSRP 2026</li>
        </ul>
      </div>
    </section>
  );
}

function DrumIcon() {
  return (
    <svg className="tc-vinyl" width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
      <ellipse cx="29" cy="20" rx="20" ry="7.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M9 20v14c0 4.1 9 7.5 20 7.5s20-3.4 20-7.5V20" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M9 22l40 10M49 22L9 32" stroke="var(--ribbon)" strokeWidth=".8" opacity=".65" />
      <ellipse cx="29" cy="20" rx="9" ry="3.4" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".4" />
      <path d="M44 11l9-5M46 13l10-3" stroke="currentColor" strokeWidth="1" opacity=".55" />
    </svg>
  );
}

function Music() {
  return (
    <section className="tc-section" id="music">
      <div className="tc-container">
        <SectionHead index={6} title="Music" />
        <p className="tc-p tc-reveal" style={{ "--i": 1 }}>
          I play drums in a band called <strong>son sek'</strong>, and I write our songs. One
          album, two singles, and a handful of live shows so far.
        </p>
        <div className="tc-music tc-reveal" style={{ "--i": 2 }}>
          <DrumIcon />
          <div className="tc-music-links">
            <a
              className="tc-link"
              href="https://open.spotify.com/intl-tr/artist/1ILN8doPYd0l4l9ME6Rtce"
              target="_blank"
              rel="noreferrer"
            >
              Listen on Spotify <span>→</span>
            </a>
            <a
              className="tc-link"
              href="https://www.youtube.com/channel/UCQ_bxqBy0npeDRfh_5iaPew"
              target="_blank"
              rel="noreferrer"
            >
              Watch on YouTube <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="tc-footer" id="contact">
      <div className="tc-container">
        <SectionHead index={7} title="Contact" />
        <p className="tc-p tc-reveal" style={{ "--i": 1 }}>
          Based in Istanbul. Open to new projects and roles.
        </p>
        <div className="tc-foot-links tc-reveal" style={{ "--i": 2 }}>
          <a className="tc-btn tc-btn--ribbon" href="mailto:tolga@tolgacakan.dev">
            <span>EMAIL</span><span>→</span>
          </a>
          <a className="tc-btn" href="https://github.com/tolgacakan14" target="_blank" rel="noreferrer">
            <span>GITHUB</span><span>→</span>
          </a>
        </div>
        <div className="tc-foot-bottom tc-reveal" style={{ "--i": 3 }}>
          <span>© {year} TOLGA ÇAKAN</span>
          <span>SET IN COURIER PRIME &amp; SPECIAL ELITE</span>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================== *
 * shell
 * ================================================================== */

function Nav({ active, progress, theme, onToggleTheme, onOpenCmd }) {
  return (
    <nav className="tc-nav">
      <div className="tc-nav-in">
        <a href="#hero" className="tc-nav-name" onClick={(e) => { e.preventDefault(); scrollToId("hero"); }}>
          TOLGA ÇAKAN<i>.</i>
        </a>
        <ul className="tc-nav-links">
          {SECTIONS.slice(1).map((s) => (
            <li key={s.id}>
              <a
                href={"#" + s.id}
                data-active={SECTIONS[active]?.id === s.id ? "true" : "false"}
                onClick={(e) => { e.preventDefault(); scrollToId(s.id); }}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="tc-nav-tools">
          <button type="button" className="tc-chip" onClick={onOpenCmd} aria-label="Open command palette">
            <span className="tc-wide-only">⌘K</span>
            <span className="tc-narrow-only">MENU</span>
          </button>
          <button type="button" className="tc-chip" onClick={onToggleTheme} aria-label="Toggle carbon mode">
            {theme === "carbon" ? "◐ PAPER" : "◑ CARBON"}
          </button>
        </div>
      </div>
      <div className="tc-progress">
        <span style={{ transform: "scaleX(" + progress + ")" }} />
      </div>
    </nav>
  );
}

function Rail({ active }) {
  return (
    <div className="tc-rail" aria-hidden="true">
      {SECTIONS.map((s, i) => (
        <button key={s.id} type="button" data-active={i === active ? "true" : "false"} onClick={() => scrollToId(s.id)}>
          <span className="tc-rail-tag">{s.label}</span>
          <span className="tc-rail-line" />
        </button>
      ))}
    </div>
  );
}

function StatusBar({ active, progress }) {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Istanbul",
        })
      );
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="tc-status">
      <span>
        SEC <b>{String(active + 1).padStart(2, "0")}</b>/{String(SECTIONS.length).padStart(2, "0")} — {SECTIONS[active]?.label}
      </span>
      <span className="tc-status-mid">
        <span>SCROLL <b>{Math.round(progress * 100)}%</b></span>
        <span>IST <b>{clock}</b></span>
      </span>
      <span>PRESS <b>⌘K</b></span>
    </div>
  );
}

export default function Portfolio() {
  const reduced = useReducedMotion();
  const [theme, setTheme] = useState("paper");
  const [booted, setBooted] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const { index, progress } = useScrollState(SECTIONS.map((s) => s.id));

  useReveal();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("tc-theme");
      if (saved === "carbon" || saved === "paper") setTheme(saved);
    } catch (err) {
      /* storage blocked — stay on paper */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "paper" ? "carbon" : "paper";
      try {
        window.localStorage.setItem("tc-theme", next);
      } catch (err) {
        /* ignore */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="tc-root" data-theme={theme}>
      <style>{STYLES}</style>

      <InkField theme={theme} reduced={reduced} />
      <div className="tc-grain" aria-hidden="true" />
      <div className="tc-vignette" aria-hidden="true" />
      <Cursor reduced={reduced} />

      {!booted && <Boot onDone={() => setBooted(true)} reduced={reduced} />}

      <Nav
        active={index}
        progress={progress}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCmd={() => setCmdOpen(true)}
      />
      <Rail active={index} />

      <main>
        <Hero reduced={reduced} />
        <Marquee />
        <About />
        <Experience />
        <ClientWork reduced={reduced} />
        <Projects reduced={reduced} />
        <Background />
        <Music />
      </main>
      <Footer />

      <StatusBar active={index} progress={progress} />
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onJump={scrollToId}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}
