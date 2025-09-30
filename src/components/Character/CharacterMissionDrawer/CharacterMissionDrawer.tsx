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
import { CharacterMission } from '@/models/CharacterMission'
import { CharacterMissionForInspector } from '@/models/CharacterMissionForInspector'
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

const CHARACTER_MISSION_MODEL = CharacterMissionForInspector

const CharacterMissionDrawer: FCC<CharacterMissionDrawerProps> = ({
  open,
  itemId,
  onComplete,
  onClose,
  width = 700,
}) => {
  const t = useTranslations('MissionCard')
  const [userForm] = Form.useForm()
  const [hrForm] = Form.useForm()
  const { currentUser } = useContext(CurrentUserContext)

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

  const { mutate: updateForInspector } = useExtraActionsPut(
    'update_for_inspector',
  )
  const handleInspectorUpdate = (values: {
    inspector_comment?: string
    status?: string
  }) => {
    updateForInspector(
      [CHARACTER_MISSION_MODEL.updateForInspectorUrl(itemId as number), values],
      {
        onSuccess: () => {
          refetch()
          onComplete?.()
        },
      },
    )
  }

  const { mutate: updateForCharacter } = useExtraActionsPut('user_missions')
  const handleCharacterUpdate = (values: { result: string }) => {
    updateForCharacter(
      [MODEL_MISSIONS.updateForCharacterUrl(itemId as number), values],
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

        <Divider size='small' />

        {/* Форма для пользователя */}
        {!isHR && (
          <div>
            <Title level={5}>{t('mission_results')}</Title>
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
                  disabled={
                    !['COMPLETED', 'NEED_IMPROVEMENT'].includes(
                      response?.data?.status,
                    )
                  }
                  placeholder={t('result_description_placeholder')}
                  maxLength={1000}
                  showCount
                />
              </Form.Item>

              <Form.Item label={t('attachments')}>
                <FileUpload
                  disabled={
                    !['COMPLETED', 'NEED_IMPROVEMENT'].includes(
                      response?.data?.status,
                    )
                  }
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
            <Title level={5}>{t('mission_results')}</Title>

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

CharacterMissionDrawer.displayName = 'CharacterMissionDrawer'

export default CharacterMissionDrawer
