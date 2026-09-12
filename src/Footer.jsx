import { useEffect, useRef, useState } from 'react'
import './Footer.css'

export default function Footer() {
  const [copied, setCopied] = useState(false)
  const [timeStr, setTimeStr] = useState('')
  const fireflyRef = useRef(null)

  // Live IST clock
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

  // Firefly particle canvas
  useEffect(() => {
    const canvas = fireflyRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 800, H = 600, animId

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

    const fireflies = Array.from({ length: 38 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      tx: Math.random() * W,
      ty: Math.random() * H,
      speed: 0.003 + Math.random() * 0.007,
      size: 1.4 + Math.random() * 1.8,
      hue: 75 + Math.random() * 55,
      alpha: 0,
      targetAlpha: 0.25 + Math.random() * 0.5,
      blinkDir: 1,
      blinkSpeed: 0.003 + Math.random() * 0.008,
      delay: i * 70,
    }))

    let frame = 0
    const draw = () => {
      frame++
      ctx.save()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      fireflies.forEach((ff) => {
        if (frame < ff.delay) return
        ff.x += (ff.tx - ff.x) * ff.speed
        ff.y += (ff.ty - ff.y) * ff.speed
        const dx = ff.tx - ff.x, dy = ff.ty - ff.y
        if (dx * dx + dy * dy < 16) {
          ff.tx = Math.random() * W
          ff.ty = Math.random() * H
          ff.speed = 0.003 + Math.random() * 0.006
        }
        ff.alpha += ff.blinkDir * ff.blinkSpeed
        if (ff.alpha >= ff.targetAlpha) { ff.alpha = ff.targetAlpha; ff.blinkDir = -1 }
        if (ff.alpha <= 0.03) { ff.alpha = 0.03; ff.blinkDir = 1; ff.targetAlpha = 0.25 + Math.random() * 0.5 }

        const r = ff.size * 6
        const g = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, r)
        g.addColorStop(0, `hsla(${ff.hue}, 95%, 78%, ${ff.alpha})`)
        g.addColorStop(0.35, `hsla(${ff.hue}, 90%, 60%, ${ff.alpha * 0.35})`)
        g.addColorStop(1, `hsla(${ff.hue}, 80%, 40%, 0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(ff.x, ff.y, r, 0, Math.PI * 2); ctx.fill()

        ctx.fillStyle = `hsla(${ff.hue}, 100%, 92%, ${Math.min(ff.alpha * 2.2, 1)})`
        ctx.shadowColor = `hsla(${ff.hue}, 95%, 72%, 0.9)`
        ctx.shadowBlur = 12
        ctx.beginPath(); ctx.arc(ff.x, ff.y, ff.size * 0.55, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0
      })

      ctx.restore()
      if (isVisible) {
        animId = requestAnimationFrame(draw)
      }
    }

    let isVisible = false
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        cancelAnimationFrame(animId)
        animId = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(animId)
      }
    }, { threshold: 0.05 })

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
    const el = id ? document.getElementById(id) : null
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="footer-reveal-container">
      <footer className="footer reveal" id="contact">

        {/* ── Background: vinland full-bleed ── */}
        <div className="f-bg" aria-hidden="true">
          <div className="f-bg__img" />
          <div className="f-bg__scrim" />
          <canvas ref={fireflyRef} className="f-firefly-canvas" />
        </div>

        {/* ── Hero text block ── */}
        <div className="f-hero">

          <h2 className="f-hero__line1">
            {'Something Worth Building?'.split('').map((ch, i) => (
              <span key={i} className="f-cta-char" style={{ animationDelay: `${i * 35}ms` }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h2>

          <h1 className="f-hero__line2">
            {'Let\'s Build.'.split('').map((ch, i) => (
              <span key={i} className="f-cta-char" style={{ animationDelay: `${860 + i * 50}ms` }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h1>

          {/* Email action */}
          <div className="f-hero__actions">
            <button
              type="button"
              className={`f-email-pill ${copied ? 'is-copied' : ''}`}
              onClick={copyEmail}
            >
              <span className="f-email-pill__addr">
                {copied ? 'Copied!' : 'aswinbiju2004@gmail.com'}
              </span>
              <span className="f-email-pill__badge">{copied ? '✓' : '→'}</span>
            </button>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="f-bar">
          <nav className="f-bar__nav" aria-label="Footer navigation">
            {[['hero', '↑ Top'], ['about', 'About'], ['works', 'Projects'], ['curiosities', 'Obsessions']].map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={(e) => goTo(e, id)} className="f-bar__link">
                {label}
              </a>
            ))}
          </nav>

          <div className="f-bar__socials">
            <a href="https://linkedin.com/in/aswinbiju" target="_blank" rel="noreferrer" className="f-bar__link">LinkedIn ↗</a>
            <a href="https://github.com/aswinbiju" target="_blank" rel="noreferrer" className="f-bar__link">GitHub ↗</a>
          </div>

          <span className="f-bar__meta">
            KOCHI · {timeStr || '—'} IST · © 2026 ASWIN BIJU
          </span>
        </div>

      </footer>
    </div>
  )
}
