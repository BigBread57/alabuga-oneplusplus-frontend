'use client'

import type { FCC } from 'src/types'
import type { CharacterPurchaseProps } from '@/models/CharacterPurchase'
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'
import { TooltipButton } from '@/components/_base/TooltipButton'
import useMessage from '@/hooks/useMessages'
import { CharacterPurchase } from '@/models/CharacterPurchase'
import { useCreateItem } from '@/services/base/hooks'
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
  active_game_world_currency_name: string
  children: any[]
  onSuccess?: () => void
}

const ShopItemCard: FCC<ShopItemProps> = ({
  id,
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
  onSuccess,
  active_game_world_currency_name,
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [form] = Form.useForm()
  const t = useTranslations('ShopItem')
  const { messageSuccess, messageError } = useMessage()

  const { mutate: createItem, isPending } = useCreateItem(CharacterPurchase)

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    setModalOpen(true)
  }

  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation()
    setModalOpen(false)
    setPurchaseModalOpen(true)
  }

  const handlePurchaseSubmit = (
    values: Pick<CharacterPurchaseProps, 'number'>,
  ) => {
    const purchaseData: Partial<CharacterPurchaseProps> = {
      number: values.number,
      shop_item: id as number,
    }

    createItem(purchaseData, {
      onSuccess: () => {
        messageSuccess()
        form.resetFields()
        setPurchaseModalOpen(false)
        setModalOpen(false)
        onSuccess?.()
      },
      onError: (error: any) => {
        console.error('Purchase error:', error)
        // Обработка ошибок в формате массива
        if (Array.isArray(error?.response?.data?.errors)) {
          const errors = error?.response?.data?.errors
          errors.forEach(
            (err: { code: string, detail: string, attr: string | null }) => {
              messageError(err.detail || t('purchase_error'))
            },
          )
        } else if (error?.response?.data?.detail) {
          // Обработка одиночной ошибки
          messageError(error.response.data.detail)
        } else if (error?.message) {
          messageError(error.message)
        } else {
          messageError(t('purchase_error'))
        }
      },
    })
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
              <Col xs={24}>
                <Text>{t('price')}: </Text>
                {formatPrice(price)}
              </Col>
              <Col xs={24}>
                <Text>{t('currency')}: </Text>
                {active_game_world_currency_name}
              </Col>
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

      {/* Модалка с деталями товара */}
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
            {t('purchase_for')} {formatPrice(price)}{' '}
            {active_game_world_currency_name}
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
                {formatPrice(price)} {active_game_world_currency_name}
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

      {/* Модалка покупки */}
      <Modal
        title={t('purchase_item')}
        open={purchaseModalOpen}
        onCancel={() => {
          setPurchaseModalOpen(false)
          form.resetFields()
        }}
        footer={null}
        width={400}
      >
        <Form
          form={form}
          onFinish={handlePurchaseSubmit}
          layout='vertical'
          initialValues={{ number: 1 }}
        >
          <Form.Item
            label={t('quantity')}
            name='number'
            rules={[
              { required: true, message: t('quantity_required') },
              { type: 'number', min: 1, message: t('min_quantity') },
              ...(number > 0
                ? [
                    {
                      type: 'number' as const,
                      max: number,
                      message: t('max_quantity'),
                    },
                  ]
                : []),
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              max={number > 0 ? number : undefined}
              placeholder={t('enter_quantity')}
            />
          </Form.Item>

          <Space
            direction='vertical'
            size='small'
            style={{ width: '100%', marginBottom: 16 }}
          >
            <Text>
              <Text strong>{t('price_per_item')}:</Text> {formatPrice(price)} (
              {active_game_world_currency_name})
            </Text>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.number !== currentValues.number}
            >
              {({ getFieldValue }) => {
                const quantity = getFieldValue('number') || 1
                const total = price * quantity
                return (
                  <Text>
                    <Text strong>{t('total')}:</Text> {formatPrice(total)}{' '}
                  </Text>
                )
              }}
            </Form.Item>
          </Space>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setPurchaseModalOpen(false)
                  form.resetFields()
                }}
              >
                {t('cancel')}
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                loading={isPending}
                icon={<ShoppingCartOutlined />}
              >
                {t('confirm_purchase')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

ShopItemCard.displayName = 'ShopItemCard'

export default ShopItemCard
