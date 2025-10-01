import type { TableProps } from 'antd'
import type { CharacterPurchaseProps } from '@/models/CharacterPurchase'
import { Tag } from 'antd'
import Image from 'next/image'

// eslint-disable-next-line react-hooks-extra/no-unnecessary-use-prefix
export const useCharacterPurchaseColumns = (
  active_game_world_currency_name: string,
) => {
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
      title: `Цена (${active_game_world_currency_name})`,
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price}`,
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
      title: `Общая сумма (${active_game_world_currency_name})`,
      dataIndex: 'total_sum',
      key: 'total_sum',
      render: (total_sum) => `${total_sum}`,
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

  return { columns }
}
