'use client'
import { Spin } from 'antd'
import { useTranslations } from 'next-intl'
import styles from './Loading.module.scss'

const ComponentLoading = () => {
  const t = useTranslations('Loading')

  return (
    <div className={styles.componentContainer}>
      <Spin size='default' />
      <h1>{t('component_loading')}</h1>
    </div>
  )
}

export default ComponentLoading
