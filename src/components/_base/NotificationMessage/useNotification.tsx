import type {
  ArgsProps,
  NotificationInstance,
} from 'antd/es/notification/interface'
import { useContext } from 'react'
import { NotificationMessageContext } from '@/components/_base/NotificationMessage/NotificationMessageContext'

export const useNotification = () => {
  const { api }: { api: NotificationInstance } = useContext(
    NotificationMessageContext,
  )
  const notifyInfo = (props: ArgsProps) => {
    api.info(props)
  }
  const notifySuccess = (props: ArgsProps) => {
    api.success(props)
  }
  const notifyError = (props: ArgsProps) => {
    api.error(props)
  }
  const notifyWarning = (props: ArgsProps) => {
    api.warning(props)
  }
  const notifyOpen = (props: ArgsProps) => {
    api.open({ ...props, style: { backgroundColor: 'red' } })
  }
  return { notifyInfo, notifySuccess, notifyError, notifyWarning, notifyOpen }
}
