'use client'

import type { FCC } from '@/types'
import { Button, List } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { useFilter } from '@/hooks/useFilter'
import useMessage from '@/hooks/useMessages'
import { ActivityLog } from '@/models/ActivityLog'
import { useExtraActionsGet, useExtraActionsPut } from '@/services/base/hooks'
import JournalItem from '../JournalItem/JournalItem'

const MODEL = ActivityLog
const ActivityLogsCard: FCC = () => {
  const t = useTranslations('ActivityLog')
  const [filter, setFilter] = useFilter({})
  const { messageSuccess } = useMessage()
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
  const { mutate } = useExtraActionsPut('read_all')
  const handleReadAll = (refetch: () => void) => {
    mutate([MODEL.markAllAsReadUrl(), { is_read: true }], {
      onSuccess: () => {
        refetch()
        messageSuccess()
      },
    })
  }
  return (
    <CardWrapper
      title={t('title').toUpperCase()}
      tabList={tabsItems}
      defaultActiveTabKey='all'
      onTabChange={handleChange}
      styles={{
        body: {
          height: '85%',
        },
      }}
    >
      <FetchMoreItemsComponent
        model={MODEL}
        defFilters={{ ...filter }}
        extra={({ refetch }) => (
          <Button onClick={() => handleReadAll(refetch)}>
            {t('read_all')}
          </Button>
        )}
        renderItems={({ data }) => (
          <List
            itemLayout='horizontal'
            style={{
              overflow: 'scroll',
              height: '85%',
            }}
            dataSource={[...data]}
            renderItem={(item) => (
              <JournalItem
                key={item.id}
                is_read={item.is_read}
                itemId={item.id}
                text={item.text}
                created_at={item.created_at}
              />
            )}
          />
        )}
      />
    </CardWrapper>
  )
}

ActivityLogsCard.displayName = 'ActivityLogsCard'

export default ActivityLogsCard
