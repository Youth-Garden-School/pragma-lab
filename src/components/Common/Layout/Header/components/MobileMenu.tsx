import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/Common/Icon'
import { RouteEnum } from '@/shared/constants/RouteEnum'
import { AuthButton } from './AuthButton'

interface MobileMenuProps {
  mobileMenuOpen: boolean
  onClose: () => void
  onLoginClick: () => void
}

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
    flag: '🇻🇳',
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
  },
]

export function MobileMenu({ mobileMenuOpen, onClose, onLoginClick }: MobileMenuProps) {
  return (
    <>
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
                        onClick={onClose}
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
                  <AuthButton onLoginClick={onLoginClick} className="w-full" />
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
