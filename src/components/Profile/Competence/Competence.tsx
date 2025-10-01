import type { FCC } from 'src/types'
import type { CharacterCompetencyProps } from '@/models/CharacterCompetence'
import { BookOutlined } from '@ant-design/icons'
import {
  Badge,
  Card,
  Divider,
  Image,
  Modal,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import styles from './Competence.module.scss'

const { Text, Paragraph, Title } = Typography

export type CompetenceProps = {
  data: CharacterCompetencyProps
  isLoading?: boolean
}

export const Competence: FCC<CompetenceProps> = ({ data, isLoading }) => {
  const t = useTranslations('Competence')
  const [modalOpen, setModalOpen] = useState(false)

  const hasStories
    = data?.competency?.game_world_stories
      && data.competency.game_world_stories.length > 0

  return (
    <>
      <Badge.Ribbon
        color='gold'
        text={t('received')}
        style={{
          display: data?.is_received ? 'block' : 'none',
        }}
      >
        <Tooltip title={data?.competency?.name || ''}>
          <Card
            loading={isLoading}
            className={styles.card}
            data-testid={`competency-${data?.competency.id}`}
            size='small'
            style={{
              borderTop: `4px solid ${data?.competency.color || '#1677ff'}`,
              borderBottom: `4px solid ${data?.competency.color || '#1677ff'}`,
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={() => setModalOpen(true)}
          >
            <Space
              direction='vertical'
              size='small'
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
              }}
            >
              <Image
                src={
                  (data?.competency.icon as string)
                  || 'https://dummyimage.com/200'
                }
                alt={data?.competency.name}
                preview={false}
                className={styles.icon}
                height={48}
              />
              <Text strong type='warning'>
                {data?.competency.name}
              </Text>
              <Text>
                {t('level')}: {data?.competency.level}
              </Text>
              <Space direction='horizontal'>
                <Tag color='default'>{data?.experience} XP</Tag>
                {t('from')}
                <Tag color='gold'>
                  {data?.competency.required_experience} XP
                </Tag>
              </Space>
              {hasStories && (
                <Tag color='purple' icon={<BookOutlined />}>
                  {t('stories')}
                </Tag>
              )}
            </Space>
          </Card>
        </Tooltip>
      </Badge.Ribbon>

      {/* Основная модалка с описанием и историями */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        width={600}
        style={{ borderColor: data?.competency.color || '#1677ff' }}
      >
        <Card variant='borderless' className={styles.modalCard}>
          <div className={styles.header}>
            {data?.competency.icon && (
              <Image
                width={100}
                height={100}
                src={data.competency.icon as string}
                alt={data.competency.name}
                className={styles.modalIcon}
                preview={false}
              />
            )}
            <Title level={4}>{data?.competency.name}</Title>
          </div>

          <Space direction='vertical' size='small' style={{ width: '100%' }}>
            <Tag color={data?.competency.color || 'blue'}>
              {t('level')} {data?.competency.level}
            </Tag>

            <Space direction='horizontal'>
              <Tag color='default'>{data?.experience} XP</Tag>
              {t('from')}
              <Tag color='gold'>{data?.competency.required_experience} XP</Tag>
            </Space>

            {data?.is_received && <Tag color='gold'>{t('received')}</Tag>}
          </Space>

          {data?.competency.description && (
            <Paragraph className={styles.description}>
              {data.competency.description}
            </Paragraph>
          )}

          {/* Раздел историй игрового мира */}
          {hasStories && (
            <>
              <Divider />
              <div className={styles.storiesSection}>
                <Title level={5}>
                  <BookOutlined /> {t('game_world_stories')}
                </Title>
                {data.competency.game_world_stories?.map((story) => (
                  <div key={story.id} className={styles.storyItem}>
                    {story.image && (
                      <div className={styles.storyImage}>
                        <Image
                          src={story.image}
                          alt={t('story_image')}
                          width={200}
                          height={120}
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </div>
                    )}
                    <Paragraph className={styles.storyText}>
                      {story.text}
                    </Paragraph>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </Modal>
    </>
  )
}

Competence.displayName = 'Competence'

export default Competence
