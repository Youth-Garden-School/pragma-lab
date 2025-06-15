import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/Common/Icon'
import { authService } from '@/feature/Authentication/services/authService'

interface AuthButtonProps {
  onLoginClick?: () => void
  className?: string
}

export function AuthButton({ onLoginClick, className = '' }: AuthButtonProps) {
  const { data: session, status } = useSession()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
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
        <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg min-w-[140px]">
          <DropdownMenuItem
            className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 text-red-600"
            onClick={handleLogout}
          >
            <Icons.login className="w-4 h-4" />
            <span>Đăng xuất</span>
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
