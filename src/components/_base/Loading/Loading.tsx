'use client'
import { Spin } from 'antd'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/providers/ThemeProvider'
import styles from './Loading.module.scss'

const ComponentLoading = () => {
  const t = useTranslations('Loading')
  const { themeConfig } = useTheme()
  return (
    <div
      className={styles.componentContainer}
      style={{
        background: themeConfig?.token?.colorBgBase,
      }}
    >
      <Spin size='large' />
      <h1>{t('component_loading')}</h1>
    </div>
  )
}

export default ComponentLoading
