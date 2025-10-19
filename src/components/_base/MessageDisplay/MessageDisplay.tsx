'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle, X } from 'lucide-react'
import React from 'react'
import { useMessage } from '@/providers/MessageProvider'

const MessageDisplay: React.FC = () => {
  const { messages, removeMessage } = useMessage()

  return (
    <div className='pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2'>
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: -20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor:
                message.type === 'success'
                  ? 'rgba(0, 255, 136, 0.15)' // cosmic.neon.green с прозрачностью
                  : 'rgba(196, 30, 58, 0.15)', // cosmic.neon.purple с прозрачностью
              borderColor:
                message.type === 'success'
                  ? '#00ff88' // cosmic.neon.green
                  : '#c41e3a', // cosmic.neon.purple
            }}
            className='pointer-events-auto flex items-center gap-3 rounded-lg border border-solid px-4 py-3 shadow-lg backdrop-blur-sm'
          >
            {message?.type === 'success' ? (
              <CheckCircle
                size={20}
                className='flex-shrink-0'
                style={{ color: '#00ff88' }} // cosmic.neon.green
              />
            ) : (
              <AlertCircle
                size={20}
                className='flex-shrink-0'
                style={{ color: '#c41e3a' }} // cosmic.neon.purple
              />
            )}

            <span
              className='text-sm font-medium'
              style={{
                color:
                  message.type === 'success'
                    ? '#00ff88' // cosmic.neon.green
                    : '#c41e3a', // cosmic.neon.purple
              }}
            >
              {message.text}
            </span>

            <button
              type='button'
              onClick={() => removeMessage(message.id)}
              className='ml-2 flex-shrink-0 transition-colors hover:opacity-100'
              style={{
                color:
                  message.type === 'success'
                    ? '#00ff88' // cosmic.neon.green
                    : '#c41e3a', // cosmic.neon.purple
                opacity: 0.7,
              }}
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default MessageDisplay
