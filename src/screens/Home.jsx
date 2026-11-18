import React from 'react';
import { Mithu, TopBar, nav, useGuide, useModel } from '../components/ui.jsx';
import { speak } from '../lib/audio.js';

// Zones: no written names — a big picture + a spoken Hindi name when tapped.
export const ZONES = [
  { id: 'swar', emo: '⛰️', mr: 'अ आ', bg: '#7b5cff', to: '/letters/swar', say: 'स्वर पर्वत! चलो अ, आ, इ सीखें।' },
  { id: 'vyanjan', emo: '🌴', mr: 'क ख', bg: '#2e9d57', to: '/letters/vyanjan', say: 'व्यंजन जंगल! चलो क, ख, ग सीखें।' },
  { id: 'g1', emo: '👂', mr: '', bg: '#0fa3b1', to: '/game/g1', say: 'सुनो और पहचानो!' },
  { id: 'g2', emo: '🎯', mr: '', bg: '#ff5d8f', to: '/game/g2', say: 'चित्र देखो, सही अक्षर चुनो!' },
  { id: 'g3', emo: '🔍', mr: '', bg: '#ff8a00', to: '/game/g3', say: 'जुड़वाँ अक्षर खोजो!' },
  { id: 'g4', emo: '🧩', mr: '', bg: '#e85d04', to: '/match', say: 'अक्षर और चित्र की जोड़ी बनाओ!' },
  { id: 'g5', emo: '🏡', mr: 'का कि', bg: '#9d4edd', to: '/barakhadi/क', say: 'बाराखड़ी गाँव! मात्रा लगाओ, नया अक्षर बनाओ।' },
  { id: 'g6', emo: '✋', mr: 'ा ि', bg: '#3a86ff', to: '/place', say: 'मात्रा मैदान! मात्रा खींचकर रखो।' },
  { id: 'g7', emo: '🗝️', mr: '', bg: '#d62828', to: '/maze', say: 'भूलभुलैया! खज़ाना ढूँढो।' },
  { id: 'g8', emo: '🎤', mr: '', bg: '#c2305f', to: '/speak', say: 'आवाज़ गुफा! बोलकर पढ़ो।' },
];

const HOME_LINE = 'नमस्ते! मैं अक्षरवीर! चलो, मराठी सीखने चलें? हरा बटन दबाओ!';

export function Home() {
  const g = useGuide(HOME_LINE, [{ sel: '.playbtn', act: 'tap' }]);
  return (
    <>
      <TopBar onRepeat={g.replay} />
      <div className="main hero">
        <div className="logo" aria-label="मिशन मराठी अक्षरवीर">मिशन मराठी<br /><span>अक्षरवीर!</span></div>
        <div className="row bob" style={{ fontSize: 70 }} lang="mr"><span className="mr">क</span><Mithu size={90} /><span className="mr">अ</span></div>
        <button className="bigbtn green playbtn" onClick={() => { speak('चलो!'); nav('/map'); }} aria-label="खेलो">▶</button>
        <div className="row" style={{ marginTop: 10 }}>
          <button className="bigbtn white small" aria-label="अक्षर" onClick={() => nav('/letters/vyanjan')}><span className="mr" lang="mr">क</span></button>
          <button className="bigbtn white small" aria-label="बोलो" onClick={() => nav('/speak')}>🎤</button>
          <button className="bigbtn white small" aria-label="जानकारी" style={{ opacity: .6 }} onClick={() => nav('/about')}>ℹ️</button>
        </div>
      </div>
      {g.hand}
    </>
  );
}

export function MapScreen() {
  const m = useModel();
  const g = useGuide('कोई भी तस्वीर दबाओ! सब खुली हैं।', [{ sel: '.zone:nth-child(2)', act: 'tap' }, { sel: '.zone:nth-child(4)', act: 'hover' }, { sel: '.zone:nth-child(10)', act: 'hover' }]);
  const played = Object.keys(m.games).length;
  return (
    <>
      <TopBar onRepeat={g.replay} />
      <div className="main">
        <div className="row" style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 34 }}>🏆</span>
          <div className="progressbar" style={{ flex: 1, maxWidth: 400 }}><div style={{ width: (played / ZONES.length) * 100 + '%' }} /></div>
        </div>
        <div className="map">
          <div className="zones">
            {ZONES.map((z) => (
              <button key={z.id} className="zone" style={{ background: z.bg }} aria-label={z.say} onClick={() => { speak(z.say); nav(z.to); }}>
                <span className="emo">{z.emo}</span>
                {z.mr && <span className="badge-l" lang="mr">{z.mr}</span>}
                <span className="stars">{m.games[z.id] ? '⭐'.repeat(Math.min(3, m.games[z.id].best)) : '☆☆☆'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {g.hand}
    </>
  );
}
