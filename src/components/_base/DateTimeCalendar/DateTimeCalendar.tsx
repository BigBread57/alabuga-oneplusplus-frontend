import { CalendarOutlined } from '@ant-design/icons'
import { Space, Typography } from 'antd'
import React from 'react'
import { useDateTimePrettyStr } from '@/hooks/useDateTimePrettyStr'

const { Text } = Typography

interface DateTimeCalendarProps {
  text: string
  datetime: string
}

const DateTimeCalendar: React.FC<DateTimeCalendarProps> = ({
  text,
  datetime,
}) => {
  const { timeDateString } = useDateTimePrettyStr()

  return (
    <Text>
      <Space direction='horizontal'>
        <CalendarOutlined /> <strong>{text}:</strong>
        {timeDateString(datetime as string)}
      </Space>
    </Text>
  )
}

DateTimeCalendar.displayName = 'DateTimeCalendar'

export default DateTimeCalendar
