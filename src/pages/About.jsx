// src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './About.module.css';
import '../App.css'; 

import slide1 from '../assets/About/slide1.jpg';
import slide2 from '../assets/About/slide2.jpg';
import slide3 from '../assets/About/slide3.jpg';
import slide4 from '../assets/About/slide4.jpg';
import logo from '../assets/logo.png';

const images = [slide1, slide2, slide3, slide4];

export default function About() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setCurrent(c => (c + 1) % images.length);
    }, 2000);
    return () => clearInterval(iv);
  }, [images.length]);

  return (
    <div className={styles.pageOverlay}>
      <div className={styles.aboutPage}>

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
        {/* Logo at top */}
        <div className={styles.logoContainer}>
          <img
  src={logo}
  alt="Technology Policy Design Toolkit"
  className="siteLogo"
/>
        </div>

        {/* Intro Text as one panel with two paragraphs */}
<div className={styles.sectionZone}>
  <p>
    The Technology Policy Design Toolkit is a methodology for exploring legal policies for emerging technologies. The project began in 2021 with the Robot Policy Design Toolkit, which focused on creating technology policy for social robots. Since then, the toolkit has been adapted for other emerging AI technologies and has been implemented in 1:1 research and community workshops, from kids to older adults to technologists to policymakers.
  </p>
  <p>
    The toolkit is designed to mimic policy processes, first focusing on key issue areas, then making priorities, and finally compromising with other viewpoints. Building on established principles in design research, the toolkit is designed in a simple way to allow a wide range of participation.
  </p>
</div>

        {/* Image carousel */}
        <div className={styles.gifZone}>
          <img
  src={images[current]}
  alt={`Slide ${current + 1}`}
  className={styles.carouselImage}
/>
          <div className={styles.carouselCredit}>
           Photo credit: [Photographer Name]
         </div>
        </div>

        {/* About Credits */}
        <div className={styles.sectionZone}>
          <h2 className={styles.sectionTitle}>About</h2>
          <div className={styles.textBlock}>
            <p>
  This project was developed by{" "}
  <a
    href="https://www.akostrowski.com/"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "#3ea1d0" }} 
  >
    Professor Anastasia Kouvaras Ostrowski (Purdue University)
  </a>{" "}
  and{" "}
  <a
    href="https://danielladipaola.com/"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "#3ea1d0" }} 
  >
    PhD Student Daniella DiPaola (MIT)
  </a> while both were students in the Personal Robots Group at the MIT Media Lab. They continue to develop this project as part of ongoing research.
</p>
            <p>
              We’d like to thank Cynthia Breazeal, Kate Darling, Rylie Spiegel, Zeynep Yalcin, and Zandra Feland for all of their help on this project. This work was generously sponsored by the Harold Horowitz Student Research Fund @ MIT.

            </p>
          </div>
        </div>

        {/* Publications */}
        <div className={styles.sectionZone}>
          <h2 className={styles.sectionTitle}>Relevant Research Publications</h2>
          <div className={styles.textBlock}>
            <p>
              DiPaola, D., Ostrowski, A. K., Spiegel, R., Darling, K., & Breazeal, C. (2022, March). Children's perspectives of advertising with social robots: A policy investigation. In 2022 17th ACM/IEEE International Conference on Human-Robot Interaction (HRI) (pp. 570-576). IEEE.{' '}
              <a
                href="https://ieeexplore.ieee.org/document/9889572"
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                [Link]
              </a>
              <br/>
              
            </p>
          </div>
        </div>

        {/* Footer Credit */}
    <div className={styles.footerCredit}>
      Created by Fouz Morished
    </div>

      </div>
    </div>
    
  );
}


