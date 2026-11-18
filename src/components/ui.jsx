import React, { useEffect, useRef, useState } from 'react';
import { onAudio, isMuted, setMuted, speak } from '../lib/audio.js';
import { getModel, subscribe } from '../lib/model.js';

export const TOKEN = '24B3929';

// Hindi phrase bank (C2). Spoken aloud — the child never has to read them.
export const PRAISE = ['बहुत अच्छा!', 'शाबाश!', 'वाह, एकदम सही!', 'कमाल कर दिया!', 'तुम तो अक्षरवीर हो!'];
export const TRYAGAIN = ['चलो, फिर कोशिश करते हैं!', 'कोई बात नहीं, ध्यान से देखो!', 'अरे, लगभग! एक बार और!'];
export const pickOne = (a) => a[Math.floor(Math.random() * a.length)];

export function nav(path) { window.location.hash = path; }

// ---------- Original cartoon hero "अक्षरवीर" ----------
// A village superhero kid: spiky hair, orange mask, saffron cape, star-suit with अ emblem.
export function Hero({ size = 160, mood = 'happy', fly = false, className = '' }) {
  const mouth = mood === 'happy' ? 'M86 104 Q100 120 114 104 Z' : mood === 'sad' ? 'M86 114 Q100 100 114 114' : mood === 'think' ? 'M90 110 Q100 106 110 110' : 'M88 108 Q100 116 112 108';
  return (
    <svg className={'hero-svg ' + className} width={size} height={size * 1.1} viewBox="0 0 200 220" aria-label="अक्षरवीर">
      <defs>
        <linearGradient id="capeG" x1="0" x2="1"><stop offset="0" stopColor="#ff3d2e" /><stop offset="1" stopColor="#ff8a00" /></linearGradient>
        <linearGradient id="suitG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3d7bff" /><stop offset="1" stopColor="#2448c9" /></linearGradient>
        <radialGradient id="skinG" cx=".4" cy=".35"><stop offset="0" stopColor="#f2bf8c" /><stop offset="1" stopColor="#d18f55" /></radialGradient>
      </defs>
      <g className="cape"><path d={fly ? 'M78 128 Q30 140 6 186 Q40 176 60 196 Q80 170 96 140Z' : 'M70 128 Q44 180 52 214 L148 214 Q156 180 130 128Z'} fill="url(#capeG)" /></g>
      <g transform={fly ? 'rotate(-12 100 150)' : ''}>
        <rect x="72" y="124" width="56" height="64" rx="24" fill="url(#suitG)" />
        <rect x="72" y="166" width="56" height="9" fill="#ffc93c" />
        <path d="M100 136 l6 12 13 2 -9 9 2 13 -12 -6 -12 6 2 -13 -9 -9 13 -2z" fill="#ffc93c" stroke="#fff" strokeWidth="2" />
        <text x="100" y="160" textAnchor="middle" fontSize="14" fontWeight="800" fill="#c2305f" fontFamily="Noto Sans Devanagari">अ</text>
        {fly ? (<><rect x="76" y="184" width="16" height="30" rx="8" fill="#2448c9" transform="rotate(30 84 186)" /><rect x="104" y="184" width="16" height="30" rx="8" fill="#2448c9" transform="rotate(20 112 186)" /><ellipse cx="74" cy="214" rx="12" ry="8" fill="#ff3d2e" /><ellipse cx="102" cy="216" rx="12" ry="8" fill="#ff3d2e" /></>)
          : (<><rect x="78" y="184" width="17" height="26" rx="8" fill="#2448c9" /><rect x="105" y="184" width="17" height="26" rx="8" fill="#2448c9" /><ellipse cx="86" cy="212" rx="13" ry="7" fill="#ff3d2e" /><ellipse cx="114" cy="212" rx="13" ry="7" fill="#ff3d2e" /></>)}
        <g className="arm-wave"><rect x="122" y="96" width="15" height="40" rx="7" fill="url(#suitG)" transform="rotate(25 128 132)" /><circle cx="146" cy="96" r="11" fill="url(#skinG)" /></g>
        <rect x="62" y="130" width="15" height="36" rx="7" fill="url(#suitG)" transform="rotate(20 70 132)" />
        <circle cx="58" cy="164" r="10" fill="url(#skinG)" />
      </g>
      <g className="head">
        <circle cx="100" cy="76" r="50" fill="url(#skinG)" />
        <path d="M50 70 L46 40 L62 52 L64 24 L80 44 L92 16 L104 40 L120 18 L126 44 L144 30 L142 54 L156 50 L150 74 Q130 46 100 48 Q68 46 50 70Z" fill="#26203b" />
        <path d="M54 72 Q100 58 146 72 L146 92 Q122 84 100 92 Q78 84 54 92Z" fill="#ff8a00" />
        <path d="M144 76 L172 66 L166 84Z" fill="#ff8a00" />
        <ellipse cx="80" cy="80" rx="14" ry="15" fill="#fff" /><ellipse cx="120" cy="80" rx="14" ry="15" fill="#fff" />
        <g className="eyes"><circle cx="82" cy="82" r="8" fill="#26203b" /><circle cx="122" cy="82" r="8" fill="#26203b" />
          <circle cx="85" cy="78" r="3" fill="#fff" /><circle cx="125" cy="78" r="3" fill="#fff" /></g>
        <path d={mouth} stroke="#26203b" strokeWidth="4" fill={mood === 'happy' ? '#ff5d8f' : 'none'} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="66" cy="102" r="7" fill="#ff8fa3" opacity=".7" /><circle cx="134" cy="102" r="7" fill="#ff8fa3" opacity=".7" />
        {mood === 'sad' && (<><path d="M66 62 L92 70 M134 62 L108 70" stroke="#26203b" strokeWidth="5" strokeLinecap="round" /><path className="tear" d="M70 96 Q66 106 70 110 Q74 106 70 96Z" fill="#5ac8fa" /></>)}
      </g>
    </svg>
  );
}

// Sidekick parrot "मिठू"
export function Mithu({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="मिठू तोता" className="mithu">
      <ellipse cx="50" cy="60" rx="26" ry="30" fill="#2ec27e" />
      <circle cx="50" cy="34" r="20" fill="#3ad98c" />
      <path d="M62 34 Q80 36 70 50 Q66 42 60 42Z" fill="#ff5d3a" />
      <circle cx="54" cy="30" r="6" fill="#fff" /><circle cx="56" cy="31" r="3" fill="#222" />
      <path className="wing" d="M30 60 Q14 70 22 88 Q34 78 38 66Z" fill="#1fa463" />
      <path d="M44 88 L40 100 M56 88 L60 100" stroke="#ffb703" strokeWidth="4" />
    </svg>
  );
}

// ---------- Flying voice guide: hero flies in and says the instruction in Hindi ----------
const guideSubs = new Set();
let lastLine = '';
export function heroSay(text) {
  lastLine = text;
  guideSubs.forEach((f) => f(text));
  return speak(text, 'hi');
}
export function HeroGuide() {
  const [k, setK] = useState(0);
  const a = useAudioState();
  useEffect(() => { const f = () => setK((x) => x + 1); guideSubs.add(f); return () => guideSubs.delete(f); }, []);
  if (!k) return null;
  return (
    <button key={k} className="heroguide" aria-label="फिर से सुनो" onClick={() => heroSay(lastLine)}>
      <div className={'guide-bubble ' + (a.speaking ? 'talking' : '')}>🔊<span className="mini-waves"><i /><i /><i /></span></div>
      <Hero size={92} fly mood="happy" />
    </button>
  );
}

// ---------- Demo hand: shows HOW to play (tap / drag) without any text ----------
// steps: [{sel, act:'tap'|'hover'|'drag', to}] evaluated when `run` changes.
export function DemoHand({ steps, run, delay = 1400 }) {
  const [p, setP] = useState(null);
  useEffect(() => {
    if (!run) return;
    let alive = true;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const center = (sel) => { const el = typeof sel === 'string' ? document.querySelector(sel) : sel; if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, txt: el.textContent }; };
    (async () => {
      await wait(delay);
      const list = typeof steps === 'function' ? steps() : steps;
      for (const s of list) {
        if (!alive) return;
        const c = center(s.sel); if (!c) continue;
        setP({ x: c.x, y: c.y + 30, show: true, press: false });
        await wait(700);
        if (s.act === 'drag') {
          const t = center(s.to); if (!t) continue;
          setP({ x: c.x, y: c.y, show: true, press: true, ghost: c.txt });
          await wait(350);
          setP({ x: t.x, y: t.y, show: true, press: true, ghost: c.txt, slow: true });
          await wait(1100);
          setP({ x: t.x, y: t.y + 30, show: true, press: false });
          await wait(400);
        } else if (s.act === 'tap') {
          setP({ x: c.x, y: c.y, show: true, press: true }); await wait(300);
          setP({ x: c.x, y: c.y + 10, show: true, press: false }); await wait(450);
        } else await wait(250);
      }
      if (alive) setP((q) => q && { ...q, show: false });
    })();
    return () => { alive = false; };
  }, [run]);
  if (!p) return null;
  return (
    <div className={'demohand ' + (p.show ? '' : 'gone ') + (p.press ? 'press ' : '') + (p.slow ? 'slow' : '')} style={{ left: p.x, top: p.y }} aria-hidden>
      {p.ghost && p.press && <span className="ghostchip mr">{p.ghost}</span>}
      <span className="handemo">👆</span>
      {p.press && <span className="ripple" />}
    </div>
  );
}

// One hook per screen: hero speaks the instruction + the demo hand shows it. Replay on 🔁.
export function useGuide(text, steps, deps = []) {
  const [run, setRun] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => { if (text) heroSay(text); if (steps) setRun((r) => r + 1); }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  const replay = () => { if (text) heroSay(text); if (steps) setRun((r) => r + 1); };
  return { replay, hand: steps ? <DemoHand steps={steps} run={run} /> : null, runHand: () => setRun((r) => r + 1) };
}
// Backwards-compatible: speak an instruction through the hero.
export function useInstruction(text, deps = []) { useGuide(text, null, deps); }

export function useModel() {
  const [m, setM] = useState(getModel());
  useEffect(() => subscribe((s) => setM({ ...s })), []);
  return m;
}

export function useAudioState() {
  const [s, setS] = useState({ speaking: false, muted: isMuted() });
  useEffect(() => onAudio(setS), []);
  return s;
}

export function TopBar({ onRepeat, back }) {
  const a = useAudioState();
  const m = useModel();
  return (
    <div className="topbar">
      <button className="iconbtn" aria-label="घर" onClick={() => nav('/')}>🏠</button>
      {back && <button className="iconbtn" aria-label="नक्शा" onClick={() => nav(back)}>🗺️</button>}
      <div className="spacer" />
      <div className="starpill" aria-label="तारे">⭐ {m.stars}</div>
      {onRepeat && (
        <button className={'iconbtn ' + (a.speaking ? 'speaking' : '')} aria-label="फिर से सुनो" onClick={onRepeat}>🔁</button>
      )}
      <button className={'iconbtn ' + (a.muted ? '' : 'on')} aria-label="आवाज़ चालू/बंद" onClick={() => setMuted(!a.muted)}>
        {a.muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}

export function Footer() {
  return <div className="footer">ET617 · {TOKEN}</div>;
}

export function Confetti({ n = 60 }) {
  const colors = ['#ff6b35', '#ffc93c', '#2ec27e', '#7b5cff', '#ff5d8f', '#7fd3ff'];
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <i key={i} style={{ left: Math.random() * 100 + '%', background: colors[i % colors.length], animationDuration: 1.8 + Math.random() * 2 + 's', animationDelay: Math.random() * 0.6 + 's' }} />
      ))}
    </div>
  );
}

// Feedback = hero reaction + big icon. The words are SPOKEN (by the caller), not shown.
const FB_ICON = { good: '🌟👍', try: '😢🔁', info: '👂🔁' };
export function Feedback({ kind = 'good', text, children }) {
  return (
    <div className={'feedback ' + kind} role="status" aria-label={typeof text === 'string' ? text : ''}>
      <div className={'mascot-mini ' + (kind === 'good' ? 'jump' : kind === 'try' ? 'bonked' : 'tilt')}>
        {kind === 'try' && <><span className="coconut">🥥</span><span className="bonkstars">💫</span></>}
        <Hero size={kind === 'try' ? 84 : 64} mood={kind === 'good' ? 'happy' : kind === 'try' ? 'sad' : 'think'} />
      </div>
      <div className="fb-icon">{FB_ICON[kind]}</div>
      {children && <div className="fb-extra">{children}</div>}
    </div>
  );
}

// ---------- Animated themed backgrounds (simple CSS + emoji, very light) ----------
const SCENES = {
  sky: { bg: 'linear-gradient(180deg,#6ec8ff,#c9f0ff 60%,#b8f29a)', items: [['☁️', 8, 10, 'drift', 60], ['☁️', 60, 18, 'drift2', 44], ['🌞', 86, 6, 'spin', 64], ['🐦', 30, 22, 'flyx', 28], ['🌳', 2, 84, 'sway', 70], ['🌳', 90, 82, 'sway', 64], ['🛖', 78, 86, 'none', 44]] },
  jungle: { bg: 'linear-gradient(180deg,#9be38f,#3fae5a 70%,#2c8a45)', items: [['🌴', 0, 70, 'sway', 90], ['🌳', 88, 66, 'sway', 96], ['🌿', 20, 88, 'sway', 50], ['🐒', 80, 12, 'swing', 50], ['🦋', 20, 30, 'flutter', 30], ['🦋', 70, 50, 'flutter2', 26], ['🐘', 40, 88, 'walk', 54], ['🦜', 6, 14, 'bob', 40]] },
  mountain: { bg: 'linear-gradient(180deg,#a8d8ff,#e6f4ff 55%,#cfe9c4)', items: [['🏔️', 2, 70, 'none', 110], ['⛰️', 74, 72, 'none', 110], ['☁️', 20, 12, 'drift', 54], ['☁️', 70, 26, 'drift2', 40], ['🦅', 40, 18, 'flyx', 40], ['❄️', 50, 40, 'fall', 22]] },
  village: { bg: 'linear-gradient(180deg,#ffd27a,#ffe9b8 55%,#c9e88f)', items: [['🛖', 2, 80, 'none', 70], ['🏡', 82, 78, 'none', 70], ['🐄', 30, 88, 'walk', 54], ['🌞', 84, 4, 'spin', 60], ['🐓', 64, 90, 'bob', 36], ['🌾', 50, 86, 'sway', 40], ['💨', 8, 66, 'smoke', 30]] },
  field: { bg: 'linear-gradient(180deg,#8fd8ff,#dff6ff 50%,#9fe07f)', items: [['🪁', 10, 12, 'kite', 50], ['🪁', 80, 20, 'kite2', 40], ['🌻', 4, 84, 'sway', 56], ['🌻', 88, 82, 'sway', 56], ['🌾', 46, 90, 'sway', 40], ['🐝', 60, 40, 'flutter', 26]] },
  river: { bg: 'linear-gradient(180deg,#8fe0ff,#c9f0ff 55%,#4fb6e8)', items: [['🌊', 4, 88, 'wave', 54], ['🌊', 50, 90, 'wave', 54], ['🐟', 30, 82, 'jump', 36], ['🦆', 74, 84, 'bob', 44], ['☁️', 20, 10, 'drift', 50], ['🪷', 88, 90, 'bob', 34]] },
  fair: { bg: 'linear-gradient(180deg,#ffb3d1,#ffe3ef 55%,#ffe7a8)', items: [['🎈', 6, 80, 'rise', 44], ['🎈', 86, 86, 'rise2', 44], ['🎡', 80, 6, 'spin', 70], ['🎪', 2, 6, 'none', 60], ['🎉', 50, 90, 'bob', 34]] },
  treasure: { bg: 'linear-gradient(180deg,#ffe29a,#f5d27a 60%,#e6b55c)', items: [['🏝️', 2, 82, 'none', 70], ['🦀', 80, 90, 'walk', 36], ['🪙', 88, 30, 'spin', 30], ['🧭', 6, 12, 'spin', 40], ['💎', 90, 6, 'twinkle', 34]] },
  cave: { bg: 'radial-gradient(circle at 50% 30%,#a891ff,#5a3fb8 60%,#3a2780)', items: [['✨', 10, 20, 'twinkle', 30], ['✨', 84, 30, 'twinkle', 26], ['💎', 6, 80, 'twinkle', 40], ['💎', 88, 78, 'twinkle', 40], ['🦇', 60, 10, 'flyx', 32], ['🔮', 46, 88, 'bob', 34]] },
  plain: { bg: 'linear-gradient(180deg,#e9f3ff,#fff)', items: [] },
};
export function Scene({ theme = 'sky' }) {
  const s = SCENES[theme] || SCENES.sky;
  return (
    <div className="scene" style={{ background: s.bg }} aria-hidden>
      {s.items.map(([e, x, y, anim, size], i) => (
        <span key={theme + i} className={'sc ' + anim} style={{ left: x + '%', top: y + '%', fontSize: size, animationDelay: i * 0.4 + 's' }}>{e}</span>
      ))}
    </div>
  );
}

export const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
