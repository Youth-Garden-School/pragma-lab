import { useCallback, useState } from 'react'

export function useToggle(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  const toggle = useCallback((isOpen?: boolean) => {
    if (isOpen) {
      setIsOpen(isOpen)
      return
    }
    setIsOpen((prev) => !prev)
  }, [])

  return {
    isOpen,
    toggle,
  }
}
