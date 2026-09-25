import { useState, useEffect, useCallback } from 'react'
import './StickyNav.css'

export default function StickyNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [navTheme, setNavTheme] = useState('light') // 'light' | 'dark'

  // Helper to determine theme for any given section element
  const getSectionTheme = useCallback((section) => {
    if (!section) return 'light'
    if (section.dataset && section.dataset.navTheme) {
      return section.dataset.navTheme
    }
    const id = section.id || ''
    const classes = section.className || ''
    if (id === 'gallery' || classes.includes('gallery-section')) {
      return 'dark'
    }
    if (id === 'about' || classes.includes('user-section')) {
      return 'dark'
    }
    if (id === 'contact' || classes.includes('img-footer')) {
      return 'dark'
    }
    if (id === 'hero' || classes.includes('hero') || classes.includes('hero-container')) {
      return 'dark'
    }
    if (id === 'creative' || classes.includes('duo-game-section')) {
      return classes.includes('is-expanded') ? 'light' : 'dark'
    }
    if (id === 'work' || id === 'works' || classes.includes('featured-section')) {
      return 'light'
    }
    if (id === 'developer-v2' || classes.includes('user-v2-section')) {
      return 'light'
    }
    return 'light'
  }, [])

  // Detect which section is currently directly under the sticky nav header
  const detectNavTheme = useCallback(() => {
    // Strategy 1: Browser elementsFromPoint (returns elements in actual CSS rendering / stacking order)
    if (typeof document !== 'undefined' && typeof document.elementsFromPoint === 'function') {
      const x = window.innerWidth / 2
      const y = 36 // Midpoint of 64px header
      const elements = document.elementsFromPoint(x, y)

      for (const el of elements) {
        if (
          el.closest('.stickynav') ||
          el.closest('.stickynav__menu-backdrop') ||
          el.closest('.thanos-screen-flash') ||
          el.closest('.thanos-dust-canvas')
        ) {
          continue
        }
        const section = el.closest('section, footer, [data-nav-theme], .stack-section, .hero-container')
        if (section) {
          return getSectionTheme(section)
        }
      }
    }

    // Strategy 2: BoundingClientRect inspection in reverse stacking order
    const navThreshold = 44
    const sectionsToCheck = [
      { el: document.getElementById('contact') || document.querySelector('.img-footer'), theme: 'dark' },
      {
        el: document.getElementById('creative') || document.querySelector('.duo-game-section'),
        getTheme: (el) => (el.classList.contains('is-expanded') ? 'light' : 'dark'),
      },
      { el: document.getElementById('gallery') || document.querySelector('.gallery-section'), theme: 'dark' },
      { el: document.getElementById('developer-v2') || document.querySelector('.user-v2-section'), theme: 'light' },
      { el: document.getElementById('about') || document.querySelector('.user-section'), theme: 'dark' },
      {
        el: document.getElementById('work') || document.getElementById('works') || document.querySelector('.featured-section'),
        theme: 'light',
      },
      { el: document.getElementById('hero') || document.querySelector('.hero'), theme: 'dark' },
    ]

    for (const item of sectionsToCheck) {
      if (!item.el) continue
      const rect = item.el.getBoundingClientRect()
      if (rect.top <= navThreshold && rect.bottom > 0) {
        return item.getTheme ? item.getTheme(item.el) : item.theme
      }
    }

    return 'light'
  }, [getSectionTheme])

  useEffect(() => {
    let rafId = null

    const handleScroll = () => {
      // Hide sticky nav on desktop screens (> 768px)
      if (window.innerWidth > 768) {
        setIsVisible(false)
        setMenuOpen(false)
        return
      }

      const heroName = document.querySelector('.hero__name')
      let shouldShow = false

      if (heroName) {
        const rect = heroName.getBoundingClientRect()
        // Only show once the hero name has scrolled completely out past the top
        shouldShow = rect.bottom <= 0
      } else {
        const hero = document.getElementById('hero')
        if (hero) {
          shouldShow = hero.getBoundingClientRect().bottom <= 0
        } else {
          shouldShow = window.scrollY > window.innerHeight
        }
      }

      setIsVisible(shouldShow)
      if (!shouldShow && menuOpen) {
        setMenuOpen(false)
      }

      if (shouldShow) {
        const activeTheme = detectNavTheme()
        setNavTheme(activeTheme)
      }
    }

    const onScrollOrResize = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        handleScroll()
        rafId = null
      })
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })
    handleScroll()

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [menuOpen, detectNavTheme])

  const scrollToTop = () => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (e, id) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.getElementById(id) || (id === 'work' ? document.getElementById('works') : null)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className={`stickynav ${isVisible ? 'is-visible' : ''} theme-${navTheme}`}
        data-theme={navTheme}
        aria-label="Sticky Site Navigation"
      >
        <div className="stickynav__container">
          {/* Logo Name on Left */}
          <div
            className="stickynav__logo"
            onClick={scrollToTop}
            role="button"
            tabIndex={0}
            aria-label="Aswin Biju - Scroll to top"
          >
            Aswin Biju
          </div>

          {/* Hamburger Menu Toggle on Right */}
          <button
            type="button"
            className={`stickynav__toggle ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            <span className="stickynav__bar stickynav__bar--1" />
            <span className="stickynav__bar stickynav__bar--2" />
          </button>
        </div>
      </header>

      {/* Dropdown Menu Modal / Drawer */}
      <div
        className={`stickynav__menu-backdrop ${menuOpen && isVisible ? 'is-open' : ''} theme-${navTheme}`}
        data-theme={navTheme}
        onClick={() => setMenuOpen(false)}
      >
        <nav
          className="stickynav__menu-panel"
          onClick={(e) => e.stopPropagation()}
          aria-label="Sticky Mobile Menu"
        >
          <a
            href="#work"
            className="stickynav__menu-link"
            onClick={(e) => scrollToSection(e, 'work')}
          >
            Work
          </a>
          <a
            href="#about"
            className="stickynav__menu-link"
            onClick={(e) => scrollToSection(e, 'about')}
          >
            About
          </a>
          <a
            href="#developer-v2"
            className="stickynav__menu-link"
            onClick={(e) => scrollToSection(e, 'developer-v2')}
          >
            Skills
          </a>
          <a
            href="#gallery"
            className="stickynav__menu-link"
            onClick={(e) => scrollToSection(e, 'gallery')}
          >
            Gallery
          </a>
          <a
            href="#creative"
            className="stickynav__menu-link"
            onClick={(e) => scrollToSection(e, 'creative')}
          >
            Game
          </a>
          <a
            href="#contact"
            className="stickynav__menu-link"
            onClick={(e) => scrollToSection(e, 'contact')}
          >
            Contact
          </a>
          <a
            href="#resume"
            className="stickynav__menu-link stickynav__menu-link--resume"
            onClick={(e) => {
              e.preventDefault()
              setMenuOpen(false)
              window.dispatchEvent(new CustomEvent('open-resume'))
            }}
          >
            Resume / CV 📄
          </a>
        </nav>
      </div>
    </>
  )
}

