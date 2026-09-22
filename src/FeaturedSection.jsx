import { useState } from 'react'
import './FeaturedSection.css'
import ProjectDetailModal from './ProjectDetailModal'

export default function FeaturedSection() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [hoveredProjectId, setHoveredProjectId] = useState(null)

  // Explicit user order: Finmate, Movie.cc, PMSE, Merchant Wallet
  const projects = [
    {
      id: 'finmate',
      client: 'Finmate',
      title: 'Finmate',
      subtitle: 'A personal finance companion that tracks every rupee with Finny.',
      description: 'A personal finance companion that tracks every rupee with Finny, your friendly finance dragon.',
      bullets: [
        '10k+ transactions tracked with Finny AI',
        '84% positive in-product habit retention',
        '3.2x faster expense logging vs manual spreadsheets',
      ],
      category: 'Mobile · Product Design',
      link: '#',
      github: 'https://github.com/aswinb77/finmate',
      themeColor: '#d96b4a',
      headerType: 'finmate',
      video: '/finny_product_video.mp4',
      previewImg: '/finmate-story.png',
      previewTag: 'NATURAL VOICE EXPENSE TRACKER',
    },
    {
      id: 'moviecc',
      client: 'Movie.cc',
      title: 'Movie.cc',
      subtitle: 'Discover every frame with real-time cinema intelligence and live chat.',
      description: 'A global movie discovery platform powered by real-time web scraping, refreshed every 6 hours. Hosts a clustered live chatroom.',
      bullets: [
        '6h auto-scraping cycle across global movie feeds',
        'Clustered live chatroom with active viewer rooms',
        '100% real-time streaming link & trailer updates',
      ],
      category: 'Full-Stack · Real-time Platform',
      link: '#',
      github: 'https://github.com/aswinb77/Anapp',
      themeColor: '#e11d48',
      headerType: 'moviecc',
      video: '/moviecc_intro.mp4',
      previewImg: '/moviecc-feed.jpg',
      previewTag: 'REAL-TIME SCRAPER & LIVE CHAT',
    },
    {
      id: 'pmse',
      client: 'PMSE',
      title: 'PMSE',
      subtitle: 'Predictive EV maintenance on-device before mechanical failure occurs.',
      description: 'On-device TinyML inference on ESP32 paired with a cross-platform Flutter app to predict EV motor faults and anomalies in real time.',
      bullets: [
        'On-device TinyML inference running on ESP32',
        '60FPS native Flutter dashboard telemetry',
        'Real-time fault anomaly detection & alerts',
      ],
      category: 'Embedded AI · Mobile',
      link: '#',
      github: 'https://github.com/aswinb77/ev-sensor',
      themeColor: '#06b6d4',
      headerType: 'pmse',
      video: '/pmse.mp4',
      previewImg: '/pmse-app.jpg',
      previewTag: 'TINYML ON ESP32 + FLUTTER',
    },
    {
      id: 'merchant-wallet',
      client: 'Merchant Wallet',
      title: 'Merchant Wallet',
      subtitle: 'Dual-panel mobile e-wallet engineered for high-volume transactions.',
      description: 'A dual-panel mobile-web e-wallet with user wallet & merchant dashboard, AJAX-powered transactions, and Telegram-bot payout approvals.',
      bullets: [
        'Instant merchant payout workflows & balance ledger',
        'Automated Telegram bot approval & notification pipeline',
        'Dual-role security architecture with audit trails',
      ],
      category: 'Full-Stack · Mobile Web',
      link: '#',
      github: 'https://github.com/aswinb77/e-wallet',
      themeColor: '#10b981',
      headerType: 'avwallet',
      previewImg: '/avwallet-merchant.png',
      previewTag: 'DUAL-PANEL E-WALLET & BOT',
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

  // Active project on desktop when hovered
  const activeProject = hoveredProjectId
    ? projects.find((p) => p.id === hoveredProjectId)
    : null

  return (
    <section className="featured-section" id="work">
      {/* ── Realistic Ripped Paper Top Edge Transition from Dark Hero ──── */}
      <div className="ripped-paper-edge" aria-hidden="true">
        <svg
          className="torn-edge-svg"
          viewBox="0 0 1440 95"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="torn-shadow-deep"
            d="M0,0 L1440,0 L1440,28 Q1380,48 1320,32 T1200,42 T1080,28 T940,48 T800,32 T640,46 T480,28 T320,44 T160,30 T0,46 Z"
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

      <div className="featured-container">
        
        {/* ── Smaller Heading for Selected Work (Image 1) ── */}
        <div className="featured-small-heading-wrap">
          <span className="featured-eyebrow-tag">SELECTED WORK</span>
          <div className="featured-divider-line" />
        </div>

        {/* ── Subtitle: "Recent work." (Image 2) ── */}
        <div className="featured-recent-header">
          <h3 className="featured-recent-title">Recent work.</h3>
        </div>

        {/* ══════════════════════════════════════════════════
            DESKTOP LAYOUT: List Left + Floating Tilted Card Right
           ══════════════════════════════════════════════════ */}
        <div
          className="featured-interactive-stage desktop-only"
          onMouseLeave={() => setHoveredProjectId(null)}
        >
          {/* Left Column: Big Typography Project List */}
          <div className="featured-list-col">
            {projects.map((project) => {
              const isActive = hoveredProjectId === project.id
              return (
                <div
                  key={project.id}
                  className={`featured-project-row ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onClick={() => handleOpenProject(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleOpenProject(project)
                    }
                  }}
                >
                  <div className="featured-title-line">
                    <span className="featured-row-arrow" aria-hidden="true">
                      →
                    </span>

                    <h2 className="featured-row-title">{project.title}</h2>

                    <button
                      type="button"
                      className="featured-know-more-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenProject(project)
                      }}
                      tabIndex={isActive ? 0 : -1}
                    >
                      <span>Know more</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  </div>

                  <div className="featured-row-desc-wrap">
                    <p className="featured-row-desc">{project.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Tilted Preview Card */}
          <div className="featured-preview-col">
            <div
              className={`featured-preview-card ${activeProject ? 'is-visible' : 'is-hidden'}`}
              role="button"
              tabIndex={activeProject ? 0 : -1}
              onClick={() => activeProject && handleOpenProject(activeProject)}
              title={activeProject ? `Click to view case study: ${activeProject.title}` : undefined}
            >
              {activeProject && (
                <>
                  <div className="featured-card-topbar">
                    <div className="featured-topbar-dots">
                      <span className="dot dot--red" />
                      <span className="dot dot--yellow" />
                      <span className="dot dot--green" />
                    </div>
                    <span className="featured-topbar-url">{activeProject.client.toLowerCase().replace(/\s+/g, '')}.app</span>
                    <span className="featured-topbar-badge">{activeProject.category}</span>
                  </div>

                  <div className="featured-card-img-wrap">
                    {activeProject.video ? (
                      <video
                        key={activeProject.id}
                        src={activeProject.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="featured-card-screenshot featured-card-video"
                      />
                    ) : (
                      <img
                        key={activeProject.id}
                        src={activeProject.previewImg}
                        alt={activeProject.title}
                        className="featured-card-screenshot"
                        loading="lazy"
                      />
                    )}
                  </div>

                  <div className="featured-card-footer">
                    <div className="featured-footer-info">
                      <span className="featured-footer-client">{activeProject.client}</span>
                      <span className="featured-footer-sub">{activeProject.subtitle}</span>
                    </div>
                    <span className="featured-footer-cta">View Case Study ↗</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            MOBILE LAYOUT: Editorial Cards Stack (Matches Screenshots)
           ══════════════════════════════════════════════════ */}
        <div className="featured-mobile-stack mobile-only">
          {projects.map((project) => (
            <div
              key={project.id}
              className="featured-mobile-card"
              onClick={() => handleOpenProject(project)}
            >
              {/* Top Visual Box with Starry/Cosmic Backdrop + Centered Phone Frame */}
              <div className="featured-mobile-visual">
                <div className="featured-phone-mockup">
                  {/* Dynamic Island Pill */}
                  <div className="featured-phone-island" aria-hidden="true" />
                  
                  {/* Screen Content: Video or Screenshot */}
                  <div className="featured-phone-screen">
                    {project.video ? (
                      <video
                        src={project.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="featured-phone-media"
                      />
                    ) : (
                      <img
                        src={project.previewImg}
                        alt={project.title}
                        className="featured-phone-media"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Card Bottom Body */}
              <div className="featured-mobile-body">
                <h3 className="featured-mobile-title">{project.title}</h3>
                <p className="featured-mobile-subtitle">{project.subtitle}</p>

                {/* 3 Square Bullet Points (■) */}
                <ul className="featured-mobile-bullets">
                  {project.bullets.map((bullet, i) => (
                    <li key={i} className="featured-mobile-bullet">
                      <span className="bullet-sq" aria-hidden="true">■</span>
                      <span className="bullet-text">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Black "Know more →" Pill Button */}
                <button
                  type="button"
                  className="featured-mobile-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenProject(project)
                  }}
                >
                  <span>Know more</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
          ))}
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
