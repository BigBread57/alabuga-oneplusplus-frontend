'use client'

import type { TableProps } from 'antd'
import type { FCC } from '@/types'
import { Table, Tag } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Select } from '@/components/_base/Select'
import { useFilter } from '@/hooks/useFilter'
import { CharacterPurchase } from '@/models/CharacterPurchase'
import { ShopItemCategory } from '@/models/ShopItemCategory'
import styles from './CharacterPurchaseTable.module.scss'

interface CharacterPurchaseProps {
  key?: React.Key
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

const columns: TableProps<CharacterPurchaseProps>['columns'] = [
  {
    title: 'Изображение',
    dataIndex: 'shop_item',
    key: 'image',
    render: (shop_item) => {
      return (
        <Image
          src={shop_item.image || 'https://dummyimage.com/300/200'}
          alt={shop_item.name}
          width={100}
          height={100}
          className={styles.shopItemImage}
        />
      )
    },
  },
  {
    title: 'Товар',
    dataIndex: 'shop_item',
    key: 'shop_item',
    render: (shop_item) => (
      <div>
        <div>{shop_item.name}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          {shop_item.category.name}
        </div>
      </div>
    ),
  },
  {
    title: 'Цена',
    dataIndex: 'price',
    key: 'price',
    render: (price) => `${price} ₽`,
  },
  {
    title: 'Количество',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Скидка',
    key: 'discount',
    render: (_, record) => {
      const discount = record.discount

      return (
        <span style={{ color: discount > 0 ? '#ff4d4f' : '#000' }}>
          {discount > 0 ? `${discount}%` : '0%'}
        </span>
      )
    },
  },
  {
    title: 'Общая сумма',
    dataIndex: 'total_sum',
    key: 'total_sum',
    render: (total_sum) => `${total_sum} ₽`,
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const statusConfig = {
        PENDING: { color: 'orange', text: 'Ожидание' },
        DELIVERED: { color: 'green', text: 'Завершено' },
      }

      const config = statusConfig[status as keyof typeof statusConfig] || {
        color: 'default',
        text: status,
      }

      return <Tag color={config.color}>{config.text}</Tag>
    },
  },
]

const MODEL = CharacterPurchase
const SHOP_ITEM_CATEGORY_MODEL = ShopItemCategory

const CharacterPurchaseTable: FCC = () => {
  const t = useTranslations('CharacterPurchaseTable')
  const [filter, setFilter] = useFilter({})

  const handleSingleChange = (value: number | string | any) => {
    setFilter({ shop_item_category: value })
  }

  return (
    <CardWrapper
      title={t('character_purchases').toUpperCase()}
      extra={
        <Select
          url={`${SHOP_ITEM_CATEGORY_MODEL.url()}?limit=1000&offset=0`}
          qKey='users-select'
          placeholder={t('select_shop_item_category')}
          valueKey='id'
          allowClear
          labelKey='name'
          style={{
            width: 300,
          }}
          onChange={handleSingleChange}
        />
      }
    >
      <FetchMoreItemsComponent
        model={MODEL}
        defFilters={{ filter }}
        options={{
          pageSize: 10,
        }}
        renderItems={({ data, isLoading, dataCount }) => (
          <div>
            {/* Можно показать общее количество */}
            {dataCount !== undefined && (
              <div style={{ marginBottom: 16 }}>
                Найдено записей: {dataCount}
              </div>
            )}

            <Table<CharacterPurchaseProps>
              columns={columns}
              dataSource={
                data?.map((item) => ({ ...item, key: item.id })) || []
              }
              loading={isLoading}
              pagination={false}
              scroll={{ x: true }}
            />
          </div>
        )}
      />
    </CardWrapper>
  )
}

CharacterPurchaseTable.displayName = 'CharacterPurchaseTable'

export default CharacterPurchaseTable
