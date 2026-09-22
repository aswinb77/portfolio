import { useState } from 'react'
import './App.css'
import Loader from './Loader'
import Hero from './Hero'
import UserSection from './UserSection'
import UserSectionV2 from './UserSectionV2'
import FeaturedSection from './FeaturedSection'
import GallerySection from './GallerySection'
import CreativeSection from './CreativeSection'
import Footer from './Footer'

function App() {
  const [isSplineReady, setIsSplineReady] = useState(false)

  return (
    <div className="page">
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
