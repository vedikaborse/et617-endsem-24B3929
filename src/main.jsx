import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { Footer, Scene, HeroGuide } from './components/ui.jsx';
import { Home, MapScreen } from './screens/Home.jsx';
import { LetterList, LetterExplorer, Barakhadi } from './screens/Letters.jsx';
import Game from './screens/Game.jsx';
import { Match, Place, Maze } from './screens/Play.jsx';
import Speak from './screens/Speak.jsx';
import { Reward, Teacher, About } from './screens/Other.jsx';

function useHash() {
  const [h, setH] = useState(window.location.hash.slice(1) || '/');
  useEffect(() => { const f = () => { setH(window.location.hash.slice(1) || '/'); window.scrollTo(0, 0); }; window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  return h;
}

function App() {
  const h = useHash();
  const [path, qs] = h.split('?');
  const query = new URLSearchParams(qs || '');
  const p = path.split('/').filter(Boolean).map(decodeURIComponent);
  let view;
  switch (p[0]) {
    case 'map': view = <MapScreen />; break;
    case 'letters': view = <LetterList kind={p[1] || 'vyanjan'} />; break;
    case 'letter': view = <LetterExplorer key={p[1]} letter={p[1]} />; break;
    case 'barakhadi': view = <Barakhadi key={p[1]} letter={p[1] || 'क'} />; break;
    case 'game': view = <Game key={h} game={p[1] || 'g1'} query={query} />; break;
    case 'match': view = <Match />; break;
    case 'place': view = <Place />; break;
    case 'maze': view = <Maze />; break;
    case 'speak': view = <Speak key={h} query={query} />; break;
    case 'reward': view = <Reward key={h} query={query} />; break;
    case 'teacher': view = <Teacher />; break;
    case 'about': view = <About />; break;
    default: view = <Home />;
  }
  const THEME = { '': 'sky', map: 'sky', letters: p[1] === 'swar' ? 'mountain' : 'jungle', letter: 'jungle', barakhadi: 'village', game: { g1: 'river', g2: 'fair', g3: 'fair' }[p[1]] || 'fair', match: 'field', place: 'field', maze: 'treasure', speak: 'cave', reward: 'sky', teacher: 'plain', about: 'plain' };
  const theme = THEME[p[0] || ''] || 'sky';
  const adult = p[0] === 'teacher' || p[0] === 'about';
  return <div className="app"><Scene theme={theme} />{view}{!adult && <HeroGuide />}<Footer /></div>;
}

createRoot(document.getElementById('root')).render(<App />);
