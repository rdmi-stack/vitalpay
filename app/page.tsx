import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Manifesto from '@/components/Manifesto'
import ProductShowcase from '@/components/ProductShowcase'
import Solution from '@/components/Solution'
import AboutMission from '@/components/AboutMission'
import Features from '@/components/Features'
import Accelerate from '@/components/Accelerate'
import PatientExperience from '@/components/PatientExperience'
import Testimonials from '@/components/Testimonials'
import HowItWorks from '@/components/HowItWorks'
import EhrIntegrations from '@/components/EhrIntegrations'
import Calculator from '@/components/Calculator'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Manifesto />
        <ProductShowcase />
        <Solution />
        <AboutMission />
        <Features />
        <Accelerate />
        <PatientExperience />
        <Testimonials />
        <HowItWorks />
        <EhrIntegrations />
        <Calculator />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
