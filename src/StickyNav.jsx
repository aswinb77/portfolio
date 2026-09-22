import { useState, useEffect } from 'react'
import './StickyNav.css'

export default function StickyNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
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
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [menuOpen])

  const scrollToTop = () => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (e, id) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className={`stickynav ${isVisible ? 'is-visible' : ''}`}
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
        className={`stickynav__menu-backdrop ${menuOpen && isVisible ? 'is-open' : ''}`}
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
            href="#curiosities"
            className="stickynav__menu-link"
            onClick={(e) => scrollToSection(e, 'curiosities')}
          >
            Obsessions
          </a>
          <a
            href="#contact"
            className="stickynav__menu-link"
            onClick={(e) => scrollToSection(e, 'contact')}
          >
            Contact
          </a>
        </nav>
      </div>
    </>
  )
}
