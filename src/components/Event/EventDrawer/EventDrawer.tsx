'use client'

import type { FCC, ReactQueryFetch } from 'src/types'
import type { EventProps } from '@/models/Event'
import type { GameWorldStoryProps } from '@/models/GameWorldStory'
import { DollarOutlined, TrophyOutlined } from '@ant-design/icons'
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import React, { useContext } from 'react'
import { DateTimeCalendar } from '@/components/_base/DateTimeCalendar'
import { FileUpload } from '@/components/_base/FileUpload'
import { CurrentUserContext } from '@/components/CurrentUserProvider/CurrentUserContext'
import { CharacterRole } from '@/models/Character'
import { CharacterEvent } from '@/models/CharacterEvent'
import { CharacterEventForInspector } from '@/models/CharacterEventForInspector'
import { useExtraActionsPut, useFetchOneItem } from '@/services/base/hooks'

const { TextArea } = Input
const { Text, Title, Paragraph } = Typography

interface EventDrawerProps {
  itemId?: number
  open: boolean
  onClose: () => void
  width?: number
  onComplete?: () => void
}

const MODEL_CHARACTER_EVENTS = CharacterEvent
const CHARACTER_EVENT_MODEL = CharacterEventForInspector

const EventDrawer: FCC<EventDrawerProps> = ({
  open,
  itemId,
  onClose,
  width = 700,
  onComplete,
}) => {
  const t = useTranslations('EventDrawer')
  const [userForm] = Form.useForm()
  const [hrForm] = Form.useForm()
  const { currentUser } = useContext(CurrentUserContext)

  const {
    data: response,
    isLoading,
    refetch,
  }: ReactQueryFetch<EventProps> | any = useFetchOneItem({
    model: MODEL_CHARACTER_EVENTS,
    id: itemId,
    qKey: 'eventDrawer',
    options: {
      queryKey: ['eventDrawer', itemId],
      enabled: !!itemId && open,
    },
  })

  const { mutate: updateForInspector } = useExtraActionsPut(
    'update_for_inspector',
  )
  const handleInspectorUpdate = (values: {
    inspector_comment?: string
    status?: string
  }) => {
    updateForInspector(
      [CHARACTER_EVENT_MODEL.updateForInspectorUrl(itemId as number), values],
      {
        onSuccess: () => {
          refetch()
          onComplete?.()
        },
      },
    )
  }

  const { mutate: updateForCharacter } = useExtraActionsPut('user_events')
  const handleCharacterUpdate = (values: { result: string }) => {
    updateForCharacter(
      [MODEL_CHARACTER_EVENTS.updateForCharacterUrl(itemId as number), values],
      {
        onSuccess: () => {
          refetch()
          onComplete?.()
        },
      },
    )
  }

  const getStatusColor = () => {
    switch (response?.data?.status) {
      case 'IN_PROGRESS':
        return 'blue'
      case 'COMPLETED':
        return 'green'
      case 'NEED_IMPROVEMENT':
        return 'orange'
      case 'PENDING_REVIEW':
        return 'purple'
      case 'FAILED':
        return 'red'
      default:
        return 'default'
    }
  }

  const isHR = currentUser?.active_character_role === CharacterRole.HR

  const canSubmitResult = () => {
    return (
      response?.data?.status === 'IN_PROGRESS'
      || response?.data?.status === 'NEED_IMPROVEMENT'
      || response?.data?.status === 'FAILED'
    )
  }

  const handleFileChange = () => {
    refetch()
  }

  return (
    <Drawer
      loading={isLoading}
      title={response?.data?.event?.name}
      placement='right'
      onClose={onClose}
      open={open}
      width={width}
      extra={
        <Tag color={getStatusColor()}>
          {response?.data?.status_display_name}
        </Tag>
      }
    >
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        {/* Описание */}
        <div>
          <Title level={5}>{t('event_description')}</Title>
          <Paragraph>{response?.data?.event?.description}</Paragraph>
        </div>

        {/* Связанные истории мира */}
        {response?.data?.event?.game_world_stories
          && response?.data?.event?.game_world_stories.length > 0
          ? (
              <>
                <Divider size='small' />
                <div>
                  <Title level={5}>{t('related_stories')}</Title>
                  <Space
                    direction='vertical'
                    size='small'
                    style={{ width: '100%' }}
                  >
                    {response?.data?.event?.game_world_stories.map(
                      (story: GameWorldStoryProps) => (
                        <Text key={story.id}>{story.text || story.id}</Text>
                      ),
                    )}
                  </Space>
                </div>
              </>
            )
          : null}

        <Divider size='small' />

        {/* Награды */}
        <div>
          <Title level={5}>{t('rewards')}</Title>
          <Space size='large'>
            <Space>
              <TrophyOutlined style={{ color: '#faad14' }} />
              <Text>
                {response?.data?.event?.experience?.toLocaleString()}{' '}
                {t('experience')}
              </Text>
            </Space>
            <Space>
              <DollarOutlined style={{ color: '#52c41a' }} />
              <Text>
                {response?.data?.event?.currency?.toLocaleString()} {t('coins')}
              </Text>
            </Space>
          </Space>
        </div>

        <Divider size='small' />

        {/* Информация о событии */}
        <div>
          <Title level={5}>{t('information')}</Title>
          <Space direction='vertical' size='small' style={{ width: '100%' }}>
            <Text>
              <strong>{t('category')}:</strong>{' '}
              {response?.data?.event?.category?.name}
            </Text>
            <Text>
              <strong>{t('time_to_complete')}:</strong>{' '}
              {response?.data?.time_to_complete} {t('minutes')}
            </Text>
          </Space>
        </div>

        <Divider size='small' />

        {/* Временные рамки */}
        <div>
          <Title level={5}>{t('timeframe')}</Title>
          <Space direction='vertical' size='small' style={{ width: '100%' }}>
            <Text>
              <DateTimeCalendar
                text={t('start_date')}
                datetime={response?.data?.start_datetime as string}
              />
            </Text>
            {response?.data?.end_datetime && (
              <Text>
                <DateTimeCalendar
                  text={t('end_date')}
                  datetime={response?.data?.end_datetime as string}
                />
              </Text>
            )}
          </Space>
        </div>

        {/* Описание категории */}
        {response?.data?.event?.category?.description && (
          <>
            <Divider size='small' />
            <div>
              <Title level={5}>
                {t('about_category', {
                  categoryName: response?.data?.event?.category?.name,
                })}
              </Title>
              <Paragraph type='secondary'>
                {response?.data?.event?.category?.description}
              </Paragraph>
            </div>
          </>
        )}

        <Divider size='small' />

        {/* Форма для пользователя */}
        {!isHR && (
          <div>
            <Title level={5}>{t('event_results')}</Title>
            <Form
              form={userForm}
              initialValues={response?.data}
              layout='vertical'
              onFinish={handleCharacterUpdate}
            >
              <Form.Item
                label={t('result_description')}
                name='result'
                rules={[
                  {
                    required: true,
                    message: t('result_description_required'),
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  disabled={!canSubmitResult()}
                  placeholder={t('result_description_placeholder')}
                  maxLength={1000}
                  showCount
                />
              </Form.Item>

              <Form.Item label={t('attachments')}>
                <FileUpload
                  disabled={!canSubmitResult()}
                  fileList={response?.data?.multimedia}
                  object_id={itemId as number}
                  content_type_id={response?.data?.content_type_id as number}
                  maxSize={10}
                  onChange={handleFileChange}
                />
              </Form.Item>

              {canSubmitResult() && (
                <Form.Item>
                  <Button size='large' type='primary' block htmlType='submit'>
                    {response?.data?.status === 'IN_PROGRESS'
                      && t('to_pending_review')}
                    {response?.data?.status === 'NEED_IMPROVEMENT'
                      && t('resubmit')}
                    {response?.data?.status === 'FAILED' && t('retry')}
                  </Button>
                </Form.Item>
              )}
            </Form>
          </div>
        )}

        {/* Форма для HR */}
        {isHR && (
          <div>
            <Title level={5}>{t('event_results')}</Title>

            {/* Результаты пользователя (read-only) */}
            <div style={{ marginBottom: 16 }}>
              <Text strong>{t('result_description')}:</Text>
              <Paragraph style={{ marginTop: 8 }}>
                {response?.data?.result || t('no_result_yet')}
              </Paragraph>
            </div>

            {response?.data?.multimedia
              && response?.data?.multimedia.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <FileUpload
                  fileList={response?.data?.multimedia}
                  object_id={itemId as number}
                  content_type_id={response?.data?.content_type_id as number}
                  maxSize={10}
                  disabled={true}
                  onChange={handleFileChange}
                />
              </div>
            )}

            <Divider size='small' />

            {/* Форма проверки HR */}
            <Form
              form={hrForm}
              initialValues={response?.data}
              layout='vertical'
              onFinish={handleInspectorUpdate}
            >
              <Form.Item
                label={t('inspector_comment')}
                name='inspector_comment'
              >
                <TextArea
                  rows={3}
                  placeholder={t('inspector_comment_placeholder')}
                  maxLength={500}
                  showCount
                />
              </Form.Item>

              <Form.Item
                label={t('status')}
                name='status'
                rules={[
                  {
                    required: true,
                    message: t('status_required'),
                  },
                ]}
              >
                <Select
                  placeholder={t('select_status')}
                  options={[
                    { value: 'PENDING_REVIEW', label: t('pending_review') },
                    {
                      value: 'NEED_IMPROVEMENT',
                      label: t('need_improvement'),
                    },
                    { value: 'COMPLETED', label: t('completed') },
                  ]}
                />
              </Form.Item>

              <Form.Item>
                <Button size='large' type='primary' block htmlType='submit'>
                  {t('apply')}
                </Button>
              </Form.Item>
            </Form>

            {/* Кнопка закрыть вне формы */}
            <Button size='large' block onClick={onClose}>
              {t('close')}
            </Button>
          </div>
        )}
      </Space>
    </Drawer>
  )
}

EventDrawer.displayName = 'EventDrawer'

export default EventDrawer
