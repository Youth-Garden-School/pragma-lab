import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoginForm } from './LoginFormModal'
import { SignupForm } from './SignupFormModal'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'login' | 'signup'

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login')

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'login' ? 'Login' : 'Sign up'}</DialogTitle>
        </DialogHeader>
        {mode === 'login' ? (
          <LoginForm onSuccess={onClose} onSignupClick={() => handleModeChange('signup')} />
        ) : (
          <SignupForm onSuccess={() => handleModeChange('login')} />
        )}
      </DialogContent>
    </Dialog>
  )
}
