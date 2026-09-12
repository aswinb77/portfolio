import { useEffect, useState, useRef } from 'react'
import './Loader.css'

const CRITICAL_IMAGES = [
  '/bg1.webp',
  '/user.webp',
  '/catlook.png',
  '/papercrane.png',
  '/telegram.webp',
]

export default function Loader({ onLoaded, isSplineReady = false }) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isMounted, setIsMounted] = useState(true)

  const progressRef = useRef(0)
  const targetProgressRef = useRef(15)
  const isSplineReadyRef = useRef(isSplineReady)

  useEffect(() => {
    isSplineReadyRef.current = isSplineReady
  }, [isSplineReady])

  useEffect(() => {
    const initialFallback = document.getElementById('initial-loader')
    if (initialFallback) {
      initialFallback.style.opacity = '0'
      setTimeout(() => {
        if (initialFallback && initialFallback.parentNode) {
          initialFallback.parentNode.removeChild(initialFallback)
        }
      }, 350)
    }

    const preventScroll = (e) => e.preventDefault()
    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })

    let isCancelled = false
    let imagesDecoded = 0
    let fontsReady = false
    let docReady = document.readyState === 'complete'
    const totalImages = CRITICAL_IMAGES.length

    const recalculateTarget = () => {
      if (isCancelled) return
      // Images contribute up to 55%
      const imagePct = (imagesDecoded / totalImages) * 55
      // Fonts contribute up to 20%
      const fontPct = fontsReady ? 20 : 0
      // Document complete contributes 10%
      const docPct = docReady ? 10 : 0

      let base = Math.min(85, Math.round(imagePct + fontPct + docPct))

      // If the hero element (mobile video or desktop Spline) is ready:
      if (isSplineReadyRef.current) {
        // If critical images and fonts are also in place, go to 100%
        if (imagesDecoded >= totalImages - 1 && fontsReady) {
          base = 100
        } else {
          base = Math.max(base, 90)
        }
      }

      if (base > targetProgressRef.current) {
        targetProgressRef.current = base
      }
    }

    // Preload & off-thread decode critical images so they don't stutter upon unmask
    CRITICAL_IMAGES.forEach((src) => {
      const img = new Image()
      img.src = src

      const onImageReady = () => {
        if (isCancelled) return
        if ('decode' in img) {
          img.decode()
            .then(() => {
              if (isCancelled) return
              imagesDecoded += 1
              recalculateTarget()
            })
            .catch(() => {
              if (isCancelled) return
              imagesDecoded += 1
              recalculateTarget()
            })
        } else {
          imagesDecoded += 1
          recalculateTarget()
        }
      }

      if (img.complete) {
        onImageReady()
      } else {
        img.onload = onImageReady
        img.onerror = () => {
          if (isCancelled) return
          imagesDecoded += 1
          recalculateTarget()
        }
      }
    })

    // Verify Google Fonts readiness
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          if (isCancelled) return
          fontsReady = true
          recalculateTarget()
        })
        .catch(() => {
          if (isCancelled) return
          fontsReady = true
          recalculateTarget()
        })
    } else {
      fontsReady = true
      recalculateTarget()
    }

    // Window loaded verification
    if (docReady) {
      recalculateTarget()
    } else {
      window.addEventListener(
        'load',
        () => {
          if (isCancelled) return
          docReady = true
          recalculateTarget()
        },
        { once: true }
      )
    }

    const startTime = Date.now()
    const MIN_LOAD_TIME = 450 // Ensure clean 0 -> 100 sweep even on instantaneous cached reload
    const MAX_LOAD_TIME = 6500 // Safety cap in case of severe network stalling

    const updateInterval = setInterval(() => {
      const elapsed = Date.now() - startTime

      // If Spline / mobile video becomes ready during interval:
      if (isSplineReadyRef.current && elapsed >= MIN_LOAD_TIME) {
        if (imagesDecoded >= totalImages - 1 && fontsReady) {
          targetProgressRef.current = 100
        } else {
          targetProgressRef.current = Math.max(targetProgressRef.current, 92)
        }
      }

      // Safety timeout: don't lock the user forever if network blocks fonts or 3D
      if (elapsed >= MAX_LOAD_TIME) {
        targetProgressRef.current = 100
      }

      if (progressRef.current < targetProgressRef.current) {
        const diff = targetProgressRef.current - progressRef.current
        const step = Math.max(1, Math.ceil(diff * 0.18))
        progressRef.current = Math.min(targetProgressRef.current, progressRef.current + step)
      }

      setProgress(progressRef.current)

      if (progressRef.current >= 100) {
        clearInterval(updateInterval)
        window.removeEventListener('wheel', preventScroll)
        window.removeEventListener('touchmove', preventScroll)
        setTimeout(() => {
          if (isCancelled) return
          setIsExiting(true)
          if (onLoaded) onLoaded()
          setTimeout(() => {
            if (!isCancelled) setIsMounted(false)
          }, 800)
        }, 150)
      }
    }, 20)

    return () => {
      isCancelled = true
      clearInterval(updateInterval)
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
    }
  }, [onLoaded])

  if (!isMounted) return null

  // Format as 3-digit string: 001, 042, 100
  const padded = String(progress).padStart(3, '0')

  return (
    <div
      className={`ldr ${isExiting ? 'ldr--exit' : ''}`}
      aria-label="Loading…"
      role="status"
    >
      {/* Pure dark canvas */}
      <div className="ldr__field" />

      {/* Scanning line that sweeps once then waits */}
      <div className="ldr__scanline" aria-hidden="true" />

      {/* Central minimal mark */}
      <div className="ldr__center" aria-hidden="true">
        {/* Cross-hair intersection */}
        <div className="ldr__cross">
          <div className="ldr__cross-h" />
          <div className="ldr__cross-v" />
        </div>

        {/* Morphing square that breathes */}
        <div className="ldr__square" />
      </div>

      {/* Name — faint, spaced, lowercase */}
      <div className="ldr__label-wrap">
        <span className="ldr__name">aswin biju</span>
      </div>

      {/* Bottom bar: progress line + counter */}
      <div className="ldr__foot">
        {/* Thin progress track */}
        <div className="ldr__track">
          <div
            className="ldr__fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Counter row */}
        <div className="ldr__count-row">
          <span className="ldr__role">portfolio</span>
          <span className="ldr__num">
            <span className="ldr__num-digit">{padded[0]}</span>
            <span className="ldr__num-digit">{padded[1]}</span>
            <span className="ldr__num-digit ldr__num-digit--active">{padded[2]}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
