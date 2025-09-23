'use client'

import { useLocale } from 'next-intl'
import LogoEn from '@/components/_icons/logo/LogoEn'
import LogoRu from '@/components/_icons/logo/LogoRu'

type LogoSwitcherProps = {
  width?: number
  height?: number
}

export function LogoSwitcher({ width, height }: LogoSwitcherProps) {
  const locale = useLocale()

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      {locale !== 'ru'
        ? (
            <LogoEn width={width} height={height} />
          )
        : (
            <LogoRu width={width} height={height} />
          )}
    </div>
  )
}
