'use client'

import type { FCC } from 'src/types'
import { Col, Row } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useContext } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Select } from '@/components/_base/Select'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import ShopItemCard from '@/components/Shop/ShopItemCard/ShopItemCard'
import { useFilter } from '@/hooks/useFilter'
import { ShopItem } from '@/models/ShopItem'
import { ShopItemCategory } from '@/models/ShopItemCategory'

const MODEL = ShopItem
const SHOP_ITEM_CATEGORY_MODEL = ShopItemCategory
const ShopItemsCard: FCC = () => {
  const t = useTranslations('ShopItem')
  const [filter, setFilter] = useFilter({})
  const { currentUser } = useContext(CurrentUserContext)
  const handleSingleChange = (value: number | string | any) => {
    setFilter({ category: value })
  }
  return (
    <CardWrapper
      title={t('shop_items').toUpperCase()}
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
        defFilters={{ ...filter }}
        renderItems={({ data, refetch }) => (
          <Row gutter={[16, 16]} justify='start'>
            {data?.map((shop_item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={shop_item.id}>
                <ShopItemCard
                  key={shop_item.id}
                  {...shop_item}
                  active_game_world_currency_name={
                    currentUser?.active_game_world_currency_name
                  }
                  onSuccess={refetch}
                />
              </Col>
            ))}
          </Row>
        )}
      />
    </CardWrapper>
  )
}

ShopItemsCard.displayName = 'ShopItemsCard'

export default ShopItemsCard
