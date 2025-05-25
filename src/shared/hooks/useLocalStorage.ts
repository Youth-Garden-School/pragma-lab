import { useCallback } from 'react'

export function useLocalStorage() {
  const setItem = useCallback(<T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }, [])

  const getItem = useCallback(<T>(key: string, defaultValue: T): T => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(error)
      return defaultValue
    }
  }, [])

  const removeItem = useCallback((key: string): void => {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(error)
    }
  }, [])

  return { setItem, getItem, removeItem }
}
