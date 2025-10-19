'use client'

import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import { Save, ShoppingCart, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'
import { CharacterPurchase } from '@/models/CharacterPurchase'
import { ShopItemCategory } from '@/models/ShopItemCategory'
import { useFetchItems } from '@/services/base/hooks'

interface CharacterPurchaseProps {
  id: number
  price: number
  number: number
  discount: number
  total_sum: number
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  additional_info: string
  buyer: number
  shop_item: {
    id: number
    name: string
    category: {
      id: number
      name: string
      icon: string | null
      color: string
    }
    price: number
    rank: number
    competency: number
    number: number
    image: string | null
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const updatePurchaseStatus = async (
  purchaseId: number,
  status: string,
  additionalInfo: string,
) => {
  // Реализуйте вызов к вашему API
  return purchaseId + status + additionalInfo
}

const StatusCell: React.FC<{
  status: string
  recordId: number
  onUpdate?: () => void
}> = ({ status, recordId, onUpdate }) => {
  const [currentStatus, setCurrentStatus] = useState(status)
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const t = useTranslations('CharacterPurchaseTable')

  const statusConfig = {
    PENDING: {
      color: 'from-orange-500 to-orange-600',
      text: t('pending'),
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-300',
    },
    COMPLETED: {
      color: 'from-green-500 to-green-600',
      text: t('delivered'),
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-300',
    },
    CANCELLED: {
      color: 'from-red-500 to-red-600',
      text: t('cancelled'),
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-300',
    },
  }

  const config = statusConfig[currentStatus as keyof typeof statusConfig] || {
    color: 'from-gray-500 to-gray-600',
    text: currentStatus,
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-300',
  }

  const handleStatusUpdate = async () => {
    try {
      await updatePurchaseStatus(recordId, currentStatus, additionalInfo)
      setIsEditing(false)
      setAdditionalInfo('')
      onUpdate?.()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleCancel = () => {
    setCurrentStatus(status)
    setAdditionalInfo('')
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='max-w-xs space-y-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 backdrop-blur-xs'
      >
        <select
          value={currentStatus}
          onChange={(e) => setCurrentStatus(e.target.value)}
          className='w-full rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-300 transition-colors outline-none focus:border-indigo-500/50'
        >
          <option value='PENDING'>{t('pending')}</option>
          <option value='COMPLETED'>{t('delivered')}</option>
          <option value='CANCELLED'>{t('cancelled')}</option>
        </select>

        <textarea
          placeholder='Дополнительная информация...'
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          className='w-full resize-none rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-300 placeholder-indigo-300/40 transition-colors outline-none focus:border-indigo-500/50'
          rows={2}
        />

        <div className='flex gap-2'>
          <button
            onClick={handleStatusUpdate}
            className='flex items-center gap-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-3 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90'
          >
            <Save size={14} />
            Сохранить
          </button>
          <button
            onClick={handleCancel}
            className='flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20'
          >
            <X size={14} />
            Отмена
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className='space-y-2'>
      <div
        className={`inline-block rounded-lg ${config.bgColor} px-3 py-1 text-xs font-semibold ${config.textColor} cursor-pointer transition-all hover:opacity-80`}
        onClick={() => setIsEditing(true)}
      >
        {config.text}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className='block text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300'
      >
        Изменить статус
      </button>
    </div>
  )
}

const MODEL = CharacterPurchase
const SHOP_ITEM_CATEGORY_MODEL = ShopItemCategory

const AdminCharacterPurchase: FCC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const { data: categoriesData } = useFetchItems({
    model: SHOP_ITEM_CATEGORY_MODEL,
    filter: { limit: 1000, offset: 0 },
    qKey: 'shopItemCategories',
  })

  const { data: purchasesData, refetch: refetchPurchases } = useFetchItems({
    model: MODEL,
    filter: {
      ...(selectedCategory && { shop_item_category: selectedCategory }),
    },
    qKey: 'characterPurchases',
  })

  const categories = categoriesData?.data?.results || []
  const purchases = purchasesData?.data?.results || []
  const totalCount = purchasesData?.data?.count || 0

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedCategory(value || null)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='w-full'
    >
      {/* Заголовок и фильтры */}
      <motion.div
        variants={sectionVariants}
        className='mb-6 flex flex-col gap-4 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-transparent p-6 backdrop-blur-xs'
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='rounded-lg bg-indigo-500/20 p-2'>
              <ShoppingCart size={20} className='text-indigo-400' />
            </div>
            <div>
              <h2 className='bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-lg font-bold text-transparent'>
                ПОКУПКИ ПЕРСОНАЖЕЙ
              </h2>
              <p className='text-sm text-indigo-300/60'>
                Всего записей:{' '}
                <span className='font-semibold text-indigo-300'>
                  {totalCount}
                </span>
              </p>
            </div>
          </div>

          <select
            value={selectedCategory || ''}
            onChange={handleCategoryChange}
            className='rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 transition-colors outline-none focus:border-indigo-500/50'
          >
            <option value=''>Все категории</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Таблица */}
      <motion.div
        variants={sectionVariants}
        className='overflow-hidden rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs'
      >
        <div className='max-h-[70vh] overflow-y-auto'>
          <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-1'>
            {purchases.length > 0 ? (
              purchases.map((purchase: CharacterPurchaseProps) => (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='flex flex-col gap-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 transition-all hover:border-indigo-500/30 hover:bg-indigo-500/10'
                >
                  <div className='flex flex-col gap-4 md:flex-row'>
                    {/* Изображение */}
                    <div className='flex-shrink-0'>
                      <Image
                        src={
                          purchase.shop_item.image
                          || 'https://dummyimage.com/300/200'
                        }
                        alt={purchase.shop_item.name}
                        width={120}
                        height={120}
                        className='rounded-lg object-cover'
                      />
                    </div>

                    {/* Информация */}
                    <div className='flex flex-1 flex-col justify-between gap-3'>
                      <div>
                        <h3 className='font-semibold text-indigo-300'>
                          {purchase.shop_item.name}
                        </h3>
                        <p className='text-xs text-indigo-300/60'>
                          {purchase.shop_item.category.name}
                        </p>
                      </div>

                      <div className='grid grid-cols-2 gap-3 text-sm md:grid-cols-4'>
                        <div>
                          <p className='text-xs text-indigo-300/60'>Цена</p>
                          <p className='font-semibold text-indigo-300'>
                            {purchase.price} ₽
                          </p>
                        </div>
                        <div>
                          <p className='text-xs text-indigo-300/60'>
                            Количество
                          </p>
                          <p className='font-semibold text-indigo-300'>
                            {purchase.number}
                          </p>
                        </div>
                        <div>
                          <p className='text-xs text-indigo-300/60'>Скидка</p>
                          <p
                            className={`font-semibold ${
                              purchase.discount > 0
                                ? 'text-red-400'
                                : 'text-indigo-300'
                            }`}
                          >
                            {purchase.discount > 0
                              ? `${purchase.discount}%`
                              : '0%'}
                          </p>
                        </div>
                        <div>
                          <p className='text-xs text-indigo-300/60'>Сумма</p>
                          <p className='font-semibold text-indigo-300'>
                            {purchase.total_sum} ₽
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Статус */}
                    <div className='flex flex-col items-end justify-between'>
                      <StatusCell
                        status={purchase.status}
                        recordId={purchase.id}
                        onUpdate={refetchPurchases}
                      />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className='flex items-center justify-center p-8 text-indigo-300/60'>
                Нет записей для отображения
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

AdminCharacterPurchase.displayName = 'AdminCharacterPurchase'

export default AdminCharacterPurchase
