import { useState } from 'react'
import './GallerySection.css'

// User Gallery Images (1-32)
import g1 from './assets/gallery/1.jpeg'
import g2 from './assets/gallery/2.jpeg'
import g3 from './assets/gallery/3.jpeg'
import g4 from './assets/gallery/4.jpeg'
import g5 from './assets/gallery/5.jpeg'
import g6 from './assets/gallery/6.jpeg'
import g7 from './assets/gallery/7.jpeg'
import g8 from './assets/gallery/8.jpeg'
import g9 from './assets/gallery/9.jpeg'
import g10 from './assets/gallery/10.jpeg'
import g11 from './assets/gallery/11.jpeg'
import g12 from './assets/gallery/12.jpeg'
import g13 from './assets/gallery/13.jpeg'
import g14 from './assets/gallery/14.jpeg'
import g15 from './assets/gallery/15.jpeg'
import g16 from './assets/gallery/16.jpeg'
import g17 from './assets/gallery/17.jpeg'
import g18 from './assets/gallery/18.jpeg'
import g19 from './assets/gallery/19.jpeg'
import g20 from './assets/gallery/20.jpeg'
import g21 from './assets/gallery/21.jpeg'
import g22 from './assets/gallery/22.jpeg'
import g23 from './assets/gallery/23.jpeg'
import g24 from './assets/gallery/24.jpeg'
import g25 from './assets/gallery/25.jpeg'
import g26 from './assets/gallery/26.jpeg'
import g27 from './assets/gallery/27.jpg'
import g28 from './assets/gallery/28.jpg'
import g29 from './assets/gallery/29.jpg'
import g30 from './assets/gallery/30.jpg'
import g31 from './assets/gallery/31.jpg'
import g32 from './assets/gallery/32.jpg'

const COLUMNS_DATA = [
  {
    direction: 'up',
    images: [
      g1,
      g4,
      g7,
      g10,
      g13,
      g16,
      g19,
      g22,
      g25,
      g28,
    ],
  },
  {
    direction: 'down',
    images: [
      g1, // replaces d3624c29
      g2, // replaces c4f186ea
      'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/b2/01/ac/b201ac0a-d696-7e94-9133-5d0160adb847/075596059527.jpg/600x600bb.jpg',
      g3, // replaces 96cad926
      'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/8f/f0/88/8ff088ee-bd18-8a27-1bb6-c0e44ad91cb6/603497862542.jpg/600x600bb.jpg',
      g4, // replaces 8fe7f417
      g5, // replaces 88900ddb
      g6, // replaces 8813c795
      g7, // replaces 8648e899
      'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/7e/de/d1/7eded170-9703-ae08-90c0-dd7c19c2bcac/00602537945665.rgb.jpg/600x600bb.jpg',
    ],
  },
  {
    direction: 'up',
    images: [
      g15, // replaces 179ffa90
      g16, // replaces 05009a8e
      g17, // replaces 95f1c441
      'https://is1-ssl.mzstatic.com/image/thumb/Music4/v4/9d/09/c2/9d09c206-1f44-d377-764d-1ba8824892b1/alternatecover-1397075998.jpg/600x600bb.jpg',
      g32, // replaces 9acf6e25
      g19, // replaces fae42799
      'https://is1-ssl.mzstatic.com/image/thumb/Music3/v4/ef/5b/1e/ef5b1e90-4b3a-851e-b67f-9f2ef62ab49c/dj.kazvtdrb.jpg/600x600bb.jpg',
      g20, // replaces bd552237
      g21, // replaces f3bdd72b
      g22, // replaces b7e52326
    ],
  },
  {
    direction: 'down',
    images: [
      g23, // replaces 5579a159
      g24, // replaces 4a3944b0
      g25, // replaces 23de5501
      g26, // replaces c868ba52
      g27, // replaces b7b15a8e
      g28, // replaces dbc81818
      g29, // replaces 93f32c4e
      g30, // replaces 68258891
      g31, // replaces 29045471
      g18, // replaces f3dd7a5a
    ],
  },
  {
    direction: 'up',
    images: [
      'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/f3/22/7f/f3227fd3-758e-2728-7db2-25b29373c8ae/18UMGIM35635.rgb.jpg/600x600bb.jpg',
      'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/cc/86/10/cc861044-0537-0de4-4389-dceec0c13b96/06UMGIM44799.rgb.jpg/600x600bb.jpg',
      g8,  // replaces 938fb30c
      g9,  // replaces 7710bdd0
      g10, // replaces 68d31343
      g11, // replaces 6499090c
      g12, // replaces 635d3043
      g13, // replaces f10c873d
      'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f0/c7/c8/f0c7c8f4-4319-d357-ddaf-566ef8e2194e/081227979379.jpg/600x600bb.jpg',
      g14, // replaces deb4760b
    ],
  },
]

export default function GallerySection() {
  const [isPaused, setIsPaused] = useState(false)
  const [isTouchDevice] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth <= 768
    }
    return false
  })

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev)
  }

  return (
    <section
      className="gallery-section"
      id="gallery"
      onClick={handleTogglePause}
      role="region"
      aria-label="3D Album & Photo Gallery"
    >
      {/* Fullscreen 3D Isometric Viewport */}
      <div className="column-wrapper">
        <div className={`columns ${isPaused ? 'is-paused' : ''}`}>
          {COLUMNS_DATA.map((col, cIdx) => (
            <div key={cIdx} className={`column ${col.direction}`}>
              {col.images.map((imgUrl, iIdx) => (
                <div
                  key={iIdx}
                  className="column-item"
                  style={{ backgroundImage: `url(${imgUrl})` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic vignette & ambient edge fade */}
      <div className="gallery-section__vignette" aria-hidden="true" />

      {/* Floating footer hint */}
      <div className="gallery-section__footer-hint">
        {isTouchDevice
          ? (isPaused ? 'paused · tap to resume' : 'tap to pause stream')
          : 'hover to pause · infinite vertical stream'}
      </div>
    </section>
  )
}

