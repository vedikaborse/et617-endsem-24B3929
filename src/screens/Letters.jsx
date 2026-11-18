import React, { useEffect, useState } from 'react';
import { TopBar, nav, useGuide, Feedback, heroSay } from '../components/ui.jsx';
import { VOWELS, CONSONANTS, MATRAS, WORDS, wordsFor, barakhadi, lookalikeOf } from '../data/marathi.js';
import { speak, beep } from '../lib/audio.js';
import { addStars } from '../lib/model.js';

export function LetterList({ kind }) {
  const list = kind === 'swar' ? VOWELS.map((v) => v.l) : CONSONANTS.map((c) => c.l);
  const g = useGuide(kind === 'swar' ? 'ये स्वर हैं! किसी भी अक्षर को दबाओ।' : 'ये व्यंजन हैं! किसी भी अक्षर को दबाओ।', [{ sel: '.lettertile:nth-child(1)', act: 'tap' }], [kind]);
  return (
    <>
      <TopBar back="/map" onRepeat={g.replay} />
      <div className="main">
        <div className="tabs">
          <button className={'tab ' + (kind === 'swar' ? 'on' : '')} onClick={() => nav('/letters/swar')}>⛰️ <span className="mr" lang="mr">अ आ</span></button>
          <button className={'tab ' + (kind === 'vyanjan' ? 'on' : '')} onClick={() => nav('/letters/vyanjan')}>🌴 <span className="mr" lang="mr">क ख</span></button>
        </div>
        <div className="lettergrid" lang="mr">
          {list.map((l) => {
            const w = (VOWELS.find((v) => v.l === l) || CONSONANTS.find((c) => c.l === l)).word;
            return (
              <button key={l} className="lettertile" onClick={() => { speak(l, 'mr'); nav('/letter/' + l); }}>
                {l}<small>{w ? WORDS[w].e : ''}</small>
              </button>
            );
          })}
        </div>
      </div>
      {g.hand}
    </>
  );
}

export function LetterExplorer({ letter }) {
  const vowel = VOWELS.find((v) => v.l === letter);
  const cons = CONSONANTS.find((c) => c.l === letter);
  const words = wordsFor(letter);
  const main = (vowel || cons || {}).word;
  const intro = (vowel ? `ये है स्वर ${vowel.say}।` : `ये है अक्षर ${letter}।`) + (main ? ` जैसे ${main} — मतलब ${WORDS[main].hi}।` : '') + ' अक्षर को दबाओ और मेरे साथ बोलो!';
  const [tapped, setTapped] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const g = useGuide(null, [{ sel: '.giant', act: 'tap' }, { sel: '.wordcard', act: 'tap' }, { sel: '.card .bigbtn.green', act: 'hover' }], [letter]);
  const say = async () => { await heroSay(intro); await speak(letter, 'mr'); };
  useEffect(() => { const t = setTimeout(say, 300); setTapped(0); setQuiz(null); return () => clearTimeout(t); }, [letter]);

  // Mini activity: tap the big letter 3 times (say it with me), then pick it from look-alikes.
  const look = lookalikeOf(letter);
  const startQuiz = () => {
    const pool = [letter, ...(look.length ? look : []), ...['क', 'म', 'स', 'र'].filter((x) => x !== letter)].slice(0, 3);
    setQuiz({ opts: pool.sort(() => Math.random() - 0.5), res: null });
    heroSay(`अब ${letter} को ढूँढो!`).then(() => speak(letter, 'mr'));
  };
  const pick = (o) => {
    if (o === letter) { beep('ok'); addStars(1); setQuiz({ ...quiz, res: 'ok' }); heroSay('शाबाश! एक तारा मिला!'); }
    else { beep('bad'); setQuiz({ ...quiz, res: o }); heroSay('ये दूसरा अक्षर है। बड़े अक्षर को फिर देखो!'); }
  };

  return (
    <>
      <TopBar back={vowel ? '/letters/swar' : '/letters/vyanjan'} onRepeat={say} />
      <div className="main explorer">
        <div className="card" style={{ textAlign: 'center' }}>
          <button className="giant bob" lang="mr" style={{ background: 'none', width: '100%' }}
            onClick={() => { speak(letter, 'mr'); setTapped((t) => t + 1); }} aria-label="अक्षर सुनो">{letter}</button>
          <div className="row">
            <button className="speakbig" onClick={() => speak(letter, 'mr')} aria-label="सुनो">🔊</button>
            <div style={{ fontSize: 34 }}>👆🗣️ {'⭐'.repeat(Math.min(tapped, 3))}</div>
          </div>
          {look.length > 0 && <button style={{ fontSize: 22, background: '#fff1c9', borderRadius: 14, padding: '4px 14px' }} onClick={() => heroSay(`ध्यान दो! ${letter} और ${look.join(' और ')} एक जैसे दिखते हैं, पर अलग हैं।`)}>👀 <span className="mr" lang="mr" style={{ fontSize: 40 }}>{letter}</span> ≠ <span className="mr" lang="mr" style={{ fontSize: 40, color: '#c2305f' }}>{look.join(' ')}</span> 🔊</button>}
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {words.slice(0, 3).map((w) => (
            <button key={w.w} className="wordcard" onClick={() => speak(w.w, 'mr').then(() => speak('मतलब ' + w.hi, 'hi'))}>
              <span className="pic">{w.e}</span>
              <span><span className="w" lang="mr">{w.w}</span> 🔊</span>
            </button>
          ))}
          {cons && (
            <div className="card">
              <div style={{ fontSize: 30, marginBottom: 6 }}>🏡</div>
              <div className="strip" lang="mr">
                {barakhadi(letter).slice(0, 11).map((s) => <button key={s} className="syl" onClick={() => speak(s, 'mr')}>{s}</button>)}
              </div>
              <div className="row" style={{ marginTop: 10 }}><button className="bigbtn purple small" onClick={() => nav('/barakhadi/' + letter)}>🏡 ▶</button></div>
            </div>
          )}
          <div className="card" style={{ textAlign: 'center' }}>
            {!quiz && <button className="bigbtn green" onClick={startQuiz}>🎯 ▶</button>}
            {quiz && (
              <>
                <div style={{ fontSize: 30 }}>👂 <button className="iconbtn" style={{ display: 'inline-grid' }} onClick={() => speak(letter, 'mr')}>🔊</button></div>
                <div className="options" style={{ gridTemplateColumns: 'repeat(3,1fr)' }} lang="mr">
                  {quiz.opts.map((o) => (
                    <button key={o} className={'opt ' + (quiz.res === 'ok' && o === letter ? 'right' : quiz.res === o ? 'wrong' : '')} style={{ minHeight: 100, fontSize: 60 }} onClick={() => pick(o)}>{o}</button>
                  ))}
                </div>
                {quiz.res === 'ok' && <Feedback text="शाबाश! ⭐ +1"><div className="row"><button className="bigbtn small" onClick={startQuiz}>🔁</button><button className="bigbtn small green" onClick={() => nav('/game/g1')}>▶</button></div></Feedback>}
                {quiz.res && quiz.res !== 'ok' && <Feedback kind="try" text="" />}
              </>
            )}
          </div>
        </div>
      </div>
      {g.hand}
    </>
  );
}

export function Barakhadi({ letter }) {
  const [c, setC] = useState(CONSONANTS.find((x) => x.l === letter) ? letter : 'क');
  const [mi, setMi] = useState(0);
  const syl = c + MATRAS[mi].m;
  const w = Object.entries(WORDS).find(([, d]) => d.first === syl || d.first === syl + 'ं');
  const g = useGuide('ऊपर से अक्षर चुनो, फिर नीचे मात्रा दबाओ। देखो अक्षर कैसे बदलता है!', [{ sel: '.strip .syl:nth-child(3)', act: 'tap' }, { sel: '.matra-strip .syl:nth-child(2)', act: 'tap' }, { sel: '.matra-strip .syl:nth-child(3)', act: 'tap' }]);
  const choose = (i) => { setMi(i); speak(c + MATRAS[i].m, 'mr').then(() => speak(MATRAS[i].v + ' की आवाज़', 'hi')); };
  return (
    <>
      <TopBar back="/map" onRepeat={g.replay} />
      <div className="main">
        
        <div className="strip" lang="mr" style={{ marginBottom: 12 }}>
          {['क', 'ख', 'ग', 'च', 'ज', 'ट', 'त', 'द', 'न', 'प', 'ब', 'भ', 'म', 'र', 'ल', 'स', 'ह'].map((x) => (
            <button key={x} className={'syl ' + (x === c ? 'on' : '')} onClick={() => { setC(x); speak(x + MATRAS[mi].m, 'mr'); }}>{x}</button>
          ))}
        </div>
        <div className="explorer">
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="row" style={{ fontSize: 60 }} lang="mr">
              <span className="mr">{c}</span><span>+</span><span className="mr" style={{ color: 'var(--pink)' }}>{MATRAS[mi].m ? '◌' + MATRAS[mi].m : '∅'}</span><span>=</span>
            </div>
            <button className="giant" lang="mr" style={{ background: 'none', width: '100%' }} onClick={() => speak(syl, 'mr')}>{syl}</button>
            {w && <button className="wordcard" onClick={() => speak(w[0], 'mr')}><span className="pic">{w[1].e}</span><span><span className="w" lang="mr">{w[0]}</span> 🔊</span></button>}
          </div>
          <div className="card">
            <div style={{ fontSize: 30, marginBottom: 8 }}>✨👇</div>
            <div className="strip matra-strip" lang="mr">
              {MATRAS.map((m, i) => (
                <button key={i} className={'syl ' + (i === mi ? 'on' : '')} onClick={() => choose(i)}>{c + m.m}</button>
              ))}
            </div>
            <button style={{ fontSize: 26, background: '#fff1c9', borderRadius: 12, padding: '4px 14px', margin: '10px auto', display: 'block' }} onClick={() => heroSay('ये मात्रा बाईं तरफ़ लिखते हैं, पर आवाज़ बाद में आती है। क, इ — कि!').then(() => speak('कि', 'mr'))}>💡 <span className="mr" lang="mr">ि + क = कि</span> 🔊</button>
            <div className="row"><button className="bigbtn green small" onClick={() => nav('/place')}>✋ ▶</button><button className="bigbtn small" onClick={() => nav('/game/g2?m=1')}>🎯 ▶</button></div>
          </div>
        </div>
      </div>
      {g.hand}
    </>
  );
}
