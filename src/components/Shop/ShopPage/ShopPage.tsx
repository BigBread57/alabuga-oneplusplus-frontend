import type { FCC } from 'src/types'
import React from 'react'
import { CharacterPurchaseTable } from '@/components/Shop/CharacterPurchaseTable'
import { ShopItemsCard } from '@/components/Shop/ShopItemsCard'

const ShopPage: FCC = () => {
  return (
    <>
      <ShopItemsCard />
      <CharacterPurchaseTable />
    </>
  )
}

ShopPage.displayName = 'ShopPage'

export default ShopPage
