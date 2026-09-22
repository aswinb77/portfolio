import { useEffect, useRef, useState, useCallback } from 'react'
import './Hero.css'
import splineVideo from './assets/spline.mp4'

export default function Hero({ onSplineReady }) {
  const videoRef = useRef(null)
  const isReadyCalledRef = useRef(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  const triggerReady = useCallback(() => {
    if (isReadyCalledRef.current) return
    isReadyCalledRef.current = true
    setVideoLoaded(true)
    if (onSplineReady) onSplineReady()
  }, [onSplineReady])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (video.readyState >= 2) {
      triggerReady()
      return
    }

    const handleReady = () => triggerReady()
    video.addEventListener('canplay', handleReady, { once: true })
    video.addEventListener('loadeddata', handleReady, { once: true })

    const fallbackTimer = setTimeout(() => {
      triggerReady()
    }, 3000)

    return () => {
      video.removeEventListener('canplay', handleReady)
      video.removeEventListener('loadeddata', handleReady)
      clearTimeout(fallbackTimer)
    }
  }, [triggerReady])

  const scrollToSection = (e, id) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleSound = () => {
    if (!videoRef.current) return
    const nextMuted = !videoRef.current.muted
    videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  return (
    <div className="hero-container">
      {/* ── Widescreen Hero Banner ── */}
      <section className="hero" id="hero">
        {/* Spline Video Background */}
        <div className="hero__video-wrap">
          <video
            ref={videoRef}
            className={`hero__video ${videoLoaded ? 'is-loaded' : ''}`}
            src={splineVideo}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onLoadedData={triggerReady}
            onCanPlay={triggerReady}
          />
          <div className="hero__video-vignette" />
        </div>

        {/* Editorial Viewport Overlay */}
        <div className="hero__overlay">
          {/* Top Row: Left Headline + Right Navigation */}
          <div className="hero__top">
            <h1 className="hero__headline">
              <span className="hero__headline-line">I make things that</span>
              <span className="hero__headline-line">Make people Wonder.</span>
            </h1>

            {/* Desktop Navigation Links */}
            <nav className="hero__nav" aria-label="Primary Navigation">
              <a href="#works" className="hero__nav-link" onClick={(e) => scrollToSection(e, 'works')}>
                Work
              </a>
              <a href="#about" className="hero__nav-link" onClick={(e) => scrollToSection(e, 'about')}>
                About
              </a>
              <a href="#gallery" className="hero__nav-link" onClick={(e) => scrollToSection(e, 'gallery')}>
                Gallery
              </a>
              <a href="#curiosities" className="hero__nav-link" onClick={(e) => scrollToSection(e, 'curiosities')}>
                Obsessions
              </a>
              <a href="#contact" className="hero__nav-link" onClick={(e) => scrollToSection(e, 'contact')}>
                Contact
              </a>
            </nav>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className={`hero__mobile-toggle ${menuOpen ? 'is-open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <span className="hero__toggle-bar" />
              <span className="hero__toggle-bar" />
              <span className="hero__toggle-bar" />
            </button>
          </div>

          {/* Mobile Dropdown Nav Menu */}
          <nav className={`hero__mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-label="Mobile Navigation">
            <a href="#works" className="hero__mobile-link" onClick={(e) => scrollToSection(e, 'works')}>
              Work
            </a>
            <a href="#about" className="hero__mobile-link" onClick={(e) => scrollToSection(e, 'about')}>
              About
            </a>
            <a href="#gallery" className="hero__mobile-link" onClick={(e) => scrollToSection(e, 'gallery')}>
              Gallery
            </a>
            <a href="#curiosities" className="hero__mobile-link" onClick={(e) => scrollToSection(e, 'curiosities')}>
              Obsessions
            </a>
            <a href="#contact" className="hero__mobile-link" onClick={(e) => scrollToSection(e, 'contact')}>
              Contact
            </a>
          </nav>

          {/* Bottom Row: Identity (Name & Role) + Sound Toggle */}
          <div className="hero__bottom">
            <div className="hero__identity">
              <div className="hero__identity-header">
                <h2 className="hero__name">Aswin Biju</h2>
                <div className="hero__socials">
                  <a
                    href="https://linkedin.com/in/aswinbiju"
                    target="_blank"
                    rel="noreferrer"
                    className="hero__social-btn"
                    aria-label="LinkedIn profile"
                    title="LinkedIn"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="hero__social-icon">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/aswinbiju"
                    target="_blank"
                    rel="noreferrer"
                    className="hero__social-btn"
                    aria-label="GitHub profile"
                    title="GitHub"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="hero__social-icon">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                    </svg>
                  </a>
                  <a
                    href="mailto:aswinbiju2004@gmail.com"
                    className="hero__social-btn"
                    aria-label="Send email"
                    title="Email"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="hero__social-icon">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </a>
                </div>
              </div>
              <p className="hero__role">SOFTWARE ENGINEER &amp; CREATIVE DEVELOPER</p>
            </div>

            {/* Bottom Right Sound Toggle Button */}
            <button
              type="button"
              className={`hero__sound-btn ${isMuted ? 'is-muted' : 'is-unmuted'}`}
              onClick={toggleSound}
              aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {isMuted ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="hero__sound-icon">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="hero__sound-icon">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
              <span className="hero__sound-pulse" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
