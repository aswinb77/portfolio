import { getMedia } from './assets/media'
import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './UserSectionV2.css'

gsap.registerPlugin(ScrollTrigger)

const TECH_ELEMENTS = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    icon: getMedia('/claude.png'),
    animClass: 'float-anim--1',
    coords: { top: '12%', left: '16%' },
    badgeClass: 'user-v2__logo-pure--claude',
    color: '#d97757', // Claude warm terracotta
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: getMedia('/typescript.svg'),
    animClass: 'float-anim--2',
    coords: { top: '32%', left: '10%' },
    badgeClass: 'user-v2__logo-pure--typescript',
    color: '#3178c6', // TypeScript blue
  },
  {
    id: 'react',
    name: 'React',
    icon: getMedia('/react-dark.svg'),
    animClass: 'float-anim--3',
    coords: { top: '52%', left: '8%' },
    badgeClass: 'user-v2__logo-pure--react',
    color: '#00d8ff', // React cyan
  },
  {
    id: 'git',
    name: 'Git',
    icon: getMedia('/git.svg'),
    animClass: 'float-anim--4',
    coords: { top: '74%', left: '16%' },
    badgeClass: 'user-v2__logo-pure--git',
    color: '#f05032', // Git flame orange-red
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    icon: getMedia('/antigravity.svg'),
    animClass: 'float-anim--5',
    coords: { top: '12%', right: '16%' },
    badgeClass: 'user-v2__logo-pure--antigravity',
    color: '#a855f7', // Antigravity electric violet
  },
  {
    id: 'flutter',
    name: 'Flutter',
    icon: getMedia('/flutter.svg'),
    animClass: 'float-anim--6',
    coords: { top: '32%', right: '10%' },
    badgeClass: 'user-v2__logo-pure--flutter',
    color: '#40c4ff', // Flutter sky blue
  },
  {
    id: 'postman',
    name: 'Postman',
    icon: getMedia('/postman.svg'),
    animClass: 'float-anim--7',
    coords: { top: '52%', right: '8%' },
    badgeClass: 'user-v2__logo-pure--postman',
    color: '#ff6c37', // Postman bright orange
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: getMedia('/github.svg'),
    animClass: 'float-anim--8',
    coords: { top: '74%', right: '16%' },
    badgeClass: 'user-v2__logo-pure--github',
    color: '#ffffff', // GitHub brilliant white
  },
]

export default function UserSectionV2({ thanosState = 'idle', onTriggerSnap }) {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const characterRef = useRef(null)
  const ringsRef = useRef(null)

  // Drag and absorption states
  const [absorbedIds, setAbsorbedIds] = useState(new Set())
  const [proximityColor, setProximityColor] = useState(null)
  const [draggingId, setDraggingId] = useState(null)
  const [isDesktop, setIsDesktop] = useState(true)

  // Track viewport size for desktop-only drag
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth > 768)
    }
    checkViewport()
    window.addEventListener('resize', checkViewport)
    return () => window.removeEventListener('resize', checkViewport)
  }, [])

  // Listen for timeline reset to restore and bloom all icons back out
  useEffect(() => {
    const handleReset = () => {
      setAbsorbedIds(new Set())
      gsap.fromTo(
        '.user-v2__logo-item',
        { scale: 0, opacity: 0, x: 0, y: 0 },
        { scale: 1, opacity: 1, stagger: 0.08, duration: 1.0, ease: 'back.out(1.8)' }
      )
    }
    window.addEventListener('thanos:reset-icons', handleReset)
    return () => window.removeEventListener('thanos:reset-icons', handleReset)
  }, [])

  // Reworked Concentric Ripple Wave (100% Circular, Color-matched, No distorted black shadow)
  const triggerRippleWave = useCallback((color = '#d97757') => {
    // 1. Initial Start Ripple: Pure geometric circle expanding right from center
    gsap.fromTo(
      '.user-v2__start-ripple',
      { attr: { r: 15 }, stroke: color, strokeWidth: 4.5, fill: color, fillOpacity: 0.2, opacity: 1 },
      {
        attr: { r: 155 },
        strokeWidth: 1,
        fillOpacity: 0,
        opacity: 0,
        duration: 0.75,
        ease: 'power2.out',
      }
    )

    // 2. High-Energy Concentric Shockwave Pulses (All perfect circles)
    gsap.fromTo(
      '.user-v2__ripple-pulse--1',
      { attr: { r: 35 }, stroke: color, strokeWidth: 4, opacity: 0.95 },
      {
        attr: { r: 440 },
        strokeWidth: 0.5,
        opacity: 0,
        duration: 0.95,
        ease: 'power2.out',
      }
    )

    gsap.fromTo(
      '.user-v2__ripple-pulse--2',
      { attr: { r: 15 }, stroke: color, strokeWidth: 3.5, opacity: 0.8 },
      {
        attr: { r: 390 },
        strokeWidth: 0.6,
        opacity: 0,
        duration: 1.15,
        delay: 0.08,
        ease: 'power2.out',
      }
    )

    gsap.fromTo(
      '.user-v2__ripple-pulse--3',
      { attr: { r: 5 }, stroke: color, strokeWidth: 5, opacity: 0.85 },
      {
        attr: { r: 480 },
        strokeWidth: 0.3,
        opacity: 0,
        duration: 1.35,
        delay: 0.16,
        ease: 'power2.out',
      }
    )

    // 3. Sequential physical wave through concentric rings (staggered outward)
    const ringConfigs = [
      { cls: '.user-v2__ring-1', baseR: 110, peakR: 136 },
      { cls: '.user-v2__ring-2', baseR: 200, peakR: 232 },
      { cls: '.user-v2__ring-3', baseR: 290, peakR: 328 },
      { cls: '.user-v2__ring-4', baseR: 380, peakR: 424 },
    ]

    ringConfigs.forEach(({ cls, baseR, peakR }, i) => {
      const tl = gsap.timeline({ delay: i * 0.065 })
      tl.to(cls, {
        attr: { r: peakR },
        stroke: color,
        strokeWidth: 3.2,
        opacity: 1,
        duration: 0.22,
        ease: 'power2.out',
      }).to(cls, {
        attr: { r: baseR },
        stroke: 'rgba(60, 60, 64, 0.09)',
        strokeWidth: 1.2,
        opacity: 0.45,
        duration: 0.75,
        ease: 'elastic.out(1.15, 0.4)',
      })
    })

    // 4. Character crisp elastic recoil (Zero dirty container filters or black shadow outlines)
    if (characterRef.current) {
      gsap.fromTo(
        characterRef.current,
        { scale: 1.05 },
        { scale: 1, duration: 0.5, ease: 'elastic.out(1.2, 0.4)' }
      )
    }
  }, [])

  // GSAP Intro & Ambience
  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const character = characterRef.current
    if (!section || !stage || !character) return

    const ctx = gsap.context(() => {
      // Initial hidden states
      gsap.set('.user-v2__ring', {
        transformOrigin: '510px 380px',
        scale: 0,
        opacity: 0,
      })
      gsap.set(character, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'bottom center',
      })
      gsap.set('.user-v2__logo-item', {
        scale: 0,
        opacity: 0,
      })

      // INTRO TIMELINE (triggers via ScrollTrigger)
      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      })

      intro
        .to(
          '.user-v2__ring',
          {
            scale: 1,
            opacity: 1,
            duration: 1.4,
            stagger: 0.12,
            ease: 'power3.out',
          },
          0.2
        )
        .to(
          character,
          {
            scale: 1,
            opacity: 1,
            duration: 1.1,
            ease: 'back.out(1.8)',
          },
          0.45
        )
        .from(
          '.user-v2__logo-item',
          {
            y: (i) => (i % 2 === 0 ? -60 : 60),
            x: (i) => (i < 4 ? -45 : 45),
            duration: 1,
            ease: 'back.out(1.6)',
          },
          0.8
        )
        .to(
          '.user-v2__logo-item',
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            stagger: 0.07,
            ease: 'back.out(1.6)',
          },
          0.8
        )

      // CONTINUOUS: Sonar pulse on the concentric rings
      ;['user-v2__ring-1', 'user-v2__ring-2', 'user-v2__ring-3', 'user-v2__ring-4'].forEach((cls, i) => {
        const baseR = [110, 200, 290, 380][i]
        gsap.to(`.${cls}`, {
          attr: { r: baseR + 14 },
          opacity: 0.45,
          duration: 2.2,
          delay: 2.2 + i * 0.45,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })

      // CONTINUOUS: gentle character breathing
      gsap.to(character, {
        y: '+=6',
        duration: 3,
        delay: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // Character Click -> Elastic bounce & Sonar Ripple Wave
      const onCharClick = () => {
        triggerRippleWave('#d97757')
      }
      character.addEventListener('click', onCharClick)

      // Mouse Parallax across Stage (Disabled during drag)
      let mx = 0, my = 0, tx = 0, ty = 0
      let reqId
      const onStageMove = (e) => {
        const r = stage.getBoundingClientRect()
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2
        my = ((e.clientY - r.top) / r.height - 0.5) * 2
      }
      const onStageLeave = () => {
        mx = 0
        my = 0
      }
      stage.addEventListener('mousemove', onStageMove)
      stage.addEventListener('mouseleave', onStageLeave)

      const parallax = () => {
        tx += (mx - tx) * 0.06
        ty += (my - ty) * 0.06
        const nonDraggedTiles = stage.querySelectorAll('.user-v2__logo-item:not(.is-dragging)')
        nonDraggedTiles.forEach((tile, i) => {
          const depth = 5 + (i % 3) * 3
          tile.style.translate = `${tx * depth}px ${ty * depth}px`
        })
        character.style.translate = `${tx * 3}px ${ty * 3}px`
        reqId = requestAnimationFrame(parallax)
      }
      reqId = requestAnimationFrame(parallax)

      return () => {
        cancelAnimationFrame(reqId)
        stage.removeEventListener('mousemove', onStageMove)
        stage.removeEventListener('mouseleave', onStageLeave)
        character.removeEventListener('click', onCharClick)
      }
    }, section)

    return () => ctx.revert()
  }, [])

  // Drag and Drop to Character (Desktop Only)
  const handlePointerDown = (e, tech) => {
    if (!isDesktop || absorbedIds.has(tech.id) || thanosState !== 'idle') return
    if (e.button !== 0) return // Left mouse only

    e.preventDefault()
    const target = e.currentTarget
    target.setPointerCapture(e.pointerId)

    const startX = e.clientX
    const startY = e.clientY
    let currentX = 0
    let currentY = 0

    setDraggingId(tech.id)

    const onPointerMove = (moveEvent) => {
      currentX = moveEvent.clientX - startX
      currentY = moveEvent.clientY - startY
      target.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1.25)`

      // Proximity check with character
      if (characterRef.current) {
        const charRect = characterRef.current.getBoundingClientRect()
        const isNear =
          moveEvent.clientX >= charRect.left - 40 &&
          moveEvent.clientX <= charRect.right + 40 &&
          moveEvent.clientY >= charRect.top - 40 &&
          moveEvent.clientY <= charRect.bottom + 40

        setProximityColor(isNear ? tech.color : null)
      }
    }

    const onPointerUp = (upEvent) => {
      target.removeEventListener('pointermove', onPointerMove)
      target.removeEventListener('pointerup', onPointerUp)
      target.removeEventListener('pointercancel', onPointerUp)
      try {
        target.releasePointerCapture(upEvent.pointerId)
      } catch (err) {}

      setDraggingId(null)
      setProximityColor(null)

      let reachedCharacter = false
      if (characterRef.current) {
        const charRect = characterRef.current.getBoundingClientRect()
        reachedCharacter =
          upEvent.clientX >= charRect.left - 40 &&
          upEvent.clientX <= charRect.right + 40 &&
          upEvent.clientY >= charRect.top - 40 &&
          upEvent.clientY <= charRect.bottom + 40
      }

      if (reachedCharacter) {
        // 1. High-energy Concentric Ripple Wave in Logo Color
        triggerRippleWave(tech.color)

        // 2. Animate icon sucking into the character
        gsap.to(target, {
          scale: 0,
          opacity: 0,
          rotation: 360,
          duration: 0.32,
          ease: 'power2.in',
          onComplete: () => {
            target.style.transform = ''
            setAbsorbedIds((prev) => {
              const next = new Set(prev)
              next.add(tech.id)
              // INSTANT white glow & automatic scroll when all 8 icons are fed
              if (next.size === 8 && onTriggerSnap) {
                // Cosmic final ripple wave
                triggerRippleWave('#ffffff')
                onTriggerSnap()
              }
              return next
            })
          },
        })
      } else {
        // Snap back to original position
        gsap.to(target, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
          onComplete: () => {
            target.style.transform = ''
          },
        })
      }
    }

    target.addEventListener('pointermove', onPointerMove)
    target.addEventListener('pointerup', onPointerUp)
    target.addEventListener('pointercancel', onPointerUp)
  }

  return (
    <section className="user-v2-section" id="developer-v2" ref={sectionRef}>
      <div className="user-v2__container">
        
        {/* Heading (Text removed completely as requested) */}
        <div className="user-v2__heading-wrap">
          <h2 className="user-v2__title">Wardrobe</h2>
          <p className="user-v2__subtitle">
            Tools of the trade, Master of Some.
          </p>
        </div>

        {/* Hero Stage: Character + Interactive / Floating Logos */}
        <div className="user-v2__stage" ref={stageRef}>
          
          {/* Concentric Sonar Rings behind Character */}
          <svg
            ref={ringsRef}
            className="user-v2__rings-svg"
            viewBox="0 0 1020 730"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* Pristine Circular Center Start Ripple */}
            <circle className="user-v2__start-ripple" cx="510" cy="380" r="0" />

            {/* Dynamic Expanding Ripple Shockwaves */}
            <circle className="user-v2__ripple-pulse user-v2__ripple-pulse--1" cx="510" cy="380" r="0" />
            <circle className="user-v2__ripple-pulse user-v2__ripple-pulse--2" cx="510" cy="380" r="0" />
            <circle className="user-v2__ripple-pulse user-v2__ripple-pulse--3" cx="510" cy="380" r="0" />

            {/* Concentric Structural Rings */}
            <circle className="user-v2__ring user-v2__ring-1" cx="510" cy="380" r="110" />
            <circle className="user-v2__ring user-v2__ring-2" cx="510" cy="380" r="200" />
            <circle className="user-v2__ring user-v2__ring-3" cx="510" cy="380" r="290" />
            <circle className="user-v2__ring user-v2__ring-4" cx="510" cy="380" r="380" />
          </svg>

          {/* Centered Character */}
          <div
            className={`user-v2__character-anchor ${proximityColor ? 'is-target' : ''}`}
            ref={characterRef}
            style={
              proximityColor
                ? { filter: `drop-shadow(0 0 16px ${proximityColor})` }
                : undefined
            }
          >
            <div className="user-v2__ground-shadow" aria-hidden="true" />
            <picture>
              <source srcSet={getMedia('/character-thanos.webp')} type="image/webp" />
              <source srcSet={getMedia('/character-thanos.png')} type="image/png" />
              <img
                src={getMedia('/character-thanos.jpeg')}
                alt="Aswin Biju - Developer"
                className="user-v2__character-img"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>

          {/* Floating / Draggable Logos Layer */}
          <div className="user-v2__floating-layer">
            {TECH_ELEMENTS.map((tech) => {
              const isAbsorbed = absorbedIds.has(tech.id)
              const isDragging = draggingId === tech.id

              return (
                <div
                  key={tech.id}
                  className={`user-v2__logo-item ${isDragging ? 'is-dragging' : ''} ${
                    isAbsorbed ? 'is-absorbed' : ''
                  }`}
                  style={tech.coords}
                  onPointerDown={(e) => handlePointerDown(e, tech)}
                  aria-label={tech.name}
                  title={isDesktop ? `Drag ${tech.name} to the character` : tech.name}
                >
                  <div className={`user-v2__logo-pure ${tech.badgeClass} ${tech.animClass}`}>
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      draggable={false}
                    />
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
