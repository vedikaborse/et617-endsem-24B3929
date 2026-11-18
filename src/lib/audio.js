// Text-to-speech wrapper around browser SpeechSynthesis.
// Marathi content -> mr-IN voice, else hi-IN voice (same Devanagari script), else silent + visual cue.
// Hindi instructions -> hi-IN voice.

let muted = false;
try { muted = localStorage.getItem('av_muted') === '1'; } catch {}
const listeners = new Set();
let speaking = false;

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let voices = [];
function loadVoices() { if (synth) voices = synth.getVoices() || []; }
if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

function emit() { listeners.forEach((f) => f({ speaking, muted })); }
export function onAudio(f) { listeners.add(f); return () => listeners.delete(f); }
export const isMuted = () => muted;
export function setMuted(m) {
  muted = m;
  try { localStorage.setItem('av_muted', m ? '1' : '0'); } catch {}
  if (m && synth) synth.cancel();
  emit();
}

function pick(lang) {
  const by = (p) => voices.find((v) => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith(p));
  if (lang === 'mr') return { voice: by('mr') || by('hi'), lang: by('mr') ? 'mr-IN' : 'hi-IN' };
  return { voice: by('hi'), lang: 'hi-IN' };
}

export function voiceReport() {
  loadVoices();
  const mr = voices.filter((v) => /^mr/i.test(v.lang));
  const hi = voices.filter((v) => /^hi/i.test(v.lang));
  return {
    supported: !!synth,
    total: voices.length,
    marathi: mr.map((v) => v.name),
    hindi: hi.map((v) => v.name),
    marathiStrategy: mr.length ? 'mr-IN voice' : hi.length ? 'hi-IN voice reads Devanagari (fallback)' : 'no Indian voice: visual captions only',
  };
}

// speak(text, 'hi' | 'mr', {rate}) -> Promise resolved when finished (or immediately if unavailable)
export function speak(text, lang = 'hi', opts = {}) {
  return new Promise((resolve) => {
    if (!synth || muted || !text) { resolve(false); return; }
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const p = pick(lang);
      if (p.voice) u.voice = p.voice;
      u.lang = p.lang;
      u.rate = opts.rate || (lang === 'mr' ? 0.75 : 0.95);
      u.pitch = 1.1;
      let done = false;
      const finish = () => { if (done) return; done = true; speaking = false; emit(); resolve(true); };
      u.onend = finish; u.onerror = finish;
      speaking = true; emit();
      synth.speak(u);
      setTimeout(finish, 6000); // safety: never block the game on TTS
    } catch { speaking = false; emit(); resolve(false); }
  });
}

// Say a Hindi instruction then a Marathi target.
export async function sayBoth(hi, mr) {
  await speak(hi, 'hi');
  if (mr) await speak(mr, 'mr');
}

// Short sound effects with WebAudio (no files to download -> low bandwidth).
let ctx;
export function beep(kind = 'ok') {
  if (muted) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (kind === 'bad') { // cartoon coconut "bonk" + sad "wah-wah"
      const t0 = ctx.currentTime;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'square'; o.frequency.setValueAtTime(180, t0 + 0.35); o.frequency.exponentialRampToValueAtTime(60, t0 + 0.5);
      g.gain.setValueAtTime(0.0001, t0); g.gain.setValueAtTime(0.25, t0 + 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
      o.connect(g).connect(ctx.destination); o.start(t0); o.stop(t0 + 0.6);
      [392, 370, 349, 294].forEach((f, i) => {
        const o2 = ctx.createOscillator(); const g2 = ctx.createGain(); const t = t0 + 0.65 + i * 0.22;
        o2.type = 'triangle'; o2.frequency.setValueAtTime(f, t); o2.frequency.linearRampToValueAtTime(f * (i === 3 ? 0.9 : 0.97), t + 0.2);
        g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(0.12, t + 0.03); g2.gain.exponentialRampToValueAtTime(0.0001, t + (i === 3 ? 0.45 : 0.2));
        o2.connect(g2).connect(ctx.destination); o2.start(t); o2.stop(t + 0.5);
      });
      return;
    }
    const notes = kind === 'ok' ? [523, 659, 784] : kind === 'star' ? [784, 988, 1175, 1568] : [330, 262];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = kind === 'bad' ? 'triangle' : 'sine'; o.frequency.value = f;
      const t = ctx.currentTime + i * 0.11;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.22);
    });
  } catch {}
}
