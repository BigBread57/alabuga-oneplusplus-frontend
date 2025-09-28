'use client'

import type { FCC } from 'src/types'
import { Col, Row } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import PostItemCard from '@/components/News/PostCard/PostCard'
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
          <Row gutter={[16, 16]} justify='start'>
            {data?.map((Post_item) => (
              <Col xs={24} sm={24} md={24} lg={24} key={Post_item.id}>
                <PostItemCard key={Post_item.id} {...Post_item} />
              </Col>
            ))}
          </Row>
        )}
      />
    </CardWrapper>
  )
}

PostsCard.displayName = 'PostsCard'

export default PostsCard
