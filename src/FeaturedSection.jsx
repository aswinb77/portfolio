import { useEffect, useRef, useState } from 'react'
import './FeaturedSection.css'
import ProjectDetailModal from './ProjectDetailModal'
import LighthouseFeature from './LighthouseFeature'

export default function FeaturedSection() {
  const sectionRef = useRef(null)
  const trackWrapRef = useRef(null)
  const trackRef = useRef(null)
  const featuredCraneRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768 || window.matchMedia('(hover: none)').matches
    }
    return false
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768 || window.matchMedia('(hover: none)').matches)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const projects = [
    {
      id: '01',
      client: 'Finmate',
      title: 'Your Budget Mate',
      description: 'A personal finance companion that tracks every rupee with Finny, your friendly finance dragon.',
      category: 'Mobile · Product Design',
      link: '#',
      github: 'https://github.com/aswinb77/finmate',
      themeColor: '#d96b4a',
      headerType: 'finmate',
    },
    {
      id: '02',
      client: 'Movie CC',
      title: 'Discover Every Frame',
      description: 'A global movie discovery platform powered by real-time web scraping , refreshed every 6 hours. Hosts a clustered live chatroom.',
      category: 'Full-Stack · Real-time',
      link: '#',
      github: 'https://github.com/aswinb77/Anapp',
      themeColor: '#e11d48',
      headerType: 'moviecc',
    },
    {
      id: '03',
      client: 'PMSE',
      title: 'Predictive EV Maintenance',
      description: 'On-device TinyML inference on ESP32/Arduino paired with a cross-platform Flutter app to predict EV motor faults and anomalies in real time.',
      category: 'Embedded AI · Mobile',
      link: '#',
      github: 'https://github.com/aswinb77/ev-sensor',
      themeColor: '#06b6d4',
      headerType: 'pmse',
    },
    {
      id: '04',
      client: 'AV Wallet',
      title: 'Mobile E-Wallet App',
      description: 'A PHP + MySQL dual-panel mobile-web e-wallet with user wallet & merchant dashboard, AJAX-powered transactions, and Telegram-bot payout approvals.',
      category: 'Full-Stack · Mobile Web',
      link: '#',
      github: 'https://github.com/aswinb77/e-wallet',
      themeColor: '#10b981',
      headerType: 'avwallet',
    },
    {
      id: '05',
      client: 'Kalavasta',
      title: 'Kerala Climate Dashboard',
      description: 'A real-time climate monitoring web app with live Open-Meteo telemetry across all 14 Kerala districts, interactive Leaflet choropleth maps, and 3-day forecasts.',
      category: 'React · Open-Meteo · Leaflet',
      link: 'https://kalavasta.vercel.app',
      github: 'https://github.com/aswinb77/kalavasta',
      themeColor: '#1e8a66',
      headerType: 'kalavasta',
    },
  ]

  const handleOpenProject = (project) => {
    setSelectedProject(project)
  }

  const handleCloseProject = () => {
    setSelectedProject(null)
  }

  const handleNextProject = () => {
    if (!selectedProject) return
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id)
    const nextIndex = (currentIndex + 1) % projects.length
    setSelectedProject(projects[nextIndex])
  }

  const handlePrevProject = () => {
    if (!selectedProject) return
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id)
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length
    setSelectedProject(projects[prevIndex])
  }

  // Pinned scroll calculation: progress from the section's reserved scroll range
  useEffect(() => {
    let animId = null

    const updatePinnedTrack = () => {
      if (!sectionRef.current || !trackRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const scrollable = sectionRef.current.offsetHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 0

      setScrollProgress(progress)

      // Calculate translation
      const trackEl = trackRef.current
      const wrapEl = trackWrapRef.current
      if (trackEl && wrapEl) {
        const maxTranslate = Math.max(trackEl.scrollWidth - wrapEl.clientWidth + 40, 0)
        trackEl.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`
      }

      // Flight of paper crane synchronized with the pinned section progress
      if (featuredCraneRef.current) {
        const viewportW = window.innerWidth
        const craneW = Math.min(180, Math.max(120, viewportW * 0.14))
        // Starts in view at the beginning (near top left) and glides across to the right
        const startX = Math.max(24, viewportW * 0.02)
        const endX = Math.max(viewportW - craneW - 40, startX + 260)
        const moveX = startX + progress * (endX - startX)
        const moveY = Math.sin(progress * Math.PI * 2.5) * 16
        const rotate = -8 + Math.sin(progress * Math.PI * 3) * 7
        // Keep the crane visible throughout instead of totally disappearing
        const opacity = 1

        featuredCraneRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${rotate}deg)`
        featuredCraneRef.current.style.opacity = `${opacity}`
      }
    }

    const onScroll = () => {
      if (animId) cancelAnimationFrame(animId)
      animId = requestAnimationFrame(updatePinnedTrack)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    updatePinnedTrack()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [])

  // Scroll prev/next buttons move the window scroll position through the pin runway
  const scrollByStep = (direction) => {
    if (!sectionRef.current) return
    const scrollable = sectionRef.current.offsetHeight - window.innerHeight
    const rect = sectionRef.current.getBoundingClientRect()
    const currentProgress = scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 0
    const step = 1 / (projects.length - 1)
    const targetProgress = Math.max(0, Math.min(1, currentProgress + direction * step))

    const targetY = window.scrollY + rect.top + targetProgress * scrollable
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }

  // Render the fanning background layers for each project
  const renderFanStack = (type) => {
    if (type === 'finmate') {
      return (
        <div className="colin-fan-stack finmate-fan-stack" aria-hidden="true">
          {/* Left screen: Meet Finny onboarding */}
          <div className="colin-fan-card colin-fan-card--left finmate-phone-card">
            <div className="finmate-phone-frame">
              <img
                src="/finmate-meet.png"
                alt="Finmate — Meet Finny onboarding screen"
                className="finmate-phone-img"
              />
            </div>
          </div>

          {/* Center screen: Just say it (chat interface, featured) */}
          <div className="colin-fan-card colin-fan-card--center finmate-phone-card finmate-phone-card--main">
            <div className="finmate-phone-frame finmate-phone-frame--main">
              <img
                src="/finmate-chat.png"
                alt="Finmate — AI Chat screen"
                className="finmate-phone-img"
              />
            </div>
          </div>

          {/* Right screen: Story Ring / Analytics */}
          <div className="colin-fan-card colin-fan-card--right finmate-phone-card">
            <div className="finmate-phone-frame">
              <img
                src="/finmate-story.png"
                alt="Finmate — Story Ring screen"
                className="finmate-phone-img"
              />
            </div>
          </div>
        </div>
      )
    }

    if (type === 'moviecc') {
      return (
        <div className="colin-fan-stack moviecc-fan-stack" aria-hidden="true">
          {/* Left screen: News Feed */}
          <div className="colin-fan-card colin-fan-card--left moviecc-phone-card">
            <div className="moviecc-phone-frame">
              <img
                src="/moviecc-news.jpg"
                alt="Movie CC — Verified Movie News Feed"
                className="moviecc-phone-img"
              />
            </div>
          </div>

          {/* Center screen: Favorites / Movies Hub (featured) */}
          <div className="colin-fan-card colin-fan-card--center moviecc-phone-card moviecc-phone-card--main">
            <div className="moviecc-phone-frame moviecc-phone-frame--main">
              <img
                src="/moviecc-favorites.jpg"
                alt="Movie CC — My Favorites & Movie Hub"
                className="moviecc-phone-img"
              />
            </div>
          </div>

          {/* Right screen: Clustered Global Chat */}
          <div className="colin-fan-card colin-fan-card--right moviecc-phone-card">
            <div className="moviecc-phone-frame">
              <img
                src="/moviecc-chat.jpg"
                alt="Movie CC — Clustered Global Chatroom"
                className="moviecc-phone-img"
              />
            </div>
          </div>
        </div>
      )
    }

    if (type === 'pmse') {
      return (
        <div className="colin-fan-stack pmse-fan-stack" aria-hidden="true">
          {/* Left: EV Architecture Schematic */}
          <div className="colin-fan-card colin-fan-card--left pmse-fan-card">
            <div className="pmse-fan-frame">
              <img
                src="/pmse-app-health.jpg"
                alt="PMSE EV Sensor Architecture"
                className="pmse-fan-img"
              />
              <span className="pmse-fan-label">SENSOR TOPOLOGY</span>
            </div>
          </div>

          {/* Center: Flutter Companion App UI (featured) */}
          <div className="colin-fan-card colin-fan-card--center pmse-fan-card pmse-fan-card--main">
            <div className="pmse-fan-frame pmse-fan-frame--main">
              <img
                src="/pmse-app.jpg"
                alt="PMSE Flutter Companion Telemetry App"
                className="pmse-fan-img"
              />
            </div>
          </div>

          {/* Right: Hardware Components */}
          <div className="colin-fan-card colin-fan-card--right pmse-fan-card">
            <div className="pmse-fan-frame">
              <img
                src="/pmse-components.jpg"
                alt="PMSE Hardware Components"
                className="pmse-fan-img"
              />
              <span className="pmse-fan-label">COMPONENTS</span>
            </div>
          </div>
        </div>
      )
    }

    if (type === 'avwallet') {
      return (
        <div className="colin-fan-stack avwallet-fan-stack" aria-hidden="true">
          {/* Left: Auth / Login screen */}
          <div className="colin-fan-card colin-fan-card--left avwallet-phone-card">
            <div className="avwallet-phone-frame">
              <div className="avwallet-auth-screen">
                <div className="avwallet-auth-logo">AV</div>
                <div className="avwallet-auth-title">Sign In</div>
                <div className="avwallet-auth-field">📧 user@example.com</div>
                <div className="avwallet-auth-field avwallet-auth-field--pass">🔒 ••••••••</div>
                <div className="avwallet-auth-btn">Login</div>
              </div>
            </div>
          </div>

          {/* Center: Wallet Dashboard (featured) */}
          <div className="colin-fan-card colin-fan-card--center avwallet-phone-card avwallet-phone-card--main">
            <div className="avwallet-phone-frame avwallet-phone-frame--main">
              <div className="avwallet-dash-screen">
                <div className="avwallet-balance-card">
                  <span className="avwallet-balance-label">Total Balance</span>
                  <span className="avwallet-balance-amt">₹ 24,850.00</span>
                </div>
                <div className="avwallet-actions">
                  <span className="avwallet-action-btn">↑ Send</span>
                  <span className="avwallet-action-btn">↓ Top Up</span>
                </div>
                <div className="avwallet-tx-list">
                  <div className="avwallet-tx"><span>Coffee</span><span className="avwallet-tx-neg">−₹120</span></div>
                  <div className="avwallet-tx"><span>Transfer</span><span className="avwallet-tx-pos">+₹500</span></div>
                  <div className="avwallet-tx"><span>Grocery</span><span className="avwallet-tx-neg">−₹340</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Merchant Panel */}
          <div className="colin-fan-card colin-fan-card--right avwallet-phone-card">
            <div className="avwallet-phone-frame">
              <div className="avwallet-merchant-screen">
                <div className="avwallet-merchant-badge">MERCHANT</div>
                <div className="avwallet-merchant-stat"><span>Orders</span><span>142</span></div>
                <div className="avwallet-merchant-stat"><span>Revenue</span><span>₹88k</span></div>
                <div className="avwallet-merchant-stat avwallet-merchant-stat--pending"><span>Pending</span><span>3</span></div>
                <div className="avwallet-telegram-row">📨 Telegram Payout Bot</div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (type === 'kalavasta') {
      return (
        <div className="colin-fan-stack kalavasta-fan-stack" aria-hidden="true">
          {/* Left: District mobile view */}
          <div className="colin-fan-card colin-fan-card--left kalavasta-fan-card">
            <div className="kalavasta-fan-frame">
              <img
                src="/kalavasta-mobile.png"
                alt="Kalavasta Mobile Weather"
                className="kalavasta-fan-img"
              />
              <span className="kalavasta-fan-label">DISTRICT TELEMETRY</span>
            </div>
          </div>

          {/* Center: Interactive GIS Map */}
          <div className="colin-fan-card colin-fan-card--center kalavasta-fan-card kalavasta-fan-card--main">
            <div className="kalavasta-fan-frame kalavasta-fan-frame--main">
              <img
                src="/kalavasta-screen.png"
                alt="Kalavasta Kerala Radar Map"
                className="kalavasta-fan-img"
              />
              <span className="kalavasta-fan-label kalavasta-fan-label--live">● LIVE MAP</span>
            </div>
          </div>

          {/* Right: Live Telemetry Widget */}
          <div className="colin-fan-card colin-fan-card--right kalavasta-fan-card">
            <div className="kalavasta-fan-frame kalavasta-widget-frame">
              <div className="kalavasta-widget-header">
                <span className="kalavasta-widget-badge">OPEN-METEO</span>
                <span className="kalavasta-widget-badge kalavasta-widget-badge--green">LIVE</span>
              </div>
              <div className="kalavasta-widget-body">
                <img src="/kalavasta-storm.gif" alt="Thunderstorm" className="kalavasta-widget-gif" />
                <div className="kalavasta-widget-temp">28°C</div>
                <div className="kalavasta-widget-malayalam">ഇടിവെട്ടി മഴ</div>
              </div>
              <div className="kalavasta-widget-footer">
                <span>14 Districts Synced</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Default fallback
    return (
      <div className="colin-fan-stack" aria-hidden="true" />
    )
  }

  // Render front card artwork / banner based on headerType
  const renderCardArtwork = (project) => {
    if (project.headerType === 'finmate') {
      return (
        <div className="colin-art colin-art--finmate">
          {/* Warm cream background matching Finmate brand */}
          <div className="finmate-art-bg" />
          <div className="finmate-art-glow" />

          {/* Dual phone showcase: Onboarding screen + Chat interface */}
          <div className="finmate-art-duo">
            <div className="finmate-art-phone finmate-art-phone--back">
              <img
                src="/finmate-meet.png"
                alt="Finmate app — Meet Finny onboarding"
                className="finmate-art-phone-img"
              />
            </div>
            <div className="finmate-art-phone finmate-art-phone--front">
              <img
                src="/finmate-chat.png"
                alt="Finmate app — Chat interface"
                className="finmate-art-phone-img"
              />
            </div>
          </div>

          {/* Cute Finny mascot floating badge */}
          <div className="finmate-art-mascot-badge" title="Finny the finance dragon">
            <img
              src="/finmate-mascot.png"
              alt="Finny mascot"
              className="finmate-mascot-badge-img"
            />
          </div>
        </div>
      )
    }

    if (project.headerType === 'moviecc') {
      return (
        <div className="colin-art colin-art--moviecc">
          {/* Deep cinematic background */}
          <div className="moviecc-art-bg" />
          <div className="moviecc-art-glow" />

          {/* Dual phone showcase: News Feed (back) + Favorites / Featured Movie (front) */}
          <div className="moviecc-art-duo">
            <div className="moviecc-art-phone moviecc-art-phone--back">
              <img
                src="/moviecc-news.jpg"
                alt="Movie CC — Verified News Feed"
                className="moviecc-art-phone-img"
              />
            </div>
            <div className="moviecc-art-phone moviecc-art-phone--front">
              <img
                src="/moviecc-splash.jpg"
                alt="Movie CC — Movie Discovery & Favorites"
                className="moviecc-art-phone-img"
              />
            </div>
          </div>

          {/* Floating cinema ticket pass icon badge */}
          <div className="moviecc-art-badge" title="Movie CC Cinema Pass">
            <svg
              className="moviecc-pass-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Ticket pass outline with notch cutouts */}
              <path d="M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3z" />
              {/* Perforated ticket tear line */}
              <path d="M13 5v2" strokeDasharray="1.5 1.5" />
              <path d="M13 11v2" strokeDasharray="1.5 1.5" />
              <path d="M13 17v2" strokeDasharray="1.5 1.5" />
              {/* Star / VIP cinema stamp */}
              <polygon
                points="8.5 8 9.5 10.5 12 10.5 10 12 10.8 14.5 8.5 13 6.2 14.5 7 12 5 10.5 7.5 10.5"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </div>
          
        </div>
      )
    }

    if (project.headerType === 'pmse') {
      return (
        <div className="colin-art colin-art--pmse">
          {/* Deep sleek dark obsidian background matching Unicare reference */}
          <div className="pmse-unicare-bg" />

          {/* Centered minimalist brand lockup: Ring icon + PMSE title */}
          <div className="pmse-unicare-lockup">
            <span className="pmse-unicare-ring" aria-hidden="true" />
            <span className="pmse-unicare-name">PMSE</span>
          </div>
        </div>
      )
    }

    if (project.headerType === 'avwallet') {
      return (
        <div className="colin-art colin-art--avwallet">
          <div className="avwallet-art-bg" />
          <div className="avwallet-art-glow" />
          {/* Centered brand lockup */}
          <div className="avwallet-art-lockup">
            <div className="avwallet-art-icon" aria-hidden="true">
              <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
                <rect x="3" y="10" width="34" height="22" rx="5" stroke="#10b981" strokeWidth="2.5"/>
                <path d="M3 16h34" stroke="#10b981" strokeWidth="2"/>
                <rect x="26" y="21" width="7" height="5" rx="2" fill="#10b981" opacity="0.85"/>
              </svg>
            </div>
            <span className="avwallet-art-name">AV Wallet</span>
          </div>
        </div>
      )
    }

    if (project.headerType === 'kalavasta') {
      return (
        <div className="colin-art colin-art--kalavasta">
          <div className="kalavasta-art-bg" />
          <div className="kalavasta-art-glow" />
          {/* Centered brand lockup matching Kalavasta branding */}
          <div className="kalavasta-art-lockup">
            <div className="kalavasta-art-icon-wrap" aria-hidden="true">
              <img src="/kalavasta-logo.png" alt="Kalavasta Logo" className="kalavasta-art-logo" />
            </div>
            <div className="kalavasta-art-text">
              <span className="kalavasta-art-name">KALAVASTA</span>
              <span className="kalavasta-art-sub">കാലാവസ്ഥ · Kerala Weather Radar</span>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="colin-art colin-art--default">
        <div className="archive-art-bg" />
      </div>
    )
  }

  return (
    <section className="featured-section" id="works" ref={sectionRef}>
      
      {/* ── Sticky 100vh Inner Viewport Frame ── */}
      <div className="featured-pin-inner">

        {/* ── Realistic Ripped / Torn Paper Edge Top Mask ── */}
        <div className="ripped-paper-edge" aria-hidden="true">
          <svg
            className="torn-edge-svg"
            viewBox="0 0 1440 85"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="torn-shadow-deep"
              d="M0,0 L1440,0 L1440,32 Q1380,52 1310,38 T1160,48 T1020,32 T870,54 T720,36 T580,50 T430,34 T280,48 T130,36 T0,50 Z"
            />
            <path
              className="torn-fiber-under"
              d="M0,0 L1440,0 L1440,42 Q1390,62 1330,46 T1190,56 T1050,42 T900,62 T760,44 T610,60 T460,42 T310,58 T160,42 T0,58 Z"
            />
            <path
              className="torn-paper-body"
              d="M0,0 L1440,0 L1440,55 C1410,65 1375,48 1340,62 C1300,75 1270,52 1230,68 C1185,82 1150,56 1105,72 C1060,86 1025,60 980,74 C940,84 905,58 865,72 C820,85 785,62 745,76 C700,88 665,64 625,78 C580,89 545,66 505,80 C465,90 430,65 390,78 C345,90 310,66 270,80 C225,91 190,68 150,82 C110,92 75,70 35,84 L0,85 Z"
            />
          </svg>
        </div>

        {/* ── Flying Paper Crane across Featured Works ── */}
        <div className="featured-crane-track" aria-hidden="true">
          <div className="featured-crane" ref={featuredCraneRef}>
            <img
              src="/cranefly.png"
              alt="Silk Embroidery Crane soaring"
              className="featured-crane__img"
            />
          </div>
        </div>

        {/* ── Background Blend Illustrations ── */}
        <div className="featured-ills" aria-hidden="true">
          <div className="featured-ill featured-ill--hibiscus">
            <img src="/hibiscus.png" alt="" />
          </div>
        </div>

        {/* ── Interactive Lighthouse & Glowing Tools — bottom strip, clipped ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: 0,
            width: '100%',
            height: '200px',
            overflow: 'hidden',
            zIndex: 3,
            pointerEvents: 'auto',
          }}
        >
          <LighthouseFeature />
        </div>

        <div className="featured-container">
          
          {/* Editorial Header with Title & Horizontal Scroll Navigation */}
          <div className="featured-header-horizontal">
            <div className="featured-header-title-wrap">
              <h2 className="featured-main-title">Selected work</h2>
              <span className="featured-scroll-hint">SCROLL DOWN TO EXPLORE ↔</span>
            </div>

            <div className="featured-scroll-nav">
              <button
                className="featured-nav-btn featured-nav-btn--prev"
                onClick={() => scrollByStep(-1)}
                aria-label="Scroll left"
                title="Previous works"
              >
                <span>←</span>
              </button>
              <button
                className="featured-nav-btn featured-nav-btn--next"
                onClick={() => scrollByStep(1)}
                aria-label="Scroll right"
                title="Next works"
              >
                <span>→</span>
              </button>
            </div>
          </div>

          {/* ── Horizontal Scroll Track for Selected Work Cards ── */}
          <div
            className="featured-horizontal-track-wrap"
            ref={trackWrapRef}
          >
            <div
              className="colin-works-horizontal-track"
              ref={trackRef}
            >
              {projects.map((project, idx) => (
                <div
                  key={project.id}
                  className="colin-work-col colin-work-col--horizontal"
                  style={{ '--delay': `${idx * 0.08}s` }}
                >
                  {/* Main Card Component (Click to open Detailed Overview) */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleOpenProject(project)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleOpenProject(project)
                      }
                    }}
                    className="colin-card colin-card--interactive"
                    title={isMobile ? undefined : `View detailed overview for ${project.client} — ${project.title}`}
                  >
                    
                    {/* ── Behind Fanning Screens / Mockup Layers (fan out on hover) ── */}
                    {renderFanStack(project.headerType)}

                    {/* ── Front Card Visual & Body Box ── */}
                    <div className="colin-card__front">
                      
                      {/* Artwork / Showcase Header */}
                      <div className="colin-card__artwork-wrap">
                        {renderCardArtwork(project)}

                        {/* Decorative Wavy Cutout Bottom Divider */}
                        <svg
                          className="colin-card-wave"
                          viewBox="0 0 320 36"
                          fill="#ffffff"
                          preserveAspectRatio="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M0,20 C80,36 160,8 240,24 C280,32 300,18 320,22 L320,36 L0,36 Z" />
                        </svg>
                      </div>

                      {/* Card Bottom Body */}
                      <div className="colin-card__body">
                        <span className="colin-card__client">{project.client}</span>
                        <h3 className="colin-card__title">
                          {project.title}
                        </h3>
                        <span className="colin-card__tap-hint">view case study ↗</span>
                      </div>

                    </div>

                  </div>

                  {/* External Description Under the Card */}
                  <p className="colin-work-desc">{project.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Horizontal Scroll Progress Bar Indicator */}
          <div className="featured-scroll-indicator-bar" aria-hidden="true">
            <div
              className="featured-scroll-indicator-thumb"
              style={{ width: `${Math.max(12, scrollProgress * 100)}%` }}
            />
          </div>

        </div>

        {/* ── Corner View Complete Work Archive Button ── */}
        <div className="featured-corner-archive">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="view-archive-btn"
          >
            <span className="view-archive-btn__label">VIEW COMPLETE WORK ARCHIVE</span>
            <span className="view-archive-btn__icon">↗</span>
          </a>
        </div>

      </div>

      {/* ── Project Detailed Overview Modal / Full Case Study View ── */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={handleCloseProject}
        onNextProject={handleNextProject}
        onPrevProject={handlePrevProject}
        currentIndex={selectedProject ? projects.findIndex((p) => p.id === selectedProject.id) : 0}
        totalProjects={projects.length}
      />

    </section>
  )
}
