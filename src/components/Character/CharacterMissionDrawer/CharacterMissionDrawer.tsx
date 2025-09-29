'use client'

import type { FCC, ReactQueryFetch } from 'src/types'
import type { CharacterMissionProps } from '@/models/CharacterMission'
import type { GameWorldStoryProps } from '@/models/GameWorldStory'
import { DollarOutlined, TrophyOutlined } from '@ant-design/icons'
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { DateTimeCalendar } from '@/components/_base/DateTimeCalendar'
import { FileUpload } from '@/components/_base/FileUpload'
import { CharacterMission } from '@/models/CharacterMission'
import { useExtraActionsPut, useFetchOneItem } from '@/services/base/hooks'

const { Text, Title, Paragraph } = Typography
const { TextArea } = Input

interface CharacterMissionDrawerProps {
  itemId?: number
  open: boolean
  onClose: () => void
  onComplete?: () => void
  width?: number
}

const MODEL_MISSIONS = CharacterMission

const CharacterMissionDrawer: FCC<CharacterMissionDrawerProps> = ({
  open,
  itemId,
  onComplete,
  onClose,
  width = 700,
}) => {
  const t = useTranslations('MissionCard')
  const [form] = Form.useForm()

  const {
    data: response,
    isLoading,
    refetch,
  }: ReactQueryFetch<CharacterMissionProps> | any = useFetchOneItem({
    model: MODEL_MISSIONS,
    id: itemId,
    qKey: 'characterMissionDrawer',
    options: {
      queryKey: ['characterMissionDrawer', itemId],
      enabled: !!itemId && open,
    },
  })

  const { mutate } = useExtraActionsPut('user_missions')
  const handleUpdate = (id: number, values: Partial<CharacterMissionProps>) => {
    mutate([MODEL_MISSIONS.updateForCharacterUrl(id), values], {
      onSuccess: () => {
        refetch()
      },
    })
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

  const handleComplete = (values: { result: string }) => {
    handleUpdate(itemId as number, values)
    form.resetFields()
    onComplete?.()
  }

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
      title={response?.data?.mission.name}
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
          <Title level={5}>{t('mission_description')}</Title>
          <Paragraph>{response?.data?.mission.description}</Paragraph>
        </div>
        {/* Связанные истории мира */}
        {response?.data?.mission?.game_world_stories
          && response?.data?.mission?.game_world_stories.length > 0
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
                    {response?.data?.mission?.game_world_stories.map(
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
                {response?.data?.mission.experience.toLocaleString()}{' '}
                {t('experience')}
              </Text>
            </Space>
            <Space>
              <DollarOutlined style={{ color: '#52c41a' }} />
              <Text>
                {response?.data?.mission.currency.toLocaleString()} {t('coins')}
              </Text>
            </Space>
          </Space>
        </div>

        <Divider size='small' />

        {/* Информация о ветке */}
        <div>
          <Title level={5}>{t('information')}</Title>
          <Space direction='vertical' size='small' style={{ width: '100%' }}>
            <Text>
              <strong>{t('branch')}:</strong>{' '}
              {response?.data?.mission.branch.name}
            </Text>
            <Text>
              <strong>{t('category')}:</strong>{' '}
              {response?.data?.mission.branch.category.name}
            </Text>
            <Text>
              <strong>{t('order')}:</strong> #{response?.data?.mission.order}
            </Text>
            <Text>
              <strong>{t('level')}:</strong> {response?.data?.mission.level}
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
            <Text>
              <DateTimeCalendar
                text={t('end_date')}
                datetime={response?.data?.end_datetime as string}
              />
            </Text>
          </Space>
        </div>

        {/* Описание ветки */}
        <div>
          <Title level={5}>
            {t('about_branch', {
              branchName: response?.data?.mission?.branch?.name,
            })}
          </Title>
          <Paragraph type='secondary'>
            {response?.data?.mission.branch?.description}
          </Paragraph>
        </div>

        {/* Блок для результатов выполнения */}
        {canSubmitResult() && (
          <>
            <Divider size='small' />
            <div>
              <Title level={5}>{t('mission_results')}</Title>
              <Form
                initialValues={response?.data}
                form={form}
                layout='vertical'
                onFinish={handleComplete}
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
                    placeholder={t('result_description_placeholder')}
                    value={response?.data?.result}
                    maxLength={1000}
                    showCount
                  />
                </Form.Item>

                <Form.Item label={t('attachments')}>
                  <FileUpload
                    fileList={response?.data?.multimedia}
                    object_id={itemId as number}
                    content_type_id={response?.data?.content_type_id as number}
                    maxSize={10}
                    onChange={handleFileChange}
                  />
                </Form.Item>
                <Form.Item>
                  {/* Кнопки действий */}
                  <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                    <Space
                      direction='vertical'
                      style={{ width: '100%' }}
                      size='middle'
                    >
                      {canSubmitResult() && (
                        <Button
                          size='large'
                          type='primary'
                          block
                          htmlType='submit'
                        >
                          {response?.data?.status === 'IN_PROGRESS'
                            && t('to_pending_review')}
                          {response?.data?.status === 'NEED_IMPROVEMENT'
                            && t('resubmit')}
                          {response?.data?.status === 'FAILED' && t('retry')}
                        </Button>
                      )}

                      {response?.data?.status === 'COMPLETED' && (
                        <Button size='large' block disabled>
                          {t('completed')}
                        </Button>
                      )}

                      {response?.data?.status === 'PENDING_REVIEW' && (
                        <Button size='large' block disabled>
                          {t('pending_review')}
                        </Button>
                      )}

                      <Button size='large' block onClick={onClose}>
                        {t('close')}
                      </Button>
                    </Space>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </>
        )}
      </Space>
    </Drawer>
  )
}

CharacterMissionDrawer.displayName = 'CharacterMissionDrawer'

export default CharacterMissionDrawer
