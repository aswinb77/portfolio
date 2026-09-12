import { useState, useEffect, useRef } from 'react'
import './CreativeSection.css'

const CURIOSITIES = [
  {
    id: '01',
    theme: 'comics',
    title: 'Panels, Pacing & Ink',
    description:
      'From Will Eisner to Naoki Urasawa. Comics taught me that interface design is sequential art: layout dictates rhythm, gutters create breath, and contrast commands tension.',
  },
  {
    id: '02',
    theme: 'space',
    title: 'Everything is Energy & Gravity',
    description:
      'Sparked by Carl Sagan and orbital mechanics. We are made of stardust and carry the exact same cosmic energy as the sun. Looking up resets scale and grounds every detail.',
  },
  {
    id: '03',
    theme: 'japan',
    title: 'Ukiyo-e & The Great Wave',
    description:
      'From Hokusai’s woodblocks to Edo folklore. Interface design is sequential rhythm: knowing where the wave crests, where the foam breaks, and giving negative space (Ma) room to breathe.',
  },
  {
    id: '04',
    theme: 'chess',
    title: '64 Squares, Infinite Wars',
    description:
      'Chess is compressed decision theory. Every position is a thesis, every move a commitment. Playing thousands of games trained me to see systems — to look three moves ahead and stay comfortable in uncertainty.',
  },
  {
    id: '05',
    theme: 'slots',
    title: 'The House, The Odds & Pure Chance',
    description:
      'Games of chance are miniature simulations of decision theory under uncertainty. The psychology of the near-miss, the mathematics of expected value, and the rush of the spin. It taught me how humans seek patterns in pure noise.',
  },
]


// ─────────────────────────────────────────────────────────────
//  Canvas Black Hole — Gargantua / Cinematic Relativistic Singularity
//  Volumetric accretion disk with Doppler beaming (blazing white-gold approaching,
//  deep redshifted amber receding), warped gravitational lensing halos (upper & lower),
//  infinitely dark event horizon with razor-sharp photon ring, and spiraling relativistic plasma filaments.
// ─────────────────────────────────────────────────────────────
function BlackHoleCanvas({ isActive }) {
  const canvasRef = useRef(null)
  const raf = useRef(null)
  const t = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width || 600
      canvas.height = rect.height || 100
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)

    // Spiraling Infall Particles (relativistically accelerated)
    const NUM_PARTICLES = 65
    const particles = Array.from({ length: NUM_PARTICLES }, () => ({
      r: 60 + Math.random() * 180,
      theta: Math.random() * Math.PI * 2,
      infallSpeed: 0.18 + Math.random() * 0.28,
      size: 0.7 + Math.random() * 1.6,
      opacity: 0.3 + Math.random() * 0.7,
      hue: Math.random() < 0.6 ? '#ffd285' : (Math.random() < 0.5 ? '#ffffff' : '#f97316'),
      tail: [],
    }))

    // Plasma streaks on the accretion disk
    const STREAKS = 40
    const streaks = Array.from({ length: STREAKS }, () => ({
      r: 42 + Math.random() * 140,
      theta: Math.random() * Math.PI * 2,
      length: 0.35 + Math.random() * 0.75, // angular length in radians
      width: 1.2 + Math.random() * 2.8,
      alpha: 0.2 + Math.random() * 0.6,
    }))

    function draw() {
      t.current += isActive ? 0.024 : 0.012
      const now = t.current

      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Singularity center
      const cx = W * 0.54
      const cy = H * 0.5

      // Event horizon radius (responsive)
      const EH = Math.max(22, Math.min(H * 0.32, 40))

      // ── 1. Cosmic Spacetime Warping Glow ──
      const deepGlow = ctx.createRadialGradient(cx, cy, EH * 0.5, cx, cy, H * 1.8)
      deepGlow.addColorStop(0, 'rgba(168, 85, 247, 0.15)')
      deepGlow.addColorStop(0.3, 'rgba(234, 88, 12, 0.08)')
      deepGlow.addColorStop(0.7, 'rgba(15, 6, 25, 0.04)')
      deepGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = deepGlow
      ctx.fillRect(0, 0, W, H)

      // ── 2. Upper Gravitational Lensing Arch (Rear Disk warped over top) ──
      // This forms the iconic Gargantua "hat" arching over the black hole
      ctx.save()
      const topArchGradient = ctx.createRadialGradient(cx, cy, EH * 0.95, cx, cy, EH * 2.8)
      topArchGradient.addColorStop(0, 'rgba(255, 250, 220, 0.95)')
      topArchGradient.addColorStop(0.18, 'rgba(255, 200, 70, 0.75)')
      topArchGradient.addColorStop(0.42, 'rgba(249, 115, 22, 0.45)')
      topArchGradient.addColorStop(0.75, 'rgba(180, 40, 10, 0.15)')
      topArchGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = topArchGradient
      ctx.beginPath()
      // Arched dome over the top of the event horizon
      ctx.ellipse(cx, cy - EH * 0.15, EH * 2.2, EH * 1.65, -0.08, Math.PI * 0.95, Math.PI * 2.05)
      ctx.lineTo(cx + EH * 0.95, cy)
      ctx.ellipse(cx, cy, EH * 1.05, EH * 1.05, 0, 0, Math.PI, true)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // ── 3. Lower Gravitational Lensing Arch (Rear Disk warped under bottom) ──
      ctx.save()
      const botArchGradient = ctx.createRadialGradient(cx, cy, EH * 0.95, cx, cy, EH * 2.2)
      botArchGradient.addColorStop(0, 'rgba(255, 235, 170, 0.75)')
      botArchGradient.addColorStop(0.25, 'rgba(245, 158, 11, 0.45)')
      botArchGradient.addColorStop(0.6, 'rgba(194, 65, 12, 0.18)')
      botArchGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = botArchGradient
      ctx.beginPath()
      ctx.ellipse(cx, cy + EH * 0.12, EH * 1.9, EH * 1.25, 0.06, 0, Math.PI)
      ctx.ellipse(cx, cy, EH * 1.05, EH * 1.05, 0, Math.PI, 0, true)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // ── 4. Swirling Relativistic Plasma Filaments (Differential Keplerian Rotation) ──
      streaks.forEach((st) => {
        // Inner orbits spin much faster: v ~ r^-0.6
        const speed = (0.015 * Math.pow(EH / Math.max(EH, st.r), 0.65)) * (isActive ? 2.2 : 1.0)
        st.theta += speed

        const rx = st.r
        const ry = st.r * 0.22 // equatorial tilt

        // Doppler beaming: approaching side (left: theta ~ PI/2 to 3PI/2) is blindingly brighter
        const sinTh = Math.sin(st.theta)
        const doppler = Math.max(0.15, (1 - sinTh * 0.75)) // 0.25 to 1.75
        const strokeAlpha = Math.min(1.0, st.alpha * doppler * (isActive ? 1.3 : 0.95))

        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(-0.12) // disk inclination angle

        ctx.beginPath()
        ctx.ellipse(0, 0, rx, ry, 0, st.theta, st.theta + st.length)

        if (doppler > 1.1) {
          ctx.strokeStyle = `rgba(255, 245, 210, ${strokeAlpha})`
          ctx.shadowColor = 'rgba(255, 215, 100, 0.8)'
          ctx.shadowBlur = 8
        } else if (doppler > 0.6) {
          ctx.strokeStyle = `rgba(251, 146, 60, ${strokeAlpha})`
          ctx.shadowColor = 'rgba(234, 88, 12, 0.5)'
          ctx.shadowBlur = 4
        } else {
          ctx.strokeStyle = `rgba(180, 40, 15, ${strokeAlpha * 0.6})`
        }

        ctx.lineWidth = st.width * (doppler > 1 ? 1.4 : 0.9)
        ctx.stroke()
        ctx.restore()
      })

      // ── 5. The Event Horizon (Central Void) ──
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, EH, 0, Math.PI * 2)
      ctx.fillStyle = '#000000'
      ctx.fill()
      ctx.restore()

      // ── 6. The Blazing Photon Ring (Einstein Ring) ──
      // Intense, razor-sharp light boundary right on the event horizon perimeter
      ctx.save()
      const photonPulse = 0.88 + Math.sin(now * 4.5) * 0.12
      ctx.beginPath()
      ctx.arc(cx, cy, EH * 1.025, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(255, 252, 235, ${0.95 * photonPulse})`
      ctx.lineWidth = 2.2
      ctx.shadowColor = 'rgba(255, 220, 110, 1)'
      ctx.shadowBlur = isActive ? 18 : 12
      ctx.stroke()

      // Thinner secondary golden halo ring
      ctx.beginPath()
      ctx.arc(cx, cy, EH * 1.08, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.5 * photonPulse})`
      ctx.lineWidth = 1.0
      ctx.shadowBlur = 6
      ctx.stroke()
      ctx.restore()

      // ── 7. Front Equatorial Accretion Disk (Cutting across the front of the sphere) ──
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(-0.12)

      // Multiple dense glowing gradient bands sweeping across the front
      const frontRings = [
        { r: EH * 1.15, w: 5.5, a: 0.95 },
        { r: EH * 1.45, w: 7.0, a: 0.88 },
        { r: EH * 1.85, w: 8.5, a: 0.78 },
        { r: EH * 2.35, w: 9.0, a: 0.65 },
        { r: EH * 3.1,  w: 10.0, a: 0.45 },
        { r: EH * 4.0,  w: 11.0, a: 0.25 },
      ]

      frontRings.forEach(({ r, w, a }) => {
        const rx = r
        const ry = r * 0.22

        // Doppler shift gradient across the front belt
        const beltGrd = ctx.createLinearGradient(-rx, 0, rx, 0)
        beltGrd.addColorStop(0,   `rgba(255, 255, 255, ${a})`)
        beltGrd.addColorStop(0.2, `rgba(255, 225, 110, ${a * 0.95})`)
        beltGrd.addColorStop(0.45,`rgba(251, 146, 60, ${a * 0.8})`)
        beltGrd.addColorStop(0.75,`rgba(220, 50, 15, ${a * 0.5})`)
        beltGrd.addColorStop(1,   `rgba(120, 20, 10, ${a * 0.15})`)

        ctx.strokeStyle = beltGrd
        ctx.lineWidth = w
        ctx.beginPath()
        // Only draw the front half (bottom arc in local rotated space)
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI)
        ctx.stroke()
      })
      ctx.restore()

      // ── 8. Infalling Spiraling Plasma Sparks & Gas Motes ──
      particles.forEach((p) => {
        // Spiral inward with gravitational acceleration
        const accel = (EH * 2.5) / Math.max(EH, p.r)
        p.theta += (0.012 * accel) * (isActive ? 2.5 : 1.0)
        p.r -= (p.infallSpeed * (0.6 + accel * 0.6)) * (isActive ? 2.4 : 1.0)

        // Calculate 2D position with disk tilt
        const tiltX = Math.cos(-0.12)
        const tiltY = Math.sin(-0.12)
        const unrotX = Math.cos(p.theta) * p.r
        const unrotY = Math.sin(p.theta) * p.r * 0.25

        const px = cx + (unrotX * tiltX - unrotY * tiltY)
        const py = cy + (unrotX * tiltY + unrotY * tiltX)

        p.tail.unshift({ x: px, y: py })
        if (p.tail.length > 6) p.tail.pop()

        // Reset if swallowed by event horizon
        if (p.r <= EH * 1.02) {
          p.r = 80 + Math.random() * 160
          p.theta = Math.random() * Math.PI * 2
          p.tail = []
        }

        // Draw particle tail
        if (p.tail.length > 1) {
          ctx.beginPath()
          ctx.moveTo(p.tail[0].x, p.tail[0].y)
          for (let i = 1; i < p.tail.length; i++) {
            ctx.lineTo(p.tail[i].x, p.tail[i].y)
          }
          ctx.strokeStyle = p.hue
          ctx.lineWidth = p.size * 0.8
          ctx.globalAlpha = p.opacity * 0.5
          ctx.stroke()
        }

        // Particle head
        ctx.fillStyle = p.hue
        ctx.globalAlpha = p.opacity
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      if (isVisible) {
        raf.current = requestAnimationFrame(draw)
      }
    }

    let isVisible = false
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(raf.current)
      }
    }, { threshold: 0.05 })
    io.observe(canvas.parentElement)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf.current)
      ro.disconnect()
    }
  }, [isActive])

  return (
    <div className="env-space" aria-hidden="true">
      <canvas ref={canvasRef} className="bh-canvas" />
    </div>
  )
}


// ─────────────────────────────────────────────────────────────
//  Ukiyo-e Wave — Japanese History & Art / "Ukiyo-e & The Great Wave"
//  Inspired by Katsushika Hokusai's iconic woodblock masterpiece.
//  Multi-layered rolling trochoidal ocean waves in Prussian blue & indigo,
//  stylized curling white foam claws, flying sea spray particles,
//  and a distant Mount Fuji with golden Edo sun reflection.
// ─────────────────────────────────────────────────────────────
function UkiyoeWaveCanvas({ isActive }) {
  const canvasRef = useRef(null)
  const raf = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let cssW = 600
    let cssH = 100
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      const r = canvas.parentElement.getBoundingClientRect()
      cssW = Math.max(r.width || 600, 300)
      cssH = Math.max(r.height || 100, 80)
      canvas.width = Math.floor(cssW * dpr)
      canvas.height = Math.floor(cssH * dpr)
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)

    // Sea spray foam particles (Shibuki)
    const SPRAY_COUNT = 55
    const spray = Array.from({ length: SPRAY_COUNT }, () => ({
      x: Math.random() * cssW,
      y: cssH * 0.5 + Math.random() * cssH * 0.4,
      vx: 1.2 + Math.random() * 2.6,
      vy: -(0.6 + Math.random() * 2.2),
      size: 1.0 + Math.random() * 2.2,
      alpha: 0.35 + Math.random() * 0.55,
      life: Math.random(),
    }))

    // Ambient floating mist droplets
    const mist = Array.from({ length: 20 }, () => ({
      x: Math.random() * cssW,
      y: Math.random() * (cssH * 0.5),
      vx: 0.25 + Math.random() * 0.5,
      size: 0.8 + Math.random() * 1.4,
      alpha: 0.12 + Math.random() * 0.25,
    }))

    let t = 0

    // ── Continuous Gerstner Wave Formula ──
    // Evaluates a continuous, unbroken Stokes/Gerstner ocean wave:
    // Steep sharp crests, broad flat troughs, and forward-leaning breaker curl.
    function getWavePoint(u, time, baseY, amp, wavelength, speed, steepness = 0.4, phase = 0) {
      const k = (2 * Math.PI) / wavelength
      const ph = k * u - time * speed + phase
      // Gerstner horizontal pull (leans wave crest forward in direction of travel)
      const x = u - steepness * (amp * 0.8) * Math.sin(ph)
      // Stokes wave vertical elevation: steep peak, wide trough
      const y = baseY - amp * Math.cos(ph) + (amp * 0.3) * Math.cos(2 * ph)
      return { x, y, phase: ph }
    }

    function draw() {
      t += isActive ? 0.032 : 0.016
      const W = cssW, H = cssH

      ctx.save()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // ── 1. Nocturnal Woodblock Sky & Horizon Glow ──
      const sky = ctx.createLinearGradient(0, 0, 0, H)
      sky.addColorStop(0, '#040813')
      sky.addColorStop(0.5, '#0a1626')
      sky.addColorStop(0.85, '#0e2038')
      sky.addColorStop(1, '#060e1c')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, W, H)

      // Woodblock horizontal stipple / paper grain
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.lineWidth = 1
      for (let y = 6; y < H * 0.7; y += 10) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }

      // ── 2. Distant Silver-Gold Edo Moon / Sun ──
      const moonX = W * 0.88
      const moonY = H * 0.24
      const moonR = Math.min(H * 0.20, 18)

      // Soft ambient glow (tasteful, does not obscure text)
      const moonGlow = ctx.createRadialGradient(moonX, moonY, moonR * 0.2, moonX, moonY, moonR * 3)
      moonGlow.addColorStop(0, 'rgba(253, 230, 138, 0.25)')
      moonGlow.addColorStop(0.5, 'rgba(217, 119, 6, 0.06)')
      moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = moonGlow
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonR * 3, 0, Math.PI * 2)
      ctx.fill()

      // Luminous Disc
      const moonBody = ctx.createRadialGradient(moonX - moonR * 0.25, moonY - moonR * 0.25, 1, moonX, moonY, moonR)
      moonBody.addColorStop(0, '#ffffff')
      moonBody.addColorStop(0.7, '#fef08a')
      moonBody.addColorStop(1, '#f59e0b')
      ctx.fillStyle = moonBody
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2)
      ctx.fill()

      // Delicate Kasumi mist ribbon
      ctx.fillStyle = 'rgba(10, 22, 38, 0.5)'
      ctx.beginPath()
      ctx.roundRect(moonX - 20 + Math.sin(t * 0.5) * 3, moonY + 4, 55, 3.5, 2)
      ctx.fill()

      // ── Helper: Render Completely Intact Wave Layer ──
      // Guarantees 100% continuous, unbroken curves from x = 0 to x = W!
      function renderContinuousWaveLayer({
        baseY,
        amp,
        wavelength,
        speed,
        steepness,
        phase,
        fillColor,
        crestStrokeColor,
        crestStrokeWidth,
        contours = [],
      }) {
        const STEP = 4
        const points = []

        // Sample points across full width with safety margin
        for (let u = -30; u <= W + 40; u += STEP) {
          const pt = getWavePoint(u, t, baseY, amp, wavelength, speed, steepness, phase)
          points.push(pt)
        }

        // 1. Solid Wave Body Fill (Closed polygon without gaps)
        ctx.save()
        ctx.fillStyle = fillColor
        ctx.beginPath()
        ctx.moveTo(0, H)
        for (let i = 0; i < points.length; i++) {
          const p = points[i]
          if (p.x >= -10 && p.x <= W + 10) {
            ctx.lineTo(p.x, p.y)
          }
        }
        ctx.lineTo(W, H)
        ctx.closePath()
        ctx.fill()

        // 2. Continuous Parallel Woodblock Flow Contour Stripes
        contours.forEach(({ offset, color, width }) => {
          ctx.strokeStyle = color
          ctx.lineWidth = width
          ctx.beginPath()
          let started = false
          for (let u = -20; u <= W + 30; u += STEP) {
            const pt = getWavePoint(u, t, baseY + offset, amp, wavelength, speed, steepness, phase)
            if (pt.x >= -5 && pt.x <= W + 5) {
              if (!started) {
                ctx.moveTo(pt.x, pt.y)
                started = true
              } else {
                ctx.lineTo(pt.x, pt.y)
              }
            }
          }
          ctx.stroke()
        })

        // 3. Crisp Continuous Foam Crest Line
        if (crestStrokeColor) {
          ctx.strokeStyle = crestStrokeColor
          ctx.lineWidth = crestStrokeWidth || 2.0
          ctx.beginPath()
          let started = false
          for (let i = 0; i < points.length; i++) {
            const p = points[i]
            if (p.x >= -5 && p.x <= W + 5) {
              if (!started) {
                ctx.moveTo(p.x, p.y)
                started = true
              } else {
                ctx.lineTo(p.x, p.y)
              }
            }
          }
          ctx.stroke()
        }

        ctx.restore()
        return points
      }

      // ── 3. Wave Layer 1: Distant Ocean Swell (Deep Indigo) ──
      renderContinuousWaveLayer({
        baseY: H * 0.54,
        amp: 9 + (isActive ? 3 : 0),
        wavelength: Math.max(W * 0.55, 240),
        speed: 0.9,
        steepness: 0.25,
        phase: 0.5,
        fillColor: '#0b1d35',
        crestStrokeColor: 'rgba(186, 230, 253, 0.4)',
        crestStrokeWidth: 1.5,
      })

      // ── 4. Wave Layer 2: Midground Rolling Breaker (Prussian Indigo) ──
      const midWaveAmp = 15 + (isActive ? 5 : 0)
      renderContinuousWaveLayer({
        baseY: H * 0.64,
        amp: midWaveAmp,
        wavelength: Math.max(W * 0.48, 220),
        speed: 1.4,
        steepness: 0.38,
        phase: 2.2,
        fillColor: '#112f54',
        crestStrokeColor: 'rgba(224, 242, 254, 0.75)',
        crestStrokeWidth: 2.0,
        contours: [
          { offset: 8, color: 'rgba(56, 189, 248, 0.32)', width: 1.5 },
          { offset: 16, color: 'rgba(14, 165, 233, 0.22)', width: 1.2 },
        ],
      })

      // ── 5. Wave Layer 3: THE GREAT WAVE (Hero Breaker with Woodblock Contours) ──
      const heroAmp = (isActive ? 25 : 18)
      const heroWavelength = Math.max(W * 0.42, 260)
      const heroBaseY = H * 0.82
      const heroSpeed = 1.8
      const heroSteepness = 0.55

      // Vibrant Ukiyo-e Prussian blue gradient
      const heroGrad = ctx.createLinearGradient(0, heroBaseY - heroAmp * 1.5, 0, H)
      heroGrad.addColorStop(0, '#1d4ed8')
      heroGrad.addColorStop(0.3, '#1a437e')
      heroGrad.addColorStop(0.7, '#133563')
      heroGrad.addColorStop(1, '#091c36')

      const heroPoints = renderContinuousWaveLayer({
        baseY: heroBaseY,
        amp: heroAmp,
        wavelength: heroWavelength,
        speed: heroSpeed,
        steepness: heroSteepness,
        phase: 0,
        fillColor: heroGrad,
        crestStrokeColor: '#ffffff',
        crestStrokeWidth: 2.8,
        contours: [
          { offset: 6, color: 'rgba(255, 255, 255, 0.65)', width: 1.6 },
          { offset: 12, color: 'rgba(125, 211, 252, 0.52)', width: 2.0 },
          { offset: 19, color: 'rgba(56, 189, 248, 0.42)', width: 1.8 },
          { offset: 27, color: 'rgba(29, 78, 216, 0.45)', width: 2.2 },
        ],
      })

      // ── 7. Anchored Stylized Japanese Wave Claws (Nami-gashira) ──
      // Procedurally anchored directly onto the wave crests:
      // Perfectly synchronized with the wave equation, eliminating disoriented floaters!
      ctx.save()
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = '#e0f2fe'
      ctx.lineWidth = 1.0

      // Find crest points where (phase % 2PI) is near peak
      heroPoints.forEach((p) => {
        if (p.x < -10 || p.x > W + 10) return

        // Check if point is on a sharp crest peak (cosine is high)
        const normPhase = ((p.phase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
        const isPeak = normPhase < 0.35 || normPhase > (2 * Math.PI - 0.35)

        if (isPeak) {
          // Dynamic claw reach
          const clawReach = 14 + Math.sin(p.x * 0.05 + t * 4) * 4
          const clawDrop = 9 + Math.cos(p.x * 0.05 + t * 4) * 3

          // Forward-hooking foam talon
          ctx.beginPath()
          ctx.moveTo(p.x - 3, p.y + 1)
          ctx.quadraticCurveTo(p.x + clawReach * 0.6, p.y - clawDrop * 0.6, p.x + clawReach, p.y + clawDrop * 0.4)
          ctx.quadraticCurveTo(p.x + clawReach * 0.7, p.y + clawDrop * 0.2, p.x + 2, p.y + 2)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()

          // Secondary micro-finger claw
          ctx.beginPath()
          ctx.moveTo(p.x + 2, p.y)
          ctx.quadraticCurveTo(p.x + clawReach * 0.8, p.y - clawDrop * 0.2, p.x + clawReach * 1.25, p.y + clawDrop * 0.8)
          ctx.quadraticCurveTo(p.x + clawReach * 0.9, p.y + clawDrop * 0.5, p.x + 4, p.y + 2)
          ctx.closePath()
          ctx.fill()
        }
      })
      ctx.restore()

      // ── 8. Wave Layer 4: Foreground Churning Foam & Trough Ripple ──
      renderContinuousWaveLayer({
        baseY: H * 0.89,
        amp: 7 + (isActive ? 2 : 0),
        wavelength: Math.max(W * 0.35, 180),
        speed: 2.2,
        steepness: 0.3,
        phase: 4.1,
        fillColor: '#091c33',
        crestStrokeColor: 'rgba(255, 255, 255, 0.85)',
        crestStrokeWidth: 1.8,
        contours: [
          { offset: 5, color: 'rgba(186, 230, 253, 0.35)', width: 1.2 },
        ],
      })

      // Surface foam trails in the foreground trough
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
      ctx.lineWidth = 1.0
      ;[0.93, 0.97].forEach((yPct, rowIdx) => {
        ctx.beginPath()
        ctx.moveTo(0, H * yPct)
        for (let x = 0; x <= W + 15; x += 15) {
          const y = H * yPct + Math.sin(x * 0.026 - t * 3.2 + rowIdx * 1.5) * 2.5
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      })

      // ── 9. Flying Sea Spray Particles (Shibuki) ──
      const windSpeed = isActive ? 3.8 : 2.0
      spray.forEach((p) => {
        p.x += p.vx * windSpeed
        p.y += p.vy * (isActive ? 1.3 : 1.0)
        p.vy += 0.048 // Gravity
        p.life -= 0.016

        // Respawn along the active wave crests
        if (p.x > W + 20 || p.y > H || p.life <= 0) {
          p.x = Math.random() * (W * 0.85)
          p.y = heroBaseY - heroAmp * 0.8 + Math.random() * 15
          p.vx = 1.1 + Math.random() * 2.6
          p.vy = -(1.0 + Math.random() * 2.4)
          p.life = 0.55 + Math.random() * 0.45
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * p.life})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Ambient drifting mist
      mist.forEach((m) => {
        m.x += m.vx
        if (m.x > W + 10) m.x = -10
        ctx.fillStyle = `rgba(224, 242, 254, ${m.alpha})`
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.restore()
      if (isVisible) {
        raf.current = requestAnimationFrame(draw)
      }
    }

    let isVisible = false
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(raf.current)
      }
    }, { threshold: 0.05 })
    io.observe(canvas.parentElement)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf.current)
      ro.disconnect()
    }
  }, [isActive])

  return (
    <div className="env-japan" aria-hidden="true">
      <canvas ref={canvasRef} className="env-canvas" />
    </div>
  )
}


// ─────────────────────────────────────────────────────────────
//  Knight's Tour — Chess / "64 Squares, Infinite Wars"
//  Warnsdorff's heuristic: always move to the square with fewest
//  onward moves. Traces all 64 squares without repeating once.
// ─────────────────────────────────────────────────────────────
function KnightsTourCanvas({ isActive }) {
  const canvasRef = useRef(null)
  const raf = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      const r = canvas.parentElement.getBoundingClientRect()
      canvas.width = r.width || 600
      canvas.height = r.height || 100
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)

    const KNIGHT_MOVES = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
    const N = 8

    let visited, path, kx, ky, fc, stuck, restTimer

    function inBounds(x, y) { return x >= 0 && x < N && y >= 0 && y < N }

    function degree(x, y) {
      return KNIGHT_MOVES.filter(([dx, dy]) => {
        const nx = x + dx, ny = y + dy
        return inBounds(nx, ny) && !visited[ny][nx]
      }).length
    }

    function nextSquare(x, y) {
      const cands = KNIGHT_MOVES
        .map(([dx, dy]) => [x + dx, y + dy])
        .filter(([nx, ny]) => inBounds(nx, ny) && !visited[ny][nx])
        .sort((a, b) => degree(a[0], a[1]) - degree(b[0], b[1]))
      return cands[0] || null
    }

    function reset() {
      visited = Array.from({ length: N }, () => new Array(N).fill(false))
      path = []
      kx = Math.floor(Math.random() * N)
      ky = Math.floor(Math.random() * N)
      visited[ky][kx] = true
      path.push([kx, ky])
      fc = 0
      stuck = false
      restTimer = 0
    }

    reset()

    function draw() {
      fc++
      const W = canvas.width, H = canvas.height
      ctx.fillStyle = 'rgb(7, 7, 9)'
      ctx.fillRect(0, 0, W, H)

      // Board geometry — always vertically centred
      const cellSize = Math.min((W * 0.72) / N, (H * 0.88) / N)
      const boardW = cellSize * N
      const bx0 = (W - boardW) / 2
      const by0 = (H - cellSize * N) / 2

      // Subtle grid
      ctx.strokeStyle = 'rgba(100, 110, 140, 0.12)'
      ctx.lineWidth = 0.6
      for (let i = 0; i <= N; i++) {
        ctx.beginPath()
        ctx.moveTo(bx0 + i * cellSize, by0)
        ctx.lineTo(bx0 + i * cellSize, by0 + cellSize * N)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(bx0,          by0 + i * cellSize)
        ctx.lineTo(bx0 + boardW, by0 + i * cellSize)
        ctx.stroke()
      }

      if (stuck) {
        // Pause then restart
        restTimer++
        if (restTimer > (isActive ? 55 : 110)) reset()
      } else {
        // Advance the tour
        const moveEvery = isActive ? 7 : 16
        if (fc % moveEvery === 0) {
          const next = nextSquare(kx, ky)
          if (next) {
            ;[kx, ky] = next
            visited[ky][kx] = true
            path.push([kx, ky])
          } else {
            stuck = true
          }
        }
      }

      // Draw trail — each step in path with fading luminance
      const trailLen = 20
      path.forEach(([px, py], idx) => {
        const age = path.length - idx - 1
        const cx = bx0 + px * cellSize + cellSize / 2
        const cy = by0 + py * cellSize + cellSize / 2

        if (age < trailLen) {
          // Recent trail glow
          const fade = 1 - age / trailLen
          ctx.save()
          ctx.shadowColor = `rgba(120, 200, 255, ${fade * 0.7})`
          ctx.shadowBlur = 10
          ctx.fillStyle = `rgba(80, 170, 230, ${fade * 0.35})`
          ctx.beginPath()
          ctx.arc(cx, cy, cellSize * 0.32, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        } else {
          // Old visited mark — tiny dot
          ctx.fillStyle = 'rgba(70, 130, 180, 0.14)'
          ctx.beginPath()
          ctx.arc(cx, cy, cellSize * 0.14, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Draw path line connecting all visited
      if (path.length > 1) {
        ctx.beginPath()
        path.forEach(([px, py], i) => {
          const cx = bx0 + px * cellSize + cellSize / 2
          const cy = by0 + py * cellSize + cellSize / 2
          if (i === 0) {
            ctx.moveTo(cx, cy)
          } else {
            ctx.lineTo(cx, cy)
          }
        })
        ctx.strokeStyle = 'rgba(100, 180, 240, 0.18)'
        ctx.lineWidth = 0.9
        ctx.stroke()
      }

      // Knight — bright glowing disc at current position
      if (!stuck) {
        const kCx = bx0 + kx * cellSize + cellSize / 2
        const kCy = by0 + ky * cellSize + cellSize / 2
        ctx.save()
        ctx.shadowColor = 'rgba(160, 220, 255, 0.9)'
        ctx.shadowBlur = 18
        ctx.fillStyle = 'rgba(225, 245, 255, 0.95)'
        ctx.beginPath()
        ctx.arc(kCx, kCy, cellSize * 0.38, 0, Math.PI * 2)
        ctx.fill()
        // Inner cross to suggest a chess piece
        ctx.strokeStyle = 'rgba(80, 140, 200, 0.7)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(kCx - cellSize * 0.18, kCy)
        ctx.lineTo(kCx + cellSize * 0.18, kCy)
        ctx.moveTo(kCx, kCy - cellSize * 0.18)
        ctx.lineTo(kCx, kCy + cellSize * 0.18)
        ctx.stroke()
        ctx.restore()
      }

      // Step counter
      ctx.fillStyle = 'rgba(100, 170, 220, 0.38)'
      ctx.font = `${Math.max(8, cellSize * 0.62)}px 'SF Mono', monospace`
      ctx.textAlign = 'right'
      ctx.fillText(`${path.length} / 64`, W - 10, H - 8)
      ctx.textAlign = 'left'

      if (isVisible) {
        raf.current = requestAnimationFrame(draw)
      }
    }

    let isVisible = false
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(raf.current)
      }
    }, { threshold: 0.05 })
    io.observe(canvas.parentElement)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf.current)
      ro.disconnect()
    }
  }, [isActive])

  return (
    <div className="env-knight" aria-hidden="true">
      <canvas ref={canvasRef} className="env-canvas" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  Slot Machine — Probability & Chance / "The House, The Odds & Pure Chance"
//  3-Reel classic mechanical slot machine in vintage gold & titanium cabinet.
//  Reels spin with motion blur, land with realistic mechanical spring recoil.
//  On hover: pulls lever, spins, locks into JACKPOT 777, flashing neon payline laser,
//  chasing golden marquee bulbs, and a shower of bouncing gold coins!
// ─────────────────────────────────────────────────────────────
function SlotMachineCanvas({ isActive }) {
  const canvasRef = useRef(null)
  const raf = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let cssW = 600
    let cssH = 100
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      const r = canvas.parentElement.getBoundingClientRect()
      cssW = Math.max(r.width || 600, 300)
      cssH = Math.max(r.height || 100, 80)
      canvas.width = Math.floor(cssW * dpr)
      canvas.height = Math.floor(cssH * dpr)
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)

    // Symbol types for the 3 reels
    const SYMBOLS = ['7', 'DIAMOND', 'CHERRY', 'BELL', 'BAR', 'STAR']

    // 3 Reels state: pos, speed, stopping, stopTime, recoilTimer
    const reels = [
      { pos: 0, speed: 0, stopping: false, stopProgress: 0 },
      { pos: 0, speed: 0, stopping: false, stopProgress: 0 },
      { pos: 0, speed: 0, stopping: false, stopProgress: 0 },
    ]

    // Coins and Sparkles
    const coins = []
    const sparks = []

    let spinTimer = 0
    let isSpinning = false
    let isJackpot = false
    let bulbTick = 0
    let prevActive = false

    function triggerSpin() {
      isSpinning = true
      isJackpot = false
      spinTimer = 0
      reels.forEach((reel, i) => {
        reel.speed = 0.55 + i * 0.12
        reel.stopping = false
        reel.stopProgress = 0
      })
    }

    function spawnJackpotEffects(cx, cy, W, H) {
      // Golden coins fountain
      for (let i = 0; i < 48; i++) {
        const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.6
        const spd = 3.5 + Math.random() * 6.5
        coins.push({
          x: cx + (Math.random() - 0.5) * (W * 0.4),
          y: cy + 10,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          rot: Math.random() * Math.PI * 2,
          rotSpd: (Math.random() - 0.5) * 0.35,
          size: 4.5 + Math.random() * 4.5,
          life: 1.0,
        })
      }
      // Victory sparkles
      for (let i = 0; i < 35; i++) {
        sparks.push({
          x: cx + (Math.random() - 0.5) * (W * 0.7),
          y: cy + (Math.random() - 0.5) * (H * 0.6),
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          color: Math.random() > 0.4 ? '#fcd34d' : '#f43f5e',
          size: 1.5 + Math.random() * 2.5,
          life: 1.0,
        })
      }
    }

    // ── Vector Symbol Draw Routines ──

    // 1. LUCKY 7 — Beveled crimson-ruby 7 with gold chrome trim
    function drawLucky7(c, cx, cy, size, jackpot, pulse) {
      c.save()
      c.translate(cx, cy)
      const sc = size * (jackpot ? 1.0 + Math.sin(pulse * 8) * 0.12 : 1.0)
      c.scale(sc, sc)

      if (jackpot) {
        // Radiant golden aura
        c.shadowColor = '#f59e0b'
        c.shadowBlur = 18
      }

      // Red ruby body gradient
      const bodyGrad = c.createLinearGradient(-12, -18, 12, 18)
      bodyGrad.addColorStop(0, '#f87171')
      bodyGrad.addColorStop(0.3, '#dc2626')
      bodyGrad.addColorStop(1, '#991b1b')

      c.beginPath()
      c.moveTo(-16, -18)
      c.lineTo(16, -18)
      c.lineTo(16, -10)
      c.lineTo(4, 18)
      c.lineTo(-6, 18)
      c.lineTo(5, -9)
      c.lineTo(-16, -9)
      c.closePath()
      c.fillStyle = bodyGrad
      c.fill()

      // Beveled Gold Border
      c.strokeStyle = '#fde047'
      c.lineWidth = 2.2
      c.stroke()

      // Inner highlight line
      c.strokeStyle = 'rgba(255, 255, 255, 0.75)'
      c.lineWidth = 1.0
      c.beginPath()
      c.moveTo(-13, -15)
      c.lineTo(13, -15)
      c.lineTo(4, 12)
      c.stroke()

      c.restore()
    }

    // 2. DIAMOND — Faceted cyan brilliant gem
    function drawDiamond(c, cx, cy, size) {
      c.save()
      c.translate(cx, cy)
      c.scale(size, size)

      // Top Table & Crown
      c.fillStyle = '#e0f2fe'
      c.beginPath()
      c.moveTo(-8, -14)
      c.lineTo(8, -14)
      c.lineTo(16, -4)
      c.lineTo(-16, -4)
      c.closePath()
      c.fill()

      // Center Pavilion
      c.fillStyle = '#38bdf8'
      c.beginPath()
      c.moveTo(-16, -4)
      c.lineTo(16, -4)
      c.lineTo(0, 16)
      c.closePath()
      c.fill()

      // Left facet
      c.fillStyle = '#0284c7'
      c.beginPath()
      c.moveTo(-16, -4)
      c.lineTo(-6, -4)
      c.lineTo(0, 16)
      c.closePath()
      c.fill()

      // Right facet
      c.fillStyle = '#0369a1'
      c.beginPath()
      c.moveTo(16, -4)
      c.lineTo(6, -4)
      c.lineTo(0, 16)
      c.closePath()
      c.fill()

      // Table facet
      c.fillStyle = '#bae6fd'
      c.beginPath()
      c.moveTo(-8, -14)
      c.lineTo(8, -14)
      c.lineTo(5, -4)
      c.lineTo(-5, -4)
      c.closePath()
      c.fill()

      // Facet outlines
      c.strokeStyle = 'rgba(255, 255, 255, 0.85)'
      c.lineWidth = 1.2
      c.stroke()

      // Sparkle Glint
      c.fillStyle = '#ffffff'
      c.beginPath()
      c.arc(-4, -8, 2, 0, Math.PI * 2)
      c.fill()

      c.restore()
    }

    // 3. CHERRY — Double plump cherries with curved stems and leaf
    function drawCherry(c, cx, cy, size) {
      c.save()
      c.translate(cx, cy)
      c.scale(size, size)

      // Stems
      c.strokeStyle = '#65a30d'
      c.lineWidth = 2.0
      c.beginPath()
      c.moveTo(-7, 4)
      c.quadraticCurveTo(-2, -10, 3, -15)
      c.stroke()

      c.beginPath()
      c.moveTo(8, 6)
      c.quadraticCurveTo(4, -8, 3, -15)
      c.stroke()

      // Leaf
      c.fillStyle = '#22c55e'
      c.beginPath()
      c.moveTo(3, -15)
      c.quadraticCurveTo(12, -20, 15, -14)
      c.quadraticCurveTo(10, -10, 3, -15)
      c.closePath()
      c.fill()

      // Left cherry
      const cherry1 = c.createRadialGradient(-9, 4, 1, -8, 6, 9)
      cherry1.addColorStop(0, '#fda4af')
      cherry1.addColorStop(0.3, '#f43f5e')
      cherry1.addColorStop(1, '#9f1239')
      c.fillStyle = cherry1
      c.beginPath()
      c.arc(-8, 6, 8.5, 0, Math.PI * 2)
      c.fill()

      // Right cherry
      const cherry2 = c.createRadialGradient(7, 6, 1, 8, 8, 9)
      cherry2.addColorStop(0, '#fda4af')
      cherry2.addColorStop(0.3, '#f43f5e')
      cherry2.addColorStop(1, '#9f1239')
      c.fillStyle = cherry2
      c.beginPath()
      c.arc(8, 8, 8.5, 0, Math.PI * 2)
      c.fill()

      // Specular highlights
      c.fillStyle = '#ffffff'
      c.beginPath()
      c.arc(-10, 3, 2.2, 0, Math.PI * 2)
      c.fill()
      c.beginPath()
      c.arc(6, 5, 2.2, 0, Math.PI * 2)
      c.fill()

      c.restore()
    }

    // 4. BELL — Golden Liberty bell
    function drawBell(c, cx, cy, size) {
      c.save()
      c.translate(cx, cy)
      c.scale(size, size)

      // Top Hanger Loop
      c.strokeStyle = '#b45309'
      c.lineWidth = 2.2
      c.beginPath()
      c.arc(0, -13, 3.5, 0, Math.PI * 2)
      c.stroke()

      // Bell Body
      const bellGrad = c.createLinearGradient(-12, -10, 12, 10)
      bellGrad.addColorStop(0, '#fef08a')
      bellGrad.addColorStop(0.4, '#f59e0b')
      bellGrad.addColorStop(1, '#b45309')
      c.fillStyle = bellGrad

      c.beginPath()
      c.moveTo(-5, -10)
      c.quadraticCurveTo(-10, -3, -11, 6)
      c.quadraticCurveTo(-15, 11, -14, 13)
      c.lineTo(14, 13)
      c.quadraticCurveTo(15, 11, 11, 6)
      c.quadraticCurveTo(10, -3, 5, -10)
      c.closePath()
      c.fill()

      // Bell Rim
      c.strokeStyle = '#fde047'
      c.lineWidth = 2.0
      c.stroke()

      // Clapper
      c.fillStyle = '#e2e8f0'
      c.beginPath()
      c.arc(0, 15, 3.5, 0, Math.PI * 2)
      c.fill()

      c.restore()
    }

    // 5. BAR — Polished titanium ingot with gold emboss
    function drawBar(c, cx, cy, size) {
      c.save()
      c.translate(cx, cy)
      c.scale(size, size)

      // Ingot Rect
      const barGrad = c.createLinearGradient(-18, -10, 18, 10)
      barGrad.addColorStop(0, '#f8fafc')
      barGrad.addColorStop(0.5, '#cbd5e1')
      barGrad.addColorStop(1, '#64748b')
      c.fillStyle = barGrad

      c.beginPath()
      c.roundRect(-20, -10, 40, 20, 3)
      c.fill()

      // Gold Bevel Edge
      c.strokeStyle = '#f59e0b'
      c.lineWidth = 1.8
      c.stroke()

      // Embossed "BAR" text
      c.font = "900 11px 'Arial Black', sans-serif"
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillStyle = '#0f172a'
      c.fillText('BAR', 0, 1)

      c.restore()
    }

    // 6. STAR — Golden arcade star
    function drawStar(c, cx, cy, size) {
      c.save()
      c.translate(cx, cy)
      c.scale(size, size)

      const starGrad = c.createRadialGradient(0, 0, 2, 0, 0, 16)
      starGrad.addColorStop(0, '#fef08a')
      starGrad.addColorStop(0.5, '#fbbf24')
      starGrad.addColorStop(1, '#d97706')
      c.fillStyle = starGrad

      c.beginPath()
      for (let i = 0; i < 5; i++) {
        const outerA = (i * 72 - 90) * (Math.PI / 180)
        const innerA = ((i * 72 + 36) - 90) * (Math.PI / 180)
        const ox = Math.cos(outerA) * 15
        const oy = Math.sin(outerA) * 15
        const ix = Math.cos(innerA) * 6.8
        const iy = Math.sin(innerA) * 6.8
        if (i === 0) {
          c.moveTo(ox, oy)
        } else {
          c.lineTo(ox, oy)
        }
        c.lineTo(ix, iy)
      }
      c.closePath()
      c.fill()

      c.strokeStyle = '#ffffff'
      c.lineWidth = 1.2
      c.stroke()

      c.restore()
    }

    // Symbol dispatcher
    function renderSymbol(c, symName, cx, cy, scale, isJack, pulse) {
      switch (symName) {
        case '7':
          drawLucky7(c, cx, cy, scale, isJack, pulse)
          break
        case 'DIAMOND':
          drawDiamond(c, cx, cy, scale)
          break
        case 'CHERRY':
          drawCherry(c, cx, cy, scale)
          break
        case 'BELL':
          drawBell(c, cx, cy, scale)
          break
        case 'BAR':
          drawBar(c, cx, cy, scale)
          break
        case 'STAR':
          drawStar(c, cx, cy, scale)
          break
      }
    }

    // ── Main Render Loop ──
    function draw() {
      bulbTick += 0.08
      const W = cssW, H = cssH

      ctx.save()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // Trigger spin on hover entry
      if (isActive && !prevActive) {
        triggerSpin()
      }
      prevActive = isActive

      // Backdrop
      ctx.fillStyle = '#07040a'
      ctx.fillRect(0, 0, W, H)

      // Cabinet Bounds — Fills the row container
      const mx = 4, my = 4
      const machineW = W - 8
      const machineH = H - 8

      // Spin Sequence & Timing
      if (isSpinning) {
        spinTimer += 0.016
        // Staggered Stops
        if (spinTimer > 0.55 && !reels[0].stopping) {
          reels[0].stopping = true
        }
        if (spinTimer > 1.05 && !reels[1].stopping) {
          reels[1].stopping = true
        }
        if (spinTimer > 1.55 && !reels[2].stopping) {
          reels[2].stopping = true
        }
      }

      // Reel Physics: Spin + Mechanical Spring Recoil
      reels.forEach((reel) => {
        if (!reel.stopping) {
          reel.pos = (reel.pos + reel.speed) % SYMBOLS.length
        } else {
          // Snap toward 0 ("7") with spring oscillation
          reel.stopProgress += 0.05
          const target = 0
          const diff = ((target - reel.pos + SYMBOLS.length * 10) % SYMBOLS.length)
          const snappedDiff = diff > SYMBOLS.length / 2 ? diff - SYMBOLS.length : diff

          // Mechanical spring overshoot recoil
          const spring = Math.sin(reel.stopProgress * 14) * Math.exp(-reel.stopProgress * 5) * 0.22
          reel.pos += snappedDiff * 0.2 + spring
          reel.speed *= 0.85
        }
      })

      // Jackpot Trigger
      if (isSpinning && spinTimer > 1.85 && !isJackpot) {
        isSpinning = false
        isJackpot = true
        reels.forEach((r) => { r.pos = 0 }) // Guarantee perfect alignment
        spawnJackpotEffects(W / 2, H / 2, W, H)
      }

      // ── 1. Cabinet Housing & Chrome Trim ──
      const cabGrad = ctx.createLinearGradient(mx, my, mx, my + machineH)
      cabGrad.addColorStop(0, '#1f1325')
      cabGrad.addColorStop(0.5, '#120a17')
      cabGrad.addColorStop(1, '#1b0f20')
      ctx.fillStyle = cabGrad

      ctx.beginPath()
      ctx.roundRect(mx, my, machineW, machineH, 6)
      ctx.fill()

      // Metallic Bezel
      ctx.strokeStyle = isJackpot ? '#f59e0b' : '#4a2840'
      ctx.lineWidth = 2.0
      ctx.stroke()

      // ── 2. Chasing Perimeter Marquee Bulbs ──
      const bulbSpacing = 22
      const numBulbsX = Math.max(8, Math.floor(machineW / bulbSpacing))
      const numBulbsY = Math.max(3, Math.floor(machineH / bulbSpacing))
      const bulbs = []
      for (let i = 0; i < numBulbsX; i++) {
        bulbs.push({ bx: mx + (i + 0.5) * (machineW / numBulbsX), by: my + 3 })
      }
      for (let i = 0; i < numBulbsY; i++) {
        bulbs.push({ bx: mx + machineW - 3, by: my + (i + 0.5) * (machineH / numBulbsY) })
      }
      for (let i = numBulbsX - 1; i >= 0; i--) {
        bulbs.push({ bx: mx + (i + 0.5) * (machineW / numBulbsX), by: my + machineH - 3 })
      }
      for (let i = numBulbsY - 1; i >= 0; i--) {
        bulbs.push({ bx: mx + 3, by: my + (i + 0.5) * (machineH / numBulbsY) })
      }

      bulbs.forEach((b, idx) => {
        const isBulbOn = isJackpot
          ? Math.sin(bulbTick * 7 + idx * 0.8) > 0
          : Math.sin(bulbTick * 3.2 + idx * 0.45) > 0
        const bulbGlow = isJackpot
          ? (isBulbOn ? '#fde047' : '#ef4444')
          : (isBulbOn ? '#fbbf24' : '#451a35')
        ctx.fillStyle = bulbGlow
        ctx.beginPath()
        ctx.arc(b.bx, b.by, 2.2, 0, Math.PI * 2)
        ctx.fill()
      })

      // ── 3. Reel Windows ──
      const winMargin = 8
      const winW = machineW - winMargin * 2
      const winH = machineH - winMargin * 2
      const winX = mx + winMargin
      const winY = my + winMargin
      const reelW = winW / 3

      ctx.save()
      // Clip reels area
      ctx.beginPath()
      ctx.roundRect(winX, winY, winW, winH, 4)
      ctx.clip()

      // Reel drum background
      ctx.fillStyle = '#09050d'
      ctx.fillRect(winX, winY, winW, winH)

      // Draw 3 Reels
      reels.forEach((reel, rIdx) => {
        const rx = winX + rIdx * reelW
        const cx = rx + reelW / 2
        const cy = winY + winH / 2

        // Column separator
        if (rIdx > 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.moveTo(rx, winY)
          ctx.lineTo(rx, winY + winH)
          ctx.stroke()
        }

        // Motion Blur Speed Streaks during high speed spin
        if (reel.speed > 0.18) {
          ctx.save()
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.16)'
          ctx.lineWidth = 1.5
          for (let s = 0; s < 6; s++) {
            const sx = rx + 8 + Math.random() * (reelW - 16)
            ctx.beginPath()
            ctx.moveTo(sx, winY)
            ctx.lineTo(sx, winY + winH)
            ctx.stroke()
          }
          ctx.restore()
        }

        // Render visible symbols (-1, 0, +1)
        const centerSymIdx = Math.round(reel.pos)
        const rowH = winH * 0.68
        const symScale = Math.min(reelW / 52, winH / 56, 1.05)

        ;[-1, 0, 1].forEach((offset) => {
          const symIndex = (centerSymIdx + offset + SYMBOLS.length * 10) % SYMBOLS.length
          const symName = SYMBOLS[symIndex]

          // Delta from center
          const delta = reel.pos - (centerSymIdx + offset)
          const sy = cy - delta * rowH

          // 3D cylindrical compression
          const distFromCenter = Math.abs(sy - cy)
          const scaleY = Math.max(0.4, 1.0 - (distFromCenter / winH) * 0.62)
          const alpha = Math.max(0.2, 1.0 - (distFromCenter / winH) * 0.88)

          ctx.save()
          ctx.translate(0, 0)
          ctx.globalAlpha = alpha

          // Stretched motion blur during high velocity
          if (reel.speed > 0.22) {
            ctx.save()
            ctx.translate(cx, sy)
            ctx.scale(symScale, symScale * (1.3 + reel.speed))
            renderSymbol(ctx, symName, 0, 0, 1.0, isJackpot, bulbTick)
            ctx.restore()
          } else {
            ctx.save()
            ctx.translate(cx, sy)
            ctx.scale(symScale, symScale * scaleY)
            renderSymbol(ctx, symName, 0, 0, 1.0, isJackpot, bulbTick)
            ctx.restore()
          }

          ctx.restore()
        })
      })

      // 3D Cylinder shadow (Top & Bottom dark falloff)
      const rollShade = ctx.createLinearGradient(0, winY, 0, winY + winH)
      rollShade.addColorStop(0, 'rgba(0, 0, 0, 0.88)')
      rollShade.addColorStop(0.22, 'rgba(0, 0, 0, 0.12)')
      rollShade.addColorStop(0.5, 'rgba(0, 0, 0, 0)')
      rollShade.addColorStop(0.78, 'rgba(0, 0, 0, 0.12)')
      rollShade.addColorStop(1, 'rgba(0, 0, 0, 0.88)')
      ctx.fillStyle = rollShade
      ctx.fillRect(winX, winY, winW, winH)

      // Glass specular reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.beginPath()
      ctx.moveTo(winX, winY)
      ctx.lineTo(winX + winW * 0.45, winY)
      ctx.lineTo(winX + winW * 0.12, winY + winH)
      ctx.lineTo(winX, winY + winH)
      ctx.closePath()
      ctx.fill()

      ctx.restore() // End clip

      // ── 4. Center Win Line / Laser Beam ──
      const paylineY = winY + winH / 2
      ctx.save()
      if (isJackpot) {
        // High-energy laser payline
        ctx.strokeStyle = `rgba(254, 240, 138, ${0.9 + Math.sin(bulbTick * 9) * 0.1})`
        ctx.lineWidth = 3.0
        ctx.shadowColor = '#f59e0b'
        ctx.shadowBlur = 14
      } else {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'
        ctx.lineWidth = 1.2
      }
      ctx.beginPath()
      ctx.moveTo(winX - 3, paylineY)
      ctx.lineTo(winX + winW + 3, paylineY)
      ctx.stroke()

      // Payline Arrows
      ctx.fillStyle = isJackpot ? '#fde047' : '#ef4444'
      ;[-1, 1].forEach((dir) => {
        const ax = dir === -1 ? winX - 2 : winX + winW + 2
        ctx.beginPath()
        ctx.moveTo(ax, paylineY)
        ctx.lineTo(ax - dir * 6, paylineY - 4)
        ctx.lineTo(ax - dir * 6, paylineY + 4)
        ctx.closePath()
        ctx.fill()
      })
      ctx.restore()

      // ── 5. Jackpot Illuminated Badge (Centered, non-overlapping) ──
      if (isJackpot) {
        ctx.save()
        const badgeW = 168
        const badgeH = 18
        const badgeX = winX + winW / 2 - badgeW / 2
        const badgeY = winY + 5

        ctx.fillStyle = '#100617'
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#fde047'
        ctx.font = "900 11px 'Arial Black', sans-serif"
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = '#f59e0b'
        ctx.shadowBlur = 10
        ctx.fillText('★ 777 JACKPOT ★', winX + winW / 2, badgeY + badgeH / 2)
        ctx.restore()
      }

      // ── 7. Falling / Bouncing Gold Coins ──
      for (let c = coins.length - 1; c >= 0; c--) {
        const coin = coins[c]
        coin.x += coin.vx
        coin.y += coin.vy
        coin.vy += 0.24 // Gravity
        coin.rot += coin.rotSpd
        coin.life -= 0.012

        if (coin.life <= 0 || coin.y > H + 25) {
          coins.splice(c, 1)
          continue
        }

        ctx.save()
        ctx.translate(coin.x, coin.y)
        ctx.rotate(coin.rot)
        ctx.scale(Math.cos(coin.rot * 2), 1)

        ctx.fillStyle = '#f59e0b'
        ctx.strokeStyle = '#fef08a'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.arc(0, 0, coin.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Coin inner rim
        ctx.strokeStyle = '#b45309'
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.arc(0, 0, coin.size * 0.65, 0, Math.PI * 2)
        ctx.stroke()

        ctx.restore()
      }

      // Sparkles
      for (let s = sparks.length - 1; s >= 0; s--) {
        const sp = sparks[s]
        sp.x += sp.vx
        sp.y += sp.vy
        sp.life -= 0.02
        if (sp.life <= 0) {
          sparks.splice(s, 1)
          continue
        }
        ctx.fillStyle = sp.color
        ctx.globalAlpha = sp.life
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
      if (isVisible) {
        raf.current = requestAnimationFrame(draw)
      }
    }

    let isVisible = false
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(raf.current)
      }
    }, { threshold: 0.05 })
    io.observe(canvas.parentElement)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf.current)
      ro.disconnect()
    }
  }, [isActive])

  return (
    <div className="env-slots" aria-hidden="true">
      <canvas ref={canvasRef} className="env-canvas" />
    </div>
  )
}

export default function CreativeSection() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <section className="curiosities-section" id="curiosities">
      <div className="curiosities-container">
        {/* Section Header */}
        <div className="curiosities-header">
          <h2 className="curiosities-title">What I keep close.</h2>
        </div>

        {/* Rows */}
        <div className="curiosities-list">
          {CURIOSITIES.map((item) => {
            const isHovered = hoveredId === item.id
            const hasHover = hoveredId !== null
            const isDimmed = hasHover && !isHovered

            return (
              <div
                key={item.id}
                className={`curiosity-row curiosity-row--${item.theme} ${
                  isHovered ? 'curiosity-row--active' : ''
                } ${isDimmed ? 'curiosity-row--dimmed' : ''}`}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setHoveredId((prev) => (prev === item.id ? null : item.id))}
              >
                {/* ── IN-ROW ANIMATED ENVIRONMENT (Contained inside the row) ── */}
                <div className="row-env" aria-hidden="true">
                  {/* 1. COMICS: Panoramic comic page fill spanning the row area */}
                  {item.theme === 'comics' && (
                    <div className="env-comics">
                      {/* Comic page art filling the row bar */}
                      <div className="comic-bar-fill">
                        <img
                          src="/comic-page.jpg"
                          alt="Comic Book Page"
                          className="comic-fill-image"
                        />
                        <div className="comic-fill-scrim" />
                      </div>

                      {/* Authentic in-bar comic panel details */}
                      <div className="comic-bar-overlay">
                        {/* Top-left Caption Box */}
                        <div className="comic-bar-caption">
                          <span>MEANWHILE, AT THE DRAWING BOARD...</span>
                        </div>

                        {/* Top-right Comic Code Seal */}
                        <div className="comic-bar-badge">
                          <span className="badge-price">12¢</span>
                          <span className="badge-code">COMICS CODE ★</span>
                        </div>

                        {/* Comic Action SFX */}
                        <div className="comic-bar-sfx">
                          <span className="sfx-bang">POW!</span>
                        </div>
                      </div>

                      {/* Comic halftone speed dots */}
                      <div className="comic-bar-halftone" />
                    </div>
                  )}

                  {/* 2. SPACE: Canvas Black Hole — accretion disk + lensing + stardust */}
                  {item.theme === 'space' && (
                    <BlackHoleCanvas isActive={isHovered} />
                  )}

                  {/* 3. JAPAN: Ukiyo-e Ocean Wave, Foam Claws & Mount Fuji */}
                  {item.theme === 'japan' && (
                    <UkiyoeWaveCanvas isActive={isHovered} />
                  )}

                  {/* 4. CHESS: Knight's Tour — Warnsdorff algorithm, 64 squares */}
                  {item.theme === 'chess' && (
                    <KnightsTourCanvas isActive={isHovered} />
                  )}

                  {/* 5. SLOTS: 3-Reel Slot Machine, 777 Jackpot, Payline Laser & Coins */}
                  {item.theme === 'slots' && (
                    <SlotMachineCanvas isActive={isHovered} />
                  )}
                </div>

                {/* Left: Number & Title */}
                <div className="curiosity-row__left">
                  {item.theme === 'space' ? (
                    <span className="curiosity-row__num curiosity-row__num--space">
                      {item.id.split('').map((ch, idx) => (
                        <span key={idx} className="bh-letter bh-letter--num" style={{ '--char-idx': idx }}>
                          {ch}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="curiosity-row__num">{item.id}</span>
                  )}

                  {item.theme === 'space' ? (
                    <h3 className="curiosity-row__title curiosity-row__title--space">
                      {item.title.split('').map((ch, idx) => (
                        <span
                          key={idx}
                          className="bh-letter bh-letter--title"
                          style={{ '--char-idx': idx }}
                        >
                          {ch === ' ' ? '\u00A0' : ch}
                        </span>
                      ))}
                    </h3>
                  ) : item.theme === 'japan' ? (
                    <h3 className="curiosity-row__title curiosity-row__title--wave">
                      {item.title.split('').map((ch, idx) => (
                        <span
                          key={idx}
                          className="wave-char"
                          style={{ '--char-idx': idx }}
                        >
                          {ch === ' ' ? '\u00A0' : ch}
                        </span>
                      ))}
                    </h3>
                  ) : (
                    <h3 className="curiosity-row__title">{item.title}</h3>
                  )}
                </div>

                {/* Right: Description */}
                <div className="curiosity-row__right">
                  {item.theme === 'space' ? (
                    <p className="curiosity-row__desc curiosity-row__desc--space">
                      {item.description.split(' ').map((word, wIdx) => (
                        <span key={wIdx} className="bh-desc-word" style={{ '--word-idx': wIdx }}>
                          {word.split('').map((ch, cIdx) => (
                            <span
                              key={cIdx}
                              className="bh-letter bh-letter--desc"
                              style={{ '--char-idx': cIdx, '--global-idx': wIdx * 5 + cIdx }}
                            >
                              {ch}
                            </span>
                          ))}
                          {'\u00A0'}
                        </span>
                      ))}
                    </p>
                  ) : item.theme === 'japan' ? (
                    <p className="curiosity-row__desc curiosity-row__desc--wave">
                      {item.description.split(' ').map((word, wIdx) => (
                        <span key={wIdx} className="wave-desc-word" style={{ '--word-idx': wIdx }}>
                          {word}{'\u00A0'}
                        </span>
                      ))}
                    </p>
                  ) : (
                    <p className="curiosity-row__desc">{item.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
