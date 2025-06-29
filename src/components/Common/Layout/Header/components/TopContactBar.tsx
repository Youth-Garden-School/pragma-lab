import { Icons } from '@/components/Common/Icon'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AuthButton } from './AuthButton'

interface TopContactBarProps {
  scrolled: boolean
  isDesktop: boolean
  onLoginClick: () => void
}

const languages = [
  {
    code: 'vi',
    name: 'Tiếng việt',
    flag: <Icons.flagVi />,
  },
  {
    code: 'en',
    name: 'English',
    flag: <Icons.flagEn />,
  },
]

export function TopContactBar({ scrolled, isDesktop, onLoginClick }: TopContactBarProps) {
  if (!isDesktop) return null

  return (
    <div
      className={`transition-all duration-500 ${scrolled ? 'h-0 opacity-0' : 'h-12 opacity-100'} overflow-hidden bg-white border-b border-gray-100`}
    >
      <div className="container mx-auto px-[120px] py-2">
        <div className="flex justify-between items-center">
          <div className="hidden md:flex items-center space-x-6 text-xs">
            <div className="flex items-center space-x-1 text-gray-600">
              <Icons.phone className="w-3 h-3" />
              <span>1900 6888</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Icons.mail className="w-3 h-3" />
              <span>support@datvexe.vn</span>
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
                  <Icons.flagVi />
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
            <AuthButton onLoginClick={onLoginClick} />
          </div>
        </div>
      </div>
    </div>
  )
}
