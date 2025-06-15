import { useToggle } from './useToggle'

export function useModal(initialState = false) {
  const { isOpen, toggle } = useToggle(initialState)

  return {
    isOpen,
    open: () => toggle(true),
    close: () => toggle(false),
    toggle,
  }
}
