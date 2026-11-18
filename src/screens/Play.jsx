import React, { useEffect, useRef, useState } from 'react';
import { TopBar, nav, Feedback, PRAISE, pickOne, shuffle, useInstruction } from '../components/ui.jsx';
import { WORDS, CONSONANTS, MATRAS } from '../data/marathi.js';
import { speak, beep } from '../lib/audio.js';
import { recordAnswer, addStars, markGame } from '../lib/model.js';

// ---------- Game 4: letter ↔ picture matching (tap one, tap its partner) ----------
export function Match() {
  const mk = () => shuffle(CONSONANTS.filter((c) => c.word && WORDS[c.word])).slice(0, 4).map((c) => ({ l: c.l, w: c.word, e: WORDS[c.word].e }));
  const [set, setSet] = useState(mk);
  const [right] = useState(() => null);
  const [pics, setPics] = useState(() => shuffle(set));
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState([]);
  const [bad, setBad] = useState(null);
  const [round, setRound] = useState(0);
  useInstruction('अक्षर पर टैप करो, फिर उसका चित्र ढूँढो!', [round]);
  const tapLetter = (l) => { if (done.includes(l)) return; setSel(l); speak(l, 'mr'); };
  const tapPic = (p) => {
    if (done.includes(p.l)) return;
    speak(p.w, 'mr');
    if (!sel) { speak('पहले अक्षर पर टैप करो!'); return; }
    const ok = sel === p.l;
    recordAnswer({ game: 'g4', target: p.l, chosen: sel, correct: ok });
    if (ok) {
      beep('ok'); const d = [...done, p.l]; setDone(d); setSel(null); addStars(1);
      if (d.length === set.length) { speak('सारी जोड़ियाँ बन गईं! शाबाश!'); }
      else speak(pickOne(PRAISE));
    } else { beep('bad'); setBad(p.l); setTimeout(() => setBad(null), 500); speak(`ये ${p.w} है। सुनो, इसकी पहली आवाज़ क्या है?`); }
  };
  const again = () => { const s = mk(); setSet(s); setPics(shuffle(s)); setDone([]); setSel(null); setRound(round + 1); };
  const finished = done.length === set.length;
  return (
    <>
      <TopBar back="/map" onRepeat={() => speak('अक्षर पर टैप करो, फिर उसका चित्र ढूँढो!')} />
      <div className="main">
        <div className="title" style={{ fontSize: 30 }}>🧩 अक्षर-चित्र मिलाओ</div>
        <div className="matchgrid">
          <div style={{ display: 'grid', gap: 12 }} lang="mr">
            {set.map((s) => <button key={s.l} className={'mitem mr ' + (sel === s.l ? 'sel ' : '') + (done.includes(s.l) ? 'done' : '')} onClick={() => tapLetter(s.l)}>{s.l}{done.includes(s.l) && ' ✅'}</button>)}
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {pics.map((p) => <button key={p.l} className={'mitem ' + (done.includes(p.l) ? 'done ' : '') + (bad === p.l ? 'wrong' : '')} onClick={() => tapPic(p)}>{p.e}{done.includes(p.l) && <span className="mr" lang="mr" style={{ fontSize: 22, position: 'absolute', bottom: 4 }}>{p.w}</span>}</button>)}
          </div>
        </div>
        {finished && <Feedback text="सारी जोड़ियाँ बन गईं! 🎉"><div className="row"><button className="bigbtn small" onClick={again}>🔁 फिर से</button><button className="bigbtn small green" onClick={() => { markGame('g4', 3); nav('/reward?g=g4&s=4&n=4'); }}>🏆 इनाम</button></div></Feedback>}
      </div>
    </>
  );
}

// ---------- Game 6: drag (or tap-then-tap) the right matra into the slot ----------
const PLACE_ITEMS = [
  { word: 'कान', c: 'क', m: 'ा', rest: 'न' }, { word: 'मोर', c: 'म', m: 'ो', rest: 'र' },
  { word: 'किल्ला', c: 'क', m: 'ि', rest: 'ल्ला' }, { word: 'गुलाब', c: 'ग', m: 'ु', rest: 'लाब' },
  { word: 'केळे', c: 'क', m: 'े', rest: 'ळे' }, { word: 'फूल', c: 'फ', m: 'ू', rest: 'ल' },
  { word: 'टोपी', c: 'ट', m: 'ो', rest: 'पी' }, { word: 'चिमणी', c: 'च', m: 'ि', rest: 'मणी' },
];
export function Place() {
  const [i, setI] = useState(0);
  const [placed, setPlaced] = useState(null);
  const [sel, setSel] = useState(null);
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(false);
  const [fb, setFb] = useState(null);
  const [score, setScore] = useState(0);
  const slotRef = useRef();
  const it = PLACE_ITEMS[i];
  const chips = React.useMemo(() => shuffle([...new Set([it.m, ...{ 'ा': ['ो', 'ि'], 'ो': ['ा', 'ौ'], 'ि': ['ी', 'ु'], 'ु': ['ू', 'ि'], 'े': ['ै', 'ा'], 'ू': ['ु', 'ो'] }[it.m]])]), [i]);
  const say = () => speak('चित्र देखो, शब्द सुनो, और सही मात्रा खाली डिब्बे में रखो!', 'hi').then(() => speak(it.word, 'mr'));
  useEffect(() => { const t = setTimeout(say, 300); return () => clearTimeout(t); }, [i]);

  const drop = (m) => {
    setSel(null); setDrag(null); setOver(false);
    const ok = m === it.m;
    recordAnswer({ game: 'g6', target: it.c + it.m, chosen: it.c + m, correct: ok });
    setPlaced(m);
    if (ok) { beep('ok'); addStars(1); setScore(score + 1); setFb({ kind: 'good', text: `${pickOne(PRAISE)} ${it.c} + ${it.m} = ${it.c + it.m}` }); speak(it.word, 'mr'); }
    else {
      beep('bad');
      const v = MATRAS.find((x) => x.m === m).v;
      setFb({ kind: 'try', text: `ये बना "${it.c + m}" — आवाज़ "${v}" वाली। शब्द फिर सुनो और दूसरी मात्रा आज़माओ!` });
      speak(`ये बना`, 'hi').then(() => speak(it.c + m, 'mr')).then(() => speak('शब्द फिर सुनो', 'hi')).then(() => speak(it.word, 'mr'));
      setTimeout(() => setPlaced(null), 1400);
    }
  };
  // Pointer-based drag: works with touch + mouse. Tap-to-select + tap-slot also works.
  const onDown = (e, m) => { setSel(m); setDrag({ m, x: e.clientX, y: e.clientY, moved: false }); };
  useEffect(() => {
    if (!drag) return;
    const mv = (e) => {
      setDrag((d) => d && { ...d, x: e.clientX, y: e.clientY, moved: true });
      const r = slotRef.current?.getBoundingClientRect();
      setOver(!!r && e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom);
    };
    const up = (e) => {
      const r = slotRef.current?.getBoundingClientRect();
      const inside = r && e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
      if (drag.moved && inside) drop(drag.m); else { setDrag(null); setOver(false); }
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
  }, [drag]);

  const nextItem = () => {
    setFb(null); setPlaced(null);
    if (i + 1 >= PLACE_ITEMS.length) { markGame('g6', score >= 6 ? 3 : score >= 4 ? 2 : 1); nav(`/reward?g=g6&s=${score}&n=${PLACE_ITEMS.length}`); }
    else setI(i + 1);
  };
  const solved = placed === it.m;
  return (
    <>
      <TopBar back="/map" onRepeat={say} />
      <div className="main" style={{ textAlign: 'center' }}>
        <div className="title" style={{ fontSize: 30 }}>✋ मात्रा मैदान</div>
        <div className="dots">{PLACE_ITEMS.map((_, k) => <i key={k} className={k < i ? 'ok' : k === i ? 'cur' : ''} />)}</div>
        <div className="row"><button className="speakbig" onClick={say}>🔊</button><div className="card" style={{ fontSize: 90, padding: '0 26px' }}>{WORDS[it.word].e}</div></div>
        <div className="slotword" lang="mr" style={{ marginTop: 14 }}>
          <span>{it.c}</span>
          <div ref={slotRef} className={'slot ' + (over ? 'over ' : '') + (solved ? 'filled' : '')} onClick={() => sel && drop(sel)}>{placed ? <span>{it.c + placed}</span> : <span style={{ fontSize: 30 }}>❓</span>}</div>
          <span>{it.rest}</span>
        </div>
        <p style={{ fontSize: 18, fontWeight: 700 }}>👇 मात्रा को खींचो — या टैप करो, फिर डिब्बे पर टैप करो</p>
        <div className="tray" lang="mr">
          {chips.map((m) => <button key={m} className={'chip ' + (sel === m ? 'sel' : '')} onPointerDown={(e) => onDown(e, m)}>◌{m}</button>)}
        </div>
        {drag && drag.moved && <div className="dragghost chip mr" style={{ left: drag.x, top: drag.y, display: 'grid', placeItems: 'center' }}>◌{drag.m}</div>}
        {fb && <Feedback kind={fb.kind} text={fb.text} />}
        {solved && <div className="row"><button className="bigbtn green" onClick={nextItem}>आगे ➡️</button></div>}
      </div>
    </>
  );
}

// ---------- Game 7: letter maze — hear target, step only on that letter to reach treasure ----------
const N = 5;
function buildMaze(target, decoys) {
  // random monotone path from top-left to bottom-right
  const path = [[0, 0]]; let r = 0, c = 0;
  while (r < N - 1 || c < N - 1) { if (r === N - 1) c++; else if (c === N - 1) r++; else Math.random() < 0.5 ? r++ : c++; path.push([r, c]); }
  const key = (a, b) => a + ',' + b; const onPath = new Set(path.map(([a, b]) => key(a, b)));
  const grid = [];
  for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) grid.push({ a, b, l: onPath.has(key(a, b)) ? target : decoys[(a * N + b) % decoys.length] });
  return { grid, path };
}
const MAZE_TARGETS = [{ t: 'भ', d: ['म', 'ब', 'स'] }, { t: 'घ', d: ['ध', 'प', 'न'] }, { t: 'ब', d: ['व', 'क', 'म'] }, { t: 'प', d: ['ष', 'य', 'ग'] }];
export function Maze() {
  const [lvl, setLvl] = useState(0);
  const T = MAZE_TARGETS[lvl % MAZE_TARGETS.length];
  const maze = React.useMemo(() => buildMaze(T.t, lvl === 0 ? T.d.slice(1) : T.d), [lvl]);
  const [pos, setPos] = useState([0, 0]);
  const [trail, setTrail] = useState(['0,0']);
  const [bad, setBad] = useState(null);
  const [won, setWon] = useState(false);
  const say = () => speak('सिर्फ़ इस अक्षर पर चलो और खज़ाने तक पहुँचो!', 'hi').then(() => speak(T.t, 'mr'));
  useEffect(() => { setPos([0, 0]); setTrail(['0,0']); setWon(false); const t = setTimeout(say, 300); return () => clearTimeout(t); }, [lvl]);
  const tap = (cell) => {
    if (won) return;
    const adj = Math.abs(cell.a - pos[0]) + Math.abs(cell.b - pos[1]) === 1;
    if (!adj) { speak('पास वाले डिब्बे पर टैप करो!'); return; }
    const ok = cell.l === T.t;
    recordAnswer({ game: 'g7', target: T.t, chosen: cell.l, correct: ok });
    if (!ok) { beep('bad'); setBad(cell.a + ',' + cell.b); setTimeout(() => setBad(null), 500); speak(`ये ${cell.l} है! हमें चाहिए`, 'hi').then(() => speak(T.t, 'mr')); return; }
    beep('ok'); setPos([cell.a, cell.b]); setTrail([...trail, cell.a + ',' + cell.b]);
    if (cell.a === N - 1 && cell.b === N - 1) { setWon(true); addStars(2); beep('star'); speak('खज़ाना मिल गया! तुम सच्चे अक्षरवीर हो!'); }
  };
  return (
    <>
      <TopBar back="/map" onRepeat={say} />
      <div className="main" style={{ textAlign: 'center' }}>
        <div className="title" style={{ fontSize: 30 }}>🗝️ अक्षर भूलभुलैया</div>
        <div className="row"><button className="speakbig" onClick={say}>🔊</button><div style={{ fontSize: 22, fontWeight: 800 }}>सिर्फ़ <span className="mr" lang="mr" style={{ fontSize: 50, color: 'var(--saffron)' }}>{T.t}</span> पर चलो → 💎</div></div>
        <div className="maze" lang="mr" style={{ gridTemplateColumns: `repeat(${N},1fr)` }}>
          {maze.grid.map((cell) => {
            const k = cell.a + ',' + cell.b; const here = pos[0] === cell.a && pos[1] === cell.b;
            const isEnd = cell.a === N - 1 && cell.b === N - 1;
            return <button key={k} className={'cell ' + (here ? 'hero ' : trail.includes(k) ? 'path ' : '') + (isEnd && !here ? 'treasure ' : '') + (bad === k ? 'bad' : '')} onClick={() => tap(cell)}>{here ? '🦸' : isEnd ? (won ? '💎' : cell.l) : cell.l}</button>;
          })}
        </div>
        {won && <Feedback text="खज़ाना मिल गया! 💎 ⭐⭐"><div className="row"><button className="bigbtn small" onClick={() => setLvl(lvl + 1)}>➡️ अगला नक्शा</button><button className="bigbtn small green" onClick={() => { markGame('g7', 3); nav('/reward?g=g7&s=1&n=1'); }}>🏆</button></div></Feedback>}
      </div>
    </>
  );
}
