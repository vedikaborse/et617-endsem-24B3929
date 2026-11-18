// NLP feature: speech recognition + variation-aware judgement (P2 design challenge).
// Recogniser: browser Web Speech API (Chrome/Edge/Android Chrome send audio to the browser vendor's
// speech service; nothing is sent to our own server and no API key is needed).
import { lookalikeOf, MATRAS } from '../data/marathi.js';
import { visualConfusion, visualCorrect } from './model.js';

const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
export const speechSupported = () => !!SR;

/** listen({lang}) -> Promise<{ok, alternatives:[{transcript, confidence}], error, lang}> */
export function listen({ lang = 'mr-IN', timeoutMs = 7000 } = {}) {
  return new Promise((resolve) => {
    if (!SR) { resolve({ ok: false, error: 'unsupported', alternatives: [], lang }); return; }
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      resolve({ ok: false, error: 'offline', alternatives: [], lang }); return;
    }
    let settled = false;
    const done = (r) => { if (!settled) { settled = true; resolve({ lang, ...r }); } };
    try {
      const rec = new SR();
      rec.lang = lang; rec.maxAlternatives = 5; rec.interimResults = false; rec.continuous = false;
      rec.onresult = (ev) => {
        const res = ev.results[0];
        const alts = [];
        for (let i = 0; i < res.length; i++) alts.push({ transcript: res[i].transcript.trim(), confidence: res[i].confidence });
        done({ ok: true, alternatives: alts });
      };
      rec.onerror = (e) => done({ ok: false, error: e.error || 'error', alternatives: [] });
      rec.onend = () => done({ ok: false, error: 'no-speech', alternatives: [] });
      rec.start();
      setTimeout(() => { try { rec.stop(); } catch {} }, timeoutMs);
    } catch (e) { done({ ok: false, error: 'start-failed', alternatives: [] }); }
  });
}

// ---------- Normalisation ----------
const strip = (s) => (s || '').normalize('NFC').replace(/[\s.,!?।'"\-_]/g, '').replace(/[‌‍]/g, '');

// Acceptable pronunciation-variation rules. Each is conventional and documented in the report.
export const VARIATION_RULES = [
  { id: 'V1', from: /ळ/g, to: 'ल', hi: 'ळ को ल बोलना (हिंदी में ळ नहीं होता)', en: 'ळ → ल: Hindi has no retroflex lateral ळ; Hindi-speaking children say कमल for कमळ' },
  { id: 'V2', from: /ी/g, to: 'ि', hi: 'छोटी/बड़ी ई की लंबाई', en: 'ी ↔ ि: vowel length i/ī is weakly contrasted in everyday speech' },
  { id: 'V3', from: /ू/g, to: 'ु', hi: 'छोटा/बड़ा ऊ की लंबाई', en: 'ू ↔ ु: vowel length u/ū is weakly contrasted in everyday speech' },
  { id: 'V4', from: /ण/g, to: 'न', hi: 'ण को न बोलना', en: 'ण → न: common in Hindi-influenced speech' },
  { id: 'V5', from: /[शष]/g, to: 'स', hi: 'श/स का फ़र्क', en: 'श/ष ↔ स: regional sibilant merger' },
  { id: 'V6', from: /ँ/g, to: 'ं', hi: 'नाक वाली आवाज़', en: 'chandrabindu ↔ anusvara' },
  { id: 'V7', from: /ई/g, to: 'इ', hi: 'इ/ई', en: 'independent vowel length इ/ई' },
  { id: 'V8', from: /ऊ/g, to: 'उ', hi: 'उ/ऊ', en: 'independent vowel length उ/ऊ' },
];
const varNorm = (s) => VARIATION_RULES.reduce((acc, r) => acc.replace(r.from, r.to), strip(s));

// Does the heard string contain the target (syllable targets: heard may be a longer word starting with it)?
function matches(target, heard, norm) {
  const t = norm(target), h = norm(heard);
  if (!t || !h) return false;
  if (h === t) return true;
  if (t.length <= 3) return h.startsWith(t) && h.length <= t.length + 3; // short syllable inside a short word
  return h.includes(t);
}

export const THRESH = { low: 0.45 };

/**
 * judge({target, alternatives}) -> decision object. Pure, explainable, logged.
 * Evidence sources: (1) recogniser text, (2) recogniser confidence, (3) visual tap history from the learner model.
 */
export function judge({ target, alternatives = [] }) {
  const trace = [];
  const alts = alternatives.filter((a) => a.transcript);
  if (!alts.length) {
    trace.push('No transcript returned by recogniser');
    return { decision: 'UNCERTAIN', reason: 'no-transcript', trace, heard: '' };
  }
  const best = alts[0];
  const conf = typeof best.confidence === 'number' && best.confidence > 0 ? best.confidence : null; // Chrome Android often returns 0 = unknown
  trace.push(`Top transcript "${best.transcript}" (confidence ${conf === null ? 'not reported' : conf.toFixed(2)}); ${alts.length} alternative(s)`);

  // 1. exact match in any alternative
  const exact = alts.find((a) => matches(target, a.transcript, strip));
  if (exact) {
    trace.push(`Exact match with "${exact.transcript}"`);
    return { decision: 'CORRECT', heard: exact.transcript, conf, trace };
  }
  // 2. match after acceptable-variation rules
  const v = alts.find((a) => matches(target, a.transcript, varNorm));
  if (v) {
    const fired = VARIATION_RULES.filter((r) => {
      const re = new RegExp(r.from.source);
      return re.test(strip(target)) || re.test(strip(v.transcript));
    }).map((r) => r.id);
    trace.push(`Match after variation rules ${fired.join(', ')} → pronunciation variation, NOT an error`);
    return { decision: 'VARIATION_ACCEPTED', heard: v.transcript, conf, rules: fired, trace };
  }
  // 3. low confidence → never judge
  if (conf !== null && conf < THRESH.low) {
    trace.push(`Confidence ${conf.toFixed(2)} < ${THRESH.low} → recogniser is unsure; do not judge the child`);
    return { decision: 'UNCERTAIN', reason: 'low-confidence', heard: best.transcript, conf, trace };
  }
  // 4. heard a look-alike letter or a different matra of the same consonant?
  const first = [...strip(target)];
  const tc = first[0];
  const tMatra = MATRAS.find((m) => m.m && strip(target).startsWith(tc + m.m));
  for (const a of alts) {
    const h = strip(a.transcript);
    for (const la of lookalikeOf(tc)) {
      if (h.startsWith(la)) {
        const vis = visualConfusion(tc, la);
        const visOk = visualCorrect(tc);
        trace.push(`Heard look-alike "${la}" for "${tc}". Visual evidence: chose ${la} for ${tc} ${vis}× in tap games; correct ${visOk}×`);
        if (vis >= 2) {
          trace.push('Speech AND visual tasks show the same confusion → likely learning error (M1)');
          return { decision: 'LIKELY_LEARNING_ERROR', heard: a.transcript, conf, confusedWith: la, trace };
        }
        trace.push('Only speech shows it → possible error; ask child to confirm visually (tap)');
        return { decision: 'POSSIBLE_ERROR', heard: a.transcript, conf, confusedWith: la, trace };
      }
    }
    if (h.startsWith(tc) && tMatra) {
      const hm = MATRAS.find((m) => m.m && h.startsWith(tc + m.m));
      if (!hm || hm.m !== tMatra.m) {
        trace.push(`Same consonant, different matra (${hm ? tc + hm.m : tc}) → possible matra error (M2); ask to listen & compare`);
        return { decision: 'POSSIBLE_ERROR', heard: a.transcript, conf, matra: true, confusedWith: hm ? tc + hm.m : tc, trace };
      }
    }
  }
  trace.push('Transcript unrelated to target → no evidence about literacy; model the sound and let child retry');
  return { decision: 'TRY_AGAIN', heard: best.transcript, conf, trace };
}

// Recorded sample outcomes used by the clearly-labelled DEMO / fallback mode.
export const SAMPLE_OUTCOMES = {
  variation: { label: 'कमळ → "कमल" (ळ→ल)', target: 'कमळ', alternatives: [{ transcript: 'कमल', confidence: 0.82 }, { transcript: 'कमला', confidence: 0.4 }] },
  correct: { label: 'मोर → "मोर"', target: 'मोर', alternatives: [{ transcript: 'मोर', confidence: 0.91 }] },
  uncertain: { label: 'गाय → "का" (low confidence)', target: 'गाय', alternatives: [{ transcript: 'का', confidence: 0.28 }] },
  error: { label: 'भ → "म" (look-alike)', target: 'भ', alternatives: [{ transcript: 'म', confidence: 0.77 }, { transcript: 'मा', confidence: 0.5 }] },
  matra: { label: 'कि → "का" (matra)', target: 'कि', alternatives: [{ transcript: 'का', confidence: 0.8 }] },
};
