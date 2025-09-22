import { useEffect, useState } from 'react'

/**
 * Хук для отслеживания скролла страницы
 * @param scrollThreshold
 */
export const useWindowScroll = (scrollThreshold: number) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > scrollThreshold
      setIsScrolled(show)
    }

    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [scrollThreshold])

  return isScrolled
}
