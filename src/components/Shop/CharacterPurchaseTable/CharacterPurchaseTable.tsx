'use client'

import type { ColumnsType } from 'antd/es/table'
import type { FCC } from '@/types'
import { Table } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useContext } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Select } from '@/components/_base/Select'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { useCharacterPurchaseColumns } from '@/components/Shop/CharacterPurchaseTable/useCharacterPurchaseColumns'
import { useFilter } from '@/hooks/useFilter'
import { CharacterPurchase } from '@/models/CharacterPurchase'
import { ShopItemCategory } from '@/models/ShopItemCategory'

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

const MODEL = CharacterPurchase
const SHOP_ITEM_CATEGORY_MODEL = ShopItemCategory

const CharacterPurchaseTable: FCC = () => {
  const { currentUser } = useContext(CurrentUserContext)
  const { columns } = useCharacterPurchaseColumns(
    currentUser?.active_game_world_currency_name,
  )
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
        renderItems={({ data, isLoading }) => (
          <Table<CharacterPurchaseProps>
            columns={columns as ColumnsType<any>}
            dataSource={data?.map((item) => ({ ...item, key: item.id })) || []}
            loading={isLoading}
            pagination={false}
            scroll={{ x: true }}
          />
        )}
      />
    </CardWrapper>
  )
}

CharacterPurchaseTable.displayName = 'CharacterPurchaseTable'

export default CharacterPurchaseTable
