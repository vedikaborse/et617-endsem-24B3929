// Learner model + rule-based adaptation engine (transparent, explainable).
// Stored only in this device's localStorage. No names, no personal data.
import { pairInfo, MATRAS } from '../data/marathi.js';

const KEY = 'aksharveer_v1';
const pk = (a, b) => [a, b].sort().join('/'); // symmetric look-alike pair key

export const fresh = () => ({
  stars: 0,
  level: 1,            // 1: 3 options random; 2: 4 options incl. look-alike; 3: 4 options look-alikes + matra variants
  streak: 0,           // consecutive correct
  wrongStreak: 0,      // consecutive wrong
  hintsThisRound: 0,
  confusions: {},      // "target>chosen" -> count (visual evidence for M1)
  matraErrors: {},     // consonant -> count (evidence for M2)
  letters: {},         // letter -> {seen, correct, wrong}
  games: {},           // gameId -> {played, best}
  log: [],             // every answer
  adapt: [],           // every adaptation decision with the rule that fired
  speech: [],          // every speech judgement
  started: Date.now(),
});

let state = load();
const subs = new Set();
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.log) return { ...fresh(), ...s }; } catch {}
  return fresh();
}
function save() {
  try {
    state.log = state.log.slice(-300); state.adapt = state.adapt.slice(-100); state.speech = state.speech.slice(-60);
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  subs.forEach((f) => f(state));
}
export const getModel = () => state;
export const subscribe = (f) => { subs.add(f); return () => subs.delete(f); };
export function resetModel() { state = fresh(); save(); }
export function addStars(n) { state.stars += n; save(); }
export function markGame(id, score) {
  const g = state.games[id] || { played: 0, best: 0 };
  g.played += 1; g.best = Math.max(g.best, score); state.games[id] = g; save();
}
export function noteHint() { state.hintsThisRound += 1; save(); }

// Split a syllable into consonant + matra ("कि" -> ["क","ि"]).
export function splitSyl(s) {
  const m = MATRAS.find((x) => x.m && s.endsWith(x.m));
  return m ? [s.slice(0, -m.m.length), m.m] : [s, ''];
}

// Classify the error type: 'lookalike' (M1), 'matra' (M2), or 'other'.
export function classifyError(target, chosen) {
  const [tc, tm] = splitSyl(target); const [cc, cm] = splitSyl(chosen);
  if (tc === cc && tm !== cm) return 'matra';
  if (pairInfo(tc, cc) && tm === cm) return 'lookalike';
  return 'other';
}

function adaptEvent(rule, outcome, detail) {
  const e = { t: Date.now(), rule, outcome, detail };
  state.adapt.push(e);
  return e;
}

/**
 * Record an answer and decide the adaptation outcome.
 * Returns { kind, events[], outcome } where outcome is one of
 *  CONTINUE | LEVEL_UP | SIMPLIFY | COMPARE | MATRA_REVIEW | EASIER
 */
export function recordAnswer({ game, target, chosen, correct, ms = 0, attempt = 1 }) {
  const kind = correct ? 'correct' : classifyError(target, chosen);
  state.log.push({ t: Date.now(), game, target, chosen, correct, kind, ms, attempt, level: state.level });
  const L = (state.letters[target] = state.letters[target] || { seen: 0, correct: 0, wrong: 0 });
  L.seen += 1; correct ? (L.correct += 1) : (L.wrong += 1);

  let outcome = 'CONTINUE'; const events = [];
  if (correct) {
    state.streak += 1; state.wrongStreak = 0;
    if (state.streak >= 3 && state.level < 3) {
      state.level += 1; state.streak = 0; outcome = 'LEVEL_UP';
      events.push(adaptEvent('R1: 3 correct in a row', 'LEVEL_UP', `level → ${state.level} (${state.level === 2 ? '4 options + look-alike distractor' : 'look-alikes + matra variants'})`));
    }
  } else {
    state.wrongStreak += 1; state.streak = 0;
    if (kind === 'lookalike') {
      const k = pk(splitSyl(target)[0], splitSyl(chosen)[0]);
      state.confusions[k] = (state.confusions[k] || 0) + 1;
      if (state.confusions[k] >= 2) {
        outcome = 'COMPARE';
        events.push(adaptEvent('R3: same look-alike confusion ≥ 2 (M1)', 'COMPARE', `${k} confused ×${state.confusions[k]} → side-by-side comparison card`));
      }
    }
    if (kind === 'matra') {
      const c = splitSyl(target)[0];
      state.matraErrors[c] = (state.matraErrors[c] || 0) + 1;
      if (state.matraErrors[c] >= 2) {
        outcome = 'MATRA_REVIEW';
        events.push(adaptEvent('R4: matra errors ≥ 2 on same consonant (M2)', 'MATRA_REVIEW', `${target} vs ${chosen} → back to barakhadi of ${c}`));
      }
    }
    if (outcome === 'CONTINUE' && state.wrongStreak >= 2) {
      outcome = 'SIMPLIFY';
      if (state.level > 1) state.level -= 1;
      events.push(adaptEvent('R2: 2 wrong in a row', 'SIMPLIFY', `next item: 2 options + picture hint; level → ${state.level}`));
    }
  }
  if (state.hintsThisRound >= 3 && outcome === 'CONTINUE') {
    outcome = 'EASIER'; state.hintsThisRound = 0;
    events.push(adaptEvent('R5: 3+ hints in a round', 'EASIER', 'next items use letters already answered correctly'));
  }
  save();
  return { kind, outcome, events };
}

// What the next question should look like, given the current model.
export function questionConfig() {
  const simplify = state.wrongStreak >= 2;
  return {
    level: state.level,
    nOptions: simplify ? 2 : state.level === 1 ? 3 : 4,
    useLookalike: !simplify && state.level >= 2,
    showHint: simplify,
  };
}

export function knownLetters() {
  return Object.entries(state.letters).filter(([, v]) => v.correct > v.wrong).map(([k]) => k);
}

export function logSpeech(entry) { state.speech.push({ t: Date.now(), ...entry }); save(); }

// Visual evidence for the P2 challenge: how often did the learner pick `wrong` when the target was `target` in tap games?
export function visualConfusion(target, wrong) {
  return state.confusions[pk(target, wrong)] || 0;
}
export function visualCorrect(target) {
  return (state.letters[target] && state.letters[target].correct) || 0;
}

// Seed model for demo scenarios (teacher panel).
export function seedConfusion(target, wrong, n = 2) {
  state.confusions[pk(target, wrong)] = n;
  for (let i = 0; i < n; i++) state.log.push({ t: Date.now(), game: 'demo-seed', target, chosen: wrong, correct: false, kind: 'lookalike', ms: 0, attempt: 1, level: state.level });
  save();
}
export function seedCorrect(target, n = 2) {
  const L = (state.letters[target] = state.letters[target] || { seen: 0, correct: 0, wrong: 0 });
  L.seen += n; L.correct += n;
  for (let i = 0; i < n; i++) state.log.push({ t: Date.now(), game: 'demo-seed', target, chosen: target, correct: true, kind: 'correct', ms: 0, attempt: 1, level: state.level });
  save();
}
