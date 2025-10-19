'use client'

import type { ReactNode } from 'react'
import type { FCC } from 'src/types'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'

type TooltipButtonProps = {
  tooltip: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  icon?: ReactNode
  children?: ReactNode
  disabled?: boolean
  variant?: 'default' | 'primary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const TooltipButton: FCC<TooltipButtonProps> = ({
  children,
  tooltip,
  onClick,
  icon,
  disabled = false,
  variant = 'default',
  size = 'medium',
  className,
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const sizeClasses = {
    small: 'px-2 py-1.5 text-xs',
    medium: 'px-3 py-2 text-sm',
    large: 'px-4 py-2.5 text-base',
  }

  const variantClasses = {
    default:
      'border border-indigo-500/30 bg-indigo-500/5 text-indigo-300 hover:border-indigo-500/60 hover:bg-indigo-500/10',
    primary:
      'border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 hover:border-cyan-400/60 hover:from-cyan-500/30 hover:to-blue-500/30',
    danger:
      'border border-red-500/30 bg-red-500/5 text-red-300 hover:border-red-500/60 hover:bg-red-500/10',
  }

  return (
    <div className='relative inline-block'>
      <motion.button
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={onClick}
        onMouseEnter={() => !disabled && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={disabled}
        className={`flex items-center gap-2 rounded-lg border-2 font-medium transition-all duration-300 ${
          sizeClasses[size]
        } ${variantClasses[variant]} ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        } ${className || ''}`}
      >
        {icon}
        {children}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className='pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg border border-indigo-500/20 bg-slate-900/95 px-3 py-2 text-xs whitespace-nowrap text-gray-300 shadow-lg backdrop-blur-sm'
          >
            {tooltip}
            <div className='absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95' />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

TooltipButton.displayName = 'TooltipButton'

export default TooltipButton
export type { TooltipButtonProps }
