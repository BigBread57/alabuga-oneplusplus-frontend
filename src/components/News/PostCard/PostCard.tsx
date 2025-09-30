import type { FCC } from '@/types'
import {
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'
import { useDateTimePrettyStr } from '@/hooks/useDateTimePrettyStr'
import styles from './PostCard.module.scss'

const { Text } = Typography
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
  const { timeDateString } = useDateTimePrettyStr()
  const t = useTranslations('ShopItem')
  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <Card
      style={{
        margin: '10px 0',
      }}
    >
      <List.Item
        key={topic.name}
        extra={
          <Image
            draggable={false}
            width={272}
            height={10}
            alt='logo'
            src={image || 'https://dummyimage.com/300/200'}
          />
        }
        actions={[
          <Button key='act' onClick={showDrawer}>
            {t('view_details')}
          </Button>,
        ]}
      >
        <List.Item.Meta
          avatar={
            <Avatar
              src={
                character.avatar
                || 'https://api.dicebear.com/7.x/miniavs/svg?seed=1'
              }
            />
          }
          title={
            <Space direction='horizontal'>
              {name}
              <Tag color={topic.color}>{topic.name}</Tag>
            </Space>
          }
          description={timeDateString(created_at)}
        />
        {text}
      </List.Item>

      <Drawer
        width={600}
        title={name}
        placement='right'
        onClose={onClose}
        open={open}
      >
        <Row
          justify='space-between'
          gutter={[16, 16]}
          style={{
            height: '100%',
          }}
        >
          <Col xs={24}>
            <Space direction='vertical'>
              <Col xs={24}>
                <Tag color={topic.color}>{topic.name}</Tag>
              </Col>
              <Col xs={24}>
                <Image
                  src={image || 'https://dummyimage.com/300/200'}
                  alt=''
                  width={600}
                  height={400}
                />
              </Col>
              <Col xs={24}>
                <Text>{text}</Text>
              </Col>
            </Space>
          </Col>
          <Col
            xs={24}
            style={{
              alignSelf: 'flex-end',
            }}
          >
            <Row justify='space-between'>
              <Col>
                <div>
                  <Text strong>{character.user.full_name}</Text>
                  {character.role && (
                    <div className={styles.characterRole}>
                      {character.role_display_name}
                    </div>
                  )}
                </div>
              </Col>
              <Col>
                <Text>{timeDateString(created_at)}</Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Drawer>
    </Card>
  )
}

PostCard.displayName = 'PostCard'

export default PostCard
