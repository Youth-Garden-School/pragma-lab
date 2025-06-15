import { useState } from 'react'
import { BaseModal, ModalBody, ModalHeader } from '@/components/Modal/BaseModal'
import { LoginForm } from '../molecules/LoginFormModal'
import { SignupForm } from '../molecules/SignupFormModal'

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

  const modalTitle = mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      {mode === 'login' ? (
        <>
          <ModalHeader
            title="Đăng nhập"
            description="Nhập email của bạn để đăng nhập vào tài khoản"
          />
          <ModalBody>
            <LoginForm onSuccess={onClose} onSignupClick={() => handleModeChange('signup')} />
          </ModalBody>
        </>
      ) : (
        <>
          <ModalHeader
            title="Tạo tài khoản"
            description="Nhập email của bạn để tạo tài khoản mới"
          />
          <ModalBody>
            <SignupForm onSuccess={() => handleModeChange('login')} />
          </ModalBody>
        </>
      )}
    </BaseModal>
  )
}
