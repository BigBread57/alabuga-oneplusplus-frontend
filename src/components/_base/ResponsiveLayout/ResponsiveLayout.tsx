import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import NET from 'vanta/dist/vanta.net.min.js'
import { useScreens } from '@/hooks/useScreens'

type ResponsiveLayoutProps = {
  className?: string
}

const ResponsiveLayout: FCC<ResponsiveLayoutProps> = ({
  children,
  className,
}) => {
  const { isMobile, isTablet } = useScreens()
  const vantaRef = useRef<HTMLDivElement>(null)

  const containerPadding = isMobile ? 'p-2' : isTablet ? 'p-4' : 'p-6'

  // Инициализация Vanta.js NET эффект
  useEffect(() => {
    if (vantaRef.current && (!window.vantaEffect as any)) {
      window.vantaEffect = NET({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: '#FFF4E8',
        backgroundColor: '#0a0e27',
        points: 5.0,
        maxDistance: 1.0,
        spacing: 25.0,
        top: '0px',
      })
    }

    return () => {
      if (window.vantaEffect) {
        window.vantaEffect.destroy()
        window.vantaEffect = null
      }
    }
  }, [])

  return (
    <motion.div
      ref={vantaRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative min-h-screen ${containerPadding} ${className || ''}`}
    >
      {children}
    </motion.div>
  )
}

ResponsiveLayout.displayName = 'ResponsiveLayout'

export default ResponsiveLayout
