import { useEffect } from 'react'
import {
  getMedia,
  aswinAvatarpng,
  shieldCertpng,
  shieldCodeBluepng,
  shieldCodeOrangepng,
  shieldEdupng,
} from './assets/media'
import './ResumeModal.css'

export default function ResumeModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // All verified certificates provided (with clean length + dots for long titles)
  const certificates = [
    {
      title: 'Google UX Design Professional Cert...',
      issuer: 'Google / Coursera',
      date: 'Sep 2024',
      id: 'GQN2NIQA2D47',
      link: 'https://coursera.org/verify/professional-cert/GQN2NIQA2D47',
    },
    {
      title: 'Build With AI - OpenAI Pathway...',
      issuer: 'OpenAI',
      date: 'Sep 2026',
      id: '194395106',
      link: 'https://oaiacademy.credential.net/ae7c8901-bf16-45a2-b468-ac7c154f7761',
    },
    {
      title: 'Apply AI at Work Pathway...',
      issuer: 'OpenAI',
      date: 'Sep 2026',
      id: '194361475',
      link: 'https://oaiacademy.credential.net/7efdd3a6-725c-4999-be37-2b7dbd6cdd7c',
    },
    {
      title: 'Applied AI Foundations...',
      issuer: 'OpenAI',
      date: 'Sep 2026',
      id: '194349024',
      link: 'https://oaiacademy.credential.net/3c77ce7f-f734-43e7-8f27-9d5197b28c98',
    },
    {
      title: 'Claude Platform 101',
      issuer: 'Anthropic',
      date: 'Jun 2026',
      id: 'tswfgouzuyc2',
      link: 'https://verify.skilljar.com/c/tswfgouzuyc2',
    },
    {
      title: 'Claude 101',
      issuer: 'Anthropic',
      date: 'Jun 2026',
      id: 'nwsh367g854k',
      link: 'https://verify.skilljar.com/c/nwsh367g854k',
    },
    {
      title: 'Cloud Computing Fundamentals',
      issuer: 'IBM',
      date: 'Jul 2026',
      id: '25c987cf',
      link: 'https://www.credly.com/badges/25c987cf-2584-4ddf-8ffd-754de839e6c4/linked_in_profile',
    },
    {
      title: 'MongoDB: Core Concepts & Arch...',
      issuer: 'MongoDB',
      date: 'Aug 2026',
      id: 'c11d78ed',
      link: 'https://www.credly.com/badges/c11d78ed-27af-4573-80a4-6bd11dd6a2da/linked_in_profile',
    },
    {
      title: 'API Beginner',
      issuer: 'Postman',
      date: 'Aug 2026',
      id: '0ba09695',
      link: 'https://www.credly.com/badges/0ba09695-46e0-4d01-9000-2da978c7198b/linked_in_profile',
    },
    {
      title: 'Python Essentials 1',
      issuer: 'Cisco',
      date: 'Jun 2026',
      id: '4d2d05ba',
      link: 'https://www.credly.com/badges/4d2d05ba-5f75-4ca3-919b-bda36b80ec06/linked_in_profile',
    },
    {
      title: 'JavaScript Certificate',
      issuer: 'HackerRank',
      date: 'Jun 2026',
      id: '0d1ad430259d',
      link: 'https://www.hackerrank.com/certificates/0d1ad430259d',
    },
    {
      title: 'The CRAFT of Mobile SEO',
      issuer: 'Semrush',
      date: 'Jun 2026',
      id: 'aca9f9e32c',
      link: 'https://static.semrush.com/academy/certificates/aca9f9e32c/aswin-biju_15.pdf',
    },
    {
      title: 'Using Git with Visual Studio Code',
      issuer: 'LinkedIn',
      date: 'Jun 2026',
      id: 'LinkedIn',
      link: 'https://www.linkedin.com/in/aswin-biju7/',
    },
  ]

  return (
    <div className="resume-page-view" role="region" aria-label="Aswin Biju - Resume">

      {/* Floating Actions */}
      <div className="resume-floating-actions no-print">
        <a
          href="https://docs.google.com/document/d/1xalNovDpLxrrh4YJF8xPturYlzjg8giX/edit?usp=sharing&ouid=106737287132703381431&rtpof=true&sd=true"
          target="_blank"
          rel="noreferrer"
          className="resume-pill-btn resume-pill-btn--primary"
          title="Download Resume Document"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Download PDF</span>
        </a>
        <button
          type="button"
          className="resume-pill-btn resume-pill-btn--close"
          onClick={onClose}
          aria-label="Close resume"
          title="Close (Esc)"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <main className="resume-page-canvas">
        <article className="resume-sheet">

          {/* Header */}
          <header className="resume-header">
            <div className="resume-header__left">
              <div className="resume-avatar-wrap">
                <img src={aswinAvatarpng} alt="Aswin Biju" className="resume-avatar" />
              </div>
              <div className="resume-identity">
                <h1 className="resume-name">Aswin Biju</h1>
                <p className="resume-role">
                  Product Designer <span className="resume-role__dot">•</span> Full-Stack Developer
                </p>
              </div>
            </div>

            {/* Smaller, compact metadata */}
            <div className="resume-header__right">
              <div className="resume-meta-line">
                <span className="resume-meta-lbl">Location:</span>
                <span className="resume-meta-val">Pathanamthitta, Kerala, India</span>
              </div>
              <div className="resume-meta-line">
                <span className="resume-meta-lbl">Mail:</span>
                <a href="mailto:aswinbiju2004@gmail.com" className="resume-meta-link">aswinbiju2004@gmail.com</a>
              </div>
              <div className="resume-meta-line">
                <span className="resume-meta-lbl">Phone:</span>
                <span className="resume-meta-val">+91 62828 08167</span>
              </div>
              <div className="resume-meta-line">
                <span className="resume-meta-lbl">Portfolio:</span>
                <a href="https://asw7nbiju.vercel.app" target="_blank" rel="noreferrer" className="resume-meta-link">Website</a>
                <span className="resume-meta-sep">•</span>
                <a href="https://github.com/aswinb77" target="_blank" rel="noreferrer" className="resume-meta-link">GitHub</a>
                <span className="resume-meta-sep">•</span>
                <a href="https://linkedin.com/in/aswin-biju7" target="_blank" rel="noreferrer" className="resume-meta-link">LinkedIn</a>
              </div>
            </div>
          </header>

          {/* EXPERIENCE */}
          <section className="resume-section">
            <h2 className="resume-section-heading">EXPERIENCE</h2>

            {/* Finmate */}
            <div className="resume-item">
              <div className="resume-shield-icon" title="Finmate">
                <img src={shieldCodeOrangepng} alt="Finmate" className="resume-shield-img" width="46" height="46" />
              </div>
              <div className="resume-item__body">
                <div className="resume-item__head">
                  <h3 className="resume-item__title">Finmate — Conversational Expense Tracker</h3>
                  <a href="https://github.com/aswinb77/finmate" target="_blank" rel="noreferrer" className="resume-item__link">github</a>
                </div>
                <p className="resume-item__meta">2026 &nbsp;•&nbsp; React Native, Expo, OpenAI, Node.js</p>
                <ul className="resume-item__bullets">
                  <li>Mascot-led AI expense logging parsing natural language into rupee amounts and categories in sub-seconds.</li>
                  <li>Visual habit rings for daily spending targets — 84% Day-7 retention in user testing.</li>
                </ul>
              </div>
            </div>

            {/* Movie.cc */}
            <div className="resume-item">
              <div className="resume-shield-icon" title="Movie.cc">
                <img src={shieldCodeOrangepng} alt="Movie.cc" className="resume-shield-img" width="46" height="46" />
              </div>
              <div className="resume-item__body">
                <div className="resume-item__head">
                  <h3 className="resume-item__title">Movie.cc — Full-Stack Movie Platform</h3>
                  <a href="https://github.com/aswinb77/moviecc" target="_blank" rel="noreferrer" className="resume-item__link">github</a>
                </div>
                <p className="resume-item__meta">2026 &nbsp;•&nbsp; Flutter, Node.js, Firebase, Puppeteer</p>
                <ul className="resume-item__bullets">
                  <li>Cross-platform Flutter app with Firebase Auth, Firestore sync, and Provider state management.</li>
                  <li>Automated 6-hour scraping pipeline (Wikipedia → TMDB → BookMyShow) maintaining 500+ records with NLP moderation.</li>
                </ul>
              </div>
            </div>

            {/* PMSE */}
            <div className="resume-item">
              <div className="resume-shield-icon" title="PMSE">
                <img src={shieldCodeBluepng} alt="PMSE" className="resume-shield-img" width="46" height="46" />
              </div>
              <div className="resume-item__body">
                <div className="resume-item__head">
                  <h3 className="resume-item__title">PMSE — TinyML Maintenance Sensor for EV</h3>
                  <a href="https://github.com/aswinb77/ev-sensor" target="_blank" rel="noreferrer" className="resume-item__link">github</a>
                </div>
                <p className="resume-item__meta">2025 &nbsp;•&nbsp; TinyML, Embedded C, ESP32, Flutter</p>
                <ul className="resume-item__bullets">
                  <li>Edge ML model on ESP32 for real-time anomaly detection without cloud reliance.</li>
                  <li>60FPS Flutter dashboard visualizing live motor temp, current, vibration, and charging limits.</li>
                </ul>
              </div>
            </div>

            {/* Web Wallet */}
            <div className="resume-item">
              <div className="resume-shield-icon" title="Web Wallet">
                <img src={shieldCodeBluepng} alt="Web Wallet" className="resume-shield-img" width="46" height="46" />
              </div>
              <div className="resume-item__body">
                <div className="resume-item__head">
                  <h3 className="resume-item__title">Web Wallet — E-Wallet Web App</h3>
                  <a href="https://github.com/aswinb77/e-wallet" target="_blank" rel="noreferrer" className="resume-item__link">github</a>
                </div>
                <p className="resume-item__meta">2023 &nbsp;•&nbsp; PHP, MySQL, AJAX, Telegram Bot API</p>
                <ul className="resume-item__bullets">
                  <li>Dual-panel mobile-web e-wallet with user &amp; merchant dashboards, session auth, and transaction records.</li>
                  <li>Telegram bot payout flow with inline Paid / Reject approval buttons for admin authorization.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* EDUCATION */}
          <section className="resume-section">
            <h2 className="resume-section-heading">EDUCATION</h2>

            <div className="resume-item">
              <div className="resume-shield-icon" title="Musaliar College">
                <img src={shieldEdupng} alt="Musaliar College" className="resume-shield-img" width="46" height="46" />
              </div>
              <div className="resume-item__body">
                <div className="resume-item__head">
                  <h3 className="resume-item__title">Musaliar College of Engineering — B.Tech CSE</h3>
                </div>
                <p className="resume-item__meta">2022 – 2026 &nbsp;•&nbsp; Pathanamthitta, Kerala (KTU) &nbsp;•&nbsp; CGPA: 7.01 / 10.0</p>
              </div>
            </div>

            <div className="resume-item">
              <div className="resume-shield-icon" title="Netaji HSS">
                <img src={shieldEdupng} alt="Netaji HSS" className="resume-shield-img" width="46" height="46" />
              </div>
              <div className="resume-item__body">
                <div className="resume-item__head">
                  <h3 className="resume-item__title">Netaji H S S — Higher Secondary (Class XII)</h3>
                </div>
                <p className="resume-item__meta">2022 &nbsp;•&nbsp; Pramadom, Kerala &nbsp;•&nbsp; Aggregate: 91.67%</p>
              </div>
            </div>
          </section>

          {/* CERTIFICATIONS (Clickable Badges with tactile on-click effect) */}
          <section className="resume-section">
            <h2 className="resume-section-heading">CERTIFICATIONS</h2>
            <div className="resume-certs-grid">
              {certificates.map((cert, index) => (
                <a
                  key={index}
                  href={cert.link}
                  target="_blank"
                  rel="noreferrer"
                  className="resume-cert-card"
                  title={`Open ${cert.title} credential`}
                >
                  <div className="resume-cert-icon">
                    <img src={shieldCertpng} alt="Cert" className="resume-cert-img" width="34" height="34" />
                  </div>
                  <div className="resume-cert-content">
                    <h4 className="resume-cert-title">{cert.title}</h4>
                    <p className="resume-cert-meta">
                      {cert.issuer} &nbsp;•&nbsp; {cert.date} {cert.id && <span>&nbsp;•&nbsp; ID: {cert.id}</span>}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* SKILLS */}
          <section className="resume-section">
            <h2 className="resume-section-heading">SKILLS</h2>
            <div className="resume-skills-block">
              <p className="resume-skills-line">
                <strong className="resume-skills-label">Design:</strong>
                User Research, Data-Driven Design, User Flow, Wireframing, Design Systems, Interaction Design, Rapid Prototyping, Responsive Web Design, A/B Testing, Figma (Variables, Auto Layout, Tokens), Framer, Claude, Cursor, Codex, Gemini
              </p>
              <p className="resume-skills-line">
                <strong className="resume-skills-label">Frontend &amp; Mobile:</strong>
                Flutter (Dart), React.js, React Native, Expo, Tailwind CSS, JavaScript (ES6+), HTML5, CSS3, AJAX, Leaflet GIS
              </p>
              <p className="resume-skills-line">
                <strong className="resume-skills-label">Backend &amp; Cloud:</strong>
                Node.js, Express.js, PHP, Python, REST APIs, Puppeteer, MySQL, MongoDB, Firebase Firestore, Firebase Auth, Railway
              </p>
              <p className="resume-skills-line">
                <strong className="resume-skills-label">Systems &amp; Tools:</strong>
                TinyML (TensorFlow Lite on ESP32), Embedded C/C++, Git, GitHub, VS Code, Postman, Android Studio, System Architecture, OOP
              </p>
            </div>
          </section>

        </article>
      </main>
    </div>
  )
}
