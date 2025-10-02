'use client'

import type { TableProps } from 'antd'
import type { FCC } from 'src/types'
import { Button, Input, Select, Space, Table, Tag } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Select as CustomSelect } from '@/components/_base/Select'
import { useFilter } from '@/hooks/useFilter'
import { CharacterPurchase } from '@/models/CharacterPurchase'
import { ShopItemCategory } from '@/models/ShopItemCategory'
import styles from './AdminCharacterPurchase.module.scss'

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

const updatePurchaseStatus = async (
  purchaseId: number,
  status: string,
  additionalInfo: string,
) => {
  return purchaseId + status + additionalInfo
  // Реализуйте вызов к вашему API
  // Пример:
  // return await api.patch(`/purchases/${purchaseId}`, {
  //   status,
  //   additional_info: additionalInfo
  // });
}

// Отдельный компонент для ячейки статуса
const StatusCell: React.FC<{
  status: string
  recordId: number
}> = ({ status, recordId }) => {
  const [currentStatus, setCurrentStatus] = useState(status)
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const t = useTranslations('CharacterPurchaseTable')

  const statusConfig = {
    PENDING: { color: 'orange', text: t('pending') },
    DELIVERED: { color: 'green', text: t('delivered') },
  }

  const config = statusConfig[currentStatus as keyof typeof statusConfig] || {
    color: 'default',
    text: currentStatus,
  }

  const handleStatusUpdate = async () => {
    try {
      await updatePurchaseStatus(recordId, currentStatus, additionalInfo)
      setIsEditing(false)
      setAdditionalInfo('')
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
      <div style={{ maxWidth: '200px' }}>
        <Select
          value={currentStatus}
          onChange={setCurrentStatus}
          style={{ width: '100%', marginBottom: '8px' }}
        >
          <Select.Option value='PENDING'>t('pending')</Select.Option>
          <Select.Option value='DELIVERED'>t('delivered')</Select.Option>
        </Select>

        <Input.TextArea
          placeholder='Дополнительная информация...'
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          rows={2}
          style={{ marginBottom: '8px' }}
        />

        <Space>
          <Button type='primary' size='small' onClick={handleStatusUpdate}>
            Сохранить
          </Button>
          <Button size='small' onClick={handleCancel}>
            Отмена
          </Button>
        </Space>
      </div>
    )
  }

  return (
    <div>
      <Tag
        color={config.color}
        style={{ marginBottom: '8px', cursor: 'pointer' }}
        onClick={() => setIsEditing(true)}
      >
        {config.text}
      </Tag>
      <div>
        <Button type='link' size='small' onClick={() => setIsEditing(true)}>
          Изменить статус
        </Button>
      </div>
    </div>
  )
}

const MODEL = CharacterPurchase
const SHOP_ITEM_CATEGORY_MODEL = ShopItemCategory

const AdminCharacterPurchase: FCC = () => {
  const [filter, setFilter] = useFilter({})

  const handleSingleChange = (value: number | string | any) => {
    setFilter({ shop_item_category: value })
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
      render: (status, record) => (
        <StatusCell status={status} recordId={record.id} />
      ),
    },
  ]

  return (
    <CardWrapper
      title='ПОКУПКИ ПЕРСОНАЖЕЙ'
      style={{
        height: '80vh',
      }}
      extra={
        <CustomSelect
          url={`${SHOP_ITEM_CATEGORY_MODEL.url()}?limit=1000&offset=0`}
          qKey='users-select'
          placeholder='Выберите категорию товара'
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

AdminCharacterPurchase.displayName = 'AdminCharacterPurchase'

export default AdminCharacterPurchase
