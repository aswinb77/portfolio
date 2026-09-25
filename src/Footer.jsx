import { useState, useEffect, useCallback } from 'react'
import { getMedia } from './assets/media'
import './Footer.css'

const WORDS = ['create', 'design', 'connect', 'build']

export default function Footer() {
  const [wordIndex, setWordIndex] = useState(0)
  const [animClass, setAnimClass] = useState('visible')
  const [copied, setCopied] = useState(false)

  // Smooth rotating word ticker: create -> design -> connect -> build
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Slide current word up and out
      setAnimClass('slide-up-out')

      setTimeout(() => {
        // 2. Change word and position below
        setWordIndex((prev) => (prev + 1) % WORDS.length)
        setAnimClass('slide-up-in')

        // 3. Trigger entrance animation in next frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimClass('visible')
          })
        })
      }, 320)
    }, 2500)

    return () => clearInterval(timer)
  }, [])

  // ── Minecraft Love Hearts Emitter for Aswin Character ──
  const [hearts, setHearts] = useState([])

  const removeHeart = useCallback((id) => {
    setHearts((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const spawnHearts = useCallback((count = 3) => {
    const newHearts = Array.from({ length: count }).map(() => ({
      id: Math.random().toString(36).slice(2, 9) + Date.now(),
      left: 18 + Math.random() * 58, // spawn around torso & upper body
      bottom: 50 + Math.random() * 26,
      size: 22 + Math.floor(Math.random() * 14), // 22px to 36px
      drift: (Math.random() - 0.5) * 55, // horizontal sway
      rise: 75 + Math.random() * 70, // float up distance
      duration: 1.6 + Math.random() * 0.7, // 1.6s to 2.3s
      delay: Math.random() * 0.25,
    }))

    setHearts((prev) => [...prev.slice(-18), ...newHearts])
  }, [])

  // Random regular intervals: randomly triggers bursts of 3 or 4 loves
  useEffect(() => {
    let timeoutId
    let isMounted = true

    const scheduleNextBurst = () => {
      const delay = 2400 + Math.random() * 2600 // 2.4s to 5.0s random interval
      timeoutId = setTimeout(() => {
        if (!isMounted) return
        const count = Math.random() < 0.5 ? 3 : 4
        spawnHearts(count)
        scheduleNextBurst()
      }, delay)
    }

    scheduleNextBurst()

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [spawnHearts])

  const copyEmail = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText('aswinbiju2004@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2400)
  }

  const scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="img-footer" id="contact" data-nav-theme="dark">
      <div className="img-footer__container">
        {/* ── Main Display Headline & Character ── */}
        <div className="img-footer__hero">
          <div className="img-footer__hero-text">
            <h2 className="img-footer__title">
              <span className="img-footer__line1">
                Lets{' '}
                <span className="img-footer__word-slot" aria-live="polite">
                  <span className={`img-footer__word ${animClass}`}>
                    {WORDS[wordIndex]}
                  </span>
                </span>
              </span>
              <span className="img-footer__line2">
                incredible work together.
              </span>
            </h2>
          </div>

          {/* Aswin Character with Infinity Gauntlet & Minecraft Affection Hearts */}
          <div className="img-footer__character-wrap" aria-hidden="true">
            <div className="img-footer__hearts-emitter">
              {hearts.map((h) => (
                <img
                  key={h.id}
                  src={getMedia('/minecraft-heart.svg')}
                  alt=""
                  className="img-footer__minecraft-heart"
                  style={{
                    left: `${h.left}%`,
                    bottom: `${h.bottom}%`,
                    width: `${h.size}px`,
                    height: `${Math.round(h.size * 0.888)}px`,
                    '--drift': `${h.drift}px`,
                    '--rise': `${h.rise}px`,
                    '--dur': `${h.duration}s`,
                    '--delay': `${h.delay}s`,
                  }}
                  onAnimationEnd={() => removeHeart(h.id)}
                />
              ))}
            </div>

            <img
              src={getMedia('/aswin-duo.png')}
              alt="Aswin character"
              className="img-footer__character-img"
              draggable="false"
            />
          </div>
        </div>

        {/* ── Middle Row: Email (Left) & Social (Right) ── */}
        <div className="img-footer__info-row">
          {/* Email Info */}
          <div className="img-footer__col-email">
            <span className="img-footer__label">Email</span>
            <div className="img-footer__email-wrap">
              <a
                href="mailto:aswinbiju2004@gmail.com"
                className="img-footer__email-link"
                title="Send email to aswinbiju2004@gmail.com"
              >
                aswinbiju2004@gmail.com
              </a>
              <button
                type="button"
                className={`img-footer__copy-pill ${copied ? 'is-copied' : ''}`}
                onClick={copyEmail}
                aria-label="Copy email address"
              >
                {copied ? 'Copied! ✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Social Icons (White circular buttons matching reference image) */}
          <div className="img-footer__col-social">
            <span className="img-footer__label">Connect & Resume</span>
            <div className="img-footer__social-list">
              {/* GitHub */}
              <a
                href="https://github.com/aswinb77"
                target="_blank"
                rel="noreferrer"
                className="img-footer__social-circle"
                aria-label="GitHub profile"
                title="GitHub @aswinb77"
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/aswin-biju7"
                target="_blank"
                rel="noreferrer"
                className="img-footer__social-circle"
                aria-label="LinkedIn profile"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <circle cx="4.2" cy="4" r="2.3" />
                  <path d="M1.9 8.5h4.6V22H1.9z" />
                  <path d="M12.6 8.5H8.3V22h4.3v-7.2c0-4 4.8-4.3 4.8 0V22h4.4v-8.5c0-6.8-7.3-6.6-9.2-3.2v-1.8z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/aswin.rar"
                target="_blank"
                rel="noreferrer"
                className="img-footer__social-circle"
                aria-label="Instagram profile"
                title="Instagram"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/aswinbiju"
                target="_blank"
                rel="noreferrer"
                className="img-footer__social-circle"
                aria-label="Telegram channel"
                title="Telegram"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.67c.458 0 .66-.21.916-.458l2.199-2.138 4.573 3.378c.843.465 1.448.225 1.658-.783l2.997-14.121c.307-1.232-.47-1.79-1.275-1.426l-.23.106z" />
                </svg>
              </a>

              {/* Resume Trigger Pill */}
              <button
                type="button"
                className="img-footer__resume-pill"
                onClick={() => window.dispatchEvent(new CustomEvent('open-resume'))}
                title="View & Download Aswin's Resume"
              >
                <span>Resume 📄</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom Divider Rule & Meta ── */}
        <div className="img-footer__bottom-line" />

        <div className="img-footer__meta-row">
          <span className="img-footer__copyright">
            © 2026 Aswin Biju. All rights reserved.
          </span>

          <button
            type="button"
            className="img-footer__back-to-top"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <span className="img-footer__arrow" aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
