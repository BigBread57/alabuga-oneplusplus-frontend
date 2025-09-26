'use client'

import type { FCC } from 'src/types'
import { Card, Modal, Tag, Typography } from 'antd'
import Image from 'next/image'
import React, { useState } from 'react'
import ColorItem from '../../_base/ColorItem/ColorItem'
import styles from './Artifact.module.scss'

const { Title, Paragraph } = Typography
export interface ArtifactModel {
  id: string
  name: string
  description?: string
  icon?: string | null
  color?: string
  modifier: 'DEFAULT' | 'EXPERIENCE_GAIN' | 'CURRENCY_GAIN' | 'STORE_DISCOUNT'
  modifier_value: number
  game_world?: string
}
export type ArtifactProps = {
  name: string
  description?: string
  icon?: string | null
  color?: string
  modifier: 'DEFAULT' | 'EXPERIENCE_GAIN' | 'CURRENCY_GAIN' | 'STORE_DISCOUNT'
  modifier_value?: number
  modifier_display_name?: string
}

const modifierLabels: Record<ArtifactProps['modifier'], string> = {
  DEFAULT: 'Стандартный',
  EXPERIENCE_GAIN: 'Прирост опыта',
  CURRENCY_GAIN: 'Прирост валюты',
  STORE_DISCOUNT: 'Скидка в магазине',
}

const Artifact: FCC<ArtifactProps> = ({
  name,
  description,
  icon,
  color,
  modifier,
  modifier_value,
}) => {
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
                name[0]
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
            {modifierLabels[modifier]}
            {modifier_value ? ` +${modifier_value}` : null}
          </Tag>

          {description && (
            <Paragraph className={styles.description}>{description}</Paragraph>
          )}
        </Card>
      </Modal>
    </>
  )
}

Artifact.displayName = 'Artifact'

export default Artifact
