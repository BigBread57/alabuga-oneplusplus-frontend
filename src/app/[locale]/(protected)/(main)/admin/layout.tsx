'use client'

import { Col, Row } from 'antd'
import React from 'react'
import { AdminMenu } from '@/components/Admin/AdminMenu'

type AdminLayoutProps = {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <Row
      gutter={[24, 24]}
      style={{
        height: '100%',
      }}
    >
      <Col xs={24} md={24} lg={4}>
        {/* Навигационное меню */}
        <AdminMenu />
      </Col>
      <Col
        xs={24}
        md={24}
        lg={20}
        style={{
          width: '100%',
        }}
      >
        {children}
      </Col>
    </Row>
  )
}

export default AdminLayout
