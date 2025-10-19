'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

type ShopPageProps = {
  params: Promise<{ locale: string }>
  children: React.ReactNode
}

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
}

const navItems = [
  {
    key: 'shop',
    href: '/shop/showcase',
    label: 'menu_shop',
    icon: ShoppingBag,
  },
  {
    key: 'purchases',
    href: '/shop/character-purchase',
    label: 'menu_purchases',
    icon: ShoppingCart,
  },
]

export default function Layout(props: ShopPageProps) {
  const params = useParams()
  const pathname = usePathname()
  const locale = params.locale as string
  const t = useTranslations('ShopPage')

  const getIsActive = (href: string) => pathname.includes(href)

  return (
    <div className='flex w-full flex-col gap-6'>
      {/* Навигация */}
      <motion.div
        variants={tabVariants}
        initial='hidden'
        animate='visible'
        className='flex flex-col overflow-hidden rounded-2xl'
      >
        {/* Кнопки навигации */}
        <div className='flex flex-wrap items-center justify-center gap-2 p-2 md:justify-start md:p-4'>
          {navItems?.map((item) => {
            const Icon = item.icon
            const isActive = getIsActive(item.href)

            return (
              <Link key={item.key} href={`/${locale}${item.href}`}>
                <motion.div
                  variants={buttonVariants}
                  initial='initial'
                  whileHover='hover'
                  whileTap='tap'
                  className={`group relative flex items-center justify-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-semibold transition-all duration-300 md:text-sm ${
                    isActive
                      ? 'border-cyan-400/60 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20'
                      : 'border-indigo-500/30 bg-indigo-500/5 text-indigo-300 hover:border-indigo-500/60 hover:bg-indigo-500/10'
                  }`}
                >
                  {/* Иконка с эффектом */}
                  <div className='relative'>
                    <Icon
                      size={16}
                      className={`transition-all duration-300 ${
                        isActive
                          ? 'text-cyan-400'
                          : 'text-indigo-400 group-hover:text-cyan-400'
                      }`}
                    />
                    {isActive && (
                      <motion.div
                        layoutId={`indicator-${item.key}`}
                        className='absolute inset-0 rounded-full bg-cyan-400/20'
                      />
                    )}
                  </div>

                  <span className='truncate'>{t(item?.label)}</span>

                  {/* Gradient border effect */}
                  {isActive && (
                    <motion.div
                      layoutId={`underline-${item.key}`}
                      className='absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent'
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* Декоративная линия */}
        <div className='h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent' />
      </motion.div>

      {/* Контент */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {props.children}
      </motion.div>
    </div>
  )
}
