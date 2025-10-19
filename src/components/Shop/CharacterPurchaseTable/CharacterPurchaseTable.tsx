'use client'

import type { FCC } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useContext } from 'react'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Select } from '@/components/_base/Select'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { useFilter } from '@/hooks/useFilter'
import { CharacterPurchase } from '@/models/CharacterPurchase'
import { ShopItemCategory } from '@/models/ShopItemCategory'

interface CharacterPurchaseProps {
  key?: React.Key
  id?: number
  price?: number
  number?: number
  discount?: number
  total_sum?: number
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  additional_info?: string
  buyer?: number
  shop_item?: {
    id?: number
    name?: string
    category?: {
      id?: number
      name?: string
      icon?: string | null
      color?: string
    }
    price?: number
    rank?: number
    competency?: number
    number?: number
    image?: string | null
  }
}

const MODEL = CharacterPurchase
const SHOP_ITEM_CATEGORY_MODEL = ShopItemCategory

const statusConfig = {
  PENDING: {
    label: 'Ожидание',
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  },
  COMPLETED: {
    label: 'Завершено',
    color: 'bg-green-500/20 text-green-300 border-green-500/30',
  },
  CANCELLED: {
    label: 'Отменено',
    color: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
}

const CharacterPurchaseTable: FCC = () => {
  const { currentUser } = useContext(CurrentUserContext)
  const t = useTranslations('CharacterPurchaseTable')
  const [filter, setFilter] = useFilter({})

  const handleSingleChange = (value?: number | string | any) => {
    setFilter({ shop_item_category: value })
  }

  return (
    <motion.div
      variants={sectionVariants}
      initial='hidden'
      animate='visible'
      className='flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs'
    >
      {/* Заголовок */}
      <div className='flex flex-col gap-4 border-b border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-transparent px-6 py-4 md:flex-row md:items-center md:justify-between md:px-8'>
        {/* Фильтр категорий */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className='w-full flex-shrink-0 md:w-auto'
        >
          <Select
            url={`${SHOP_ITEM_CATEGORY_MODEL.url()}/list?limit=1000&offset=0`}
            qKey='users-select'
            placeholder={t('select_shop_item_category')}
            valueKey='id'
            allowClear
            labelKey='name'
            style={{
              width: '100%',
              maxWidth: 300,
            }}
            onChange={handleSingleChange}
          />
        </motion.div>
      </div>

      {/* Таблица */}
      <div className='flex-1 overflow-x-auto'>
        <FetchMoreItemsComponent
          model={MODEL}
          defFilters={{ ...filter }}
          options={{
            pageSize: 10,
          }}
          isClearRender
          renderItems={({ data, isLoading }) => (
            <div className='w-full'>
              {isLoading && (
                <div className='flex h-40 items-center justify-center'>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Loader2 size={32} className='text-cyan-400' />
                  </motion.div>
                </div>
              )}

              {!isLoading && (!data || data.length === 0) && (
                <div className='flex h-40 items-center justify-center'>
                  <p className='text-center text-gray-400'>
                    {t('no_data') ?? 'Нет данных'}
                  </p>
                </div>
              )}

              {data && data.length > 0 && (
                <table className='w-full border-collapse'>
                  {/* Заголовок таблицы */}
                  <thead>
                    <tr className='border-b border-indigo-500/10 bg-indigo-500/5'>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400'>
                        Изображение
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400'>
                        Товар
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400'>
                        Цена (
                        {currentUser?.active_game_world_currency_name ??
                          'валюта'}
                        )
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400'>
                        Количество
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400'>
                        Скидка
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400'>
                        Итого (
                        {currentUser?.active_game_world_currency_name ??
                          'валюта'}
                        )
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400'>
                        Статус
                      </th>
                    </tr>
                  </thead>

                  {/* Тело таблицы */}
                  <tbody>
                    <AnimatePresence>
                      {data.map((item: CharacterPurchaseProps, index) => (
                        <motion.tr
                          key={item.id}
                          variants={rowVariants}
                          initial='hidden'
                          animate='visible'
                          exit='exit'
                          transition={{ delay: index * 0.05 }}
                          className='group border-b border-indigo-500/10 transition-all duration-200 hover:bg-indigo-500/10'
                        >
                          {/* Изображение */}
                          <td className='px-6 py-4'>
                            <div
                              className='relative h-16 w-16 overflow-hidden rounded-lg'
                              style={
                                item.shop_item?.image
                                  ? { backgroundColor: '#1e293b' }
                                  : {
                                      background: `linear-gradient(135deg, ${item.shop_item?.category?.color ?? '#06b6d4'}20 0%, ${item.shop_item?.category?.color ?? '#06b6d4'}10 100%)`,
                                      borderColor: `${item.shop_item?.category?.color ?? '#06b6d4'}40`,
                                      borderWidth: '1px',
                                    }
                              }
                            >
                              {item.shop_item?.image ? (
                                <Image
                                  src={item.shop_item.image}
                                  alt={item.shop_item?.name ?? 'Товар'}
                                  fill
                                  className='object-cover'
                                />
                              ) : (
                                <div className='flex h-full w-full items-center justify-center'>
                                  <span className='text-xs font-semibold text-cyan-400'>
                                    {item.shop_item?.name?.[0]?.toUpperCase() ??
                                      '?'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Товар */}
                          <td className='px-6 py-4'>
                            <div>
                              <p className='font-medium text-cyan-300'>
                                {item.shop_item?.name ?? '-'}
                              </p>
                              <p className='text-xs text-gray-400'>
                                {item.shop_item?.category?.name ?? '-'}
                              </p>
                            </div>
                          </td>

                          {/* Цена */}
                          <td className='px-6 py-4'>
                            <span className='text-white'>
                              {item.price ?? '-'}
                            </span>
                          </td>

                          {/* Количество */}
                          <td className='px-6 py-4'>
                            <span className='text-white'>
                              {item.number ?? '-'}
                            </span>
                          </td>

                          {/* Скидка */}
                          <td className='px-6 py-4'>
                            <span
                              className={
                                item?.discount && item.discount > 0
                                  ? 'font-medium text-green-400'
                                  : 'text-gray-400'
                              }
                            >
                              {item?.discount && item?.discount > 0
                                ? `${item.discount}%`
                                : '0%'}
                            </span>
                          </td>

                          {/* Итого */}
                          <td className='px-6 py-4'>
                            <span className='font-semibold text-cyan-300'>
                              {item.total_sum ?? '-'}
                            </span>
                          </td>

                          {/* Статус */}
                          <td className='px-6 py-4'>
                            <div
                              className={`inline-flex rounded-lg border px-3 py-1 text-xs font-medium ${
                                statusConfig[
                                  item.status as keyof typeof statusConfig
                                ]?.color ??
                                'border-gray-500/30 bg-gray-500/20 text-gray-300'
                              }`}
                            >
                              {statusConfig[
                                item.status as keyof typeof statusConfig
                              ]?.label ?? item.status}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              )}
            </div>
          )}
        />
      </div>
    </motion.div>
  )
}

CharacterPurchaseTable.displayName = 'CharacterPurchaseTable'

export default CharacterPurchaseTable
