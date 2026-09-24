import { useEffect, useState, useRef } from 'react'
import './Loader.css'

const CRITICAL_IMAGES = [
  '/bg1.webp',
  '/user.webp',
  '/catlook.png',
  '/papercrane.png',
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
    // Dismiss initial HTML static loader immediately once React takes control
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
    let imagesDecoded = 0
    let fontsReady = false
    let docReady = document.readyState === 'complete'
    const totalImages = CRITICAL_IMAGES.length

    const recalculateTarget = () => {
      if (isCancelled) return
      const imagePct = (imagesDecoded / totalImages) * 50
      const fontPct = fontsReady ? 25 : 0
      const docPct = docReady ? 15 : 0

      let base = Math.min(85, Math.round(imagePct + fontPct + docPct))

      if (isSplineReadyRef.current) {
        if (imagesDecoded >= totalImages - 1 && fontsReady) {
          base = 100
        } else {
          base = Math.max(base, 92)
        }
      }

      if (base > targetProgressRef.current) {
        targetProgressRef.current = base
      }
    }

    // Preload critical images
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

    // Check fonts
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

    // Window loaded
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
    const MIN_LOAD_TIME = 400
    const MAX_LOAD_TIME = 4500

    const updateInterval = setInterval(() => {
      const elapsed = Date.now() - startTime

      if (isSplineReadyRef.current && elapsed >= MIN_LOAD_TIME) {
        if (imagesDecoded >= totalImages - 1 && fontsReady) {
          targetProgressRef.current = 100
        } else {
          targetProgressRef.current = Math.max(targetProgressRef.current, 95)
        }
      }

      if (elapsed >= MAX_LOAD_TIME) {
        targetProgressRef.current = 100
      }

      if (progressRef.current < targetProgressRef.current) {
        const diff = targetProgressRef.current - progressRef.current
        const step = Math.max(1, Math.ceil(diff * 0.22))
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
          }, 650)
        }, 180)
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

  return (
    <div
      className={`ldr ${isExiting ? 'ldr--exit' : ''}`}
      aria-label="Loading portfolio..."
      role="status"
    >
      {/* Subtle textured dark field */}
      <div className="ldr__field" />

      {/* Centered Name & Minimal Progress Bar (like reference) */}
      <div className="ldr__content">
        <h1 className="ldr__name">Aswin Biju</h1>
        <div className="ldr__track">
          <div
            className="ldr__fill"
            style={{ width: `${Math.max(12, progress)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
