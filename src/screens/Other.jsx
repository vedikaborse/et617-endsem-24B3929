import React, { useEffect, useState } from 'react';
import { TopBar, nav, Hero, Mithu, Confetti, useModel, TOKEN } from '../components/ui.jsx';
import { speak, beep, voiceReport } from '../lib/audio.js';
import { resetModel, seedConfusion, seedCorrect } from '../lib/model.js';
import { judge, speechSupported, SAMPLE_OUTCOMES, VARIATION_RULES } from '../lib/speech.js';

export function Reward({ query }) {
  const s = +query.get('s') || 0, n = +query.get('n') || 1, g = query.get('g') || 'g1';
  const stars = s / n >= 0.8 ? 3 : s / n >= 0.5 ? 2 : 1;
  const msg = stars === 3 ? 'कमाल! तुम सच्चे अक्षरवीर हो!' : stars === 2 ? 'बहुत अच्छा! थोड़ा और अभ्यास, फिर तीन तारे!' : 'अच्छी कोशिश! हर बार तुम और सीख रहे हो!';
  useEffect(() => { beep('star'); speak(msg); }, []);
  const replay = { g4: '/match', g6: '/place', g7: '/maze', g8: '/speak' }[g] || '/game/' + g;
  return (
    <>
      <TopBar />
      <Confetti />
      <div className="main hero">
        <div className="title">🏆 मिशन पूरा!</div>
        <div className="bigstars">{[0, 1, 2].map((k) => <span key={k} style={{ animationDelay: k * 0.25 + 's', opacity: k < stars ? 1 : 0.25 }}>⭐</span>)}</div>
        <div className="row"><div className="bob"><Hero size={150} /></div><Mithu size={80} /></div>
        <div className="bubble">{msg}<br />✅ {s} / {n}</div>
        <div className="row" style={{ marginTop: 12 }}>
          <button className="bigbtn" onClick={() => nav(replay)}>🔁 फिर खेलो</button>
          <button className="bigbtn green" onClick={() => nav('/map')}>🗺️ नक्शा</button>
        </div>
      </div>
    </>
  );
}

const fmt = (t) => new Date(t).toLocaleTimeString();

export function Teacher() {
  const m = useModel();
  const [vr, setVr] = useState(voiceReport());
  const [sim, setSim] = useState(null);
  useEffect(() => { const t = setTimeout(() => setVr(voiceReport()), 800); return () => clearTimeout(t); }, []);
  const runJudge = (k, prep) => { prep && prep(); const s = SAMPLE_OUTCOMES[k]; setSim({ k, ...s, out: judge({ target: s.target, alternatives: s.alternatives }) }); };
  const total = m.log.length, correct = m.log.filter((l) => l.correct).length;
  const conf = Object.entries(m.confusions).sort((a, b) => b[1] - a[1]);
  return (
    <>
      <TopBar />
      <div className="main teacher">
        <div className="title" style={{ fontSize: 30 }}>🔒 Teacher / Demo Panel</div>
        <p style={{ textAlign: 'center', marginTop: 0 }}>Separate from child screens (reached via About ▸ "Teacher" or <code>#/teacher</code>). English is used here only for the teacher/examiner.</p>

        <div className="card">
          <h2>▶ Live learner scenarios (D5)</h2>
          <p><b>A — Correct learner:</b> opens scripted items (भ/भाकरी, घ/घर, कि, ब, म, प). Tap the right letter each time → praise, ⭐, after 3 correct the engine fires <i>R1 LEVEL_UP</i>.</p>
          <button className="tbtn a" onClick={() => { resetModel(); nav('/game/g2?demo=A'); }}>Run Scenario A (fresh learner)</button>
          <p><b>B — Misconception M1 (look-alike):</b> same items; tap <b>म</b> for भ/भाकरी. 1st wrong → targeted hint with the distinguishing stroke (answer not shown). 2nd confusion (or on item 5 tap भ for म) → <i>R3 COMPARE</i> card. Item 3 (कि): tap की → M2 matra hint; repeat → <i>R4 MATRA_REVIEW</i>.</p>
          <button className="tbtn b" onClick={() => { resetModel(); nav('/game/g2?demo=B'); }}>Run Scenario B (fresh learner)</button>
          <p><b>C — Pronunciation variation vs error (P2 challenge):</b> recorded sample transcripts run through the <u>real</u> judge() pipeline (labelled DEMO on the child screen):</p>
          <button className="tbtn c" onClick={() => nav('/speak?t=' + encodeURIComponent('कमळ') + '&sim=variation')}>C1: कमळ heard “कमल” → VARIATION_ACCEPTED</button>
          <button className="tbtn b" onClick={() => { seedConfusion('भ', 'म', 2); nav('/speak?t=भ&sim=error'); }}>C2: भ heard “म” + visual evidence → LIKELY_LEARNING_ERROR</button>
          <button className="tbtn warn" onClick={() => { resetModel(); nav('/speak?t=भ&sim=error'); }}>C3: भ heard “म”, no visual evidence → POSSIBLE_ERROR → tap check</button>
          <button className="tbtn" onClick={() => nav('/speak?t=' + encodeURIComponent('गाय') + '&sim=uncertain')}>C4: low confidence 0.28 → UNCERTAIN</button>
          <button className="tbtn" onClick={() => nav('/speak?t=' + encodeURIComponent('कि') + '&sim=matra')}>C5: कि heard “का” → matra POSSIBLE_ERROR</button>
          <button className="tbtn" onClick={() => nav('/speak')}>Live microphone</button>
        </div>

        <div className="card">
          <h2>🧪 Judge pipeline in place (no navigation)</h2>
          {Object.keys(SAMPLE_OUTCOMES).map((k) => <button key={k} className="tbtn" onClick={() => runJudge(k, k === 'error' ? () => seedConfusion('भ', 'म', 2) : null)}>{SAMPLE_OUTCOMES[k].label}</button>)}
          {sim && <div className="trace">INPUT target={sim.target} alternatives={JSON.stringify(sim.alternatives)}{'\n'}DECISION <b>{sim.out.decision}</b>{'\n'}{sim.out.trace.map((t, i) => `${i + 1}. ${t}`).join('\n')}</div>}
          <details><summary>Acceptable-variation rules</summary><ul>{VARIATION_RULES.map((r) => <li key={r.id}><b>{r.id}</b> {r.en}</li>)}</ul></details>
        </div>

        <div className="card">
          <h2>📊 Progress & learner model</h2>
          <p>Answers: {total} · correct {correct} ({total ? Math.round((correct / total) * 100) : 0}%) · stars {m.stars} · <b>level {m.level}</b> · streak {m.streak} · wrong-streak {m.wrongStreak}</p>
          <p>Look-alike confusions (M1): {conf.length ? conf.map(([k, v]) => `${k.replace('>', '→')} ×${v}`).join(', ') : 'none'} · Matra errors (M2): {Object.entries(m.matraErrors).map(([k, v]) => `${k} ×${v}`).join(', ') || 'none'}</p>
          <p>Games played: {Object.entries(m.games).map(([k, v]) => `${k}(${v.played})`).join(', ') || 'none'}</p>
          <button className="tbtn warn" onClick={() => { if (confirm('Reset this device\'s learner progress?')) resetModel(); }}>Reset learner (shared tablet)</button>
          <button className="tbtn" onClick={() => seedCorrect('भ', 2)}>Seed: 2 correct visual taps of भ</button>
        </div>

        <div className="card">
          <h2>🧠 Adaptation decisions (rule that fired)</h2>
          <p style={{ fontSize: 13 }}>R1 3 correct → LEVEL_UP · R2 2 wrong → SIMPLIFY (2 options + picture hint) · R3 same look-alike ×2 → COMPARE card · R4 matra error ×2 → MATRA_REVIEW · R5 ≥3 hints → EASIER (known letters)</p>
          <table><thead><tr><th>time</th><th>outcome</th><th>rule</th><th>detail</th></tr></thead>
            <tbody>{[...m.adapt].reverse().slice(0, 15).map((a, i) => <tr key={i}><td>{fmt(a.t)}</td><td><span className={'pill ' + a.outcome}>{a.outcome}</span></td><td>{a.rule}</td><td>{a.detail}</td></tr>)}</tbody></table>
        </div>

        <div className="card">
          <h2>🎤 What speech recognition actually did</h2>
          <p>Recogniser available: <b>{speechSupported() ? 'yes (Web Speech API)' : 'NO — manual fallback used'}</b> · TTS: {vr.supported ? 'yes' : 'no'} · Marathi voices: {vr.marathi.join(', ') || 'none'} · Hindi voices: {vr.hindi.join(', ') || 'none'} → <i>{vr.marathiStrategy}</i></p>
          <table><thead><tr><th>time</th><th>target</th><th>transcripts (conf)</th><th>decision</th><th>source</th></tr></thead>
            <tbody>{[...m.speech].reverse().slice(0, 12).map((s, i) => <tr key={i}><td>{fmt(s.t)}</td><td className="mr">{s.target}</td><td>{(s.alternatives || []).map((a) => `${a.transcript} (${a.confidence?.toFixed?.(2)})`).join(' | ') || s.error}</td><td><span className={'pill ' + s.decision}>{s.decision}</span></td><td>{s.simulated ? 'SIMULATED sample' : 'live mic ' + (s.lang || '')}</td></tr>)}</tbody></table>
        </div>

        <div className="card">
          <h2>📝 Answer log</h2>
          <table><thead><tr><th>time</th><th>game</th><th>target</th><th>chosen</th><th>type</th><th>ms</th></tr></thead>
            <tbody>{[...m.log].reverse().slice(0, 20).map((l, i) => <tr key={i}><td>{fmt(l.t)}</td><td>{l.game}</td><td className="mr">{l.target}</td><td className="mr">{l.chosen}</td><td><span className={'pill ' + (l.correct ? 'CORRECT' : 'POSSIBLE_ERROR')}>{l.kind}</span></td><td>{l.ms}</td></tr>)}</tbody></table>
        </div>
      </div>
    </>
  );
}

export function About() {
  return (
    <>
      <TopBar />
      <div className="main about">
        <div className="card">
          <div className="row"><Hero size={90} /><div><div className="title" style={{ textAlign: 'left', margin: 0 }}>मिशन मराठी — अक्षरवीर!</div><div style={{ fontSize: 20 }}>Mission Marathi: Aksharveer!</div></div></div>
          <p><b>Developer:</b> Vedikaborse · <b>Roll number / identity token:</b> {TOKEN}</p>
          <p><b>Exam card:</b> P2 Contextual language & literacy · T1 Marathi barakhadi / matra recognition · L2 First-generation learner, NGO after-school centre, shared tablets · C2 Learner's own language (Hindi)</p>
          <p>A Hindi-instructed, audio-first game that teaches Hindi-speaking Grade 3 children in Niphad (Nashik) to recognise Marathi letters, look-alike letters, matras and barakhadi, and to read aloud with speech recognition that accepts accent variation.</p>
          <ul>
            <li><b>NLP:</b> Web Speech API speech recognition (mr-IN, fallback hi-IN) + rule-based judge that separates learning errors from pronunciation variation / recogniser uncertainty using confidence and visual-task evidence.</li>
            <li><b>TTS:</b> browser SpeechSynthesis (mr-IN → hi-IN voice → visual-only).</li>
            <li><b>Adaptation:</b> transparent rules R1–R5 on locally stored performance.</li>
            <li><b>C2:</b> every child-facing instruction and feedback is in simple spoken Hindi and is also spoken aloud; Marathi appears only as learning content.</li>
            <li><b>Privacy / shared device:</b> no login, no names, progress stays in this tablet's localStorage, one-tap reset in Teacher panel.</li>
          </ul>
          <p><b>Credits:</b> React 18, Vite 5, Google Fonts (Baloo 2, Noto Sans Devanagari), system emoji for pictures, original SVG mascot. Built with AI assistance (Claude Code) — see REPORT.md.</p>
          <div className="row"><button className="bigbtn purple small" onClick={() => nav('/teacher')}>🔒 Teacher / Demo panel</button><button className="bigbtn small" onClick={() => nav('/')}>🏠</button></div>
        </div>
      </div>
    </>
  );
}
