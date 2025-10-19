'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { AdminMenu } from '@/components/Admin/AdminMenu'

type AdminLayoutProps = {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const sidebarVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='mt-4 flex h-full flex-col gap-6 lg:flex-row'
    >
      {/* Сайдбар */}
      <motion.aside
        variants={sidebarVariants}
        className='w-full flex-shrink-0 lg:w-1/6'
      >
        <AdminMenu />
      </motion.aside>

      {/* Основной контент */}
      <motion.main
        variants={contentVariants}
        className='h-[75vh] w-full flex-1 overflow-y-auto shadow-lg lg:w-5/6'
      >
        {children}
      </motion.main>
    </motion.div>
  )
}

export default AdminLayout
