import type { FCC } from 'src/types'
import { Col, Row } from 'antd'
import React from 'react'
import { CardWrapper } from '@/components/_base/CardWrapper'
import { GraphCanvas } from '@/components/Graph/GraphCanvas'

const AdminPageWrapper: FCC = () => {
  return (
    <Row>
      <Col xs={24} md={24} lg={24} xl={6}>
        SOME CONTENT
      </Col>
      <Col xs={24} md={24} lg={24} xl={18}>
        <CardWrapper
          style={{}}
          styles={{
            body: {
              height: 'calc(80vh)',
              padding: 8,
            },
          }}
        >
          <GraphCanvas />
        </CardWrapper>
      </Col>
    </Row>
  )
}

AdminPageWrapper.displayName = 'AdminPageWrapper'

export default AdminPageWrapper
