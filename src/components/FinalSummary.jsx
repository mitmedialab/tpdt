import React from 'react'
import html2canvas from 'html2canvas'
import { useNavigate } from 'react-router-dom'
import CardBox from './CardBox'
import styles from './FinalSummary.module.css'

function Section({ title, cards, threeCols }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div
        className={[
          styles.cardRow,
          threeCols ? styles.threeCols : ''
        ].join(' ')}
      >
        {cards.map(c => (
          <CardBox
            key={c.id}
            text={c.text}
            icon={c.icon}
          />
        ))}
      </div>
    </div>
  )
}

export default function FinalSummary({
  passedCards,
  rejectedCards,
  topThree,
  bottomThree,
  policyOne,
  policyTwo,
  rankPhaseRanks    
}) {
  const navigate = useNavigate()

  const labelMap = {
    policyOne: 'Policy One',
    policyTwo: 'Policy Two',
    noPolicy:  'No Policy'
  };
  const sortedKeys = Object.entries(rankPhaseRanks)
    .sort(([, a], [, b]) => a - b)    
    .map(([key]) => key);             

  const downloadSummary = () => {
    const el = document.getElementById('final-summary')
    if (!el) return

    el.classList.add(styles.hideButtons)

    html2canvas(el).then(canvas => {
      el.classList.remove(styles.hideButtons)
      canvas.toBlob(blob => {
        if (!blob) return
        const link = document.createElement('a')
        link.download = 'game-summary.png'
        link.href = URL.createObjectURL(blob)
        link.click()
      })
    })
  }

  return (
  <div id="final-summary" className={styles.container}>
    <h2 className={styles.header}>Final Summary</h2>

    {/* ─── Phase 1 ─────────────────────────── */}
    <div className={styles.summaryPhase}>
  <div className={styles.phaseIndicator}>Phase 1</div>
  <div className={styles.phaseSections}>
        <Section title="All Passed Cards" cards={passedCards} threeCols />
        <Section title="All Do Not Pass Cards" cards={rejectedCards} threeCols />
      </div>
    </div>

    {/* ─── Phase 2 ─────────────────────────── */}
    <div className={styles.summaryPhase}>
  <div className={styles.phaseIndicator}>Phase 2</div>
  <div className={styles.phaseSections}>
        <Section title="Top Three" cards={topThree} />
        <Section title="Bottom Three" cards={bottomThree} />
      </div>
    </div>

    {/* ─── Phase 3 ─────────────────────────── */}
    <div className={styles.summaryPhase}>
  <div className={styles.phaseIndicator}>Phase 3</div>
  <div className={styles.phaseSections}>
        <Section title="Policy 1" cards={policyOne} />
        <Section title="Policy 2" cards={policyTwo} />
      </div>
    </div>

    {/* ─── Phase 4 ─────────────────────────── */}
    <div className={styles.summaryPhase}>
  <div className={styles.phaseIndicator}>Phase 4</div>
  <div className={styles.phaseSections}>
        <h3 className={styles.sectionTitle}>Ranking</h3>
        <p className={styles.rankText}>
          <span className={styles.rankItem}>
            <strong>1st:</strong> {labelMap[sortedKeys[0]]}
          </span>
          <span className={styles.rankItem}>
            <strong>2nd:</strong> {labelMap[sortedKeys[1]]}
          </span>
          <span className={styles.rankItem}>
            <strong>3rd:</strong> {labelMap[sortedKeys[2]]}
          </span>
        </p>
      </div>
    </div>

      <div className={styles.buttonRow}>
        <button className={styles.button} onClick={downloadSummary}>
          Download Summary
        </button>
        <button className={styles.button} onClick={() => navigate('/')}>
          Home
        </button>
      </div>
    </div>
  )
}