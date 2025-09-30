'use client'

import type { FCC } from 'src/types'
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Card, Modal, Row, Space, Tag, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'
import { TooltipButton } from '@/components/_base/TooltipButton'
import styles from './ShopItemCard.module.scss'

const { Title, Text, Paragraph } = Typography
const { Meta } = Card

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
  children: any[]
}

const ShopItemCard: FCC<ShopItemProps> = ({
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
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const t = useTranslations('ShopItem')

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    setModalOpen(true)
  }

  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Здесь будет логика покупки
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  return (
    <>
      <Card
        hoverable
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        cover={
          <div className={styles.imageWrapper}>
            <Image
              src={image || 'https://dummyimage.com/300/200'}
              alt={name}
              width={300}
              height={200}
              className={styles.cardImage}
              style={{ objectFit: 'cover' }}
            />
          </div>
        }
        actions={[
          <TooltipButton
            tooltip={t('view_details')}
            key='view'
            type='text'
            size='large'
            icon={<EyeOutlined />}
            onClick={handleViewDetails}
          />,
          <TooltipButton
            tooltip={t('purchase')}
            key='purchase'
            type='text'
            size='large'
            icon={<ShoppingCartOutlined />}
            onClick={handlePurchase}
            disabled={!is_active}
          />,
        ]}
      >
        <Meta
          title={
            <Row justify='space-between'>
              <Title level={5}>{name}</Title>
              <Text className={styles.price}>
                {formatPrice(price)} {t('points')}
              </Text>
            </Row>
          }
          description={
            <div className={styles.cardDescription}>
              <Paragraph
                ellipsis={{ rows: 2, tooltip: description }}
                className={styles.description}
              >
                {description}
              </Paragraph>
              <div className={styles.categoryInfo}>
                <Text type='secondary'>
                  <Tag color={category.color}>{category.name}</Tag>
                </Text>
                {!is_active
                  ? (
                      <Text type='warning' className={styles.inactive}>
                        {t('inactive')}
                      </Text>
                    )
                  : null}
              </div>
            </div>
          }
        />
      </Card>

      <Modal
        title={name}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key='cancel' onClick={() => setModalOpen(false)}>
            {t('close')}
          </Button>,
          <Button
            key='purchase'
            type='primary'
            icon={<ShoppingCartOutlined />}
            onClick={handlePurchase}
            disabled={!is_active}
          >
            {t('purchase_for')} {formatPrice(price)} {t('points')}
          </Button>,
        ]}
        width={600}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalImageWrapper}>
            <Image
              src={image || 'https://dummyimage.com/400/300'}
              alt={name}
              width={400}
              height={300}
              className={styles.modalImage}
              style={{ objectFit: 'cover' }}
            />
          </div>

          <Space
            direction='vertical'
            size='middle'
            className={styles.modalInfo}
          >
            <Space direction='horizontal'>
              <Text strong>{t('description')}:</Text>
              <Text>{description}</Text>
            </Space>

            <Space direction='horizontal'>
              <Text strong>{t('category')}:</Text>
              <Text> {category.name}</Text>
            </Space>

            <Space direction='horizontal'>
              <Text strong>{t('price')}:</Text>
              <Text>
                {formatPrice(price)} {t('points')}
              </Text>
            </Space>

            {start_datetime && (
              <Space direction='horizontal'>
                <Text strong>{t('start_date')}:</Text>
                <Text> {new Date(start_datetime).toLocaleString('ru-RU')}</Text>
              </Space>
            )}

            {end_datetime && (
              <Space direction='horizontal'>
                <Text strong>{t('end_date')}:</Text>
                <Text> {new Date(end_datetime).toLocaleString('ru-RU')}</Text>
              </Space>
            )}

            {purchase_restriction && (
              <Space direction='horizontal'>
                <Text strong>{t('restrictions')}:</Text>
                <Text> {purchase_restriction}</Text>
              </Space>
            )}

            {number > 0 && (
              <Space direction='horizontal'>
                <Text strong>{t('available_quantity')}:</Text>
                <Text> {number}</Text>
              </Space>
            )}

            <Space direction='horizontal'>
              <Text strong>{t('status')}:</Text>
              <Text type={is_active ? 'success' : 'danger'}>
                {is_active ? t('active') : t('inactive')}
              </Text>
            </Space>
          </Space>
        </div>
      </Modal>
    </>
  )
}

ShopItemCard.displayName = 'ShopItemCard'

export default ShopItemCard
