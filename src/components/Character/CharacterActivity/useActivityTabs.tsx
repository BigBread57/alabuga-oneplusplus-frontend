import { Space, Tag } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'

export const useActivityTabs = ({
  missionData,
  eventData,
}: {
  missionData?: any
  eventData?: any
}) => {
  const t = useTranslations('Mission')

  const tabList = [
    {
      key: 'tab1',
      tab: (
        <Space direction='horizontal'>
          {t('missions_branches').toUpperCase()}
          <Tag>{missionData?.data?.count || 0}</Tag>
        </Space>
      ),
    },
    {
      key: 'tab2',
      tab: (
        <Space direction='horizontal'>
          {t('events').toUpperCase()}
          <Tag>{eventData?.data?.count || 0}</Tag>
        </Space>
      ),
    },
  ]
  return { tabList }
}
