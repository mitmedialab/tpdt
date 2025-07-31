// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Home  from './pages/Home';
import Game  from './pages/Game';
import Download   from './pages/DownloadPage';

export default function App() {
  return (
    <Routes>
      <Route path="/"       element={<About />} />
      <Route path="/about"  element={<About />} />
      <Route path="/home"   element={<Home />} />
      <Route path="/game"   element={<Game />} />
      <Route path="/download" element={<Download  />} />
    </Routes>
  );
}
