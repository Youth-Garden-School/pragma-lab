import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useMatchBreakpoint } from '@/shared/hooks/useMatchBreakpoint'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface ModalHeaderProps {
  title: string
  description?: string
  className?: string
}

export interface ModalBodyProps {
  children: ReactNode
  className?: string
}

export interface ModalFooterProps {
  children: ReactNode
  className?: string
}

export interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  title?: string
}

export function ModalHeader({ title, description, className }: ModalHeaderProps) {
  return (
    <div className={cn('space-y-1.5 text-center sm:text-left', className)}>
      <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}

export function ModalBody({ children, className }: ModalBodyProps) {
  const { isMobile } = useMatchBreakpoint()

  const motionProps = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      delay: isMobile ? 0 : 0.1,
    },
  }

  return (
    <div className={cn('mt-4', className)}>
      <motion.div {...motionProps}>{children}</motion.div>
    </div>
  )
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return <div className={cn('mt-6 flex justify-end gap-2', className)}>{children}</div>
}

export function BaseModal({ isOpen, onClose, children, className, title }: BaseModalProps) {
  const { isMobile } = useMatchBreakpoint()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:max-w-md',
          'sm:max-w-[425px] sm:rounded-lg',
          'data-[state=open]:animate-[enter_200ms_ease-out] data-[state=closed]:animate-[modal-out_200ms_ease-out]',
          {
            'w-full rounded-md': isMobile,
          },
          className,
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  )
}
