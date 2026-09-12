import { useEffect, useState, useRef } from 'react'
import './Loader.css'

const CRITICAL_IMAGES = [
  '/bg1.webp',
  '/user.webp',
  '/stamp.webp',
]

export default function Loader({ onLoaded, isSplineReady = false }) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isMounted, setIsMounted] = useState(true)

  const progressRef = useRef(0)
  const targetProgressRef = useRef(20)
  const isSplineReadyRef = useRef(isSplineReady)

  useEffect(() => {
    isSplineReadyRef.current = isSplineReady
    if (isSplineReady) {
      targetProgressRef.current = 100
    }
  }, [isSplineReady])

  useEffect(() => {
    const initialFallback = document.getElementById('initial-loader')
    if (initialFallback) {
      initialFallback.style.opacity = '0'
      setTimeout(() => {
        if (initialFallback && initialFallback.parentNode) {
          initialFallback.parentNode.removeChild(initialFallback)
        }
      }, 300)
    }

    const preventScroll = (e) => e.preventDefault()
    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })

    let isCancelled = false
    let assetsLoaded = 0
    const totalAssets = CRITICAL_IMAGES.length + 2

    const checkAssetIncrement = () => {
      assetsLoaded += 1
      const calculated = Math.min(95, Math.round((assetsLoaded / totalAssets) * 94))
      if (calculated > targetProgressRef.current) {
        targetProgressRef.current = calculated
      }
    }

    CRITICAL_IMAGES.forEach((src) => {
      const img = new Image()
      img.src = src
      if (img.complete) {
        checkAssetIncrement()
      } else {
        img.onload = () => { if (!isCancelled) checkAssetIncrement() }
        img.onerror = () => { if (!isCancelled) checkAssetIncrement() }
      }
    })

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => { if (!isCancelled) checkAssetIncrement() })
        .catch(() => { if (!isCancelled) checkAssetIncrement() })
    } else {
      checkAssetIncrement()
    }

    if (document.readyState === 'complete') {
      checkAssetIncrement()
    } else {
      window.addEventListener('load', () => { if (!isCancelled) checkAssetIncrement() }, { once: true })
    }

    const startTime = Date.now()
    const MIN_LOAD_TIME = 600
    const MAX_LOAD_TIME = 2200

    const updateInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const timeRatio = Math.min(1, elapsed / MIN_LOAD_TIME)
      const artificialBaseline = Math.round(timeRatio * 90)
      
      let currentTarget = Math.max(targetProgressRef.current, artificialBaseline)

      if (isSplineReadyRef.current) {
        currentTarget = 100
      }

      if (progressRef.current < currentTarget) {
        const step = Math.max(1, Math.ceil((currentTarget - progressRef.current) * 0.22))
        progressRef.current = Math.min(currentTarget, progressRef.current + step)
      }

      if (elapsed >= MIN_LOAD_TIME && assetsLoaded >= totalAssets - 1) {
        targetProgressRef.current = 100
        progressRef.current = 100
      }

      if (elapsed >= MAX_LOAD_TIME) {
        targetProgressRef.current = 100
        progressRef.current = 100
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
        }, 200)
      }
    }, 25)

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
