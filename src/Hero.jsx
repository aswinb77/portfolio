import { useEffect, useRef, useState } from 'react'
import './Hero.css'
import introVideo from './assets/intro.mp4'

/* ── Programming Languages & Stack List with Vector Logos ───── */
const LANGUAGES = [
  {
    name: 'PYTHON',
    icon: (
      <svg viewBox="0 0 24 24" className="hero__lang-icon" fill="currentColor">
        <path d="M12 2C6.5 2 6.8 4.4 6.8 4.4l.01 2.3h5.3v.8H4.6S1 7.1 1 12.3c0 5.1 3.2 4.9 3.2 4.9h1.9v-2.7s-.1-3.2 3.2-3.2h5.5s3.1-.1 3.1-3V4.9S18.3 2 12 2zm-3.3 1.7a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3.3 18.3c5.5 0 5.2-2.4 5.2-2.4l-.01-2.3H11.9v-.8h7.5s3.6.4 3.6-4.8c0-5.1-3.2-4.9-3.2-4.9h-1.9v2.7s.1 3.2-3.2 3.2H9.2s-3.1.1-3.1 3v3.4s-.4 2.9 5.9 2.9zm3.3-1.7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
      </svg>
    ),
  },
  {
    name: 'JAVASCRIPT',
    icon: (
      <svg viewBox="0 0 24 24" className="hero__lang-icon" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 15.5c.6.6 1.2 1 2.1 1 1.1 0 1.9-.7 1.9-1.8V9" />
        <path d="M14.2 16.2c.8.5 1.7.7 2.6.4.8-.3 1.2-1 1.2-1.8 0-1.6-2.5-1.4-2.5-2.8 0-.6.5-1.1 1.3-1.1.7 0 1.4.3 1.9.8" />
      </svg>
    ),
  },
  {
    name: 'TYPESCRIPT',
    icon: (
      <svg viewBox="0 0 24 24" className="hero__lang-icon" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M6.5 9.5h5M9 9.5v7" />
        <path d="M14.2 16.2c.8.5 1.7.7 2.6.4.8-.3 1.2-1 1.2-1.8 0-1.6-2.5-1.4-2.5-2.8 0-.6.5-1.1 1.3-1.1.7 0 1.4.3 1.9.8" />
      </svg>
    ),
  },
  {
    name: 'REACT',
    icon: (
      <svg viewBox="0 0 24 24" className="hero__lang-icon" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(150 12 12)" />
        <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'C++',
    
  },
  {
    name: 'NODE.JS',
    icon: (
      <svg viewBox="0 0 24 24" className="hero__lang-icon" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 2.5l8 4.6v9.2l-8 4.6-8-4.6V7.1L12 2.5z" />
        <path d="M12 21V12m0 0L4 7.5M12 12l8-4.5" />
      </svg>
    ),
  },
  {
    name: 'JAVA',
    icon: (
      <svg viewBox="0 0 24 24" className="hero__lang-icon" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M5 18c2 1.5 6.5 2 10.5 1 3-.8 4.5-1.8 4.5-1.8" />
        <path d="M7 21c2 .8 5.5 1.1 8.5.7 2.5-.3 4-.9 4-.9" />
        <path d="M11 3c-1.5 2-1.5 4 .5 5.5s1.5 2.5-.5 4.5" />
        <path d="M15 2.5c-1.5 2-1.5 4 .5 5.5s1.5 2.5-.5 4.5" />
        <path d="M7 6c-1.5 2-1.5 4 .5 5.5s1.5 2.5-.5 4.5" />
      </svg>
    ),
  },
  {
    name: 'SQL',
    icon: (
      <svg viewBox="0 0 24 24" className="hero__lang-icon" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
        <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
      </svg>
    ),
  },
]

export default function Hero({ onSplineReady }) {
  const timerRef = useRef(null)
  const [splineLoaded, setSplineLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768
    }
    return false
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) {
      const t = setTimeout(() => {
        if (onSplineReady) onSplineReady()
      }, 300)
      return () => clearTimeout(t)
    }
  }, [isMobile, onSplineReady])

  const smoothSlowScrollTo = (targetY, duration = 2000) => {
    const startY = window.scrollY
    const diff = targetY - startY
    if (Math.abs(diff) < 5) return

    let startTime = null
    let animId = null
    let userInterrupted = false

    // If user touches, wheels, or presses navigation keys during the scroll, stop immediately
    const interruptHandler = () => {
      userInterrupted = true
      if (animId) cancelAnimationFrame(animId)
      cleanup()
    }

    const cleanup = () => {
      window.removeEventListener('wheel', interruptHandler)
      window.removeEventListener('touchstart', interruptHandler)
      window.removeEventListener('keydown', interruptHandler)
    }

    window.addEventListener('wheel', interruptHandler, { passive: true })
    window.addEventListener('touchstart', interruptHandler, { passive: true })
    window.addEventListener('keydown', interruptHandler, { passive: true })

    // Easing curve: smooth, slow cubic easeInOut for a gentle cinematic glide
    const easeInOutCubic = (t) => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const step = (currentTime) => {
      if (userInterrupted) return
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(1, elapsed / duration)
      const eased = easeInOutCubic(progress)

      window.scrollTo(0, startY + diff * eased)

      if (progress < 1) {
        animId = requestAnimationFrame(step)
      } else {
        cleanup()
      }
    }

    animId = requestAnimationFrame(step)
  }

  const scrollToNext = () => {
    const nextSection = document.getElementById('about') || document.querySelector('.user-section')
    const targetY = nextSection
      ? nextSection.getBoundingClientRect().top + window.scrollY
      : window.innerHeight
    smoothSlowScrollTo(targetY, 2000)
  }

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 40 && timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    // After 5 seconds, initiate a slow, buttery smooth glide to the next section
    // if the user is still at the top
    timerRef.current = setTimeout(() => {
      if (window.scrollY < 40) {
        scrollToNext()
      }
    }, 5000)

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (
    <section className="hero" id="hero">
      {/* ── Spline 3D Scene on Desktop / Video on Mobile ── */}
      <div className="hero__spline-wrap">
        {isMobile ? (
          <>
            <video
              className="hero__mobile-video"
              src={introVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedData={() => {
                setSplineLoaded(true)
                if (onSplineReady) onSplineReady()
              }}
              onCanPlay={() => {
                setSplineLoaded(true)
                if (onSplineReady) onSplineReady()
              }}
            />
            {/* Mobile Hero Viewport Layout inspired by editorial luxury portfolios */}
            <div className="hero__mobile-overlay">
              {/* Top Row: Left Headline + Right Minimal Hamburger Nav */}
              <div className="hero__mobile-top">
                <h1 className="hero__mobile-headline">
                  <span className="hero__mobile-line">I make</span>
                  <span className="hero__mobile-line">things that blow</span>
                  <span className="hero__mobile-line">people’s minds.</span>
                </h1>

                <button
                  type="button"
                  className="hero__mobile-nav-btn"
                  onClick={scrollToNext}
                  aria-label="Navigate to content"
                >
                  <span className="hero__mobile-nav-line" />
                  <span className="hero__mobile-nav-line" />
                  <span className="hero__mobile-nav-line" />
                </button>
              </div>

              {/* Bottom Row: Identity (Name & Role) */}
              <div className="hero__mobile-bottom">
                <div className="hero__mobile-identity">
                  <h2 className="hero__mobile-name">Aswin Biju</h2>
                  <p className="hero__mobile-role">DEVELOPER</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <iframe
            src="https://my.spline.design/hellodistortingintro-tz982dqdsDyLhRldsm7XPdaC/"
            title="Hello Distorting Intro - Spline 3D Scene"
            frameBorder="0"
            width="100%"
            height="100%"
            className={`hero__spline-iframe ${splineLoaded ? 'is-loaded' : ''}`}
            loading="eager"
            allow="autoplay; fullscreen"
            onLoad={() => {
              setSplineLoaded(true)
              if (onSplineReady) onSplineReady()
            }}
          />
        )}
      </div>

      {/* ── Programming Languages Marquee Ticker ─────────── */}
      <div className="hero__ticker">
        <div className="hero__ticker-track">
          {[0, 1].map((blockIdx) => (
            <div key={blockIdx} className="hero__ticker-group">
              {LANGUAGES.map((lang, idx) => (
                <span key={`${blockIdx}-${idx}`} className="hero__ticker-item">
                  <span className="hero__ticker-logo">{lang.icon}</span>
                  <span className="hero__ticker-name">{lang.name}</span>
                  <span className="hero__ticker-dot">◈</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
