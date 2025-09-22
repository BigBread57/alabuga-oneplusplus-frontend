import { notification } from 'antd'
import React, { useMemo } from 'react'
import { NotificationMessageContext } from './NotificationMessageContext'

export default function NotificationMessageProvider({ children }: any) {
  const [api, contextHolder] = notification.useNotification()
  const value = useMemo(
    () => ({
      api,
    }),
    [api],
  )
  return (
    <NotificationMessageContext.Provider value={value}>
      {contextHolder}
      {children}
    </NotificationMessageContext.Provider>
  )
}
