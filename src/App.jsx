import { useState } from 'react'
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

function App() {
  const [isSplineReady, setIsSplineReady] = useState(false)

  return (
    <div className="page">
      <StickyNav />
      <Loader isSplineReady={isSplineReady} />
      <Hero onSplineReady={() => setIsSplineReady(true)} />
      <FeaturedSection />
      <UserSection /> 
      <UserSectionV2 />
      <GallerySection />
      <CreativeSection />
      <Footer />
    </div>
  )
}

export default App
