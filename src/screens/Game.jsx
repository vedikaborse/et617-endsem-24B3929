import React, { useEffect, useRef, useState } from 'react';
import { TopBar, nav, Feedback, PRAISE, TRYAGAIN, pickOne, shuffle } from '../components/ui.jsx';
import { CONSONANTS, WORDS, MATRAS, lookalikeOf, pairInfo, BARAKHADI_CORE } from '../data/marathi.js';
import { speak, beep } from '../lib/audio.js';
import { recordAnswer, questionConfig, addStars, markGame, splitSyl, knownLetters, noteHint } from '../lib/model.js';

const ROUND = 6;
const TITLES = { g1: '👂 सुनो और पहचानो', g2: '🎯 सही अक्षर चुनो', g3: '🔍 जुड़वाँ अक्षर खोजो' };
const CORE = ['क', 'ग', 'घ', 'ध', 'भ', 'म', 'ब', 'व', 'प', 'ष', 'थ', 'य', 'स', 'न', 'ट', 'ठ', 'ड', 'ढ', 'च', 'ह'];

// Fixed scripted items for live viva demos (teacher panel): A = correct learner, B = M1 misconception
const DEMO = [
  { target: 'भ', prompt: 'भाकरी', opts: ['भ', 'म', 'ब', 'क'] },
  { target: 'घ', prompt: 'घर', opts: ['घ', 'ध', 'प', 'स'] },
  { target: 'कि', prompt: null, opts: ['कि', 'की', 'का', 'के'], matra: true },
  { target: 'ब', prompt: 'बदक', opts: ['ब', 'व', 'म', 'र'] },
  { target: 'म', prompt: 'मासा', opts: ['म', 'भ', 'स', 'न'] },
  { target: 'प', prompt: 'पतंग', opts: ['प', 'ष', 'य', 'ग'] },
];

function makeQuestion(game, matraMode, cfg, prev) {
  const easy = cfg.easier ? knownLetters().filter((l) => CORE.includes(l)) : [];
  if (game === 'g2' && matraMode) {
    const c = shuffle(BARAKHADI_CORE)[0];
    const ms = shuffle(MATRAS.slice(0, 10));
    let target = c + ms[0].m;
    if (target === prev) target = c + ms[1].m;
    // Level 3 / M2 practice: include the short/long pair as distractor
    const pairM = { 'ि': 'ी', 'ी': 'ि', 'ु': 'ू', 'ू': 'ु', 'े': 'ै', 'ै': 'े', '': 'ा', 'ा': '', 'ो': 'ौ', 'ौ': 'ो' };
    const tm = splitSyl(target)[1];
    const d = [c + (pairM[tm] ?? 'ा'), ...ms.map((m) => c + m.m)].filter((x) => x !== target);
    const opts = shuffle([target, ...[...new Set(d)].slice(0, cfg.nOptions - 1)]);
    return { target, opts, matra: true };
  }
  const pool = game === 'g2' ? CONSONANTS.filter((c) => c.word && WORDS[c.word]).map((c) => c.l) : CORE;
  let target = shuffle(easy.length >= 2 ? easy : pool).find((x) => x !== prev) || pool[0];
  const look = lookalikeOf(target).filter((x) => CORE.includes(x) || game !== 'g3');
  let distract = shuffle(CORE.filter((x) => x !== target && !look.includes(x)));
  const useLook = game === 'g3' || cfg.useLookalike;
  const ds = [...(useLook ? look : []), ...distract].slice(0, cfg.nOptions - 1);
  const prompt = game === 'g2' ? CONSONANTS.find((c) => c.l === target).word : null;
  return { target, opts: shuffle([target, ...ds]), prompt };
}

export default function Game({ game, query }) {
  const matraMode = query.get('m') === '1';
  const demo = query.get('demo'); // 'A' | 'B' -> scripted items
  const [i, setI] = useState(0);
  const [results, setResults] = useState([]);
  const [q, setQ] = useState(null);
  const [state, setState] = useState({ wrong: [], solved: false, attempt: 1, fb: null, reveal: false });
  const [banner, setBanner] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const t0 = useRef(Date.now());
  const easier = useRef(false);

  const promptSay = (qq = q) => {
    if (!qq) return;
    if (game === 'g1' || qq.matra) return speak(qq.matra ? 'सुनो, और सही अक्षर पर टैप करो!' : 'आवाज़ सुनो! कौन-सा अक्षर है?', 'hi').then(() => speak(qq.target, 'mr'));
    if (game === 'g2') return speak('ये क्या है? ये किस अक्षर से शुरू होता है?', 'hi').then(() => speak(qq.prompt, 'mr'));
    return speak('बड़े अक्षर जैसा, बिल्कुल वैसा ही अक्षर खोजो!', 'hi');
  };

  const next = (idx, prevTarget) => {
    let nq;
    if (demo) nq = DEMO[idx % DEMO.length];
    else {
      const cfg = { ...questionConfig(), easier: easier.current };
      nq = makeQuestion(game, matraMode, cfg, prevTarget);
      nq.cfg = cfg;
    }
    setQ(nq); setState({ wrong: [], solved: false, attempt: 1, fb: null, reveal: false });
    t0.current = Date.now();
    setTimeout(() => promptSay(nq), 250);
  };
  useEffect(() => { setI(0); setResults([]); next(0); }, [game, matraMode, demo]);

  if (!q) return null;
  const cfg = q.cfg || { showHint: false };

  const answer = (o) => {
    if (state.solved || state.wrong.includes(o)) return;
    const correct = o === q.target;
    const { outcome, kind } = recordAnswer({ game, target: q.target, chosen: o, correct, ms: Date.now() - t0.current, attempt: state.attempt });
    if (correct) {
      beep('ok'); addStars(state.attempt === 1 ? 1 : 0);
      const msg = pickOne(PRAISE);
      speak(msg);
      setState({ ...state, solved: true, fb: { kind: 'good', text: msg + (state.attempt === 1 ? ' ⭐ +1' : '') } });
      setResults((r) => [...r, state.attempt === 1]);
      if (outcome === 'LEVEL_UP') { setBanner('🚀 लेवल ऊपर! अब और चुनौती!'); speak('वाह! अब थोड़ा मुश्किल खेल!'); }
      return;
    }
    beep('bad');
    // Targeted scaffolding — not the answer. Different for M1 (look-alike) and M2 (matra).
    let text;
    const [tc] = splitSyl(q.target); const [cc] = splitSyl(o);
    if (kind === 'lookalike') {
      const p = pairInfo(tc, cc);
      text = <>ये <span className="mr" lang="mr">{o}</span> है — <span className="mr" lang="mr">{q.target}</span> जैसा दिखता है, पर अलग है! 👀 {p.diff}</>;
      speak(`अरे! ये दोनों एक जैसे दिखते हैं। ध्यान से देखो। ${p.diff}`);
    } else if (kind === 'matra') {
      const tm = MATRAS.find((m) => m.m === splitSyl(q.target)[1]);
      text = <>व्यंजन सही है! 👍 अब <b>मात्रा</b> ध्यान से सुनो: <span className="mr" lang="mr">{o}</span> नहीं — आवाज़ "{tm.v}" वाली मात्रा खोजो।</>;
      speak(`अक्षर सही है, बस मात्रा बदलो। आवाज़ ${tm.v} वाली मात्रा खोजो।`).then(() => speak(q.target, 'mr'));
    } else {
      text = pickOne(TRYAGAIN);
      speak(text).then(() => promptSay());
    }
    const wrong = [...state.wrong, o];
    const reveal = state.attempt >= 2; // after 2 tries, gently glow the right one
    if (reveal) noteHint();
    setState({ ...state, wrong, attempt: state.attempt + 1, fb: { kind: 'try', text }, reveal });
    if (reveal) setResults((r) => [...r, false]);
    if (outcome === 'SIMPLIFY') setBanner('🪜 आसान करते हैं: अगली बार 2 ही विकल्प');
    if (outcome === 'EASIER') easier.current = true;
    if (outcome === 'COMPARE') setOverlay({ type: 'compare', a: tc, b: cc, diff: pairInfo(tc, cc).diff });
    if (outcome === 'MATRA_REVIEW') setOverlay({ type: 'matra', c: tc });
  };

  const goNext = () => {
    setBanner(null);
    if (i + 1 >= ROUND) {
      const score = results.filter(Boolean).length;
      const stars = score >= 5 ? 3 : score >= 3 ? 2 : 1;
      markGame(game, stars);
      nav(`/reward?g=${game}&s=${score}&n=${ROUND}`);
      return;
    }
    setI(i + 1); next(i + 1, q.target);
  };

  const opts = demo ? q.opts : q.opts;
  return (
    <>
      <TopBar back="/map" onRepeat={() => promptSay()} />
      <div className="main">
        <div className="title" style={{ fontSize: 30 }}>{TITLES[game]}{matraMode ? ' — मात्रा' : ''} {demo && <span className="demo-badge">DEMO {demo}</span>}</div>
        <div className="dots">{Array.from({ length: ROUND }).map((_, k) => <i key={k} className={k < results.length ? (results[k] ? 'ok' : 'no') : k === i ? 'cur' : ''} />)}</div>
        {banner && <div className="adaptbanner">{banner}</div>}
        <div className="prompt">
          <button className="speakbig" onClick={() => promptSay()} aria-label="सुनो">🔊</button>
          {game === 'g2' && q.prompt && <div className="card" style={{ fontSize: 80, padding: '4px 24px' }}>{WORDS[q.prompt].e}</div>}
          {game === 'g3' && <div className="card giant" lang="mr" style={{ fontSize: 110, padding: '0 30px' }}>{q.target}</div>}
          {cfg.showHint && game !== 'g3' && <div className="card" style={{ fontSize: 18 }}>💡 संकेत: {q.prompt || q.matra ? '' : ''}<span className="mr" lang="mr" style={{ fontSize: 34 }}>{(CONSONANTS.find((c) => c.l === q.target)?.word) || ''} {WORDS[CONSONANTS.find((c) => c.l === q.target)?.word]?.e || ''}</span></div>}
        </div>
        <div className="options" lang="mr" style={{ gridTemplateColumns: opts.length === 3 ? 'repeat(3,1fr)' : 'repeat(2,1fr)' }}>
          {opts.map((o) => (
            <button key={o} className={'opt ' + (state.solved && o === q.target ? 'right' : '') + (state.wrong.includes(o) ? ' wrong' : '') + (state.reveal && !state.solved && o === q.target ? ' glow' : '')} onClick={() => answer(o)}>{o}</button>
          ))}
        </div>
        {state.fb && <Feedback kind={state.fb.kind} text={state.fb.text} />}
        {(state.solved || state.reveal) && (
          <div className="row"><button className="bigbtn green" onClick={goNext}>आगे ➡️</button></div>
        )}
      </div>
      {overlay && (
        <div className="overlay">
          <div className="card">
            {overlay.type === 'compare' ? (
              <>
                <div style={{ fontSize: 24, fontWeight: 800 }}>🔍 चलो, दोनों को साथ में देखें!</div>
                <div className="compare" lang="mr">
                  <button className="big" onClick={() => speak(overlay.a, 'mr')}>{overlay.a}</button>
                  <button className="big" style={{ background: '#ffe3ea' }} onClick={() => speak(overlay.b, 'mr')}>{overlay.b}</button>
                </div>
                <p style={{ fontSize: 20, fontWeight: 700 }}>👀 {overlay.diff}</p>
                <p style={{ fontSize: 16 }}>👆 दोनों पर टैप करके आवाज़ सुनो</p>
                <button className="bigbtn green" onClick={() => setOverlay(null)}>समझ गया! 👍</button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 24, fontWeight: 800 }}>🏡 मात्रा की सैर करें!</div>
                <p style={{ fontSize: 20 }}>मात्रा बदलने से आवाज़ बदलती है। सुनो:</p>
                <div className="strip" lang="mr">{MATRAS.slice(0, 6).map((m) => <button key={m.m} className="syl" onClick={() => speak(overlay.c + m.m, 'mr')}>{overlay.c + m.m}</button>)}</div>
                <div className="row" style={{ marginTop: 12 }}>
                  <button className="bigbtn purple small" onClick={() => nav('/barakhadi/' + overlay.c)}>🏡 बाराखड़ी गाँव</button>
                  <button className="bigbtn green small" onClick={() => setOverlay(null)}>खेल जारी ▶</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
