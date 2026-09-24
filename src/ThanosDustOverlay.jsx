import { useEffect, useRef } from 'react'

export default function ThanosDustOverlay({ state }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId
    let particles = []
    let isRunning = true

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Authentic Thanos Ash Palette (Pure charred soot, slate ash, and smoke haze - NO confetti)
    const ASH_COLORS = [
      { r: 24, g: 24, b: 27 },  // charcoal soot
      { r: 39, g: 39, b: 42 },  // dark ash
      { r: 63, g: 63, b: 70 },  // slate ash
      { r: 82, g: 82, b: 91 },  // floating ash
      { r: 113, g: 113, b: 122 }, // medium dust
      { r: 161, g: 161, b: 170 }, // light windblown powder
      { r: 212, g: 212, b: 216 }, // fine ash speck
    ]

    const LAYER_COUNT = 20

    // Weighted distribution matching user snippet: Math.pow(count - Math.abs(peak - i), 6)
    const getLayer = (normX, normY) => {
      const peak = Math.floor((normY * 0.7 + normX * 0.3) * LAYER_COUNT)
      const jitter = Math.round((Math.random() - 0.5) * 4)
      return Math.max(0, Math.min(LAYER_COUNT - 1, peak + jitter))
    }

    // Listen to section-targeted dust events
    const onEmitDust = (e) => {
      const selector = e.detail?.selector
      const el = selector ? document.querySelector(selector) : null
      const rect = el ? el.getBoundingClientRect() : null

      // Fill the active viewport height and width so dust covers the entire visible section
      const startX = 0
      const endX = canvas.width
      const startY = rect ? Math.max(0, rect.top) : 0
      const endY = rect ? Math.min(canvas.height, Math.max(rect.bottom, canvas.height)) : canvas.height
      const width = endX - startX
      const height = Math.max(canvas.height * 0.7, endY - startY)

      const now = Date.now()

      // Spawn 1,400+ authentic fine ash particles and smoky puffs
      const count = 1400

      for (let i = 0; i < count; i++) {
        const normX = Math.random()
        const normY = Math.random()
        const x = startX + normX * width
        const y = startY + normY * height

        const layerIndex = getLayer(normX, normY)

        // Matching user snippet parameters:
        // delay: 70ms * layerIndex
        // duration: 2000ms
        // translation: x: +200px, y: -100px
        // rotation: chance.integer({ min: -25, max: 25 })
        const startTime = now + layerIndex * 60
        const duration = 1800 + Math.random() * 400
        const targetDx = 180 + Math.random() * 60 // ~200px to the right
        const targetDy = -90 - Math.random() * 50 // ~-100px upwards
        const targetAngle = (Math.random() * 50 - 25) * (Math.PI / 180) // -25deg to +25deg

        const rgb = ASH_COLORS[Math.floor(Math.random() * ASH_COLORS.length)]

        // Type: 70% micro-dust grains (0.8 - 1.6px), 20% fibrous ash flakes (1.5 - 2.5px), 10% soft smoky puffs
        const randType = Math.random()
        let type = 'grain'
        let baseSize = Math.random() * 1.0 + 0.7

        if (randType > 0.9) {
          type = 'smoke'
          baseSize = Math.random() * 10 + 6
        } else if (randType > 0.7) {
          type = 'flake'
          baseSize = Math.random() * 1.5 + 1.2
        }

        particles.push({
          originX: x,
          originY: y,
          x,
          y,
          rgb,
          type,
          baseSize,
          layerIndex,
          startTime,
          duration,
          targetDx,
          targetDy,
          targetAngle,
          baseAlpha: type === 'smoke' ? Math.random() * 0.12 + 0.05 : Math.random() * 0.8 + 0.2,
        })
      }
    }

    window.addEventListener('thanos:emit-dust', onEmitDust)

    // 60fps render loop with authentic ash smoke and drift
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = Date.now()

      if (state === 'restoring') {
        // Reversal: particles reverse trajectory smoothly
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]
          p.x += (p.originX - p.x) * 0.1
          p.y += (p.originY - p.y) * 0.1
          p.baseAlpha -= 0.015

          if (p.baseAlpha <= 0.01) {
            particles.splice(i, 1)
            continue
          }

          ctx.save()
          ctx.globalAlpha = Math.max(0, p.baseAlpha)
          ctx.fillStyle = `rgb(${p.rgb.r}, ${p.rgb.g}, ${p.rgb.b})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.baseSize, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      } else {
        // Forward Thanos Dust Disintegration
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]

          if (now < p.startTime) {
            continue
          }

          const elapsed = now - p.startTime
          const progress = Math.min(1, elapsed / p.duration)

          // ease-in curve matching user snippet
          const easeT = Math.pow(progress, 2.2)

          // Current position with subtle aerodynamic wind drift
          const currentX = p.originX + p.targetDx * easeT + Math.sin(progress * Math.PI * 2.5) * 8
          const currentY = p.originY + p.targetDy * easeT + Math.cos(progress * Math.PI * 2) * 5
          const currentAngle = p.targetAngle * easeT

          // fadeblur: opacity fades out progressively, reaching 0 at end
          const currentAlpha = Math.max(0, p.baseAlpha * (1 - Math.pow(progress, 1.4)))

          // As smoke and ash dissolve, they expand slightly (diffusing into air)
          const currentSize = p.baseSize * (1 + progress * 0.6)

          if (progress >= 1 || currentAlpha <= 0.01) {
            particles.splice(i, 1)
            continue
          }

          p.x = currentX
          p.y = currentY

          ctx.save()
          ctx.translate(currentX, currentY)
          ctx.rotate(currentAngle)
          ctx.globalAlpha = currentAlpha

          if (p.type === 'smoke') {
            // Soft smoky puff gradient (cloud of fine dust)
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize)
            grad.addColorStop(0, `rgba(${p.rgb.r}, ${p.rgb.g}, ${p.rgb.b}, 1)`)
            grad.addColorStop(1, `rgba(${p.rgb.r}, ${p.rgb.g}, ${p.rgb.b}, 0)`)
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.arc(0, 0, currentSize, 0, Math.PI * 2)
            ctx.fill()
          } else if (p.type === 'flake') {
            // Small thin ash flake
            ctx.fillStyle = `rgb(${p.rgb.r}, ${p.rgb.g}, ${p.rgb.b})`
            ctx.fillRect(-currentSize, -currentSize * 0.4, currentSize * 2, currentSize * 0.8)
          } else {
            // Fine powdery micro-dust grain
            ctx.fillStyle = `rgb(${p.rgb.r}, ${p.rgb.g}, ${p.rgb.b})`
            ctx.beginPath()
            ctx.arc(0, 0, currentSize, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.restore()
        }
      }

      if (isRunning) {
        animId = requestAnimationFrame(render)
      }
    }

    animId = requestAnimationFrame(render)

    return () => {
      isRunning = false
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('thanos:emit-dust', onEmitDust)
    }
  }, [state])

  // Clear when idle
  useEffect(() => {
    if (state === 'idle') {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [state])

  return (
    <canvas
      ref={canvasRef}
      className="thanos-dust-canvas"
      aria-hidden="true"
    />
  )
}
