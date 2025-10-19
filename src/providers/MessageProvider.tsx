'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

interface Message {
  id: string
  type: 'success' | 'error'
  text: string
}

interface MessageContextType {
  messages: Message[]
  messageSuccess: (text?: string) => void
  messageError: (text?: string) => void
  removeMessage: (id: string) => void
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

let messageCounter = 0

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([])

  const addMessage = useCallback((type: 'success' | 'error', text: string) => {
    const id = `msg-${messageCounter++}`
    const message: Message = { id, type, text }

    setMessages((prev) => [...prev, message])

    const timer = setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id))
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const messageSuccess = useCallback(
    (text?: string) => {
      addMessage('success', text || 'Успешно!')
    },
    [addMessage],
  )

  const messageError = useCallback(
    (text?: string) => {
      addMessage('error', text || 'Произошла ошибка')
    },
    [addMessage],
  )

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
  }, [])

  return (
    <MessageContext.Provider
      value={{ messages, messageSuccess, messageError, removeMessage }}
    >
      {children}
    </MessageContext.Provider>
  )
}

export const useMessage = () => {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error('useMessage must be used within MessageProvider')
  }
  return context
}
