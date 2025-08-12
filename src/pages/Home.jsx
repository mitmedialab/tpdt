import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import '../App.css';

import logo from '../assets/logo.png';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.pageOverlay}>

      {/* Fixed Header (unchanged) */}
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

      {/* Logo */}
      <div className={styles.logoContainer}>
        <img
          src={logo}
          alt="Technology Policy Design Toolkit"
          className="siteLogo"
        />
     </div>

      {/* Coming Soon Text */}
      <div className={styles.homeContainer}>
        <h1 className={styles.title}>Coming Soon!</h1>
      </div>
    </div>
  );
}
