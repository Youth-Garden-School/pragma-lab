import Footer from '@/components/Common/Layout/Footer'
import Header from '@/components/Common/Layout/Header'
import HeroSection from '@/feature/landingPage/HeroSection'
import FeaturesSection from '@/feature/landingPage/FeaturesSection'
import HowItWorksSection from '@/feature/landingPage/HowItWorksSection'
import TestimonialsSection from '@/feature/landingPage/TestimonialsSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      <section id="home">
        <HeroSection />
      </section>
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="how-it-works">
        <HowItWorksSection />
      </section>
      <section id="testimonials">
        <TestimonialsSection />
      </section>
      <Footer />
    </main>
  )
}
