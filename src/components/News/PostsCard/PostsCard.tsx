'use client'

import type { FCC } from 'src/types'
import { List } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { Select } from '@/components/_base/Select'
import { PostCard } from '@/components/News/PostCard'
import { useFilter } from '@/hooks/useFilter'
import { Post } from '@/models/Post'
import { CommunicationTopic } from '@/models/Topic'

const MODEL = Post
const TOPIC_MODEL = CommunicationTopic

const PostsCard: FCC = () => {
  const t = useTranslations('Post')
  const [filter, setFilter] = useFilter({})

  const handleSingleChange = (value: number | string | any) => {
    setFilter({ topic: value })
  }
  return (
    <CardWrapper
      title={t('posts').toUpperCase()}
      extra={
        <Select
          url={`${TOPIC_MODEL.url()}?limit=1000&offset=0`}
          qKey='users-select'
          placeholder={t('select_topic')}
          valueKey='id'
          allowClear
          labelKey='name'
          style={{
            width: 300,
          }}
          onChange={handleSingleChange}
        />
      }
    >
      <FetchMoreItemsComponent
        model={MODEL}
        defFilters={filter}
        renderItems={({ data }) => (
          <List
            itemLayout='vertical'
            size='large'
            dataSource={data}
            renderItem={(item) => <PostCard {...item} />}
          />
        )}
      />
    </CardWrapper>
  )
}

PostsCard.displayName = 'PostsCard'

export default PostsCard
