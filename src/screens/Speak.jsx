import React, { useEffect, useState } from 'react';
import { TopBar, nav, Feedback, heroSay, DemoHand } from '../components/ui.jsx';
import { WORDS } from '../data/marathi.js';
import { speak, beep } from '../lib/audio.js';
import { listen, judge, speechSupported, SAMPLE_OUTCOMES } from '../lib/speech.js';
import { logSpeech, addStars, recordAnswer, markGame } from '../lib/model.js';

const TARGETS = ['कमळ', 'मोर', 'गाय', 'घर', 'भ', 'कि', 'की', 'ससा', 'मासा', 'केळे'];
const pic = (t) => (WORDS[t] ? WORDS[t].e : '🔤');

// Child-facing Hindi message for each judgement (no harsh "wrong").
const MSG = {
  CORRECT: { kind: 'good', hi: 'बहुत अच्छा! बिल्कुल सही पढ़ा!' },
  VARIATION_ACCEPTED: { kind: 'good', hi: 'शाबाश! तुमने सही पढ़ा। मराठी में ऐसे भी बोलते हैं — सुनो:' },
  UNCERTAIN: { kind: 'info', hi: 'मैं ठीक से सुन नहीं पाया। कोई बात नहीं! एक बार फिर बोलो, या अक्षर पर टैप करो।' },
  POSSIBLE_ERROR: { kind: 'try', hi: 'हम्म! मुझे दूसरा अक्षर सुनाई दिया। बताओ, इनमें से कौन-सा अक्षर दिख रहा है?' },
  LIKELY_LEARNING_ERROR: { kind: 'try', hi: 'ये दोनों अक्षर एक जैसे दिखते हैं! चलो साथ में फ़र्क देखें।' },
  TRY_AGAIN: { kind: 'try', hi: 'चलो, फिर कोशिश करते हैं! पहले मेरी आवाज़ सुनो।' },
};

export default function Speak({ query }) {
  const [ti, setTi] = useState(Math.max(0, TARGETS.indexOf(query.get('t') || 'कमळ')));
  const target = query.get('t') && !TARGETS.includes(query.get('t')) ? query.get('t') : TARGETS[ti];
  const [phase, setPhase] = useState('idle'); // idle | listening | result
  const [res, setRes] = useState(null);
  const [check, setCheck] = useState(null);
  const supported = speechSupported();
  const [manual, setManual] = useState(!supported);
  const [handRun, setHandRun] = useState(0);
  const say = () => { setHandRun((r) => r + 1); return heroSay('पहले सुनो। फिर गुलाबी माइक दबाओ और ज़ोर से बोलो!').then(() => speak(target, 'mr')); };
  useEffect(() => { setPhase('idle'); setRes(null); setCheck(null); const t = setTimeout(say, 300); return () => clearTimeout(t); }, [target]);

  const handle = (alternatives, meta) => {
    const j = judge({ target, alternatives });
    logSpeech({ target, alternatives, decision: j.decision, trace: j.trace, ...meta });
    setRes({ ...j, ...meta }); setPhase('result');
    const m = MSG[j.decision];
    if (j.decision === 'CORRECT' || j.decision === 'VARIATION_ACCEPTED') {
      beep('ok'); addStars(1); markGame('g8', 3);
      heroSay(m.hi).then(() => j.decision === 'VARIATION_ACCEPTED' && speak(target, 'mr'));
    } else heroSay(m.hi).then(() => j.decision === 'TRY_AGAIN' && speak(target, 'mr'));
  };
  const start = async () => {
    setPhase('listening'); setRes(null); setCheck(null);
    let r = await listen({ lang: 'mr-IN' });
    if (!r.ok && r.error === 'language-not-supported') r = await listen({ lang: 'hi-IN' });
    if (!r.ok && ['unsupported', 'offline', 'not-allowed', 'service-not-allowed', 'network', 'start-failed'].includes(r.error)) {
      setManual(true); setPhase('idle');
      heroSay('अभी माइक काम नहीं कर रहा। कोई बात नहीं! सुनो, ज़ोर से बोलो, फिर अंगूठे वाला बटन दबाओ।');
      setRes({ decision: 'FALLBACK', error: r.error });
      return;
    }
    handle(r.alternatives, { simulated: false, lang: r.lang, error: r.error });
  };
  const simulate = (k) => { const s = SAMPLE_OUTCOMES[k]; nav('/speak?t=' + encodeURIComponent(s.target) + '&sim=' + k); };
  useEffect(() => { const k = query.get('sim'); if (k && SAMPLE_OUTCOMES[k] && SAMPLE_OUTCOMES[k].target === target) setTimeout(() => handle(SAMPLE_OUTCOMES[k].alternatives, { simulated: true, sample: k }), 900); }, [target, query.get('sim')]);

  // Visual confirmation step: second evidence source for POSSIBLE_ERROR
  const visualCheck = (o) => {
    const ok = o === res.targetLetter;
    recordAnswer({ game: 'g8-visual', target: res.targetLetter, chosen: o, correct: ok });
    setCheck(ok ? 'ok' : 'no');
    if (ok) { beep('ok'); heroSay('सही! तुम अक्षर पहचानते हो। शायद मुझसे सुनने में गड़बड़ हुई। फिर से बोलो!'); }
    else heroSay('ये दोनों एक जैसे दिखते हैं। चलो फ़र्क देखें।');
  };
  const tl = target.match(/^./u)[0];
  const choices = res && res.confusedWith ? [tl, res.confusedWith.match(/^./u)[0]].sort() : [];
  if (res && res.decision === 'POSSIBLE_ERROR' && !res.targetLetter) res.targetLetter = tl;
  const m = res && MSG[res.decision];

  return (
    <>
      <TopBar back="/map" onRepeat={say} />
      <div className="main" style={{ textAlign: 'center' }}>
        <div className="title" style={{ fontSize: 40 }}>🎤 {res?.simulated && <span className="demo-badge">DEMO · recorded sample, not live AI</span>}</div>
        <div className="strip" lang="mr" style={{ marginBottom: 8 }}>
          {TARGETS.map((t, k) => <button key={t} className={'syl ' + (t === target ? 'on' : '')} style={{ fontSize: 22 }} onClick={() => { setTi(k); nav('/speak?t=' + encodeURIComponent(t)); }}>{t}</button>)}
        </div>
        <div className="row"><div className="card" style={{ fontSize: 70, padding: '0 20px' }}>{pic(target)}</div><button className="giant" lang="mr" style={{ background: 'none', fontSize: 110 }} onClick={() => speak(target, 'mr')}>{target}</button></div>
        {!manual && (
          <>
            <button className={'mic ' + (phase === 'listening' ? 'listen' : '')} onClick={start} disabled={phase === 'listening'} aria-label="माइक">🎤</button>
            {phase === 'listening' ? <div className="waves"><i /><i /><i /><i /><i /></div> : <div style={{ fontSize: 34 }}>👆🗣️</div>}
          </>
        )}
        {manual && (
          <div className="card" style={{ maxWidth: 560, margin: '10px auto' }}>
            <span className="demo-badge">🚫🤖 no-mic mode · no AI check</span>
            <p style={{ fontSize: 36 }}>🔊 ➡️ 🗣️ ➡️ 👍</p>
            <div className="row">
              <button className="speakbig" onClick={() => speak(target, 'mr')}>🔊</button>
              <button className="bigbtn green" onClick={() => { addStars(1); beep('ok'); heroSay('शाबाश! खुद बोलकर पढ़ना बहुत अच्छा है!'); markGame('g8', 2); }}>👍</button>
            </div>
            {supported && <button className="bigbtn white small" style={{ marginTop: 8 }} onClick={() => setManual(false)}>🎤 🔁</button>}
          </div>
        )}
        {res && m && (
          <Feedback kind={m.kind} text={m.hi}>
            {res.heard && <div style={{ fontSize: 30, marginTop: 4 }}>👂 <span className="heard" lang="mr" style={{ fontSize: 28 }}>"{res.heard}"</span></div>}
            {res.decision === 'VARIATION_ACCEPTED' && <div><button className="bigbtn white small" onClick={() => speak(target, 'mr')}>🔊 <span className="mr" lang="mr">{target}</span></button></div>}
            {res.decision === 'POSSIBLE_ERROR' && !check && (
              <div className="row" lang="mr">{choices.map((c) => <button key={c} className="opt" style={{ minHeight: 90, fontSize: 60, width: 110 }} onClick={() => visualCheck(c)}>{c}</button>)}</div>
            )}
            {check === 'ok' && <div style={{ fontSize: 40 }}>✅👍</div>}
            {(res.decision === 'LIKELY_LEARNING_ERROR' || check === 'no') && (
              <div className="row"><button className="bigbtn purple small" onClick={() => nav('/game/g3')}>🔍 ▶</button><button className="bigbtn small" onClick={() => nav('/letter/' + tl)}>👀 <span className="mr" lang="mr">{tl}</span></button></div>
            )}
            <div className="row" style={{ marginTop: 6 }}>
              <button className="bigbtn small" onClick={start}>🔁🎤</button>
              <button className="bigbtn small green" onClick={() => { const k = (ti + 1) % TARGETS.length; setTi(k); nav('/speak?t=' + encodeURIComponent(TARGETS[k])); }}>➡️</button>
            </div>
          </Feedback>
        )}
        {res && res.decision === 'FALLBACK' && <Feedback kind="info" text="" />}
        <DemoHand steps={() => [{ sel: '.giant', act: 'tap' }, { sel: manual ? '.bigbtn.green' : '.mic', act: 'tap' }]} run={handRun} delay={3000} />
        <p style={{ fontSize: 11, color: '#666', fontFamily: 'system-ui', opacity: .7 }}>{supported ? 'Speech recognition: Web Speech API (mr-IN → hi-IN)' : 'Speech recognition not supported in this browser → manual fallback'}</p>
      </div>
    </>
  );
}
