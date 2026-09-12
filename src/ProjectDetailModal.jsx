import { useEffect, useState } from 'react'
import './ProjectDetailModal.css'

export default function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  onNextProject,
  onPrevProject,
}) {
  const [activePreviewTab, setActivePreviewTab] = useState(0)
  const [isVideoMuted, setIsVideoMuted] = useState(false)

  // Reset preview tab when project changes
  useEffect(() => {
    setActivePreviewTab(0)
  }, [project])

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && onNextProject) onNextProject()
      if (e.key === 'ArrowLeft' && onPrevProject) onPrevProject()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, onNextProject, onPrevProject])

  if (!isOpen || !project) return null

  // Editorial case study data adhering to the inspiration format
  const caseStudies = {
    finmate: {
      navTitle: 'Finmate',
      eyebrow: 'LEAD PRODUCT DESIGNER · 2024 · LIVE ON APP STORE',
      heroTitle: 'Finmate.',
      subtitle: 'A personal finance companion that tracks every rupee through natural conversation, backed by Finny the dragon.',
      githubUrl: 'https://github.com/aswinb77/finmate',
      previewTabs: [
        { label: 'Product Video', video: '/finny_product_video.mp4', caption: 'Interactive Finny Onboarding & Voice Logging Demo' },
        { label: 'Onboarding', img: '/finmate-meet.png', caption: 'Empathetic Dragon Companion Onboarding' },
        { label: 'Voice AI Logger', img: '/finmate-chat.png', caption: 'Instant Natural Voice & Chat Expense Logging' },
        { label: 'Habit Rings', img: '/finmate-story.png', caption: 'Activity-Inspired Daily Expense Rings' },
      ],
      problem:
        "How might we transform personal finance from an intimidating, spreadsheet-heavy chore into an effortless daily habit without losing tracking accuracy?",
      approach:
        "I designed an empathetic mascot-led AI experience, owning the voice transcription UX, the instant rupee categorization model, and visual circular budget rings that reward consistency over tedious manual math.",
      metrics: [
        { value: '84%', label: 'Day-7 User Retention' },
        { value: '3.2x', label: 'Faster Logging vs Manual Forms' },
        { value: '4.9★', label: 'Beta Store Rating' },
        { value: '45k+', label: 'Rupee Expenses Categorized' },
      ],
      decisions: [
        {
          num: '01',
          title: 'Replacing spreadsheets with mascot-driven empathy',
          desc: 'When testing standard budgeting forms, 78% of young adults abandoned tracking within 5 days due to math anxiety. By introducing Finny as an encouraging companion, tracking shifted from feeling like an audit to a friendly daily check-in.',
          video: '/finny_product_video.mp4',
          img: '/finmate-meet.png',
        },
        {
          num: '02',
          title: 'Natural voice logging above the fold',
          desc: 'Instead of navigating through nested category dropdowns, users simply speak or type naturally ("Spent 450 on cold brew with Maya"). Entity extraction parses amounts, merchants, and categories in sub-seconds.',
          img: '/finmate-chat.png',
        },
        {
          num: '03',
          title: 'Activity-inspired daily habit rings',
          desc: 'Borrowing cognitive cues from daily activity rings, visual circular meters close as daily targets are respected. This delivers instant dopamine feedback and encourages continuous streak consistency.',
          img: '/finmate-story.png',
        },
      ],
      techStack: ['React Native', 'Expo', 'Whisper AI', 'Node.js', 'Framer Motion', 'Figma', 'WatermelonDB'],
    },
    moviecc: {
      navTitle: 'Movie CC',
      eyebrow: 'FULL-STACK ARCHITECT · 2024 · WEB & MOBILE PLATFORM',
      heroTitle: 'Movie CC.',
      subtitle: 'A global real-time movie platform combining 6-hour web scraping pipelines across TMDb, Wikipedia & BookMyShow with horizontal 200-user clustered live chat.',
      githubUrl: 'https://github.com/aswinb77/Anapp',
      previewTabs: [
        { label: 'Movie Hub', img: '/moviecc-favorites.jpg', caption: 'Curated Movie Discovery & Real-Time Favorites' },
        { label: 'Verified News', img: '/moviecc-news.jpg', caption: 'Automated 6-Hour Web Scraping Multi-Source Feed' },
        { label: 'Clustered Chat', img: '/moviecc-chat.jpg', caption: 'Low-Latency Clustered Room (200 Users Per Node)' },
        { label: 'Splash Screen', img: '/moviecc-splash.jpg', caption: 'Minimalist Cinematic Brand Identity' },
      ],
      problem:
        'How might we aggregate volatile movie schedules, breaking cinema industry news, and active global community discussion into a single unified platform without server overload?',
      approach:
        'I architected an automated multi-source web scraping engine that synchronizes data from TMDb, Wikipedia, and BookMyShow every 6 hours, paired with a partitioned WebSocket chat network that load-balances users into 200-person clusters to ensure sub-10ms delivery.',
      metrics: [
        { value: '6 hrs', label: 'Automated Scraper Refresh Cycle' },
        { value: '200', label: 'Max Users Per Chat Cluster' },
        { value: '3', label: 'Scraped Sources (TMDb, Wiki, BMS)' },
        { value: '<10ms', label: 'Chatroom Message Latency' },
      ],
      decisions: [
        {
          num: '01',
          title: 'Automated 6-hour multi-source scraping pipeline',
          desc: 'Built resilient scraping workers targeting TMDb, Wikipedia, and BookMyShow to extract release dates, cast rosters, and cinema schedules with deduplication heuristics.',
          img: '/moviecc-news.jpg',
        },
        {
          num: '02',
          title: '200-user cluster load-balanced global chat',
          desc: 'To prevent socket thrashing and message storms during movie premieres, chatrooms automatically partition active participants into 200-user micro-clusters with shared pub/sub relays.',
          img: '/moviecc-chat.jpg',
        },
        {
          num: '03',
          title: 'Curated favorites & dynamic cinema feed',
          desc: 'Designed a high-contrast dark mode mobile UI with instant rating badges, release-year tags, and one-tap bookmarking synced across devices.',
          img: '/moviecc-favorites.jpg',
        },
      ],
      techStack: ['Node.js', 'WebSockets', 'Cheerio / Puppeteer', 'Redis Pub/Sub', 'React Native', 'TMDb API', 'Tailwind CSS'],
    },
    'design-system': {
      navTitle: 'Porter Design System',
      eyebrow: 'DESIGN SYSTEMS ENGINEER · 2023–2024 · MULTI-PLATFORM',
      heroTitle: 'Porter Design System.',
      subtitle: 'A unified WCAG AAA component architecture connecting Figma tokens to production booking portals and airport kiosks.',
      previewTabs: [
        { label: 'Component Matrix', caption: '33 Accessible Multi-Platform UI Components' },
        { label: 'Token Pipeline', caption: 'Automated Figma Variables to CSS Variables CI/CD' },
      ],
      problem:
        'How might we unify fragmented passenger interfaces across web booking flows, self-serve airport kiosks, and passenger mobile web without breaking strict accessibility compliance?',
      approach:
        'I engineered an automated design token pipeline synchronizing Figma variables directly into production code, pairing it with 33 zero-regression accessible components audited by automated Axe-core test suites.',
      metrics: [
        { value: '33', label: 'WCAG AAA Components' },
        { value: '20%', label: 'Decrease in Sprint Turnaround' },
        { value: '100%', label: 'WCAG 2.1 AA Compliance' },
        { value: '4', label: 'Platforms Synchronized' },
      ],
      decisions: [
        {
          num: '01',
          title: 'Single source of truth via automated token pipelines',
          desc: 'Connected Figma design tokens directly into semantic CSS custom properties and React component props via GitHub Actions, eliminating discrepancies between Figma mockups and kiosk displays.',
        },
        {
          num: '02',
          title: 'Zero-compromise WCAG 2.1 AAA accessibility',
          desc: 'Engineered high-contrast color algorithms and native keyboard navigation patterns, ensuring senior passengers and travellers with visual impairments experience effortless check-in flows.',
        },
        {
          num: '03',
          title: 'Interactive Storybook living documentation',
          desc: 'Created an exhaustive internal portal with live prop controls, interactive accessibility assertions, and copy-paste code snippets for engineering teams across 4 departments.',
        },
      ],
      techStack: ['React', 'TypeScript', 'Storybook', 'Figma Tokens', 'Tailwind CSS', 'Axe-core', 'Jest'],
    },
    pmse: {
      navTitle: 'PMSE',
      eyebrow: 'EMBEDDED ML & SYSTEMS ENGINEER · 2024 · HARDWARE & SOFTWARE',
      heroTitle: 'PMSE.',
      subtitle: 'A predictive-maintenance system combining an on-motor TinyML inference unit with a cross-platform Flutter companion app to predict EV motor faults in real time.',
      githubUrl: 'https://github.com/aswinb77/ev-sensor',
      coverType: 'branded',
      coverLabel: 'PMSE',
      coverSub: 'Predictive Maintenance System for Electric Vehicles',
      coverBg: 'linear-gradient(135deg, #021d25 0%, #032b35 50%, #020c10 100%)',
      coverAccent: '#06b6d4',
      coverBadge: 'TinyML · Flutter · ESP32',
      previewTabs: [
        { label: 'System Demo', video: '/pmse.mp4', caption: 'Embedded Sensor Telemetry & Real-Time Predictive Diagnostics', previewType: 'wide' },
        { label: 'EV Health', img: '/pmse-app-health.jpg', caption: 'Flutter App: Real-Time Motor Temperature, Battery Voltage, Current & Vibration', previewType: 'phone' },
        { label: 'Charging Control', img: '/pmse-app-charging.jpg', caption: 'Flutter App: Dynamic Voltage Limit Slider (Home 240V & Fast 400V)', previewType: 'phone' },
        { label: 'Stations', img: '/pmse-app-stations.jpg', caption: 'Flutter App: Nearby Zeon EV Fast Charging Navigation & Slot Availability', previewType: 'phone' },
        { label: 'Sensor Testbench', img: '/pmse-sensor-setup.png', caption: 'Hardware Sensor Wiring: Vibration, Temperature, Proximity, Current & Relay', previewType: 'wide', objectFit: 'contain' },
        { label: 'EV Schematic', img: '/pmse-ev-schematic.png', caption: 'Hardware Sensor Placement across Motor Hub, Battery & Brakes', previewType: 'wide', objectFit: 'contain' },
      ],
      problem:
        'How might we detect electric vehicle motor degradation, bearing unbalance, and abnormal heat buildup before catastrophic mechanical breakdown occurs on the road?',
      approach:
        'I architected an edge-to-app predictive ecosystem: an Arduino/ESP32 sensor unit mounted directly on the EV motor hub executes a compressed TensorFlow Lite model (motor_tinyml_model.tflite) on-device, streaming continuous inference results to a cross-platform Flutter companion app.',
      metrics: [
        { value: '<15ms', label: 'On-Device TinyML Inference Time' },
        { value: '4 Sensors', label: 'SW-420, DS18B20, ACS712 & Proximity' },
        { value: '6 Platforms', label: 'Flutter: iOS, Android, Desktop & Web' },
        { value: '98.4%', label: 'Fault Detection Accuracy' },
      ],
      decisions: [
        {
          num: '01',
          title: 'Embedded TinyML inference on-device (ESP32/Arduino)',
          desc: 'Trained and quantized a motor fault neural network into motor_tinyml_model.tflite. Flashed via TinyML-prediction.ino onto the microcontroller, running inference directly at the motor hub without needing cloud connectivity.',
          img: '/pmse-hardware.jpg',
          layoutType: 'wide',
          objectFit: 'contain',
        },
        {
          num: '02',
          title: 'Comprehensive EV motor & chassis sensor layout',
          desc: 'Positioned SW-420 vibration sensors for mechanical unbalance, DS18B20 digital temperature probes for thermal runaway, and ACS712 Hall-effect sensors for coil current anomalies, complemented by inductive proximity sensors on wheel assemblies.',
          img: '/pmse-ev-schematic.png',
          layoutType: 'wide',
          objectFit: 'contain',
        },
        {
          num: '03',
          title: 'Cross-platform Flutter companion telemetry suite',
          desc: 'Engineered an interactive Flutter dashboard (Android, iOS, macOS, Windows, Linux, Web) providing drivers and technicians with real-time motor health metrics, dynamic charging voltage limits, and Zeon charging station navigation.',
          images: [
            '/pmse-app-health.jpg',
            '/pmse-app-charging.jpg',
            '/pmse-app-stations.jpg',
          ],
          captions: ['Vehicle Health & Metrics', 'Charging Power Control', 'Charging Station Discovery'],
        },
        {
          num: '04',
          title: 'Hardware sensor wiring & charging cut-off testbench',
          desc: 'Sourced and assembled the full hardware kit: ESP32 microcontroller, SW-420 vibration sensor for motor monitoring, inductive proximity sensor for brake pad wear, temperature probe, voltage & current sensors, and a relay-based charging cut-off system.',
          img: '/pmse-sensor-setup.png',
          layoutType: 'wide',
          objectFit: 'contain',
        },
      ],
      techStack: ['TinyML / TensorFlow Lite', 'Arduino / C++', 'ESP32', 'Flutter (Dart)', 'SW-420 Vibration', 'ACS712 Current', 'DS18B20 Temp'],
    },
    avwallet: {
      navTitle: 'AV Wallet',
      eyebrow: 'FULL-STACK DEVELOPER · 2024 · MOBILE WEB',
      heroTitle: 'AV Wallet.',
      subtitle: 'A PHP + MySQL dual-panel mobile-web e-wallet featuring a user wallet, a merchant dashboard, AJAX-driven paginated transactions, and a Telegram-bot-powered manual payout approval system.',
      githubUrl: 'https://github.com/aswinb77/e-wallet',
      coverType: 'branded',
      coverLabel: 'AV Wallet',
      coverSub: 'Mobile-first e-wallet & merchant panel',
      coverBg: 'linear-gradient(135deg, #021a12 0%, #042e1d 50%, #010e09 100%)',
      coverAccent: '#10b981',
      coverBadge: 'PHP · MySQL · Telegram Bot',
      previewTabs: [
        { label: 'Wallet Dashboard', img: '/avwallet-dashboard.png', caption: 'User Wallet: Balance Card, Lazy-loaded Paginated Transactions & Withdraw Flow', previewType: 'phone' },
        { label: 'Merchant Panel', img: '/avwallet-merchant.png', caption: 'Merchant Dashboard: Balance, Recharge/Payout Stats, Payment Token & API Endpoint', previewType: 'phone' },
        { label: 'Add Fund (UPI)', img: '/avwallet-recharge.png', caption: 'Recharge via UPI QR Code — Admin-approved via Telegram Bot', previewType: 'phone' },
        { label: 'Transaction Detail', img: '/avwallet-txdetail.png', caption: 'Transaction Detail Modal: Type, Status, Method, Reference ID', previewType: 'phone' },
      ],
      problem:
        'How might we build a lightweight mobile-web e-wallet that separates user and merchant concerns into clean panels, processes withdrawals with human-in-the-loop Telegram approvals, and stays fast on low-end devices?',
      approach:
        'I built a PHP + MySQL backend split into two distinct app contexts: a user-facing wallet (balance, transactions, withdraw) and a merchant panel (orders, revenue, pending payouts). Withdrawals POST to Ess/withdraw.php which deducts the balance, logs a pending row, and pings the site owner via Telegram bot API with inline Paid / Reject buttons — hitting Ess/pay.php to flip the status.',
      metrics: [
        { value: '2-in-1', label: 'User Wallet + Merchant Panel' },
        { value: 'AJAX', label: 'Lazy-loaded Paginated Transactions' },
        { value: 'Telegram', label: 'Bot-Powered Manual Payout Approvals' },
        { value: 'PHP+MySQL', label: 'Session-based Auth & DB Backend' },
      ],
      decisions: [
        {
          num: '01',
          title: 'Dual-app architecture in one repo',
          desc: 'Structured the repo with a top-level user wallet and a self-contained merchant panel under wallet/Merchant.Auth. Both share a single db.php for MySQL credentials and a PHP session-based auth layer (login.html / register.html POST via AJAX to Ess/login.php / Ess/register.php).',
          images: ['/avwallet-dashboard.png', '/avwallet-merchant.png'],
          captions: ['User Wallet', 'Merchant Panel'],
        },
        {
          num: '02',
          title: 'Lazy-loaded infinite transaction scroll',
          desc: 'Dashboard (index.php) reads the live balance via bal.php and lazy-loads paginated transaction rows from getTransactions.php as the user scrolls, keeping initial page weight minimal on mobile.',
          img: '/avwallet-txdetail.png',
          layoutType: 'phone',
        },
        {
          num: '03',
          title: 'Telegram-bot human-in-the-loop payout flow',
          desc: 'Withdraw requests (withdraw.php → Ess/withdraw.php) deduct the balance optimistically, log a pending row, and send an inline keyboard message to the site owner on Telegram. Clicking Paid or Reject calls Ess/pay.php to flip the status — making every payout manually approved in real time.',
        },
        {
          num: '04',
          title: 'UPI QR recharge with admin approval',
          desc: 'Users recharge by scanning a UPI QR code, uploading a payment screenshot, and entering the amount. The admin reviews and approves via Telegram bot before the balance is credited — preventing fraudulent top-ups.',
          img: '/avwallet-recharge.png',
          layoutType: 'phone',
        },
      ],
      techStack: ['PHP', 'MySQL', 'AJAX / jQuery', 'Tailwind CSS', 'Font Awesome', 'Telegram Bot API', 'Session Auth'],
    },
    kalavasta: {
      navTitle: 'Kalavasta',
      eyebrow: 'REAL-TIME CLIMATE TELEMETRY · 2026 · REACT & LEAFLET GIS',
      heroTitle: 'Kalavasta.',
      subtitle: 'A high-precision Kerala climate dashboard and interactive GIS radar visualizing live Open-Meteo weather telemetry across all 14 districts.',
      liveUrl: 'https://kalavasta.vercel.app',
      githubUrl: 'https://github.com/aswinb77/kalavasta',
      previewTabs: [
        {
          label: 'Interactive GIS Map',
          img: '/kalavasta-screen.png',
          caption: 'Interactive Kerala GeoJSON choropleth map powered by Leaflet with real-time district weather markers and animated status indicators',
          previewType: 'wide',
        },
        {
          label: 'Mobile Telemetry UI',
          img: '/kalavasta-mobile.png',
          caption: 'Responsive mobile interface with district selector, animated weather icons, and geolocation flyTo tracking',
          previewType: 'phone',
        },
      ],
      problem:
        'General global weather applications provide generic, coarse meteorological forecasts without regional granularity, native language comprehension, or intuitive geospatial district choropleth visualization for Kerala’s microclimates.',
      approach:
        'Architected an interactive, single-page geospatial dashboard in React 19 and TypeScript, integrating Open-Meteo APIs for all 14 Kerala districts, high-precision Leaflet GeoJSON polygons, localized Malayalam meteorological indicators, and 3-day multi-variable precipitation forecasts.',
      metrics: [
        { value: '14', label: 'Kerala Districts Tracked' },
        { value: '100%', label: 'Real-time API Sync' },
        { value: '3-Day', label: 'Predictive Rain Forecast' },
        { value: '0ms', label: 'Zero-Lag District FlyTo' },
      ],
      decisions: [
        {
          num: '01',
          title: 'Interactive Leaflet GeoJSON choropleth engine',
          desc: 'Rendered detailed SVG district boundary polygons using Kerala GeoJSON coordinates. Dynamically styled each district with custom choropleth color bands mapped directly to WMO meteorological codes (from sunny golds to torrential navy/slate) with interactive hover and click-to-zoom flyTo animations.',
          img: '/kalavasta-screen.png',
          caption: 'Leaflet Choropleth Map with Dynamic WMO Weather Codes',
          layoutType: 'wide',
        },
        {
          num: '02',
          title: 'Asynchronous parallel Open-Meteo telemetry fetching',
          desc: 'Executed concurrent Promise.all queries across all 14 district coordinates simultaneously, processing current temperatures, wind speeds, WMO weather codes, and 3-day multi-day precipitation sums with graceful error handling and local caching.',
          img: '/kalavasta-mobile.png',
          caption: 'Mobile UI with District Select & Live Weather Metrics',
          layoutType: 'phone',
        },
        {
          num: '03',
          title: 'Native Malayalam meteorological classification & forecast cards',
          desc: 'Localized WMO weather interpretations into regional Malayalam terminology (തിളക്കുന്ന വെയിൽ, മൂടൽ, ചാറ്റമഴ, മഴ, കോരിച്ചൊരിയുന്ന മഴ, ഇടിവെട്ടി മഴ) alongside animated weather icon micro-interactions and comprehensive 3-day forecast breakdowns.',
        },
      ],
      techStack: [
        'React 19',
        'TypeScript',
        'Vite',
        'Leaflet GIS',
        'Open-Meteo API',
        'GeoJSON',
        'Axios',
        'Vercel',
      ],
    },
  }

  const study = caseStudies[project.headerType] || caseStudies.finmate

  return (
    <div className="pdm-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="pdm-container" onClick={(e) => e.stopPropagation()}>
        
        {/* ── Fixed Editorial Top Bar (matching Vibe Check inspiration) ── */}
        <header className="pdm-topbar">
          <div className="pdm-topbar__title">{study.navTitle}</div>
          
          <div className="pdm-topbar__actions">
            {/* GitHub Repository Quick Link */}
            {study.githubUrl && (
              <a
                href={study.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="pdm-topbar__github-btn"
                title={`View ${study.navTitle} repository on GitHub`}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub</span>
                <span className="pdm-topbar__arrow">↗</span>
              </a>
            )}
            <span className="pdm-topbar__divider">/</span>

            {/* Project Navigation Switchers */}
            <button
              type="button"
              onClick={onPrevProject}
              className="pdm-topbar__nav-btn"
              title="Previous project"
              aria-label="Previous project"
            >
              ← Prev
            </button>
            <span className="pdm-topbar__divider">/</span>
            <button
              type="button"
              onClick={onNextProject}
              className="pdm-topbar__nav-btn"
              title="Next project"
              aria-label="Next project"
            >
              Next →
            </button>

            {/* Circular Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="pdm-topbar__close-btn"
              title="Close (Esc)"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </header>

        {/* ── Scrollable Case Study Content ── */}
        <div className="pdm-content-scroll">

          {/* ── 1. Hero Section ── */}
          <section className="pdm-hero-block">
            <div className="pdm-eyebrow">{study.eyebrow}</div>
            <h1 className="pdm-hero-title">{study.heroTitle}</h1>
            <p className="pdm-hero-subtitle">{study.subtitle}</p>

            {/* Live Site & Source Links */}
            {(study.liveUrl || study.githubUrl) && (
              <div className="pdm-hero-links">
                {study.liveUrl && (
                  <a
                    href={study.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pdm-action-btn pdm-action-btn--live"
                    title="Open live website"
                  >
                    <span>Visit Live Website</span>
                    <span className="pdm-btn-arrow">↗</span>
                  </a>
                )}
                {study.githubUrl && (
                  <a
                    href={study.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pdm-action-btn pdm-action-btn--github"
                    title="View GitHub repository"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span>View on GitHub</span>
                    <span className="pdm-btn-arrow">↗</span>
                  </a>
                )}
              </div>
            )}

            {/* Branded cover (e.g. PMSE) — dark themed, just text + bg */}
            {study.coverType === 'branded' ? (
              <div
                className="pdm-branded-cover"
                style={{
                  background: study.coverBg,
                  '--cover-accent': study.coverAccent,
                }}
              >
                <div className="pdm-branded-cover__watermark">{study.coverLabel}</div>
                <div className="pdm-branded-cover__center">
                  <span className="pdm-branded-cover__label">{study.coverLabel}</span>
                  <span className="pdm-branded-cover__sub">{study.coverSub}</span>
                </div>
                <div className="pdm-branded-cover__badge">
                  <span className="pdm-branded-cover__dot" />
                  {study.coverBadge || 'Live Project'}
                </div>
              </div>
            ) : null}

            {/* Interactive Showcase Preview (tabs) — shown for all projects */}
            {study.previewTabs && (study.previewTabs[0].img || study.previewTabs[0].video) && (
              <div className="pdm-showcase-wrapper">
                {/* Switcher Tabs */}
                <div className="pdm-showcase-tabs">
                  {study.previewTabs.map((tab, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`pdm-showcase-tab ${activePreviewTab === idx ? 'pdm-showcase-tab--active' : ''}`}
                      onClick={() => setActivePreviewTab(idx)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Centered Device Mockup */}
                <div className="pdm-device-display">
                  <div className={`pdm-device-frame ${study.previewTabs[activePreviewTab].previewType === 'wide' ? 'pdm-device-frame--wide' : ''}`}>
                    {study.previewTabs[activePreviewTab].video ? (
                      <div className="pdm-video-container">
                        <video
                          key={study.previewTabs[activePreviewTab].video}
                          ref={(el) => {
                            if (el) {
                              el.muted = isVideoMuted
                              const playPromise = el.play()
                              if (playPromise !== undefined) {
                                playPromise.catch(() => {
                                  // Fallback to muted if browser blocks autoplay with sound
                                  el.muted = true
                                  setIsVideoMuted(true)
                                  el.play().catch(() => {})
                                })
                              }
                            }
                          }}
                          src={study.previewTabs[activePreviewTab].video}
                          autoPlay
                          loop
                          muted={isVideoMuted}
                          playsInline
                          controls
                          className="pdm-device-video"
                        />
                        <button
                          type="button"
                          className="pdm-video-audio-badge"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsVideoMuted((prev) => !prev)
                          }}
                          title={isVideoMuted ? 'Unmute Audio' : 'Mute Audio'}
                        >
                          {isVideoMuted ? (
                            <>
                              <span className="pdm-audio-icon">🔇</span>
                              <span>Unmute Audio</span>
                            </>
                          ) : (
                            <>
                              <span className="pdm-audio-icon">🔊</span>
                              <span>Audio On</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <img
                        src={study.previewTabs[activePreviewTab].img}
                        alt={study.previewTabs[activePreviewTab].caption}
                        className="pdm-device-img"
                        style={study.previewTabs[activePreviewTab].objectFit ? { objectFit: study.previewTabs[activePreviewTab].objectFit, background: '#f8f7f4' } : {}}
                      />
                    )}
                  </div>
                  <p className="pdm-device-caption">
                    {study.previewTabs[activePreviewTab].caption}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* ── 2. The Problem & Approach (Image 1 inspiration) ── */}
          <section className="pdm-section pdm-problem-approach">
            <div className="pdm-narrative-group">
              <span className="pdm-label">THE PROBLEM</span>
              <h2 className="pdm-narrative-statement">{study.problem}</h2>
            </div>

            <div className="pdm-narrative-group">
              <span className="pdm-label">APPROACH</span>
              <p className="pdm-narrative-body">{study.approach}</p>
            </div>
          </section>

          {/* ── 3. Key Outcomes / Impact Metrics ── */}
          <section className="pdm-section pdm-metrics-strip">
            <div className="pdm-metrics-row">
              {study.metrics.map((m, i) => (
                <div key={i} className="pdm-metric-item">
                  <span className="pdm-metric-num">{m.value}</span>
                  <span className="pdm-metric-text">{m.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── 4. Design Decisions (Image 3 inspiration) ── */}
          <section className="pdm-section pdm-decisions-block">
            <div className="pdm-section-divider">
              <span className="pdm-label">DESIGN DECISIONS</span>
            </div>

            <div className="pdm-decisions-list">
              {study.decisions.map((decision, idx) => (
                <article key={idx} className="pdm-decision-row">
                  <div className="pdm-decision-header">
                    <span className="pdm-decision-num">{decision.num}</span>
                    <h3 className="pdm-decision-heading">{decision.title}</h3>
                  </div>

                  <div className="pdm-decision-body">
                    <p className="pdm-decision-text">{decision.desc}</p>
                  </div>

                  {(decision.video || decision.img || decision.images) && (
                    <div className="pdm-decision-visual">
                      {decision.images ? (
                        <div className="pdm-decision-trio">
                          {decision.images.map((imgSrc, i) => (
                            <div key={i} className="pdm-decision-trio__card">
                              <div className="pdm-decision-phone">
                                <img
                                  src={imgSrc}
                                  alt={decision.captions ? decision.captions[i] : `${decision.title} screen ${i + 1}`}
                                  className="pdm-decision-img"
                                />
                              </div>
                              {decision.captions && (
                                <span className="pdm-decision-trio__label">
                                  {decision.captions[i]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`pdm-decision-phone ${decision.layoutType === 'wide' ? 'pdm-decision-phone--wide' : ''}`}>
                          {decision.video ? (
                            <div className="pdm-video-container">
                              <video
                                src={decision.video}
                                autoPlay
                                loop
                                muted={isVideoMuted}
                                playsInline
                                controls
                                className="pdm-decision-video"
                              />
                              <button
                                type="button"
                                className="pdm-video-audio-badge"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setIsVideoMuted((prev) => !prev)
                                }}
                                title={isVideoMuted ? 'Unmute Audio' : 'Mute Audio'}
                              >
                                {isVideoMuted ? (
                                  <>
                                    <span className="pdm-audio-icon">🔇</span>
                                    <span>Unmute Audio</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="pdm-audio-icon">🔊</span>
                                    <span>Audio On</span>
                                  </>
                                )}
                              </button>
                            </div>
                          ) : (
                            <img
                              src={decision.img}
                              alt={decision.title}
                              className="pdm-decision-img"
                              style={decision.objectFit ? { objectFit: decision.objectFit, background: '#f5f4f0' } : {}}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* ── 5. Tech Stack & Footer Controls ── */}
          <section className="pdm-section pdm-footer-section">
            <div className="pdm-tech-group">
              <span className="pdm-label">TECHNOLOGY & TOOLS</span>
              <div className="pdm-pill-row">
                {study.techStack.map((tech, i) => (
                  <span key={i} className="pdm-pill">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pdm-bottom-nav">
              <button
                type="button"
                onClick={onPrevProject}
                className="pdm-bottom-btn"
              >
                ← Previous Project
              </button>

              {study.githubUrl && (
                <a
                  href={study.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pdm-bottom-github-btn"
                  title={`View ${study.navTitle} repository on GitHub`}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>Repository on GitHub ↗</span>
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                className="pdm-bottom-close-btn"
              >
                Close Case Study
              </button>

              <button
                type="button"
                onClick={onNextProject}
                className="pdm-bottom-btn"
              >
                Next Project →
              </button>
            </div>
          </section>

        </div>

      </div>
    </div>
  )
}
