import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ShowcaseSection from '@/components/ShowcaseSection';
import SolutionsSection from '@/components/SolutionsSection';
import PricingSection from '@/components/PricingSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ShowcaseSection />
      <FeaturesSection />
      <SolutionsSection />
      <PricingSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
