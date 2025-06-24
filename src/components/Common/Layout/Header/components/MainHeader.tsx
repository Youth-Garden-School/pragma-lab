'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/Common/Icon'
import { RouteEnum } from '@/shared/constants/RouteEnum'

interface MainHeaderProps {
  scrolled: boolean
  onMobileMenuClick: () => void
  mobileMenuOpen: boolean
}

const menuItems = [
  { name: 'Tra Cứu', href: RouteEnum.Search },
  { name: 'Tin tức', href: RouteEnum.News },
  { name: 'Hỗ trợ', href: RouteEnum.Support },
  { name: 'Về Chúng Tôi', href: RouteEnum.About },
]

export function MainHeader({ scrolled, onMobileMenuClick, mobileMenuOpen }: MainHeaderProps) {
  return (
    <div
      className={`transition-all duration-500 ${scrolled ? 'bg-white shadow-xl py-2' : 'bg-white shadow-lg py-4'}`}
    >
      <div className="container mx-auto px-[120px]">
        <div className="flex justify-between items-center">
          <Link href={RouteEnum.Home} className="flex items-center group">
            <div className={`transition-all duration-300 ${scrolled ? 'scale-90' : 'scale-100'}`}>
              <div className="flex items-center space-x-3">
                <Icons.logocar width={48} height={48} />
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
            onClick={onMobileMenuClick}
            className="lg:hidden w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-all duration-300"
          >
            {mobileMenuOpen ? <Icons.X className="w-5 h-5" /> : <Icons.menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
