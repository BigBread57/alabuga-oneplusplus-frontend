import type { UsersModelProps } from '@/models'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Col, Dropdown, Row, Space, Typography } from 'antd'

import React, { useCallback } from 'react'
import { IconAsButton } from '@/components/_base/IconAsButton'
import { useLogout } from '@/services/auth/hooks'

import styles from './CurrentUser.module.scss'

const { Text } = Typography

type CurrentUserProps = {
  currentUser: UsersModelProps
}

const UserName = ({ currentUser }: { currentUser: UsersModelProps }) => (
  <Text>{currentUser?.email || currentUser?.username}</Text>
)

// Выносим DropdownRender на верхний уровень
const DropdownRender = ({
  onLogout,
}: {
  onLogout: (e: React.MouseEvent) => void
}) => (
  <Card>
    <Space direction='vertical'>
      <Button
        type='text'
        icon={<LogoutOutlined />}
        onClick={(e) => {
          e.stopPropagation()
          onLogout(e)
        }}
      >
        Выйти
      </Button>
    </Space>
  </Card>
)

export const CurrentUser: React.FC<CurrentUserProps> = ({ currentUser }) => {
  const { mutate: logout }: any = useLogout()

  const handleLogout = useCallback(() => {
    logout(
      {},
      {
        onSuccess: () => {
          window.location.reload()
        },
      },
    )
  }, [logout])

  // Мемоизируем dropdown render с правильными зависимостями
  const dropdownRender = useCallback(
    () => <DropdownRender onLogout={handleLogout} />,
    [handleLogout],
  )

  return (
    <Row>
      <Col xs={24}>
        <Dropdown
          placement='bottom'
          trigger={['click']}
          dropdownRender={dropdownRender}
        >
          <Space
            className={styles.spaceRow}
            direction='horizontal'
            onClick={e => e.stopPropagation()}
          >
            <IconAsButton
              icon={UserOutlined}
              style={{
                fontSize: 16,
              }}
            />
            <UserName currentUser={currentUser} />
          </Space>
        </Dropdown>
      </Col>
    </Row>
  )
}

CurrentUser.displayName = 'CurrentUser'

export default CurrentUser
