'use client'

import type { FCC } from 'src/types'
import type { CharacterPurchaseProps } from '@/models/CharacterPurchase'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Eye, ShoppingCart, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useMemo, useState } from 'react'
import useMessage from '@/hooks/useMessages'
import { CharacterPurchase } from '@/models/CharacterPurchase'
import { useCreateItem } from '@/services/base/hooks'

type ShopItemProps = {
  id: number
  name: string
  description: string
  category: {
    id: number
    name: string
    icon: string | null
    color: string
  }
  price: number
  number: number
  image: string | null
  is_active: boolean
  start_datetime: string | null
  end_datetime: string | null
  purchase_restriction: string | null
  active_game_world_currency_name: string
  children: any[]
  onSuccess?: () => void
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  hover: {
    y: -8,
    transition: { duration: 0.3 },
  },
}

const ShopItemCard: FCC<ShopItemProps> = ({
  id,
  name,
  description,
  category,
  price,
  number,
  image,
  is_active,
  start_datetime,
  end_datetime,
  purchase_restriction,
  onSuccess,
  active_game_world_currency_name,
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const t = useTranslations('ShopItem')
  const { messageSuccess, messageError } = useMessage()

  const { mutate: createItem, isPending } = useCreateItem(CharacterPurchase)

  // Генерируем рандомный градиент на основе ID
  const randomGradient = useMemo(() => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-indigo-500 to-blue-500',
      'from-cyan-500 to-blue-500',
      'from-violet-500 to-purple-500',
      'from-emerald-500 to-cyan-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500',
      'from-amber-500 to-orange-500',
      'from-teal-500 to-emerald-500',
    ]
    return colors[id % colors.length]
  }, [id])

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDetailsModalOpen(true)
  }

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDetailsModalOpen(false)
    setPurchaseModalOpen(true)
  }

  const handlePurchaseSubmit = () => {
    const purchaseData: Partial<CharacterPurchaseProps> = {
      number: quantity,
      shop_item: id as number,
    }

    createItem(purchaseData, {
      onSuccess: () => {
        messageSuccess()
        setPurchaseModalOpen(false)
        setDetailsModalOpen(false)
        setQuantity(1)
        onSuccess?.()
      },
      onError: (error: any) => {
        if (Array.isArray(error?.response?.data?.errors)) {
          const errors = error?.response?.data?.errors
          errors.forEach(
            (err: { code: string; detail: string; attr: string | null }) => {
              messageError(err.detail || t('purchase_error'))
            },
          )
        } else if (error?.response?.data?.detail) {
          messageError(error.response.data.detail)
        } else if (error?.message) {
          messageError(error.message)
        } else {
          messageError(t('purchase_error'))
        }
      },
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  const totalPrice = price * quantity

  return (
    <>
      {/* Карточка товара */}
      <motion.div
        variants={cardVariants}
        initial='hidden'
        animate='visible'
        whileHover='hover'
        className='flex h-full flex-col overflow-hidden rounded-xl border border-indigo-500/20 bg-slate-900/50 backdrop-blur-xs transition-all duration-300 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10'
      >
        {/* Изображение */}
        <div
          className={`relative h-40 w-full overflow-hidden bg-gradient-to-b ${randomGradient}`}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              width={400}
              height={300}
              className='h-full w-full object-cover transition-transform duration-500 hover:scale-110'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className='h-16 w-16 rounded-full border-4 border-white/20 border-t-white/60'
              />
            </div>
          )}

          {!is_active && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
              <span className='text-sm font-semibold text-red-400'>
                {t('inactive')}
              </span>
            </div>
          )}

          {/* Категория */}
          <div className='absolute top-2 left-2'>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className='inline-block rounded-full px-3 py-1 text-xs font-semibold text-white'
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </motion.span>
          </div>
        </div>

        {/* Контент */}
        <div className='flex flex-1 flex-col gap-3 p-3'>
          {/* Название */}
          <div className='flex-1'>
            <h3 className='line-clamp-2 text-sm font-bold text-cyan-300 hover:text-cyan-200'>
              {name}
            </h3>
            <p className='mt-1 line-clamp-2 text-xs text-gray-400'>
              {description}
            </p>
          </div>

          {/* Цена */}
          <div className='border-t border-indigo-500/10 pt-2'>
            <div className='flex items-baseline gap-1'>
              <span className='text-lg font-bold text-cyan-400'>
                {formatPrice(price)}
              </span>
              <span className='text-xs text-gray-500'>
                {active_game_world_currency_name}
              </span>
            </div>
            {number > 0 && (
              <p className='mt-1 text-xs text-gray-500'>
                {t('available_quantity')}: {number}
              </p>
            )}
          </div>
        </div>

        {/* Кнопки действия */}
        <div className='flex gap-2 border-t border-indigo-500/10 p-3'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewDetails}
            className='flex flex-1 items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 py-2 text-sm font-medium text-indigo-300 transition-colors hover:border-indigo-500/60 hover:bg-indigo-500/20'
            title={t('view_details')}
          >
            <Eye size={16} />
            <span className='hidden sm:inline'>{t('view_details')}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePurchaseClick}
            disabled={!is_active}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
              is_active
                ? 'border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 hover:border-cyan-400/60 hover:from-cyan-500/30 hover:to-blue-500/30'
                : 'cursor-not-allowed border border-gray-600 bg-gray-800/20 text-gray-500'
            }`}
            title={t('purchase')}
          >
            <ShoppingCart size={16} />
            <span className='hidden sm:inline'>{t('purchase')}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Модалка с деталями */}
      <AnimatePresence>
        {detailsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetailsModalOpen(false)}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className='flex max-h-screen w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900 shadow-2xl'
            >
              {/* Заголовок */}
              <div className='flex items-center justify-between border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-6 py-4'>
                <h2 className='text-xl font-bold text-cyan-300'>{name}</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setDetailsModalOpen(false)}
                  className='text-gray-400 transition-colors hover:text-gray-300'
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Содержимое */}
              <div className='flex-1 overflow-y-auto p-6'>
                <div className='flex flex-col gap-6 md:flex-row'>
                  {/* Изображение */}
                  <div
                    className={`h-64 w-full flex-shrink-0 rounded-lg bg-gradient-to-b md:w-64 ${randomGradient} flex items-center justify-center`}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className='h-full w-full rounded-lg object-cover'
                      />
                    ) : (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className='h-24 w-24 rounded-full border-4 border-white/20 border-t-white/60'
                      />
                    )}
                  </div>

                  {/* Информация */}
                  <div className='flex-1 space-y-4'>
                    <div>
                      <p className='text-sm text-gray-400'>
                        {t('description')}
                      </p>
                      <p className='text-gray-300'>{description}</p>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-gray-400'>{t('category')}</p>
                        <span
                          className='inline-block rounded-full px-3 py-1 text-sm font-semibold text-white'
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name}
                        </span>
                      </div>

                      <div>
                        <p className='text-sm text-gray-400'>{t('price')}</p>
                        <p className='text-lg font-bold text-cyan-400'>
                          {formatPrice(price)} {active_game_world_currency_name}
                        </p>
                      </div>
                    </div>

                    {start_datetime && (
                      <div>
                        <p className='text-sm text-gray-400'>
                          {t('start_date')}
                        </p>
                        <p className='text-gray-300'>
                          {new Date(start_datetime).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    )}

                    {end_datetime && (
                      <div>
                        <p className='text-sm text-gray-400'>{t('end_date')}</p>
                        <p className='text-gray-300'>
                          {new Date(end_datetime).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    )}

                    {purchase_restriction && (
                      <div>
                        <p className='text-sm text-gray-400'>
                          {t('restrictions')}
                        </p>
                        <p className='text-gray-300'>{purchase_restriction}</p>
                      </div>
                    )}

                    {number > 0 && (
                      <div>
                        <p className='text-sm text-gray-400'>
                          {t('available_quantity')}
                        </p>
                        <p className='text-gray-300'>{number}</p>
                      </div>
                    )}

                    <div>
                      <p className='text-sm text-gray-400'>{t('status')}</p>
                      <p
                        className={`font-semibold ${
                          is_active ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {is_active ? t('active') : t('inactive')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div className='flex gap-3 border-t border-indigo-500/10 bg-slate-800/50 p-6'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDetailsModalOpen(false)}
                  className='flex-1 rounded-lg border border-indigo-500/30 py-2 font-semibold text-indigo-300 transition-colors hover:border-indigo-500/60 hover:bg-indigo-500/10'
                >
                  {t('close')}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePurchaseClick}
                  disabled={!is_active}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-semibold transition-colors ${
                    is_active
                      ? 'border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 hover:border-cyan-400/60'
                      : 'cursor-not-allowed border border-gray-600 bg-gray-800/20 text-gray-500'
                  }`}
                >
                  <ShoppingCart size={18} />
                  {t('purchase_for')} {formatPrice(price)}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модалка покупки */}
      <AnimatePresence>
        {purchaseModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPurchaseModalOpen(false)}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className='w-full max-w-md rounded-2xl border border-indigo-500/20 bg-slate-900 shadow-2xl'
            >
              {/* Заголовок */}
              <div className='flex items-center justify-between border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-6 py-4'>
                <h2 className='text-lg font-bold text-cyan-300'>
                  {t('purchase_item')}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPurchaseModalOpen(false)}
                  className='text-gray-400 transition-colors hover:text-gray-300'
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Контент */}
              <div className='space-y-6 p-6'>
                <div>
                  <label className='text-sm font-semibold text-gray-300'>
                    {t('quantity')}
                  </label>
                  <div className='mt-2 flex items-center gap-3'>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className='flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/30 text-indigo-300 hover:border-indigo-500/60 hover:bg-indigo-500/10'
                    >
                      −
                    </motion.button>

                    <input
                      type='number'
                      min='1'
                      max={number > 0 ? number : undefined}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(1, Number.parseInt(e.target.value) || 1),
                        )
                      }
                      className='flex-1 rounded-lg border border-indigo-500/20 bg-slate-800/50 px-4 py-2 text-center text-gray-300 transition-colors outline-none focus:border-cyan-400/60'
                    />

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setQuantity(
                          number > 0
                            ? Math.min(number, quantity + 1)
                            : quantity + 1,
                        )
                      }
                      className='flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/30 text-indigo-300 hover:border-indigo-500/60 hover:bg-indigo-500/10'
                    >
                      +
                    </motion.button>
                  </div>
                  {number > 0 && (
                    <p className='mt-2 text-xs text-gray-500'>
                      {t('available_quantity')}: {number}
                    </p>
                  )}
                </div>

                {/* Расчёт цены */}
                <div className='space-y-2 rounded-lg border border-indigo-500/10 bg-indigo-500/5 p-4'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-400'>
                      {t('price_per_item')}:
                    </span>
                    <span className='text-gray-300'>
                      {formatPrice(price)} {active_game_world_currency_name}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-semibold text-gray-300'>
                      {t('total')}:
                    </span>
                    <span className='text-lg font-bold text-cyan-400'>
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div className='flex gap-3 border-t border-indigo-500/10 bg-slate-800/50 p-6'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPurchaseModalOpen(false)}
                  className='flex-1 rounded-lg border border-indigo-500/30 py-2 font-semibold text-indigo-300 transition-colors hover:border-indigo-500/60 hover:bg-indigo-500/10'
                >
                  {t('cancel')}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePurchaseSubmit}
                  disabled={isPending}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-semibold transition-colors ${
                    isPending
                      ? 'cursor-not-allowed border border-gray-600 bg-gray-800/20 text-gray-500'
                      : 'border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 hover:border-cyan-400/60'
                  }`}
                >
                  {isPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <ShoppingCart size={18} />
                      </motion.div>
                      {t('processing')}
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      {t('confirm_purchase')}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

ShopItemCard.displayName = 'ShopItemCard'

export default ShopItemCard
