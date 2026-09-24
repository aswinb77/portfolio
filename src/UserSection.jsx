import { getMedia } from './assets/media'
import { useEffect, useRef, useState, useCallback } from 'react'
import './UserSection.css'

const NARRATIVE_P1 = "On weekends you’ll find me on the football court, exploring new restaurants each month, watching movies, or stuck in puzzle games that lead nowhere (and I love it)"
const NARRATIVE_P2 = "Drawn to consistency and the subtle things that just feel right."
const P1_WORDS = NARRATIVE_P1.split(' ')
const P2_WORDS = NARRATIVE_P2.split(' ')
const TOTAL_WORDS = P1_WORDS.length + P2_WORDS.length

export default function UserSection() {
  const [copiedKey, setCopiedKey] = useState(null)
  const containerRef = useRef(null)
  const bubbleRef = useRef(null)
  const chessRef = useRef(null)
  const badmintonRef = useRef(null)
  const skatesRef = useRef(null)
  const avatarRef = useRef(null)
  const wordsRef = useRef([])

  // Auto-incrementing Duolingo streak starting at 605 on 2026-09-24
  const [duoStreak, setDuoStreak] = useState(() => {
    const BASE_DATE = new Date('2026-09-23T00:00:00')
    const elapsedDays = Math.max(0, Math.floor((Date.now() - BASE_DATE.getTime()) / (1000 * 60 * 60 * 24)))
    return 605 + elapsedDays
  })

  useEffect(() => {
    const checkStreak = () => {
      const BASE_DATE = new Date('2026-09-23T00:00:00')
      const elapsedDays = Math.max(0, Math.floor((Date.now() - BASE_DATE.getTime()) / (1000 * 60 * 60 * 24)))
      setDuoStreak(605 + elapsedDays)
    }
    const timer = setInterval(checkStreak, 60000)
    return () => clearInterval(timer)
  }, [])

  // Desktop on-scroll progressive reveal text effect
  useEffect(() => {
    if (typeof window === 'undefined') return
    const bubble = bubbleRef.current
    if (!bubble) return

    let ticking = false
    const handleScrollReveal = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.innerWidth <= 768) {
            ticking = false
            return
          }
          const rect = bubble.getBoundingClientRect()
          const winH = window.innerHeight

          // Progress begins when card top enters bottom 80% and finishes when top reaches 25%
          const startY = winH * 0.80
          const endY = winH * 0.25
          const rawProgress = (startY - rect.top) / (startY - endY)
          const progress = Math.min(Math.max(rawProgress, 0), 1)

          wordsRef.current.forEach((span, idx) => {
            if (!span) return
            const startThresh = (idx / TOTAL_WORDS) * 0.90
            const endThresh = startThresh + 0.10
            const alpha = Math.min(Math.max((progress - startThresh) / (endThresh - startThresh), 0), 1)
            span.style.opacity = (0.16 + 0.84 * alpha).toFixed(3)
            span.style.color = alpha > 0.6 ? '#1e1916' : 'rgba(30, 25, 22, 0.35)'
            span.style.transform = `translateY(${((1 - alpha) * 2).toFixed(1)}px)`
          })

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScrollReveal, { passive: true })
    window.addEventListener('resize', handleScrollReveal, { passive: true })
    handleScrollReveal()

    return () => {
      window.removeEventListener('scroll', handleScrollReveal)
      window.removeEventListener('resize', handleScrollReveal)
    }
  }, [])

  const handleCopy = (e, text, key) => {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2200)
  }

  // Interactive 3D tilt and floating parallax on mouse move
  const handleMouseMove = useCallback((e) => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) return
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const dx = (x - cx) / cx // -1 to 1
    const dy = (y - cy) / cy

    // Parallax on floating hobby stickers
    if (chessRef.current) {
      chessRef.current.style.transform = `translate(${dx * -16}px, ${dy * -14}px) rotate(${-12 + dx * 4}deg)`
    }
    if (badmintonRef.current) {
      badmintonRef.current.style.transform = `translate(${dx * 20}px, ${dy * -18}px) rotate(${15 + dy * 5}deg)`
    }
    if (skatesRef.current) {
      skatesRef.current.style.transform = `translate(${dx * 16}px, ${dy * 16}px) rotate(${-6 + dx * 5}deg)`
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (chessRef.current) chessRef.current.style.transform = ''
    if (badmintonRef.current) badmintonRef.current.style.transform = ''
    if (skatesRef.current) skatesRef.current.style.transform = ''
  }, [])

  return (
    <section
      className="user-section"
      id="about"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="user-section__ambient" aria-hidden="true" />

      <div className="user-section__container">
        {/* Heroic Personality Showcase Stage */}
        <div className="personality-showcase-stage">
          {/* Floating Sticker: Chess Board (Top-Left) */}
          <div className="floating-sticker floating-sticker--chess" ref={chessRef} aria-hidden="true">
            <img src={getMedia('/chess.avif')} alt="Chess board" className="sticker-img" />
          </div>

          {/* Floating Sticker: Football on Grass (Top-Right) */}
          <div className="floating-sticker floating-sticker--badminton" ref={badmintonRef} aria-hidden="true">
            <img src={getMedia('/footballongras.png')} alt="Football on grass" className="sticker-img" />
          </div>

          {/* Floating Sticker: Movie (Far-Right) */}
          <div className="floating-sticker floating-sticker--skates" ref={skatesRef} aria-hidden="true">
            <img src={getMedia('/movie.png')} alt="Movie" className="sticker-img" />
          </div>

          {/* Centerpiece: The Electric Blue Speech Bubble */}
          <div className="personality-bubble-wrap">
            <div className="personality-speech-bubble" ref={bubbleRef}>
              <div className="personality-speech-bubble__inner">
                {/* Narrative Paragraphs with Desktop On-Scroll Reveal (Hidden on Mobile) */}
                <div className="personality-bubble-narrative">
                  <p className="personality-bubble-text">
                    {P1_WORDS.map((word, i) => (
                      <span key={`p1-${i}`}>
                        <span
                          ref={el => (wordsRef.current[i] = el)}
                          className="scroll-reveal-word"
                        >
                          {word}
                        </span>
                        {' '}
                      </span>
                    ))}
                  </p>

                  <p className="personality-bubble-text">
                    {P2_WORDS.map((word, i) => (
                      <span key={`p2-${i}`}>
                        <span
                          ref={el => (wordsRef.current[P1_WORDS.length + i] = el)}
                          className="scroll-reveal-word"
                        >
                          {word}
                        </span>
                        {' '}
                      </span>
                    ))}
                  </p>
                </div>

                {/* Compact Mobile Narrative (Shown only on mobile) */}
                <p className="personality-bubble-mobile-text">
                  Weekends on the pitch, movies, and puzzle games that go nowhere. Drawn to subtle details that just feel right.
                </p>

                {/* Subheading Anchor */}
                <h3 className="personality-bubble-lead">
                  Sidequest...
                </h3>

                {/* Brand Inspiration Icons */}
                <div className="personality-brand-row">
                  {/* Duolingo App Icon with Streak Flame & Link */}
                  <a
                    href="https://www.duolingo.com/profile/aswin.rar"
                    target="_blank"
                    rel="noreferrer"
                    className="brand-squircle brand-squircle--duo"
                    aria-label={`Duolingo profile aswin.rar with ${duoStreak} day streak`}
                  >
                    <div className="brand-squircle__icon-box duo-box">
                      <img src={getMedia('/duodead.avif')} alt="Duolingo" className="duodead-img" />
                    </div>

                    {/* Streak Flame and Number without white background */}
                    <div className="brand-squircle__streak">
                      <img src={getMedia('/duolingo-fire.svg')} alt="Flame streak" className="duo-flame-icon" />
                      <span className="duo-flame-count">{duoStreak}</span>
                    </div>
                  </a>

                  {/* Notion Icon */}
                  <div className="brand-squircle brand-squircle--notion" aria-label="Notion Architecture Philosophy">
                    <div className="brand-squircle__icon-box notion-box">
                      <img src={getMedia('/notion.avif')} alt="Notion" className="notion-avif-img" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Thought Bubble Circular Tail Dots connecting Character to Thought Card */}
              <div className="thought-bubble-tail" aria-hidden="true">
                <span className="thought-dot thought-dot--large" />
                <span className="thought-dot thought-dot--medium" />
                <span className="thought-dot thought-dot--small" />
              </div>
            </div>

            {/* Character Avatar (Thinker - Corner) */}
            <div className="personality-avatar-anchor" ref={avatarRef}>
              <div className="personality-avatar-crop">
                <img
                  src={getMedia('/character-alpha.webp')}
                  alt="Character avatar"
                  className="personality-avatar-video"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Social Connect Dock directly below the bubble */}
          <div className="personality-social-dock">
            {/* Email with Copy & Interactive Multi-part Logo */}
            <button
              type="button"
              className={`social-dock-pill social-dock-pill--email ${copiedKey === 'gmail' ? 'is-copied' : ''}`}
              onClick={(e) => handleCopy(e, 'aswinbiju2004@gmail.com', 'gmail')}
              aria-label="Copy Email address aswinbiju2004@gmail.com"
              title={copiedKey === 'gmail' ? 'Copied to Clipboard!' : 'Click to copy email'}
            >
              {copiedKey === 'gmail' ? (
                <svg className="dock-pill-icon-svg check-copied-svg" viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg className="gm-svg dock-pill-icon-svg" viewBox="52 42 88 66" width="48" height="40" xmlns="http://www.w3.org/2000/svg">
                  <path className="gm-from-top" fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
                  <path className="gm-from-top" fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92" />
                  <path className="gm-from-top" fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
                  <path className="gm-from-left" fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
                  <path className="gm-from-right" fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
                </svg>
              )}
            </button>

            {/* GitHub with Interactive Vector Drawing Logo */}
            <a
              href="https://github.com/aswinb77"
              target="_blank"
              rel="noreferrer"
              className="social-dock-pill social-dock-pill--github"
              aria-label="GitHub Profile"
              title="GitHub Profile"
            >
              <svg className="gh-svg dock-pill-icon-svg" viewBox="0 0 24 24" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
                <path className="gh-outline" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                <path className="gh-fill" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>

            {/* LinkedIn with Interactive Path Drawing & Dot Animation */}
            <a
              href="https://www.linkedin.com/in/aswin-biju7"
              target="_blank"
              rel="noreferrer"
              className="social-dock-pill social-dock-pill--linkedin"
              aria-label="LinkedIn Profile"
              title="LinkedIn Profile"
            >
              <svg className="li-svg dock-pill-icon-svg" viewBox="0 0 24 24" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
                <path className="li-path" style={{ '--len': 76, '--draw-dur': '0.5s', '--draw-delay': '0s' }} d="M4 2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2z" />
                <path className="li-path" style={{ '--len': 12, '--draw-dur': '0.3s', '--draw-delay': '0.12s' }} d="M8 11v6" />
                <circle className="li-dot" cx="8" cy="8" r="1.3" />
                <path className="li-path" style={{ '--len': 22, '--draw-dur': '0.4s', '--draw-delay': '0.2s' }} d="M12 17v-4c0-1.5 1-2.2 2.2-2.2s1.8.8 1.8 2.2v4" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {copiedKey === 'gmail' && (
        <div className="card-copied-toast" role="status">
          Copied aswinbiju2004@gmail.com to clipboard! ✓
        </div>
      )}
    </section>
  )
}
