import { Calendar } from 'lucide-react'
import React from 'react'
import { useDateTimePrettyStr } from '@/hooks/useDateTimePrettyStr'

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
    <div className='flex items-center gap-2'>
      <Calendar size={16} className='flex-shrink-0 text-indigo-400' />
      <span className='font-semibold text-gray-300'>{text}:</span>
      <span className='text-gray-400'>
        {timeDateString(datetime as string)}
      </span>
    </div>
  )
}

DateTimeCalendar.displayName = 'DateTimeCalendar'

export default DateTimeCalendar
