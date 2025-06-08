import Footer from '@/components/Common/Layout/Footer'
import Header from '@/components/Common/Layout/Header'
import HeroSection from '@/components/Common/landingPage/HeroSection'
import FeaturesSection from '@/components/Common/landingPage/FeaturesSection'
import HowItWorksSection from '@/components/Common/landingPage/HowItWorksSection'
import TestimonialsSection from '@/components/Common/landingPage/TestimonialsSection'

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
