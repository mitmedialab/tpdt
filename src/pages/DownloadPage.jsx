// src/pages/DownloadPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DownloadPage.module.css';
import '../App.css';

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
            src="/images/logo.png"
            alt="Technology Policy Design Toolkit"
            className={styles.logoImage}
          />
        </div>

        {/* Intro Section with Link */}
        <div className={styles.sectionZone}>
          <p>
            Try out different policy toolkits for different emerging AI technologies. You can find the protocol here{' '}
            <a
              href="https://example.com/guide"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.textLink}
            >
              [Link]
            </a>.
          </p>
        </div>

        {/* 2×2 Grid with Title + 2 Boxes (each with 2 buttons) */}
        <div className={styles.sectionZone}>
          <h2 className={styles.sectionTitle}>Download</h2>

          <div className={styles.downloadGrid}>
            {/* Grid Item 1 */}
            <div>
              <h3>Social Robots</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="/pdfs/rules.pdf" download className={styles.downloadButton}>Download PDF</a>
                <a
                  href="https://docs.google.com/presentation/d/SLIDE_ID_1"
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
                <a href="/pdfs/scenario.pdf" download className={styles.downloadButton}>Download PDF</a>
                <a
                  href="https://docs.google.com/presentation/d/SLIDE_ID_2"
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
                <a href="/pdfs/another.pdf" download className={styles.downloadButton}>Download PDF</a>
                <a
                  href="https://docs.google.com/presentation/d/SLIDE_ID_3"
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
              <h3>Blank Template</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="/pdfs/fourth.pdf" download className={styles.downloadButton}>Download PDF</a>
                <a
                  href="https://docs.google.com/presentation/d/SLIDE_ID_4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadButton}
                >
                  View Slides
                </a>
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
