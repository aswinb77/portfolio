import { useEffect, useRef, useState, useCallback } from 'react'
import './UserSection.css'

const TYPEWRITER_PHRASES = [
  'thoughtful architecture.',
  'timeless design.',
  'creative interfaces.',
  'modern engineering.',
]

export default function UserSection() {
  const craneRef = useRef(null)
  const [duoStreak, setDuoStreak] = useState(null)
  const [learningLang, setLearningLang] = useState('German')

  // Live Duolingo Streak
  // ─ Dev:        Vite proxy forwards /api/duo-streak → Duolingo (server-side, no CORS)
  // ─ Production: Vercel serverless function at /api/duo-streak.js does the same
  // ─ Fallback:   Shows last known verified streak so widget never stays broken
  useEffect(() => {
    const FALLBACK_STREAK = 588 // verified streak as of 2026-09-04
    const FALLBACK_LANG = 'German'

    const applyUserData = (user) => {
      if (user && typeof user.streak === 'number') {
        setDuoStreak(user.streak)
        if (user.learningLanguage === 'de') setLearningLang('German')
        else if (user.learningLanguage === 'ru') setLearningLang('Russian')
        else if (user.learningLanguage === 'ja') setLearningLang('Japanese')
        else if (user.learningLanguage === 'es') setLearningLang('Spanish')
        else if (user.learningLanguage === 'hi') setLearningLang('Hindi')
        else if (user.learningLanguage) setLearningLang(user.learningLanguage.toUpperCase())
        return true
      }
      return false
    }

    const fetchDuoData = async () => {
      try {
        // Works in dev (Vite proxy) AND in production (Vercel function)
        const res = await fetch('/api/duo-streak?username=aswin.rar', {
          cache: 'no-store',
          signal: AbortSignal.timeout(8000),
        })
        if (res.ok) {
          const data = await res.json()
          const user = data?.users?.[0]
          if (applyUserData(user)) return
        }
      } catch {
        // API route not available — fall through to hardcoded fallback
      }

      // All strategies failed — show last-known verified streak
      setDuoStreak(FALLBACK_STREAK)
      setLearningLang(FALLBACK_LANG)
    }

    fetchDuoData()
  }, [])

  const getLanguageFlag = (lang) => {
    switch (lang?.toLowerCase()) {
      case 'german':
      case 'de':
        return '🇩🇪'
      case 'russian':
      case 'ru':
        return '🇷🇺'
      case 'japanese':
      case 'ja':
        return '🇯🇵'
      case 'spanish':
      case 'es':
        return '🇪🇸'
      case 'french':
      case 'fr':
        return '🇫🇷'
      case 'hindi':
      case 'hi':
        return '🇮🇳'
      default:
        return '🇩🇪'
    }
  }

  const [copiedKey, setCopiedKey] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)

  const handleCopy = (e, text, key) => {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Typewriter effect for editorial quote
  const [twPhraseIdx, setTwPhraseIdx] = useState(0)
  const [twCharIdx, setTwCharIdx] = useState(TYPEWRITER_PHRASES[0].length)
  const [twIsDeleting, setTwIsDeleting] = useState(false)

  useEffect(() => {
    const current = TYPEWRITER_PHRASES[twPhraseIdx]
    let timer

    if (!twIsDeleting && twCharIdx < current.length) {
      timer = setTimeout(() => setTwCharIdx((prev) => prev + 1), 80)
    } else if (!twIsDeleting && twCharIdx === current.length) {
      timer = setTimeout(() => setTwIsDeleting(true), 2400)
    } else if (twIsDeleting && twCharIdx > 0) {
      timer = setTimeout(() => setTwCharIdx((prev) => prev - 1), 40)
    } else if (twIsDeleting && twCharIdx === 0) {
      setTwIsDeleting(false)
      setTwPhraseIdx((prev) => (prev + 1) % TYPEWRITER_PHRASES.length)
    }

    return () => clearTimeout(timer)
  }, [twCharIdx, twIsDeleting, twPhraseIdx])

  // Interactive Mini Paper Crane Pop Burst on Click
  const [poppedCranes, setPoppedCranes] = useState([])
  const popCounterRef = useRef(0)

  const handleCraneClick = (e) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const originX = rect.left + rect.width / 2
    const originY = rect.top + rect.height / 2

    // Burst 14 smaller shorter origami paper cranes
    const count = 14
    const newBurst = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4
      const distance = 90 + Math.random() * 240
      const tx = Math.cos(angle) * distance
      const ty = Math.sin(angle) * distance - (50 + Math.random() * 80) // upward buoyancy
      const scale = 0.2 + Math.random() * 0.25 // small & shorter
      const startRot = (Math.random() - 0.5) * 45
      const endRot = startRot + (Math.random() - 0.5) * 360
      const duration = 0.85 + Math.random() * 0.45

      return {
        id: ++popCounterRef.current,
        x: originX,
        y: originY,
        tx,
        ty,
        scale,
        startRot,
        endRot,
        duration,
      }
    })

    setPoppedCranes((prev) => [...prev, ...newBurst])

    // Cleanup after animation completes
    setTimeout(() => {
      const ids = new Set(newBurst.map((c) => c.id))
      setPoppedCranes((prev) => prev.filter((c) => !ids.has(c.id)))
    }, 1400)
  }

  const userSectionRef = useRef(null)

  // ─── Scroll reveal with cinematic stagger delays ───────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
    )

    const items = userSectionRef.current?.querySelectorAll('.scroll-reveal-item')
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  // ─── Crane scroll fly-away ─────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      if (!craneRef.current) return
      const parent = craneRef.current.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const windowHeight = window.innerHeight

      const triggerPoint = windowHeight * 0.45
      const flyDistance = 500
      const flyProgress = Math.max(0, (triggerPoint - rect.top) / flyDistance)

      if (flyProgress > 0) {
        const flyX = -(flyProgress * 280)
        const flyY = -(flyProgress * 460)
        const flyRotate = -8 - flyProgress * 26
        const flyScale = Math.min(1.25, 1 + flyProgress * 0.18)
        const flyOpacity = Math.max(0, 1 - Math.max(0, flyProgress - 0.4) * 1.7)

        craneRef.current.style.transform = `translate3d(${flyX}px, ${flyY}px, 0) rotate(${flyRotate}deg) scale(${flyScale})`
        craneRef.current.style.opacity = `${flyOpacity}`
      } else {
        craneRef.current.style.transform = 'translate3d(0, 0, 0) rotate(-6deg) scale(1)'
        craneRef.current.style.opacity = '1'
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const bioTextRef = useRef(null)

  // ─── Progressive text fill ─────────────────────────────────────────────
  useEffect(() => {
    let animId = null
    const updateTextFill = () => {
      if (!bioTextRef.current) return
      const words = bioTextRef.current.querySelectorAll('.progressive-word')
      if (!words || words.length === 0) return

      const rect = bioTextRef.current.getBoundingClientRect()
      const windowH = window.innerHeight
      const fillStart = windowH * 0.80
      const fillRange = windowH * 0.65
      const totalProgress = Math.max(0, Math.min(1, (fillStart - rect.top) / fillRange))

      const totalWords = words.length
      words.forEach((word, idx) => {
        const wordStart = idx / totalWords
        const wordEnd = (idx + 1) / totalWords
        const wordFill = Math.max(0, Math.min(1, (totalProgress - wordStart) / (wordEnd - wordStart)))
        word.style.setProperty('--fill', wordFill.toFixed(3))
      })
    }

    const onScrollText = () => {
      if (animId) cancelAnimationFrame(animId)
      animId = requestAnimationFrame(updateTextFill)
    }

    window.addEventListener('scroll', onScrollText, { passive: true })
    updateTextFill()

    return () => {
      window.removeEventListener('scroll', onScrollText)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [])

  // ─── Magnetic cursor: portrait + illustrations parallax ─────────────────
  const magnetRef = useRef(null)
  const ill1Ref = useRef(null)
  const ill2Ref = useRef(null)
  const ill3Ref = useRef(null)
  const raf = useRef(null)
  const mouse = useRef({ x: 0.5, y: 0.5 })
  const smoothMouse = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const section = userSectionRef.current
    if (!section) return

    const onMouseMove = (e) => {
      const rect = section.getBoundingClientRect()
      mouse.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }

    let isVisible = false
    const tick = () => {
      // Lerp smoothing — cinematic lag
      const lerpFactor = 0.055
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * lerpFactor
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * lerpFactor

      const mx = (smoothMouse.current.x - 0.5) * 2  // -1 to +1
      const my = (smoothMouse.current.y - 0.5) * 2

      // Portrait — gentle tilt
      if (magnetRef.current) {
        const rx = -my * 4
        const ry = mx * 6
        magnetRef.current.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`
      }

      // Illustration parallax at different depths
      if (ill1Ref.current) {
        ill1Ref.current.style.transform = `rotate(-5deg) translate(${mx * -18}px, ${my * -12}px)`
      }
      if (ill2Ref.current) {
        ill2Ref.current.style.transform = `rotate(4deg) translate(${mx * 22}px, ${my * 14}px)`
      }
      if (ill3Ref.current) {
        ill3Ref.current.style.transform = `rotate(-2deg) translate(${mx * 10}px, ${my * 8}px)`
      }

      if (isVisible) {
        raf.current = requestAnimationFrame(tick)
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        if (raf.current) cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(tick)
      } else {
        if (raf.current) cancelAnimationFrame(raf.current)
      }
    }, { threshold: 0.05 })

    observer.observe(section)
    section.addEventListener('mousemove', onMouseMove, { passive: true })

    return () => {
      observer.disconnect()
      section.removeEventListener('mousemove', onMouseMove)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  // ─── 3D tilt on side quest cards ──────────────────────────────────────
  const handleCardTilt = useCallback((e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rx = ((y - cy) / cy) * -12
    const ry = ((x - cx) / cx) * 12
    card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px) scale(1.03)`
    card.style.boxShadow = `${-ry * 0.6}px ${rx * 0.6}px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.15) inset`
  }, [])

  const handleCardReset = useCallback((e) => {
    const card = e.currentTarget
    card.style.transform = ''
    card.style.boxShadow = ''
    card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    setTimeout(() => { card.style.transition = '' }, 600)
  }, [])

  // ─── Scroll progress line through section ─────────────────────────────
  const [sectionProgress, setSectionProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const section = userSectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const wh = window.innerHeight
      const progress = Math.max(0, Math.min(1, (-rect.top) / (rect.height - wh)))
      setSectionProgress(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const bioTokens = [
    { text: 'I', type: 'word' },
    { text: 'am', type: 'word' },
    { text: 'Aswin Biju', type: 'name' },
    { text: ', a', type: 'word' },
    { text: 'full-stack', type: 'word' },
    { text: 'engineer', type: 'word' },
    { text: 'and', type: 'word' },
    { text: 'digital', type: 'word' },
    { text: 'creator', type: 'word' },
    { text: 'based', type: 'word' },
    { text: 'in', type: 'word' },
    { text: 'Kerala,', type: 'word' },
    { text: 'India.', type: 'word' },
    { text: 'My', type: 'word' },
    { text: 'craft', type: 'word' },
    { text: 'spans', type: 'word' },
    { text: 'end-to-end', type: 'word' },
    { text: 'web', type: 'word' },
    { text: 'architecture,', type: 'word' },
    { text: 'performant', type: 'word' },
    { text: 'modern', type: 'word' },
    { text: 'interfaces,', type: 'word' },
    { text: 'and', type: 'word' },
    { text: 'creative', type: 'word' },
    { text: 'digital', type: 'word' },
    { text: 'storytelling.', type: 'word' },
    { text: 'Every', type: 'word' },
    { text: 'project', type: 'word' },
    { text: 'is', type: 'word' },
    { text: 'constructed', type: 'word' },
    { text: 'with', type: 'word' },
    { text: 'rigorous', type: 'word' },
    { text: 'attention', type: 'word' },
    { text: 'to', type: 'word' },
    { text: 'detail,', type: 'word' },
    { text: 'clean', type: 'word' },
    { text: 'typography,', type: 'word' },
    { text: 'and', type: 'word' },
    { text: 'fluid', type: 'word' },
    { text: 'user', type: 'word' },
    { text: 'experience.', type: 'word' },
  ]

  return (
    <section className="user-section" id="about" ref={userSectionRef}>
      {/* Cinematic scroll progress line */}
      <div
        className="user-section__progress-line"
        style={{ '--progress': sectionProgress }}
        aria-hidden="true"
      />

      {/* Background ambient glow */}
      <div className="user-section__ambient" />

      {/* ── Background Blend Illustrations Across Section ── */}
      <div className="user-section__illustrations" aria-hidden="true">
        <div className="user-ill user-ill--1" ref={ill1Ref}>
          <img src="/illustration-1-trans.png" alt="Botanical engraving" />
        </div>
        <div className="user-ill user-ill--2" ref={ill2Ref}>
          <img src="/illustration2-trans.png" alt="Tarot clock artwork" />
        </div>
        <div className="user-ill user-ill--3" ref={ill3Ref}>
          <img src="/illustration3-trans.png" alt="Linocut warhorse" />
        </div>
      </div>

      {/* Vignette overlay for cinematic depth */}
      <div className="user-section__vignette" aria-hidden="true" />

      <div className="user-section__container">
        
        {/* Section Header */}
        <div className="user-section__header scroll-reveal-item scroll-reveal--fade" style={{ '--reveal-delay': '0s' }}>
          <div className="user-section__tag">
            <span className="user-section__tag-box">01</span>
            <span className="user-section__tag-text">ABOUT THE DEVELOPER</span>
          </div>
          <div className="user-section__coord">LAT 10.8505° N &nbsp;•&nbsp; LON 76.2711° E</div>
        </div>

        {/* Panoramic Portrait Showcase */}
        <div className="user-section__portrait-wrapper scroll-reveal-item scroll-reveal--cinematic" style={{ '--reveal-delay': '0.1s' }}>
          <div className="user-section__portrait-frame" ref={magnetRef}>
            {/* Corner architectural marks */}
            <span className="user-frame-corner user-frame-corner--tl">┌</span>
            <span className="user-frame-corner user-frame-corner--tr">┐</span>
            <span className="user-frame-corner user-frame-corner--bl">└</span>
            <span className="user-frame-corner user-frame-corner--br">┘</span>

            <div className="user-section__img-box">
              <img
                src="/user.png"
                alt="Aswin Biju"
                className="user-section__img"
              />
              <div className="user-section__img-overlay" />

              {/* Cinematic scan line effect */}
              <div className="user-section__scan-line" aria-hidden="true" />

              {/* ── Handwritten Note on the Edge of the Portrait ── */}
              <div className="user-portrait__handwritten-note">
                <span className="handwritten-tape" aria-hidden="true" />
                <span className="handwritten-text">"absolute worth hiring"</span>
                <svg
                  className="handwritten-doodle"
                  viewBox="0 0 130 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M4,9 C35,14 70,4 126,8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Bottom info bar inside frame */}
            <div className="user-section__frame-caption">
              <span className="user-caption-badge">CREATOR PROFILE</span>
              <span className="user-caption-meta">PORTRAIT № 01 &nbsp;•&nbsp; 35MM MONOCHROME</span>
            </div>
          </div>

          {/* ── Crane at the Marked Section (Click to pop mini cranes!) ── */}
          <div
            className="user-section__crane"
            ref={craneRef}
            onClick={handleCraneClick}
            role="button"
            tabIndex={0}
            title="Click to release mini paper cranes"
          >
            <img
              src="/papercrane.png"
              alt="Origami Paper Crane"
              className="user-section__crane-img"
            />
            <span className="crane-click-hint">✦</span>
          </div>
        </div>

        {/* ── Popped Mini Origami Cranes Burst Layer ── */}
        <div className="crane-pop-layer" aria-hidden="true">
          {poppedCranes.map((crane) => (
            <div
              key={crane.id}
              className="mini-crane-particle"
              style={{
                left: `${crane.x}px`,
                top: `${crane.y}px`,
                '--tx': `${crane.tx}px`,
                '--ty': `${crane.ty}px`,
                '--scale': crane.scale,
                '--r0': `${crane.startRot}deg`,
                '--r1': `${crane.endRot}deg`,
                '--dur': `${crane.duration}s`,
              }}
            >
              <img
                src="/papercrane.png"
                alt=""
                className="mini-crane-particle__img"
              />
            </div>
          ))}
        </div>

        {/* Editorial Statement & Narrative Grid */}
        <div className="user-section__grid">
          
          {/* Left Column: Bold Editorial Quote & Side Quests */}
          <div className="user-section__quote-col scroll-reveal-item scroll-reveal--slide-left" style={{ '--reveal-delay': '0.15s' }}>
            <h2 className="user-section__quote">
              <span className="quote-line quote-line--1">
                <span className="quote-word" style={{ '--qi': 0 }}>
                  <span className="user-quote-italic">Building at the</span> <span className="user-quote-reg">intersection of</span>
                </span>
              </span>
              <span className="quote-line quote-line--2">
                <span className="quote-word" style={{ '--qi': 1 }}>
                  <span className="user-quote-italic">precision code,</span> <span className="user-quote-reg">timeless design,</span>
                </span>
              </span>
              <span className="quote-line quote-line--3">
                <span className="quote-word" style={{ '--qi': 2 }}>
                  <span className="user-quote-italic">and</span>{' '}
                  <span className="user-quote-typewriter">
                    <span className="user-quote-reg-tw">{TYPEWRITER_PHRASES[twPhraseIdx].slice(0, twCharIdx)}</span>
                    <span className="typewriter-cursor" aria-hidden="true">|</span>
                  </span>
                </span>
              </span>
            </h2>

            {/* ── Side Quests Section in Vacant White Space ── */}
            <div className="user-section__sidequests">
              <div className="sidequests__header">
                <span className="sidequests__tag">SIDE QUESTS</span>
                <span className="sidequests__line" />
              </div>

              {/* 3-Column Layout: Big Duolingo (Left) + 3 Stacked (Middle) + 2 Stacked (Right: GitHub & LinkedIn) */}
              <div className="sidequests__layout">
                
                {/* ── Column 1: Big Duolingo Card (Left) ── */}
                <a
                  href="https://www.duolingo.com/profile/aswin.rar"
                  target="_blank"
                  rel="noreferrer"
                  className="card duo-card--big"
                  aria-label="Duolingo Profile aswin.rar"
                  onMouseMove={handleCardTilt}
                  onMouseLeave={handleCardReset}
                >
                  <div className="sq-tooltip" role="tooltip">
                    <span className="sq-tooltip__text">
                      Learning {learningLang} {getLanguageFlag(learningLang)} · {duoStreak === null ? '586' : duoStreak} day streak
                    </span>
                  </div>

                  <div className="duo-widget-card__top">
                    <img
                      src="/duolingo-fire.svg"
                      alt="Fire Streak"
                      className="duo-widget-card__fire"
                    />
                    <span className={`duo-widget-card__streak-num${duoStreak === null ? ' duo-streak--loading' : ''}`}>
                      {duoStreak === null ? '···' : duoStreak}
                    </span>
                  </div>

                  <div className="duo-widget-card__avatar-wrap">
                    <video
                      className="duo-widget-card__avatar-video"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src="/characterduo-alpha.mov" type='video/mp4; codecs="hvc1"' />
                      <source src="/characterduo-alpha.webm" type="video/webm" />
                      <source src="/characterduo.mp4" type="video/mp4" />
                    </video>
                    <div className="duo-widget-card__badge-box">
                      <img
                        src="/duolingo.svg"
                        alt="Duolingo Owl App Icon"
                        className="duo-widget-card__duo-logo"
                      />
                    </div>
                  </div>
                </a>

                {/* ── Column 2: 3 Stacked Cards (Gmail with Copy, Binance, Telegram) ── */}
                <div className="sidequests__stack sidequests__stack--tri">
                  
                  {/* Card 1: Gmail (WITH COPY ICON ONLY) */}
                  <a
                    href="mailto:aswinbiju2004@gmail.com"
                    className="card side-stack-card side-stack-card--gmail"
                    aria-label="Gmail aswinbiju2004@gmail.com"
                    onMouseMove={handleCardTilt}
                    onMouseLeave={handleCardReset}
                    onClick={(e) => handleCopy(e, 'aswinbiju2004@gmail.com', 'gmail')}
                  >
                    <div className="sq-tooltip" role="tooltip">
                      <span className="sq-tooltip__text">
                        {copiedKey === 'gmail' ? 'Copied to clipboard! ✓' : 'aswinbiju2004@gmail.com'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="card__copy-btn"
                      onClick={(e) => handleCopy(e, 'aswinbiju2004@gmail.com', 'gmail')}
                      aria-label="Copy Email"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>

                    <svg className="gm-svg" viewBox="52 42 88 66" width="56" height="56" xmlns="http://www.w3.org/2000/svg">
                      <path className="gm-from-top" fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
                      <path className="gm-from-top" fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92" />
                      <path className="gm-from-top" fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
                      <path className="gm-from-left" fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
                      <path className="gm-from-right" fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
                    </svg>
                  </a>

                  {/* Card 2: Binance (NO COPY ICON) */}
                  <a
                    href="https://www.binance.com"
                    target="_blank"
                    rel="noreferrer"
                    className="card side-stack-card side-stack-card--binance"
                    aria-label="Binance madminer"
                    onMouseMove={handleCardTilt}
                    onMouseLeave={handleCardReset}
                  >
                    <div className="sq-tooltip" role="tooltip">
                      <span className="sq-tooltip__text">
                        Binance · madminer
                      </span>
                    </div>

                    <svg className="bn-svg" viewBox="0 0 96 96" width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path className="bn-top" fill="#F0B90B" d="M34.5355 42.4676l13.4647-13.4644 13.4715 13.4715 7.8346-7.835-21.3061-21.3064-21.2995 21.2995z"/>
                      <path className="bn-left" fill="#F0B90B" d="M21.1683 40.1646l7.8347 7.8347-7.8351 7.8351-7.8346-7.8347z"/>
                      <path className="bn-bottom" fill="#F0B90B" d="M34.5355 55.8322l13.4647 13.464 13.4712-13.4708 7.8391 7.8308-.0042.004-21.3061 21.3064-21.2998-21.2994-.0109-.0108z"/>
                      <path className="bn-right" fill="#F0B90B" d="M82.6674 48l-7.8347 7.8346-7.8346-7.8346 7.8346-7.8347z"/>
                      <path className="bn-center" fill="#F0B90B" d="M55.95 48l-7.95-7.95-7.95 7.95 7.95 7.95z"/>
                    </svg>
                  </a>

                  {/* Card 3: Telegram (NO COPY ICON) */}
                  <a
                    href="https://t.me/immortal182"
                    target="_blank"
                    rel="noreferrer"
                    className="card side-stack-card side-stack-card--telegram"
                    aria-label="Telegram @immortal182"
                    onMouseMove={handleCardTilt}
                    onMouseLeave={handleCardReset}
                  >
                    <div className="sq-tooltip" role="tooltip">
                      <span className="sq-tooltip__text">
                        Telegram · @immortal182
                      </span>
                    </div>

                    <div className="tg-plane">
                      <img src="/telegram.webp" alt="Telegram" className="tg-plane__img" />
                    </div>
                  </a>

                </div>

                {/* ── Column 3: 2 Stacked Cards (Right: GitHub & LinkedIn - Matching Reference Image) ── */}
                <div className="sidequests__stack sidequests__stack--duo">
                  
                  {/* GitHub Square Card */}
                  <a
                    href="https://github.com/aswinb77"
                    target="_blank"
                    rel="noreferrer"
                    className="card side-stack-card side-stack-card--github"
                    aria-label="GitHub aswinb77"
                    onMouseMove={handleCardTilt}
                    onMouseLeave={handleCardReset}
                  >
                    <div className="sq-tooltip" role="tooltip">
                      <span className="sq-tooltip__text">
                        GitHub · aswinb77
                      </span>
                    </div>

                    <svg className="gh-svg" viewBox="0 0 24 24" width="60" height="60" xmlns="http://www.w3.org/2000/svg" style={{ '--gh-len': '300px' }}>
                      <path className="gh-outline" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      <path className="gh-fill" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                  </a>

                  {/* LinkedIn Square Card */}
                  <a
                    href="https://www.linkedin.com/in/aswin-biju7"
                    target="_blank"
                    rel="noreferrer"
                    className="card side-stack-card side-stack-card--linkedin"
                    aria-label="LinkedIn aswin-biju7"
                    onMouseMove={handleCardTilt}
                    onMouseLeave={handleCardReset}
                  >
                    <div className="sq-tooltip" role="tooltip">
                      <span className="sq-tooltip__text">
                        LinkedIn · aswin-biju7
                      </span>
                    </div>

                    <svg className="li-svg" viewBox="0 0 24 24" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                      <path className="li-path" style={{ '--len': 76, '--draw-dur': '0.5s', '--draw-delay': '0s' }} d="M4 2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2z" />
                      <path className="li-path" style={{ '--len': 12, '--draw-dur': '0.3s', '--draw-delay': '0.12s' }} d="M8 11v6" />
                      <circle className="li-dot" cx="8" cy="8" r="1.3" />
                      <path className="li-path" style={{ '--len': 22, '--draw-dur': '0.4s', '--draw-delay': '0.2s' }} d="M12 17v-4c0-1.5 1-2.2 2.2-2.2s1.8.8 1.8 2.2v4" />
                    </svg>
                  </a>

                </div>
              </div>
            </div>

          </div>


          {/* Right Column: Bio & Core Disciplines */}
          <div className="user-section__bio-col scroll-reveal-item scroll-reveal--slide-right" style={{ '--reveal-delay': '0.25s' }}>
            <p ref={bioTextRef} className="user-section__bio-text">
              {bioTokens.map((token, index) => {
                if (token.type === 'name') {
                  return (
                    <span key={index} className="progressive-word pen-marked-name">
                      <span className="base-layer">{token.text}</span>
                      <span className="fill-layer" aria-hidden="true">{token.text}</span>
                      <svg
                        className="pen-sketch-circle"
                        viewBox="0 0 160 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M18,28 C28,10 75,4 125,7 C148,8 158,16 155,26 C151,36 128,42 90,44 C45,46 8,40 5,24 C3,12 35,5 82,6 C124,7 154,14 153,28 C152,38 120,43 85,44"
                          className="pen-sketch-path"
                        />
                      </svg>
                    </span>
                  )
                }
                return (
                  <span key={index} className="progressive-word">
                    <span className="base-layer">{token.text}</span>
                    <span className="fill-layer" aria-hidden="true">{token.text}</span>
                  </span>
                )
              })}
            </p>

            {/* Real-time Collaboration Bento Card */}
            <div
              className="bento-collab-card"
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setHoveredCard((prev) => (prev === 3 ? null : 3))}
            >
              <div className="bento-collab__info">
                <h3 className="bento-collab__title">
                  Real-time collaboration{' '}
                  <svg className="bento-collab__users-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </h3>
                <p className="bento-collab__desc">
                  Work together with your team in real-time. See cursors, leave
                  comments, and ship faster.
                </p>
                <a
                  href="mailto:contact@aswinbiju.com"
                  className="bento-collab__btn"
                >
                  Get in touch ↗
                </a>
              </div>

              <div className="bento-collab__preview-side">
                {/* Animated Group Wrapper */}
                <div className="bento-collab__group-wrap">
                  {/* Mockup UI */}
                  <div className="bento-collab__mockup-ui">
                    {/* Mock Document Content */}
                    <div 
                      className="bento-collab__bar bento-collab__bar--title" 
                      style={{
                        width: hoveredCard === 3 ? '80%' : '75%',
                        transition: 'width 0.7s ease-out',
                      }}
                    />
                    <div 
                      className="bento-collab__bar bento-collab__bar--line" 
                      style={{
                        width: hoveredCard === 3 ? '95%' : '100%',
                        transition: 'width 0.7s ease-out 0.075s',
                      }}
                    />
                    <div 
                      className="bento-collab__bar bento-collab__bar--line" 
                      style={{
                        width: hoveredCard === 3 ? '85%' : '83.333333%',
                        transition: 'width 0.7s ease-out 0.1s',
                      }}
                    />

                    {/* Cursor 1 */}
                    <div 
                      className="bento-collab__cursor bento-collab__cursor--you"
                      style={{
                        transform: hoveredCard === 3 ? 'translate(32px, 12px)' : 'translate(0px, 0px)',
                        transition: 'transform 0.7s ease-out',
                      }}
                    >
                      <svg className="bento-collab__cursor-svg bento-collab__cursor-svg--rose" viewBox="0 0 24 24" width="16" height="16">
                        <path d="m4.037 4.688 15.358 6.425a.5.5 0 0 1-.06.945l-6.423 1.848-1.848 6.423a.5.5 0 0 1-.945.06L3.694 5.031a.5.5 0 0 1 .343-.343z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      <div className="bento-collab__cursor-label bento-collab__cursor-label--rose">
                        You
                      </div>
                    </div>

                    <div 
                      className="bento-collab__bar bento-collab__bar--line" 
                      style={{
                        width: hoveredCard === 3 ? '90%' : '91.666667%',
                        transition: 'width 0.7s ease-out 0.2s',
                      }}
                    />

                    {/* Cursor 2 */}
                    <div 
                      className="bento-collab__cursor bento-collab__cursor--aswin"
                      style={{
                        transform: hoveredCard === 3 ? 'translate(-24px, -16px)' : 'translate(0px, 0px)',
                        transition: 'transform 0.7s ease-out',
                      }}
                    >
                      <svg className="bento-collab__cursor-svg bento-collab__cursor-svg--blue" viewBox="0 0 24 24" width="16" height="16">
                        <path d="m4.037 4.688 15.358 6.425a.5.5 0 0 1-.06.945l-6.423 1.848-1.848 6.423a.5.5 0 0 1-.945.06L3.694 5.031a.5.5 0 0 1 .343-.343z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      <div className="bento-collab__cursor-label bento-collab__cursor-label--blue">
                        Aswin
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cat Suction Loop */}
            <div className="user-section__actions fade-and-rise" style={{ '--delay': '0.75s' }}>
              <div className="user-section__cat-container">
                <div className="cat-scene">
                  {/* Wind lines emitted to the left during suction */}
                  <div className="cat-wind" aria-hidden="true">
                    <span className="cat-wind__line cat-wind__line--1" />
                    <span className="cat-wind__line cat-wind__line--2" />
                    <span className="cat-wind__line cat-wind__line--3" />
                  </div>
                  {/* Fail pop spark burst */}
                  <div className="cat-pop" aria-hidden="true">
                    <span className="cat-pop__dot cat-pop__dot--1" />
                    <span className="cat-pop__dot cat-pop__dot--2" />
                    <span className="cat-pop__dot cat-pop__dot--3" />
                    <span className="cat-pop__dot cat-pop__dot--4" />
                  </div>
                  <img
                    src="/catlook.png"
                    alt="Cat companion"
                    className="user-section__cat-img"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Floating feedback when Email copied */}
      {copiedKey === 'gmail' && (
        <div className="card-copied-toast" role="status">
          Copied aswinbiju2004@gmail.com to clipboard! ✓
        </div>
      )}
    </section>
  )
}
