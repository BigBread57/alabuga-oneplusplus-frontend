import type { FCC } from 'src/types'
import { motion } from 'framer-motion'
import React from 'react'
import { FetchMoreItemsComponent } from '@/components/_base/FetchMoreItemsComponent'
import { CharacterEvent } from '@/models/CharacterEvent'
import { EventCard } from '../EventCard'

interface EventsCardWrapperProps {
  filters?: any
  prop?: any
}

const MODEL_EVENTS = CharacterEvent

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const EventsCardWrapper: FCC<EventsCardWrapperProps> = ({ filters }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      data-testid='test-EventsCardWrapper'
      className='h-full w-full'
    >
      <FetchMoreItemsComponent
        isParentCounter
        model={MODEL_EVENTS}
        defFilters={filters}
        renderItems={({ data, refetch }) => (
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='flex h-full flex-col gap-4 overflow-y-auto '
          >
            {data && data.length > 0
              ? data?.map((item) => (
                  <EventCard key={item.id} data={item} onComplete={refetch} />
                ))
              : null}
          </motion.div>
        )}
      />
    </motion.div>
  )
}

EventsCardWrapper.displayName = 'EventsCardWrapper'

export default EventsCardWrapper
