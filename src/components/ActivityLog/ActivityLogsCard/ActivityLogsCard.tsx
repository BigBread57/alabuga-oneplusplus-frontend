'use client'

import type { FCC } from '@/types'
import { List } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { useDateTimePrettyStr } from '@/hooks/useDateTimePrettyStr'
import { useFilter } from '@/hooks/useFilter'
import { ActivityLog } from '@/models/ActivityLog'
import { useExtraActionsGet } from '@/services/base/hooks'

const MODEL = ActivityLog
const ActivityLogsCard: FCC = () => {
  const t = useTranslations('ActivityLog')
  const [filter, setFilter] = useFilter({})
  const { timeDateString } = useDateTimePrettyStr()
  const { data: contentTypesData }: any = useExtraActionsGet({
    qKey: 'getContentTypes',
    extraUrl: MODEL.contentTypesUrl(),
  })

  const handleChange = (newContentTypeId: string) => {
    setFilter({
      content_type: newContentTypeId === 'all' ? undefined : newContentTypeId,
    })
  }

  const tabsItems = [
    { key: 'all', label: t('all'), children: null },
    ...(contentTypesData?.data?.results?.map(
      (type: { id: number, name: string }) => ({
        key: type.id,
        label: type.name,
        children: null,
      }),
    ) || []),
  ]
  return (
    <CardWrapper
      title={t('title').toUpperCase()}
      tabList={tabsItems}
      defaultActiveTabKey='all'
      onTabChange={handleChange}
      styles={{
        body: {
          height: '85%',
          overflow: 'scroll',
        },
      }}
    >
      {/* <Tabs defaultActiveKey='all' items={tabsItems} onChange={handleChange} /> */}

      <FetchMoreItemsComponent
        model={MODEL}
        defFilters={{ ...filter }}
        renderItems={({ data }) => (
          <List
            itemLayout='horizontal'
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={item.text}
                  description={timeDateString(item.created_at)}
                />
              </List.Item>
            )}
          />
        )}
      />
    </CardWrapper>
  )
}

ActivityLogsCard.displayName = 'ActivityLogsCard'

export default ActivityLogsCard
