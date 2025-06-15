'use client'
import { useState, useEffect } from 'react'
import { AuthModal } from '@/feature/Authentication/presentation/organisms/AuthModal'
import useMatchBreakpoint from '@/shared/hooks/useMatchBreakpoint'
import { TopContactBar } from './components/TopContactBar'
import { MainHeader } from './components/MainHeader'
import { MobileMenu } from './components/MobileMenu'

const SCROLL_THRESHOLD = 80

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { isDesktop } = useMatchBreakpoint()

  useEffect(() => {
    const app = document.getElementById('app')
    if (!app) return

    const handleScroll = () => {
      setScrolled(app.scrollTop > SCROLL_THRESHOLD)
    }

    app.addEventListener('scroll', handleScroll, { passive: true })
    return () => app.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false)
  }

  const handleLoginClick = () => {
    setMobileMenuOpen(false)
    setAuthModalOpen(true)
  }

  return (
    <>
      <header className="fixed top-0 left-0 z-50" style={{ right: 'var(--scrollbar-width, 0px)' }}>
        <TopContactBar scrolled={scrolled} isDesktop={isDesktop} onLoginClick={handleLoginClick} />
        <MainHeader
          scrolled={scrolled}
          onMobileMenuClick={handleMobileMenuClick}
          mobileMenuOpen={mobileMenuOpen}
        />
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          onClose={handleMobileMenuClose}
          onLoginClick={handleLoginClick}
        />
      </header>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
