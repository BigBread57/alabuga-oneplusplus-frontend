'use client'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/providers/ThemeProvider'
import { motion } from 'framer-motion'
import styles from './Loading.module.scss'

const ComponentLoading = () => {
  const t = useTranslations('Loading')
  const { themeConfig } = useTheme()

  const rocketVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } as any

  const starVariants = {
    animate: (i: number) => ({
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: i * 0.2,
      },
    }),
  } as const

  const planetVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  } as const

  const stars = Array.from({ length: 12 }).map((_, i) => i)

  return (
    <div
      className={styles.componentContainer}
      style={{
        background: themeConfig?.token?.colorBgBase,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      {/* Фоновые звезды */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}
      >
        {stars.map((i) => (
          <motion.div
            key={`star-${i}`}
            custom={i}
            variants={starVariants}
            animate='animate'
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: '0 0 3px rgba(255, 255, 255, 0.8)',
            }}
          />
        ))}
      </div>

      {/* Вращающаяся планета */}
      <motion.div
        variants={planetVariants}
        animate='animate'
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          top: '10%',
          right: '5%',
          opacity: 0.4,
          boxShadow: '0 0 50px rgba(102, 126, 234, 0.5)',
        }}
      />

      {/* Летающая ракета */}
      <motion.div
        variants={rocketVariants}
        animate='animate'
        style={{
          fontSize: '80px',
          marginBottom: '40px',
          filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
          zIndex: 10,
        }}
      >
        🚀
      </motion.div>

      {/* Текст загрузки */}
      <h1
        style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: 600,
          letterSpacing: '2px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          zIndex: 10,
        }}
      >
        {t('component_loading')}
      </h1>

      {/* Анимированная линия */}
      <motion.div
        style={{
          marginTop: '30px',
          height: '3px',
          background:
            'linear-gradient(90deg, transparent, #667eea, #764ba2, transparent)',
          borderRadius: '2px',
          zIndex: 10,
        }}
        animate={{
          width: ['0%', '100%', '0%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        initial={{ width: '0%' }}
      />
    </div>
  )
}

export default ComponentLoading
