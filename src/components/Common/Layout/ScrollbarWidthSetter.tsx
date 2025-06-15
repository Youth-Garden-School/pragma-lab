'use client'

import { useEffect } from 'react'

export function ScrollbarWidthSetter() {
  useEffect(() => {
    const setScrollbarWidth = () => {
      const app = document.getElementById('app')
      if (!app) return
      const scrollbarWidth = app.offsetWidth - app.clientWidth
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
    }

    setScrollbarWidth()
    window.addEventListener('resize', setScrollbarWidth)

    return () => {
      window.removeEventListener('resize', setScrollbarWidth)
    }
  }, [])

  return null
}
