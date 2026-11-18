import React, { useEffect, useState } from 'react';
import { onAudio, isMuted, setMuted, speak } from '../lib/audio.js';
import { getModel, subscribe } from '../lib/model.js';

export const TOKEN = '24B3929';

// Hindi phrase bank (C2). Short spoken-style Hindi. Rotated so feedback does not feel robotic.
export const PRAISE = ['बहुत अच्छा!', 'शाबाश!', 'वाह, एकदम सही!', 'कमाल कर दिया!', 'तुम तो अक्षरवीर हो!'];
export const TRYAGAIN = ['चलो, फिर कोशिश करते हैं!', 'कोई बात नहीं, ध्यान से देखो!', 'अरे, लगभग! एक बार और!'];
export const pickOne = (a) => a[Math.floor(Math.random() * a.length)];

export function nav(path) { window.location.hash = path; }

// Original mascot: "अक्षरवीर" — a village kid superhero with saffron cape and a pencil-staff.
export function Hero({ size = 160, mood = 'happy', className = '' }) {
  const mouth = mood === 'happy' ? 'M84 96 Q100 112 116 96' : mood === 'think' ? 'M88 102 Q100 98 112 102' : 'M86 100 Q100 110 114 100';
  return (
    <svg className={className} width={size} height={size * 1.15} viewBox="0 0 200 230" aria-label="अक्षरवीर">
      <path d="M58 120 Q30 190 50 222 L150 222 Q170 190 142 120 Z" fill="#ff6b35" />
      <rect x="70" y="118" width="60" height="70" rx="22" fill="#2e86de" />
      <circle cx="100" cy="150" r="17" fill="#ffc93c" stroke="#fff" strokeWidth="4" />
      <text x="100" y="158" textAnchor="middle" fontSize="22" fontWeight="800" fill="#2b2140" fontFamily="Noto Sans Devanagari">अ</text>
      <rect x="76" y="186" width="18" height="34" rx="8" fill="#2b2140" />
      <rect x="106" y="186" width="18" height="34" rx="8" fill="#2b2140" />
      <circle cx="100" cy="78" r="46" fill="#c68642" />
      <path d="M54 70 Q60 26 100 28 Q142 26 146 70 Q130 52 100 54 Q72 52 54 70Z" fill="#2b2140" />
      <rect x="52" y="58" width="96" height="14" rx="7" fill="#ff8a00" />
      <path d="M146 62 L172 52 L166 70 Z" fill="#ff8a00" />
      <ellipse cx="82" cy="80" rx="12" ry="11" fill="#fff" /><ellipse cx="118" cy="80" rx="12" ry="11" fill="#fff" />
      <circle cx="84" cy="82" r="6" fill="#2b2140" /><circle cx="120" cy="82" r="6" fill="#2b2140" />
      <circle cx="86" cy="79" r="2" fill="#fff" /><circle cx="122" cy="79" r="2" fill="#fff" />
      <path d={mouth} stroke="#2b2140" strokeWidth="5" fill={mood === 'happy' ? '#ff5d8f' : 'none'} strokeLinecap="round" />
      <circle cx="68" cy="96" r="6" fill="#ff8fa3" opacity=".6" /><circle cx="132" cy="96" r="6" fill="#ff8fa3" opacity=".6" />
      <g transform="rotate(-25 160 150)">
        <rect x="154" y="96" width="14" height="90" rx="4" fill="#ffc93c" stroke="#b85f00" strokeWidth="3" />
        <path d="M154 186 L161 204 L168 186 Z" fill="#c68642" /><path d="M158 196 L161 204 L164 196Z" fill="#2b2140" />
        <circle cx="161" cy="92" r="9" fill="#ff5d8f" />
      </g>
      <rect x="40" y="128" width="30" height="16" rx="8" fill="#c68642" transform="rotate(-30 55 136)" />
    </svg>
  );
}

// Sidekick parrot "मिठू"
export function Mithu({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="मिठू तोता">
      <ellipse cx="50" cy="60" rx="26" ry="30" fill="#2ec27e" />
      <circle cx="50" cy="34" r="20" fill="#3ad98c" />
      <path d="M62 34 Q80 36 70 50 Q66 42 60 42Z" fill="#ff5d3a" />
      <circle cx="54" cy="30" r="6" fill="#fff" /><circle cx="56" cy="31" r="3" fill="#222" />
      <path d="M30 60 Q14 70 22 88 Q34 78 38 66Z" fill="#1fa463" />
      <path d="M44 88 L40 100 M56 88 L60 100" stroke="#ffb703" strokeWidth="4" />
      <path d="M38 22 Q44 10 52 16" stroke="#ff5d3a" strokeWidth="4" fill="none" />
    </svg>
  );
}

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

// Feedback bubble with mascot reaction. Always spoken too.
export function Feedback({ kind = 'good', text, children }) {
  return (
    <div className={'feedback ' + kind} role="status">
      <div className="mascot-mini"><Hero size={52} mood={kind === 'good' ? 'happy' : 'think'} /></div>
      <div>{text}{children}</div>
    </div>
  );
}

// Speaks a Hindi instruction when a screen opens (C2: child does not need to read).
export function useInstruction(text, deps = []) {
  useEffect(() => {
    const t = setTimeout(() => speak(text, 'hi'), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
