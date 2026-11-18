import React from 'react';
import { Hero, Mithu, TopBar, nav, useInstruction, useModel } from '../components/ui.jsx';
import { speak } from '../lib/audio.js';

export const ZONES = [
  { id: 'swar', name: 'स्वर पर्वत', emo: '⛰️', bg: '#7b5cff', to: '/letters/swar', say: 'स्वर पर्वत — अ, आ, इ, ई सीखो' },
  { id: 'vyanjan', name: 'व्यंजन जंगल', emo: '🌳', bg: '#2e9d57', to: '/letters/vyanjan', say: 'व्यंजन जंगल — क, ख, ग सीखो' },
  { id: 'g1', name: 'सुनो और पहचानो', emo: '👂', bg: '#ff8a00', to: '/game/g1', say: 'सुनो और सही अक्षर पहचानो' },
  { id: 'g2', name: 'सही अक्षर चुनो', emo: '🎯', bg: '#ff5d8f', to: '/game/g2', say: 'चित्र देखो, सही अक्षर चुनो' },
  { id: 'g3', name: 'जुड़वाँ अक्षर खोजो', emo: '🔍', bg: '#0fa3b1', to: '/game/g3', say: 'एक जैसा दिखने वाला अक्षर खोजो' },
  { id: 'g4', name: 'अक्षर-चित्र मिलाओ', emo: '🧩', bg: '#e85d04', to: '/match', say: 'अक्षर और चित्र की जोड़ी बनाओ' },
  { id: 'g5', name: 'बाराखड़ी गाँव', emo: '🏡', bg: '#9d4edd', to: '/barakhadi/क', say: 'बाराखड़ी गाँव — मात्रा लगाओ, नया अक्षर बनाओ' },
  { id: 'g6', name: 'मात्रा मैदान', emo: '✋', bg: '#3a86ff', to: '/place', say: 'सही मात्रा खींचकर रखो' },
  { id: 'g7', name: 'अक्षर भूलभुलैया', emo: '🗝️', bg: '#d62828', to: '/maze', say: 'भूलभुलैया में सही अक्षर पर चलो, खज़ाना पाओ' },
  { id: 'g8', name: 'मेरी आवाज़', emo: '🎤', bg: '#c2305f', to: '/speak', say: 'बोलकर पढ़ो, मैं सुनूँगा' },
];

export function Home() {
  useInstruction('नमस्ते अक्षरवीर! चलो मराठी अक्षरों का मिशन शुरू करें। बड़ा बटन दबाओ!');
  return (
    <>
      <TopBar onRepeat={() => speak('नमस्ते अक्षरवीर! चलो मराठी अक्षरों का मिशन शुरू करें। बड़ा बटन दबाओ!')} />
      <div className="main hero">
        <div className="logo">मिशन मराठी<br /><span>अक्षरवीर!</span></div>
        <div className="row">
          <div className="bob"><Hero size={170} /></div>
          <div className="bubble">नमस्ते! मैं अक्षरवीर।<br /><span className="mr" lang="mr">क ख ग</span> सीखने चलें? <Mithu size={46} /></div>
        </div>
        <button className="bigbtn green playbtn" onClick={() => nav('/map')} aria-label="खेलो">▶ खेलो</button>
        <div className="row" style={{ marginTop: 10 }}>
          <button className="bigbtn white small" onClick={() => nav('/letters/vyanjan')}>🔤 अक्षर</button>
          <button className="bigbtn white small" onClick={() => nav('/speak')}>🎤 बोलो</button>
          <button className="bigbtn white small" onClick={() => nav('/about')}>ℹ️</button>
        </div>
      </div>
    </>
  );
}

export function MapScreen() {
  const m = useModel();
  useInstruction('कोई भी जगह चुनो! सब खुली हैं।');
  const played = Object.keys(m.games).length;
  return (
    <>
      <TopBar onRepeat={() => speak('कोई भी जगह चुनो! सब खुली हैं।')} />
      <div className="main">
        <div className="title">🗺️ अक्षर यात्रा</div>
        <div className="row" style={{ marginBottom: 10 }}>
          <span style={{ fontWeight: 800 }}>🏆 {played}/{ZONES.length}</span>
          <div className="progressbar" style={{ flex: 1, maxWidth: 400 }}><div style={{ width: (played / ZONES.length) * 100 + '%' }} /></div>
        </div>
        <div className="map">
          <div className="zones">
            {ZONES.map((z) => (
              <button key={z.id} className="zone" style={{ background: z.bg }} onClick={() => { speak(z.say); nav(z.to); }}>
                <span className="open">🔓</span>
                <span className="emo">{z.emo}</span>
                {z.name}
                <span className="stars">{m.games[z.id] ? '⭐'.repeat(Math.min(3, m.games[z.id].best)) : '☆☆☆'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
