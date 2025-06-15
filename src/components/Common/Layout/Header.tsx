'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Logocar from '@/components/Common/Icon/Logocar'
import { AuthModal } from '@/feature/Authentication/presentation/organisms/AuthModal'
import { RouteEnum } from '@/shared/constants/RouteEnum'
import useMatchBreakpoint from '@/shared/hooks/useMatchBreakpoint'
import { Icons } from '../Icon'
import { motion, AnimatePresence } from 'framer-motion'

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

  const menuItems = [
    { name: 'Tra Cứu', href: RouteEnum.Search },
    { name: 'Tin tức', href: RouteEnum.News },
    { name: 'Hỗ trợ', href: RouteEnum.Support },
    { name: 'Về Chúng Tôi', href: RouteEnum.About },
  ]

  const languages = [
    {
      code: 'vi',
      name: 'Tiếng việt',
      flag: (
        <svg
          className="w-5 h-3.5"
          viewBox="0 0 30 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="30" height="20" fill="#DA251D" />
          <path
            d="M15 4L16.4164 8.2918H21L17.2918 10.9836L18.7082 15.2754L15 12.5836L11.2918 15.2754L12.7082 10.9836L9 8.2918H13.5836L15 4Z"
            fill="#FFFF00"
          />
        </svg>
      ),
    },
    {
      code: 'en',
      name: 'English',
      flag: (
        <svg
          className="w-5 h-3.5"
          viewBox="0 0 30 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="30" height="20" fill="#012169" />
          <path d="M0 0L30 20M30 0L0 20" stroke="white" strokeWidth="2" />
          <path d="M15 0V20M0 10H30" stroke="white" strokeWidth="4" />
          <path d="M15 0V20M0 10H30" stroke="#C8102E" strokeWidth="2" />
          <path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" strokeWidth="1" />
        </svg>
      ),
    },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 z-50" style={{ right: 'var(--scrollbar-width, 0px)' }}>
        {/* Top Contact Bar */}
        {isDesktop && (
          <div
            className={`transition-all duration-500 ${scrolled ? 'h-0 opacity-0' : 'h-12 opacity-100'} overflow-hidden bg-white border-b border-gray-100`}
          >
            <div className="container mx-auto px-[120px] py-2">
              <div className="flex justify-between items-center">
                <div className="hidden md:flex items-center space-x-6 text-xs">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Icons.phone className="w-3 h-3" />
                    <span>1900-6888</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Icons.mail className="w-3 h-3" />
                    <span>support@busmanager.vn</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Icons.mapPin className="w-3 h-3" />
                    <span>Hỗ trợ 24/7</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white">
                        <svg
                          className="w-5 h-3.5"
                          viewBox="0 0 30 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="30" height="20" fill="#DA251D" />
                          <path
                            d="M15 4L16.4164 8.2918H21L17.2918 10.9836L18.7082 15.2754L15 12.5836L11.2918 15.2754L12.7082 10.9836L9 8.2918H13.5836L15 4Z"
                            fill="#FFFF00"
                          />
                        </svg>
                        <span>Tiếng việt</span>
                        <Icons.chevronDown className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg min-w-[140px]">
                      {languages.map((language) => (
                        <DropdownMenuItem
                          key={language.code}
                          className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50"
                        >
                          <span className="text-lg">{language.flag}</span>
                          <span className="text-sm">{language.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-sm px-4 py-1.5 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Header */}
        <div
          className={`transition-all duration-500 ${scrolled ? 'bg-white shadow-xl py-2' : 'bg-white shadow-lg py-4'}`}
        >
          <div className="container mx-auto px-[120px]">
            <div className="flex justify-between items-center">
              <Link href={RouteEnum.Home} className="flex items-center group">
                <div
                  className={`transition-all duration-300 ${scrolled ? 'scale-90' : 'scale-100'}`}
                >
                  <div className="flex items-center space-x-3">
                    <Logocar width={48} height={48} />
                    <div>
                      <h1 className="text-xl font-bold text-blue-600">DATVEXE</h1>
                      <p className="text-xs font-semibold text-gray-500">Đặt vé xe khách online</p>
                    </div>
                  </div>
                </div>
              </Link>
              <nav className="hidden lg:flex">
                <ul className="flex items-center space-x-1">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="px-4 py-2 text-slate-700 hover:text-blue-600 font-semibold transition-colors rounded-lg hover:bg-blue-50"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <Icons.X className="w-5 h-5" />
                ) : (
                  <Icons.menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ y: -10, opacity: 0, height: 0 }}
              animate={{ y: 0, opacity: 1, height: 'max-content' }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="lg:hidden bg-white border-t shadow-xl">
                <nav className="container mx-auto px-[120px] py-4">
                  <ul className="space-y-1">
                    {menuItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-4 border-t space-y-2">
                    <DropdownMenu modal={true}>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white">
                          <div className="flex items-center space-x-2">
                            <span>Tiếng việt</span>
                            <span className="text-lg">🇻🇳</span>
                          </div>
                          <Icons.chevronDown className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg w-full">
                        {languages.map((language) => (
                          <DropdownMenuItem
                            key={language.code}
                            className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50"
                          >
                            <span className="text-lg">{language.flag}</span>
                            <span className="text-sm">{language.name}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      className="w-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setAuthModalOpen(true)
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}
