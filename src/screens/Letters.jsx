import React, { useEffect, useState } from 'react';
import { TopBar, nav, useInstruction, Feedback } from '../components/ui.jsx';
import { VOWELS, CONSONANTS, MATRAS, WORDS, wordsFor, barakhadi, lookalikeOf } from '../data/marathi.js';
import { speak, beep } from '../lib/audio.js';
import { addStars } from '../lib/model.js';

export function LetterList({ kind }) {
  const list = kind === 'swar' ? VOWELS.map((v) => v.l) : CONSONANTS.map((c) => c.l);
  useInstruction(kind === 'swar' ? 'ये स्वर हैं। किसी भी अक्षर पर टैप करो।' : 'ये व्यंजन हैं। किसी भी अक्षर पर टैप करो।', [kind]);
  return (
    <>
      <TopBar back="/map" onRepeat={() => speak('किसी भी अक्षर पर टैप करो।')} />
      <div className="main">
        <div className="tabs">
          <button className={'tab ' + (kind === 'swar' ? 'on' : '')} onClick={() => nav('/letters/swar')}>⛰️ स्वर <span className="mr" lang="mr">अ आ</span></button>
          <button className={'tab ' + (kind === 'vyanjan' ? 'on' : '')} onClick={() => nav('/letters/vyanjan')}>🌳 व्यंजन <span className="mr" lang="mr">क ख</span></button>
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
    </>
  );
}

export function LetterExplorer({ letter }) {
  const vowel = VOWELS.find((v) => v.l === letter);
  const cons = CONSONANTS.find((c) => c.l === letter);
  const words = wordsFor(letter);
  const main = (vowel || cons || {}).word;
  const intro = vowel ? `ये है स्वर ${vowel.say}. सुनो!` : `ये है अक्षर ${letter}. इसकी आवाज़ सुनो!`;
  const [tapped, setTapped] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const say = async () => { await speak(intro, 'hi'); await speak(letter, 'mr'); };
  useEffect(() => { const t = setTimeout(say, 300); setTapped(0); setQuiz(null); return () => clearTimeout(t); }, [letter]);

  // Mini activity: tap the big letter 3 times (say it with me), then pick it from look-alikes.
  const look = lookalikeOf(letter);
  const startQuiz = () => {
    const pool = [letter, ...(look.length ? look : []), ...['क', 'म', 'स', 'र'].filter((x) => x !== letter)].slice(0, 3);
    setQuiz({ opts: pool.sort(() => Math.random() - 0.5), res: null });
    speak(`अब ${letter} को ढूँढो!`, 'hi').then(() => speak(letter, 'mr'));
  };
  const pick = (o) => {
    if (o === letter) { beep('ok'); addStars(1); setQuiz({ ...quiz, res: 'ok' }); speak('शाबाश! एक तारा मिला!'); }
    else { beep('bad'); setQuiz({ ...quiz, res: o }); speak('ध्यान से देखो, फिर कोशिश करो!'); }
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
            <div style={{ fontSize: 22, fontWeight: 800 }}>👆 टैप करो, साथ में बोलो! {'🟣'.repeat(Math.min(tapped, 3))}</div>
          </div>
          <p style={{ fontSize: 20 }}>{vowel ? vowel.hi : `"${letter}" — ${cons.g} का अक्षर`}</p>
          {look.length > 0 && <p style={{ fontSize: 18, background: '#fff1c9', borderRadius: 14, padding: 8 }}>👀 ध्यान दो: <span className="mr" lang="mr" style={{ fontSize: 30 }}>{letter}</span> और <span className="mr" lang="mr" style={{ fontSize: 30 }}>{look.join(', ')}</span> एक जैसे दिखते हैं!</p>}
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {words.length === 0 && main === null && <div className="card">🖼️ इस अक्षर से शुरू होने वाला आसान शब्द कम मिलता है — बाराखड़ी देखो!</div>}
          {words.slice(0, 3).map((w) => (
            <button key={w.w} className="wordcard" onClick={() => speak(w.w, 'mr')}>
              <span className="pic">{w.e}</span>
              <span><span className="w" lang="mr">{w.w}</span><br /><span className="h">हिंदी में: {w.hi} 🔊</span></span>
            </button>
          ))}
          {cons && (
            <div className="card">
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>🏡 बाराखड़ी — मात्रा लगाओ:</div>
              <div className="strip" lang="mr">
                {barakhadi(letter).slice(0, 11).map((s) => <button key={s} className="syl" onClick={() => speak(s, 'mr')}>{s}</button>)}
              </div>
              <div className="row" style={{ marginTop: 10 }}><button className="bigbtn purple small" onClick={() => nav('/barakhadi/' + letter)}>🏡 बाराखड़ी खेलो</button></div>
            </div>
          )}
          <div className="card" style={{ textAlign: 'center' }}>
            {!quiz && <button className="bigbtn green" onClick={startQuiz}>🎯 अभ्यास करो</button>}
            {quiz && (
              <>
                <div style={{ fontSize: 22, fontWeight: 800 }}>👂 <span className="mr" lang="mr">{letter}</span> कौन-सा है? <button className="iconbtn" style={{ display: 'inline-grid' }} onClick={() => speak(letter, 'mr')}>🔊</button></div>
                <div className="options" style={{ gridTemplateColumns: 'repeat(3,1fr)' }} lang="mr">
                  {quiz.opts.map((o) => (
                    <button key={o} className={'opt ' + (quiz.res === 'ok' && o === letter ? 'right' : quiz.res === o ? 'wrong' : '')} style={{ minHeight: 100, fontSize: 60 }} onClick={() => pick(o)}>{o}</button>
                  ))}
                </div>
                {quiz.res === 'ok' && <Feedback text="शाबाश! ⭐ +1"><div className="row"><button className="bigbtn small" onClick={startQuiz}>🔁 फिर से</button><button className="bigbtn small green" onClick={() => nav('/game/g1')}>▶ खेल</button></div></Feedback>}
                {quiz.res && quiz.res !== 'ok' && <Feedback kind="try" text="ये दूसरा अक्षर है। बड़े अक्षर को फिर देखो!" />}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function Barakhadi({ letter }) {
  const [c, setC] = useState(CONSONANTS.find((x) => x.l === letter) ? letter : 'क');
  const [mi, setMi] = useState(0);
  const syl = c + MATRAS[mi].m;
  const w = Object.entries(WORDS).find(([, d]) => d.first === syl || d.first === syl + 'ं');
  useInstruction('पहले अक्षर चुनो, फिर मात्रा पर टैप करो। देखो अक्षर कैसे बदलता है!');
  const choose = (i) => { setMi(i); speak(c + MATRAS[i].m, 'mr'); };
  return (
    <>
      <TopBar back="/map" onRepeat={() => speak('पहले अक्षर चुनो, फिर मात्रा पर टैप करो।')} />
      <div className="main">
        <div className="title">🏡 बाराखड़ी गाँव</div>
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
            <p style={{ fontSize: 20, fontWeight: 700 }}>🔊 "{MATRAS[mi].v}" की आवाज़ — {MATRAS[mi].hi}</p>
            {w && <button className="wordcard" onClick={() => speak(w[0], 'mr')}><span className="pic">{w[1].e}</span><span><span className="w" lang="mr">{w[0]}</span><br /><span className="h">{w[1].hi}</span></span></button>}
          </div>
          <div className="card">
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>✨ मात्रा चुनो:</div>
            <div className="strip" lang="mr">
              {MATRAS.map((m, i) => (
                <button key={i} className={'syl ' + (i === mi ? 'on' : '')} onClick={() => choose(i)}>{c + m.m}</button>
              ))}
            </div>
            <p style={{ fontSize: 18, background: '#fff1c9', borderRadius: 12, padding: 8 }}>💡 <span className="mr" lang="mr">ि</span> बाईं तरफ़ लिखते हैं पर आवाज़ <b>बाद में</b> आती है: <span className="mr" lang="mr">कि</span> = क + इ</p>
            <div className="row"><button className="bigbtn green small" onClick={() => nav('/place')}>✋ अब मात्रा रखो</button><button className="bigbtn small" onClick={() => nav('/game/g2?m=1')}>🎯 पहचानो</button></div>
          </div>
        </div>
      </div>
    </>
  );
}
