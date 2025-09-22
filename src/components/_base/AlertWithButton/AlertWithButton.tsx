import type { ReactNode } from 'react'
import { Alert, Button, Col, Row } from 'antd'
import React from 'react'

type AlertWithButtonProps = {
  title: string
  alertType: 'success' | 'info' | 'warning' | 'error'
  buttonText: string
  buttonIcon?: ReactNode
  onClick?: () => void
}

const AlertWithButton: React.FC<AlertWithButtonProps> = ({
  title,
  alertType,
  buttonText,
  buttonIcon,
  onClick,
}) => {
  return (
    <Row>
      <Col span={24}>
        <Alert
          message={title}
          type={alertType}
          action={(
            <Button icon={buttonIcon} onClick={onClick}>
              {buttonText}
            </Button>
          )}
        />
      </Col>
    </Row>
  )
}

AlertWithButton.displayName = 'AlertWithButton'

export default AlertWithButton
