import { useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import './App.css'
import Loader from './Loader'
import Hero from './Hero'
import StickyNav from './StickyNav'
import FeaturedSection from './FeaturedSection'
import UserSection from './UserSection'
import UserSectionV2 from './UserSectionV2'
import GallerySection from './GallerySection'
import CreativeSection from './CreativeSection'
import Footer from './Footer'
import ThanosDustOverlay from './ThanosDustOverlay'

gsap.registerPlugin(ScrollToPlugin)

function App() {
  const [isSplineReady, setIsSplineReady] = useState(false)
  const [thanosState, setThanosState] = useState('idle') // 'idle' | 'snapping' | 'dusting' | 'restoring'
  const [dustedSections, setDustedSections] = useState(() => new Set())

  // Automatic Thanos Snap Sequence:
  // 1. Instant white glow
  // 2. Camera automatically scrolls to upper sections
  // 3. Sequentially dusts off UserSection -> FeaturedSection -> Hero
  // 4. Time stone rewinds and restores everything back to normal!
  const triggerThanosSnapSequence = useCallback(() => {
    if (typeof window === 'undefined' || window.innerWidth <= 768) return

    // 1. INSTANT blinding white screen flash & aura
    setThanosState('snapping')
    setDustedSections(new Set())

    // Prevent wheel interruption during the cinematic camera sequence
    const preventManualScroll = (e) => e.preventDefault()
    window.addEventListener('wheel', preventManualScroll, { passive: false })
    window.addEventListener('touchmove', preventManualScroll, { passive: false })

    // White flash transitions to reveal world turning to dust
    setTimeout(() => {
      setThanosState('dusting')
    }, 350)

    // Stage 1: Scroll to UserSection (#about)
    setTimeout(() => {
      const userEl = document.getElementById('about') || document.querySelector('.user-section')
      if (userEl) {
        gsap.to(window, {
          scrollTo: { y: userEl, offsetY: 30 },
          duration: 1.0,
          ease: 'power2.inOut',
          onComplete: () => {
            // Erupt dust across UserSection & dissolve it
            window.dispatchEvent(new CustomEvent('thanos:emit-dust', { detail: { selector: '#about' } }))
            setDustedSections((prev) => new Set(prev).add('user'))
          },
        })
      }
    }, 450)

    // Stage 2: Scroll to FeaturedSection (#work)
    setTimeout(() => {
      const workEl = document.getElementById('work') || document.querySelector('.featured-section')
      if (workEl) {
        gsap.to(window, {
          scrollTo: { y: workEl, offsetY: 30 },
          duration: 1.1,
          ease: 'power2.inOut',
          onComplete: () => {
            // Erupt dust across FeaturedSection & dissolve it
            window.dispatchEvent(new CustomEvent('thanos:emit-dust', { detail: { selector: '#work' } }))
            setDustedSections((prev) => new Set(prev).add('featured'))
          },
        })
      }
    }, 2100)

    // Stage 3: Scroll to Hero (#hero / top)
    setTimeout(() => {
      const heroEl = document.getElementById('hero') || document.querySelector('.hero')
      if (heroEl) {
        gsap.to(window, {
          scrollTo: { y: 0 },
          duration: 1.1,
          ease: 'power2.inOut',
          onComplete: () => {
            // Erupt dust across Hero & dissolve it
            window.dispatchEvent(new CustomEvent('thanos:emit-dust', { detail: { selector: '#hero' } }))
            setDustedSections((prev) => new Set(prev).add('hero'))
          },
        })
      }
    }, 3900)

    // Stage 4: Back to normal - timeline reversal
    setTimeout(() => {
      setThanosState('restoring')
      setDustedSections(new Set())
    }, 5900)

    // Stage 5: Scroll smoothly back down to UserSectionV2 (#developer-v2)
    setTimeout(() => {
      const devV2 = document.getElementById('developer-v2') || document.querySelector('.user-v2-section')
      if (devV2) {
        gsap.to(window, {
          scrollTo: { y: devV2, offsetY: 0 },
          duration: 1.3,
          ease: 'power2.inOut',
          onComplete: () => {
            setThanosState('idle')
            window.removeEventListener('wheel', preventManualScroll)
            window.removeEventListener('touchmove', preventManualScroll)
            window.dispatchEvent(new CustomEvent('thanos:reset-icons'))
          },
        })
      } else {
        setThanosState('idle')
        window.removeEventListener('wheel', preventManualScroll)
        window.removeEventListener('touchmove', preventManualScroll)
        window.dispatchEvent(new CustomEvent('thanos:reset-icons'))
      }
    }, 6900)
  }, [])

  return (
    <div className={`page thanos-page--${thanosState}`}>
      {/* Blinding Screen Flash during Thanos Snap */}
      <div
        className={`thanos-screen-flash ${
          thanosState === 'snapping' ? 'active' : thanosState !== 'idle' ? 'fade-out' : ''
        }`}
        aria-hidden="true"
      />

      {/* Thanos Ash & Dust Particle Canvas (Red Stapler Layered Physics) */}
      <ThanosDustOverlay state={thanosState} />

      {/* Mobile Sticky Navigation Header */}
      <StickyNav />

      {/* Pure CSS Stacking Card Sections */}
      <div className="stack">
        {/* Sequential Disintegration Sections (Above UserSectionV2) */}
        <div className="thanos-upper-sections">
          {/* Section 1: Hero */}
          <div
            className={`thanos-section-wrap stack-section stack-section--1 ${
              dustedSections.has('hero')
                ? 'is-dusted'
                : thanosState === 'restoring'
                ? 'is-restoring'
                : ''
            }`}
          >
            <Hero onSplineReady={() => setIsSplineReady(true)} />
          </div>

          {/* Section 2: FeaturedSection */}
          <div
            className={`thanos-section-wrap stack-section stack-section--2 ${
              dustedSections.has('featured')
                ? 'is-dusted'
                : thanosState === 'restoring'
                ? 'is-restoring'
                : ''
            }`}
          >
            <FeaturedSection />
          </div>

          {/* Section 3: UserSection */}
          <div
            className={`thanos-section-wrap stack-section stack-section--3 ${
              dustedSections.has('user')
                ? 'is-dusted'
                : thanosState === 'restoring'
                ? 'is-restoring'
                : ''
            }`}
          >
            <UserSection />
          </div>
        </div>

        {/* Section 4: UserSectionV2 */}
        <div className="stack-section stack-section--4">
          <UserSectionV2
            thanosState={thanosState}
            onTriggerSnap={triggerThanosSnapSequence}
          />
        </div>

        {/* Section 5: GallerySection */}
        <div className="stack-section stack-section--5">
          <GallerySection />
        </div>

        {/* Section 6: CreativeSection */}
        <div className="stack-section stack-section--6">
          <CreativeSection />
        </div>
      </div>

      <Loader isSplineReady={isSplineReady} />

      <Footer />
    </div>
  )
}

export default App
