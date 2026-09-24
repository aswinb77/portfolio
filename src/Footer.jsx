import { useEffect, useRef, useState } from 'react'
import './Footer.css'

export default function Footer() {
  const [copied, setCopied] = useState(false)
  const [timeStr, setTimeStr] = useState('')
  const fireflyRef = useRef(null)

  // Live IST clock (Asia/Kolkata)
  useEffect(() => {
    const tick = () => {
      setTimeStr(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date())
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Floating Firefly particle canvas
  useEffect(() => {
    const canvas = fireflyRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 800
    let H = 600
    let animId

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      W = rect?.width || window.innerWidth
      H = rect?.height || 600
      canvas.width = Math.floor(W * dpr)
      canvas.height = Math.floor(H * dpr)
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
    }
    resize()
    window.addEventListener('resize', resize)

    // Atmospheric fireflies matching screenshot
    const fireflies = Array.from({ length: 42 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      tx: Math.random() * W,
      ty: Math.random() * H,
      speed: 0.003 + Math.random() * 0.007,
      size: 1.4 + Math.random() * 1.8,
      hue: 78 + Math.random() * 50, // vibrant lime/green firefly hue
      alpha: 0,
      targetAlpha: 0.28 + Math.random() * 0.55,
      blinkDir: 1,
      blinkSpeed: 0.004 + Math.random() * 0.008,
      delay: i * 60,
    }))

    let frame = 0
    let isVisible = true

    const draw = () => {
      frame++
      ctx.save()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      fireflies.forEach((ff) => {
        if (frame < ff.delay) return
        ff.x += (ff.tx - ff.x) * ff.speed
        ff.y += (ff.ty - ff.y) * ff.speed
        const dx = ff.tx - ff.x
        const dy = ff.ty - ff.y
        if (dx * dx + dy * dy < 20) {
          ff.tx = Math.random() * W
          ff.ty = Math.random() * H
          ff.speed = 0.003 + Math.random() * 0.006
        }
        ff.alpha += ff.blinkDir * ff.blinkSpeed
        if (ff.alpha >= ff.targetAlpha) {
          ff.alpha = ff.targetAlpha
          ff.blinkDir = -1
        }
        if (ff.alpha <= 0.03) {
          ff.alpha = 0.03
          ff.blinkDir = 1
          ff.targetAlpha = 0.25 + Math.random() * 0.5
        }

        // Soft ethereal glow
        const r = ff.size * 6.5
        const g = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, r)
        g.addColorStop(0, `hsla(${ff.hue}, 95%, 78%, ${ff.alpha})`)
        g.addColorStop(0.35, `hsla(${ff.hue}, 90%, 62%, ${ff.alpha * 0.4})`)
        g.addColorStop(1, `hsla(${ff.hue}, 80%, 40%, 0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(ff.x, ff.y, r, 0, Math.PI * 2)
        ctx.fill()

        // Bright luminous center
        ctx.fillStyle = `hsla(${ff.hue}, 100%, 92%, ${Math.min(ff.alpha * 2.2, 1)})`
        ctx.shadowColor = `hsla(${ff.hue}, 95%, 72%, 0.95)`
        ctx.shadowBlur = 12
        ctx.beginPath()
        ctx.arc(ff.x, ff.y, ff.size * 0.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      ctx.restore()
      if (isVisible) {
        animId = requestAnimationFrame(draw)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) {
          cancelAnimationFrame(animId)
          animId = requestAnimationFrame(draw)
        } else {
          cancelAnimationFrame(animId)
        }
      },
      { threshold: 0.05 }
    )

    observer.observe(canvas)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const copyEmail = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText('aswinbiju2004@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2400)
  }

  const goTo = (e, id) => {
    e.preventDefault()
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="footer-reveal-container">
      <footer className="footer reveal" id="contact">
        {/* ── Background: Scenic image (footer.jpg) full-bleed ── */}
        <div className="f-bg" aria-hidden="true">
          <div className="f-bg__img" />
          <div className="f-bg__scrim" />
          <canvas ref={fireflyRef} className="f-firefly-canvas" />
        </div>

        {/* ── Hero Text Block ── */}
        <div className="f-hero">
          <h2 className="f-hero__line1">
            {'Something Worth Building?'.split('').map((ch, i) => (
              <span
                key={i}
                className="f-cta-char"
                style={{ animationDelay: `${i * 35}ms` }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h2>

          <h1 className="f-hero__line2">
            {"Let's Build.".split('').map((ch, i) => (
              <span
                key={i}
                className="f-cta-char"
                style={{ animationDelay: `${860 + i * 50}ms` }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h1>

          {/* Email action pill */}
          <div className="f-hero__actions">
            <button
              type="button"
              className={`f-email-pill ${copied ? 'is-copied' : ''}`}
              onClick={copyEmail}
              aria-label="Copy email address"
            >
              <span className="f-email-pill__addr">
                {copied ? 'Copied to clipboard!' : 'aswinbiju2004@gmail.com'}
              </span>
              <span className="f-email-pill__badge">{copied ? '✓' : '→'}</span>
            </button>
          </div>
        </div>

        {/* ── Floating Bottom Nav Bar Island (Image 2 style) ── */}
        <div className="f-bottom-area">
          <div className="f-floating-pill">
            <a
              href="#hero"
              onClick={(e) => goTo(e, 'hero')}
              className="f-pill-brand"
              aria-label="Aswin Biju - Home"
            >
              <svg
                className="f-pill-icon"
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Intersecting loops icon matching reference design */}
                <path d="M12 12c-2.4-3-5.2-4.5-7.6-3s-2.4 5.2 0 7.6 6 1.4 7.6-1.6zm0 0c2.4 3 5.2 4.5 7.6 3s2.4-5.2 0-7.6-6-1.4-7.6 1.6z" />
              </svg>
              <span className="f-pill-name">Aswin Biju</span>
            </a>

            <div className="f-pill-divider" aria-hidden="true" />

            <nav className="f-pill-nav" aria-label="Footer navigation">
              <a
                href="#hero"
                onClick={(e) => goTo(e, 'hero')}
                className="f-pill-link"
              >
                ↑ Top
              </a>
              <a
                href="#about"
                onClick={(e) => goTo(e, 'about')}
                className="f-pill-link"
              >
                About
              </a>
              <a
                href="#work"
                onClick={(e) => goTo(e, 'work')}
                className="f-pill-link"
              >
                Projects
              </a>
              <a
                href="#gallery"
                onClick={(e) => goTo(e, 'gallery')}
                className="f-pill-link"
              >
                Obsessions
              </a>
            </nav>

            <div className="f-pill-divider" aria-hidden="true" />

            <div className="f-pill-socials">
              <a
                href="https://linkedin.com/in/aswinbiju"
                target="_blank"
                rel="noreferrer"
                className="f-pill-link"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://github.com/aswinbiju"
                target="_blank"
                rel="noreferrer"
                className="f-pill-link"
              >
                GitHub ↗
              </a>
            </div>
          </div>

          <div className="f-meta-bar">
            <span>KOCHI · {timeStr || '—'} IST · © 2026 ASWIN BIJU</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
