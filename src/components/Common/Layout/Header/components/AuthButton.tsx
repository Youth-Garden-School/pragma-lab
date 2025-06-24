'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/Common/Icon'
import { authService } from '@/feature/Authentication/services/authService'

interface AuthButtonProps {
  onLoginClick?: () => void
  className?: string
}

export function AuthButton({ onLoginClick, className = '' }: AuthButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  if (status === 'loading') {
    return (
      <Button
        size="sm"
        variant="outline"
        className={`text-sm px-4 py-1.5 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 text-gray-700 ${className}`}
        disabled
      >
        Loading...
      </Button>
    )
  }

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className={`text-sm px-4 py-1.5 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 text-gray-700 ${className}`}
          >
            <div className="flex items-center space-x-2">
              <span>{session.user?.name || session.user?.email}</span>
              <Icons.chevronDown className="w-4 h-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg min-w-[180px] rounded-lg p-1">
          <DropdownMenuLabel className="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
            My Account
          </DropdownMenuLabel>
          
          <DropdownMenuItem 
            className="flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 text-gray-700 cursor-pointer rounded-md mx-1 my-0.5"
            onClick={() => handleNavigate('/profile')}
          >
            <Icons.user className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Hồ sơ</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 text-gray-700 cursor-pointer rounded-md mx-1 my-0.5"
            onClick={() => handleNavigate('/settings')}
          >
            <Icons.settings className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Cài đặt</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="my-1 border-gray-100" />
          
          <DropdownMenuItem
            className="flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 text-gray-700 cursor-pointer rounded-md mx-1 my-0.5"
            onClick={handleLogout}
          >
            <Icons.login className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className={`text-sm px-4 py-1.5 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 text-gray-700 ${className}`}
      onClick={onLoginClick}
    >
      Đăng nhập
    </Button>
  )
}