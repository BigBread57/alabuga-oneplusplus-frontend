'use client'

import type { FCC } from 'src/types'
import { List } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { PostCard } from '@/components/News/PostCard'
import { Post } from '@/models/Post'

const MODEL = Post
const PostsCard: FCC = () => {
  const t = useTranslations('Post')
  return (
    <CardWrapper title={t('posts').toUpperCase()}>
      <FetchMoreItemsComponent
        model={MODEL}
        defFilters={{}}
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
