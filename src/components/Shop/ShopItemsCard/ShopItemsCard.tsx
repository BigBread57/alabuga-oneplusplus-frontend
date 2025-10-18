'use client'

import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import React, { useContext } from 'react'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Select } from '@/components/_base/Select'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import ShopItemCard from '@/components/Shop/ShopItemCard/ShopItemCard'
import { useFilter } from '@/hooks/useFilter'
import { ShopItem } from '@/models/ShopItem'
import { ShopItemCategory } from '@/models/ShopItemCategory'

const MODEL = ShopItem
const SHOP_ITEM_CATEGORY_MODEL = ShopItemCategory

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

const ShopItemsCard: FCC = () => {
  const t = useTranslations('ShopItem')
  const [filter, setFilter] = useFilter({})
  const { currentUser } = useContext(CurrentUserContext)

  const handleSingleChange = (value: number | string | any) => {
    setFilter({ category: value })
  }

  return (
    <motion.div
      variants={sectionVariants}
      initial='hidden'
      animate='visible'
      className='flex h-[70vh] flex-col overflow-y-auto rounded-2xl border border-indigo-500/20 bg-transparent backdrop-blur-xs'
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
            url={`${SHOP_ITEM_CATEGORY_MODEL.url()}?limit=1000&offset=0`}
            qKey='users-select'
            placeholder={t('select_shop_item_category')}
            valueKey='id'
            allowClear
            labelKey='name'
            style={{
              width: '100%',
            }}
            onChange={handleSingleChange}
          />
        </motion.div>
      </div>
      {/* Контент */}
      <div className='flex-1 overflow-y-auto p-4 md:p-6 '>
        <FetchMoreItemsComponent
          model={MODEL}
          defFilters={{ ...filter }}
          renderItems={({ data, refetch }) => (
            <motion.div
              variants={sectionVariants}
              initial='hidden'
              animate='visible'
            >
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {data?.map((shop_item, index) => (
                  <motion.div
                    key={shop_item.id}
                    variants={itemVariants}
                    custom={index}
                    initial='hidden'
                    animate='visible'
                    transition={{
                      delay: index * 0.05,
                    }}
                  >
                    <ShopItemCard
                      {...shop_item}
                      active_game_world_currency_name={
                        currentUser?.active_game_world_currency_name
                      }
                      onSuccess={refetch}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        />
      </div>
    </motion.div>
  )
}

ShopItemsCard.displayName = 'ShopItemsCard'

export default ShopItemsCard
