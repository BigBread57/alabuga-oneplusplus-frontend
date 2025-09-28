import type { FCC } from '@/types'
import { Button, Drawer, theme } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'
import { useDateTimePrettyStr } from '@/hooks/useDateTimePrettyStr'
import styles from './PostCard.module.scss'

type PostProps = {
  id: number
  image: string
  name: string
  text: string
  character: {
    id: number
    avatar: string
    user: {
      id: number
      email: string
      first_name: string
      last_name: string
      middle_name: string
      full_name: string
    }
    role: string
    role_display_name: string
  }
  topic: {
    id: number
    name: string
    color: string
    icon: string
  }
  created_at: string
}

const PostCard: FCC<PostProps> = ({
  image,
  name,
  character,
  topic,
  text,
  created_at,
}) => {
  const { token } = theme.useToken()
  const { timeDateString } = useDateTimePrettyStr()
  const t = useTranslations('ShopItem')
  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: 'auto',
    padding: 48,
    overflow: 'hidden',
    background: token.colorFillAlter,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  }

  return (
    <div style={containerStyle}>
      <div className={styles.cardContainer}>
        <div className={styles.imageWrapper}>
          <Image
            src={image || 'https://picsum.photos/300/200'}
            alt=''
            width={50}
            height={50}
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <span className={styles.name}>{name}</span>
          <div className={styles.buttonContainer}>
            <Button type='primary' onClick={showDrawer}>
              {t('view_details')}
            </Button>
          </div>
        </div>
      </div>

      <Drawer
        title={name}
        placement='right'
        onClose={onClose}
        open={open}
        styles={{
          wrapper: {
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100vh',
            width: window.innerWidth < 768 ? '100%' : '66.666%',
          },
        }}
      >
        <div className={styles.container}>
          <div className={styles.theme}>
            <strong style={{ color: token.colorText }}>Тема:</strong>
            <span style={{ color: token.colorText, marginLeft: 8 }}>
              {topic.name}
            </span>
          </div>

          <div className={styles.imageContainer}>
            <Image
              src={image || 'https://picsum.photos/300/200'}
              alt=''
              width={600}
              height={400}
              className={styles.image}
            />
          </div>

          <div className={styles.textContainer}>
            <p className={styles.text}>{text}</p>
          </div>
          <div className={styles.character}>
            <div>
              <strong>{character.user.full_name}</strong>
              {character.role && (
                <div className={styles.characterRole}>
                  {character.role_display_name}
                </div>
              )}
            </div>
            <div className={styles.createdAt}>{timeDateString(created_at)}</div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

PostCard.displayName = 'PostCard'

export default PostCard
