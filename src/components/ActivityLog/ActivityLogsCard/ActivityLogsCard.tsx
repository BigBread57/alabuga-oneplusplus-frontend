'use client'

import type { FCC } from '@/types'
import { Row, Tabs } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import ActivityLogCard from '@/components/ActivityLog/ActivityLogCard/ActivityLogCard'
import { ActivityLog } from '@/models/ActivityLog'
import { useExtraActionsGet } from '@/services/base/hooks'

const MODEL = ActivityLog
const ActivityLogsCard: FCC = () => {
  const t = useTranslations('ActivityLog')

  const [contentTypeId, setContentTypeId] = useState<string>('all')

  const { data: contentTypesData } = useExtraActionsGet({
    qKey: 'getContentTypes',
    extraUrl: MODEL.contentTypesUrl(),
  })

  const handleChange = (newContentTypeId: string) => {
    setContentTypeId(newContentTypeId)
  }

  const tabItems = contentTypesData
    ? [
        {
          key: 'all',
          label: 'Все',
          children: null,
        },
        // ...contentTypesData.map((contentType: any) => ({
        //   key: contentType.id.toString(),
        //   label: contentType.name,
        //   children: null,
        // })
      ]
    : [
        {
          key: 'all',
          label: 'Все',
          children: null,
        },
      ]

  return (
    <>
      <CardWrapper
        styles={{
          header: {
            fontSize: '18px',
          },
          body: {
            height: '90%',
            overflow: 'scroll',
          },
        }}
        title={t('title')}
      >
        <Tabs defaultActiveKey='all' items={tabItems} onChange={handleChange} />

        <FetchMoreItemsComponent
          model={MODEL}
          defFilters={
            contentTypeId === 'all'
              ? {}
              : { content_type: Number.parseInt(contentTypeId) }
          }
          renderItems={({ data }) => (
            <Row gutter={[32, 32]} justify='start'>
              {data?.map((activity_log) => (
                <ActivityLogCard key={activity_log.id} {...activity_log} />
              ))}
            </Row>
          )}
        />
      </CardWrapper>
    </>
  )
}

ActivityLogsCard.displayName = 'ActivityLogsCard'

export default ActivityLogsCard
