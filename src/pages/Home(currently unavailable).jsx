import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import '../App.css'; 


export default function Home() {
  const navigate = useNavigate();
  const [csvUrl, setCsvUrl] = useState('');

  const decks = [
    { name: 'Social Robots', url: '/data/rulesForRobots.csv' },
    { name: 'Gen AI Tutor', url: '/data/genAITutor.csv' },
    { name: 'AI in K-12', url: '/data/AIPolicy.csv' },
    // …add more decks
  ];

  return (
    <div className={styles.pageOverlay}>

      {/* Fixed Header */}
      <header className={styles.fixedHeader}>
        <button
          className={styles.headerButton}
          onClick={() => navigate('/about')}
        >
          About
        </button>
        <button
          className={styles.headerButton}
          onClick={() => navigate('/home')}
        >
          Try the Toolkit
        </button>
        <button
          className={styles.headerButton}
          onClick={() => navigate('/download')}
        >
          Download Cards
        </button>
      </header>

      {/* Logo at top */}
      <div className={styles.logoContainer}>
        <img
          src="/images/logo.png"
          alt="Technology Policy Design Toolkit"
          className={styles.logoImage}
        />
      </div>

      {/* Main Content */}
      <div className={styles.homeContainer}>
        <h1 className={styles.title}>Select Your Technology</h1>

        <div className={styles.deckGrid}>
          {decks.map(d => (
            <button
              key={d.url}
              className={`${styles.deckButton} ${csvUrl === d.url ? styles.active : ''}`}
              onClick={() => setCsvUrl(d.url)}
            >
              {d.name}
            </button>
          ))}
        </div>

        <button
          className={styles.startButton}
          disabled={!csvUrl}
          onClick={() => navigate('/game', { state: { csvUrl } })}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
