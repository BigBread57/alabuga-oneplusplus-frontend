'use client'

import type { ButtonProps } from 'antd'
import type { ReactNode } from 'react'
import type { FCC } from 'src/types'
import { Button, Tooltip } from 'antd'

type TooltipButtonProps = {
  tooltip: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
} & ButtonProps

const TooltipButton: FCC<TooltipButtonProps> = ({
  children,
  tooltip,
  onClick,
  ...buttonProps
}) => {
  return (
    <Tooltip title={tooltip}>
      <Button onClick={onClick} {...buttonProps}>
        {children}
      </Button>
    </Tooltip>
  )
}

TooltipButton.displayName = 'TooltipButton'

export default TooltipButton
export type { TooltipButtonProps }
