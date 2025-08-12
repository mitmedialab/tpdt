// src/pages/DownloadPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DownloadPage.module.css';
import '../App.css';

import logo from '../assets/logo.png';

export default function DownloadPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.pageOverlay}>
      <div className={styles.downloadBackground}>

        {/* Fixed Header */}
        <header className="fixedHeader">
          <button
            className="headerButton"
            onClick={() => navigate('/about')}
          >
            About
          </button>
          <button
            className="headerButton"
            onClick={() => navigate('/home')}
          >
            Try the Toolkit
          </button>
          <button
            className="headerButton"
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
  className={styles.logoImage}
/>
        </div>

        {/* Intro Section with Link */}
        <div className={styles.sectionZone}>
          <p>
            Try out different policy toolkits for different emerging AI technologies. You can find the protocol here{' '}
            <a
              href="https://drive.google.com/file/d/1pUm5umPMjFgHEHFsMUJGU1khNeKnAMDO/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.textLink}
            >
              [Link]
            </a>.
          </p>
        </div>

        {/* 2×2 Grid with Title + 2 Boxes (each with 2 links) */}
        <div className={styles.sectionZone}>
          <h2 className={styles.sectionTitle}>Explore Cards</h2>

          <div className={styles.downloadGrid}>
            {/* Grid Item 1 */}
            <div>
              <h3>Social Robots</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a
                  href="https://drive.google.com/file/d/1vl7HPx9fBfZIqAoIQKI72RMfmc4AWZ76/view?usp=drive_link"
                  className={styles.downloadButton}
                >
                  View PDF
                </a>
                <a
                  href="https://docs.google.com/presentation/d/1We-ejISYKldB4m3DUh41N50vgtd7iOTQzSOOokOyfto/edit?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadButton}
                >
                  View Slides
                </a>
              </div>
            </div>

            {/* Grid Item 2 */}
            <div>
              <h3>Gen AI Tutor</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a
                  href="https://drive.google.com/file/d/1G3_1R8r5DU3KtroODNigQ8Ns0PxPFG7W/view?usp=drive_link"
                  className={styles.downloadButton}
                >
                  View PDF
                </a>
                <a
                  href="https://docs.google.com/presentation/d/1lJTlyVRJWw0b2ZDFVbMkLPJGODVpBh_MyK6ZJsnFR70/edit?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadButton}
                >
                  View Slides
                </a>
              </div>
            </div>

            {/* Grid Item 3 */}
            <div>
              <h3>AI in K-12</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a
                  href="https://drive.google.com/file/d/1oS9IExMdiAXfkRR2h1nDv9r-kX4lebPq/view?usp=drive_link"
                  className={styles.downloadButton}
                >
                  View PDF
                </a>
                <a
                  href="https://docs.google.com/presentation/d/1lJTlyVRJWw0b2ZDFVbMkLPJGODVpBh_MyK6ZJsnFR70/edit?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadButton}
                >
                  View Slides
                </a>
              </div>
            </div>

            {/* Grid Item 4 */}
<div>
  <h3>Coming Soon!</h3>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <span className={styles.placeholderButton}>View PDF</span>
    <span className={styles.placeholderButton}>View Slides</span>
  </div>
</div>
          </div>
        </div>

        {/* New Text at End */}
        <p>
          Have you created your own set of these cards? Email us at{' '}
          <a
            href="mailto:tpdt@media.mit.edu"
            className={styles.textLink}
          >
            tpdt@media.mit.edu
          </a>{' '}
          and we can share them here.
        </p>

      </div>
    </div>
  );
}
