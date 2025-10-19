import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

type MessageType = 'success' | 'error'

interface Message {
  id: string
  type: MessageType
  text: string
}

let messageCounter = 0

const useMessage = () => {
  const t = useTranslations('Common')
  const [messages, setMessages] = useState<Message[]>([])

  const addMessage = useCallback((type: MessageType, text: string) => {
    const id = `msg-${messageCounter++}`
    const message: Message = { id, type, text }

    setMessages((prev) => [...prev, message])

    // Автоматически удаляем сообщение через 3 секунды
    const timer = setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id))
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const messageSuccess = useCallback(
    (text?: string) => {
      addMessage('success', text || t('success'))
    },
    [addMessage, t],
  )

  const messageError = useCallback(
    (errorText?: string) => {
      const errorMessage = errorText || t('error')
      addMessage('error', errorMessage)
    },
    [addMessage, t],
  )

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
  }, [])

  return {
    messageSuccess,
    messageError,
    messages,
    removeMessage,
  }
}

export default useMessage
