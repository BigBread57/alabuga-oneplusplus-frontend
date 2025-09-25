'use client'

import type { NotificationInstance } from 'antd/es/notification/interface'
import React from 'react'

export const NotificationMessageContext = React.createContext({
  api: {} as NotificationInstance,
})
