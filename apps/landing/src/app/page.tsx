import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import SolutionsSection from '@/components/SolutionsSection'
import PricingSection from '@/components/PricingSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <SolutionsSection />
      <PricingSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}