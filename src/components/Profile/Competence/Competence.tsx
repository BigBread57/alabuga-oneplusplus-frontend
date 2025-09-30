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
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import styles from './Competence.module.scss'

const { Text, Paragraph } = Typography

export type CompetenceProps = {
  data: CharacterCompetencyProps
  isLoading?: boolean
}

export const Competence: FCC<CompetenceProps> = ({ data, isLoading }) => {
  const t = useTranslations('Competence')
  const [storiesModalOpen, setStoriesModalOpen] = useState(false)

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
        <Card
          loading={isLoading}
          className={styles.card}
          data-testid={`competency-${data?.competency.id}`}
          size='small'
          style={{
            borderTop: `4px solid ${data?.competency.color || '#1677ff'}`,
            borderBottom: `4px solid ${data?.competency.color || '#1677ff'}`,
            position: 'relative',
          }}
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
            {data?.competency.description && (
              <Paragraph ellipsis={{ rows: 3 }}>
                {data?.competency.description}
              </Paragraph>
            )}
            <Space direction='horizontal'>
              <Tag color='default'>{data?.experience} XP</Tag>
              {t('from')}
              <Tag color='gold'>{data?.competency.required_experience} XP</Tag>
            </Space>
            {hasStories
              ? (
                  <Space>
                    <Tag
                      color='purple'
                      icon={<BookOutlined />}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setStoriesModalOpen(true)}
                    >
                      {t('stories')}
                    </Tag>
                  </Space>
                )
              : null}
          </Space>
        </Card>
      </Badge.Ribbon>

      {/* Модалка с историями */}
      <Modal
        title={
          <Space>
            <BookOutlined />
            {t('world_stories_title', {
              competencyName: data?.competency.name,
            })}
          </Space>
        }
        open={storiesModalOpen}
        onCancel={() => setStoriesModalOpen(false)}
        footer={null}
        centered
        width={600}
      >
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {data?.competency?.game_world_stories?.map((story, index) => (
            <div key={story.id}>
              {story.image && (
                <div style={{ marginBottom: 16 }}>
                  <Image
                    src={story.image}
                    alt={t('story_image')}
                    style={{
                      width: '100%',
                      maxHeight: 200,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                </div>
              )}
              <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
                {story.text}
              </Paragraph>
              {index
                < (data?.competency?.game_world_stories?.length || 0) - 1 && (
                <Divider />
              )}
            </div>
          ))}
        </Space>
      </Modal>
    </>
  )
}

Competence.displayName = 'Competence'

export default Competence
