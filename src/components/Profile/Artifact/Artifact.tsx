'use client'

import type { FCC } from 'src/types'
import type { ArtifactProps } from '@/models/Artifact'
import { Card, Divider, Modal, Tag, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'
import { ColorItem } from '@/components/_base/ColorItem'
import styles from './Artifact.module.scss'

const { Title, Paragraph } = Typography

const modifierLabels: Record<ArtifactProps['modifier'], string> = {
  DEFAULT: 'no_modifier',
  EXPERIENCE_GAIN: 'experience_gain',
  CURRENCY_GAIN: 'currency_gain',
  STORE_DISCOUNT: 'store_discount',
}

const Artifact: FCC<ArtifactProps> = ({
  name,
  description,
  icon,
  color,
  modifier,
  modifier_value,
  game_world_stories,
}) => {
  const t = useTranslations('Artifact')
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className={styles.iconWrapper}
        role='button'
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setOpen(true)
          }
        }}
      >
        <ColorItem color={color}>
          {icon
            ? (
                <Image
                  src={icon}
                  alt={name}
                  className={styles.icon}
                  width={48}
                  height={48}
                />
              )
            : (
                name?.[0]
              )}
        </ColorItem>
      </div>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
        style={{ borderColor: color || '#d9d9d9' }}
      >
        <Card variant='borderless' className={styles.card}>
          <div className={styles.header}>
            {icon && (
              <Image
                width={100}
                height={100}
                src={icon}
                alt={name}
                className={styles.modalIcon}
              />
            )}
            <Title level={4}>{name}</Title>
          </div>

          <Tag color={color || 'blue'}>
            {t(modifierLabels[modifier] as any)}
            {modifier_value ? ` +${modifier_value}` : null}
          </Tag>

          {description && (
            <Paragraph className={styles.description}>{description}</Paragraph>
          )}

          {/* Раздел историй игрового мира */}
          {game_world_stories && game_world_stories.length > 0 && (
            <>
              <Divider />
              <div className={styles.storiesSection}>
                <Title level={5}>{t('game_world_stories')}</Title>
                {game_world_stories.map((story) => (
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

Artifact.displayName = 'Artifact'

export default Artifact
