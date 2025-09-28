import type { FCC } from 'src/types'
import { List, Tag, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import React from 'react'
import { useDateTimePrettyStr } from '@/hooks/useDateTimePrettyStr'

const { Text } = Typography

interface JournalItemProps {
  itemId: string | number
  text: string
  created_at: string
  is_read?: boolean
}

const JournalItem: FCC<JournalItemProps> = ({ is_read, created_at, text }) => {
  const { timeDateString } = useDateTimePrettyStr()
  const t = useTranslations('ActivityLog')

  return (
    <List.Item>
      <List.Item.Meta
        title={
          <>
            {!is_read ? <Tag color='cyan'>{t('new')}</Tag> : null}
            <Text strong={!is_read}>{text}</Text>
          </>
        }
        description={timeDateString(created_at)}
      />
    </List.Item>
  )
}

JournalItem.displayName = 'JournalItem'

export default JournalItem
