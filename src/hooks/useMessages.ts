import { App } from 'antd'
import { useTranslations } from 'next-intl'

const useMessage = () => {
  const { message } = App.useApp()
  const t = useTranslations('Common')

  const messageSuccess = (text?: string) => {
    message.success(text || t('success'))
  }

  const messageError = (errorText: string) => {
    const errorMessage = errorText || t('error')
    message.error(errorMessage)
  }

  return {
    messageSuccess,
    messageError,
  }
}

export default useMessage
