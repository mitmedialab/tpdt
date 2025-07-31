import React, { forwardRef, useRef, useLayoutEffect } from 'react'
import styles from './CardBox.module.css'

const MIN_FONT = 12   // px
const MAX_FONT = 24   // px
const STEP     = 0.5  // px

export default forwardRef(function CardBox(
  { text, icon, ...rest },
  ref
) {
  const visibleRef = useRef()
  const measureRef = useRef()

  useLayoutEffect(() => {
    const measureEl = measureRef.current
    const visibleEl = visibleRef.current
    const containerHeight = visibleEl.clientHeight

    // ensure measureEl has the same width as the visible <p>
    measureEl.style.width = `${visibleEl.clientWidth}px`

    // Try every font size from MAX down to MIN:
    for (let size = MAX_FONT; size >= MIN_FONT; size -= STEP) {
      measureEl.style.fontSize = `${size}px`
      // When the wrapped text's scrollHeight fits in the container, we're done
      if (measureEl.scrollHeight <= containerHeight) {
        visibleEl.style.fontSize = `${size}px`
        break
      }
    }
  }, [text])

  return (
    <div ref={ref} {...rest} className={styles.cardBox}>
      <span className={styles.icon}>
        <img src={`/images/icons/${icon}`} alt="" />
      </span>

      {/* visible text */}
      <p ref={visibleRef} className={styles.text}>
        {text}
      </p>

      {/* hidden mirror for measurement */}
      <p
        ref={measureRef}
        className={styles.text}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          top: 0,
          left: 0,
          height: 'auto',
          overflow: 'visible',
          pointerEvents: 'none'
        }}
      >
        {text}
      </p>
    </div>
  )
})
