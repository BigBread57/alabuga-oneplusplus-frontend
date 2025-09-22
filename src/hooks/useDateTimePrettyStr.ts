import { useCallback } from 'react'

export const useDateTimePrettyStr = () => {
  const timeDateString = useCallback((datetime: string | Date | number) => {
    if (!datetime) {
      return ''
    }
    const toDate = new Date(datetime)
    const date = toDate.toLocaleDateString('ru-Ru')
    const hours = toDate.getHours()
    const minutes
      = toDate.getMinutes() < 10 ? `0${toDate.getMinutes()}` : toDate.getMinutes()
    return `${hours}:${minutes} ${date}`
  }, [])

  /**
   * Форматируем дату
   */
  const dateFormatter = ({
    date,
    locale = 'ru',
    options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
  }: {
    date: string | Date
    locale?: string
    options?: Record<string, any>
  }) => {
    const intlInstance = new Intl.DateTimeFormat(locale, options)
    return intlInstance.format(new Date(date))
  }

  return { timeDateString, dateFormatter }
}
