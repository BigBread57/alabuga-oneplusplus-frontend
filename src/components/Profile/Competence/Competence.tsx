import type { FCC } from 'src/types'
import type { CharacterCompetencyProps } from '@/models/CharacterCompetence'
import { BookOutlined, LockOutlined } from '@ant-design/icons'
import { Card, Divider, Image, Modal, Space, Tag, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { ComponentLocker } from '@/components/_base/ComponentLocker'
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

  const isBlocked = !data?.is_received

  return (
    <>
      <Card
        loading={isLoading}
        className={`${styles.card} ${isBlocked ? styles.blocked : ''}`}
        data-testid={`competency-${data?.competency.id}`}
        size='small'
        hoverable={!isBlocked}
        style={{
          borderTop: `8px solid ${data?.competency.color || '#1677ff'}`,
          opacity: isBlocked ? 0.5 : 1,
          filter: isBlocked ? 'grayscale(70%)' : 'none',
          position: 'relative',
        }}
      >
        {/* Оверлей блокировки */}
        {isBlocked ? <ComponentLocker /> : null}

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
              (data?.competency.icon as string) || 'https://picsum.photos/200'
            }
            alt={data?.competency.name}
            preview={false}
            className={styles.icon}
            height={48}
          />
          <Text strong>{data?.competency.name}</Text>
          {data?.competency.description && (
            <Paragraph ellipsis={{ rows: 3 }}>
              {data?.competency.description}
            </Paragraph>
          )}
          <Space direction='horizontal'>
            <Tag color={isBlocked ? 'default' : 'blue'}>
              {data?.experience} XP
            </Tag>
            {isBlocked && (
              <Tag color='red' icon={<LockOutlined />}>
                {t('locked')}
              </Tag>
            )}
            {hasStories && !isBlocked && (
              <Tag
                color='purple'
                icon={<BookOutlined />}
                style={{ cursor: 'pointer' }}
                onClick={() => setStoriesModalOpen(true)}
              >
                {t('stories')}
              </Tag>
            )}
          </Space>
        </Space>
      </Card>

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
