'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle, X } from 'lucide-react'
import React from 'react'
import { useMessage } from '@/providers/MessageProvider'

const MessageDisplay: React.FC = () => {
  const { messages, removeMessage } = useMessage()

  return (
    <div className='pointer-events-none fixed inset-0 z-50 flex items-start justify-center pt-4'>
      <div className='flex flex-col gap-2'>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor:
                  message.type === 'success'
                    ? 'rgba(0, 255, 136, 0.15)'
                    : 'rgba(196, 30, 58, 0.15)',
                borderColor: message.type === 'success' ? '#00ff88' : '#c41e3a',
              }}
              className='pointer-events-auto flex items-center gap-3 rounded-lg border border-solid px-4 py-3 shadow-lg backdrop-blur-sm'
            >
              {message?.type === 'success' ? (
                <CheckCircle
                  size={20}
                  className='flex-shrink-0'
                  style={{ color: '#00ff88' }}
                />
              ) : (
                <AlertCircle
                  size={20}
                  className='flex-shrink-0'
                  style={{ color: '#c41e3a' }}
                />
              )}

              <span
                className='text-sm font-medium'
                style={{
                  color: message.type === 'success' ? '#00ff88' : '#c41e3a',
                }}
              >
                {message.text}
              </span>

              <button
                type='button'
                onClick={() => removeMessage(message.id)}
                className='ml-2 flex-shrink-0 transition-colors hover:opacity-100'
                style={{
                  color: message.type === 'success' ? '#00ff88' : '#c41e3a',
                  opacity: 0.7,
                }}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MessageDisplay
