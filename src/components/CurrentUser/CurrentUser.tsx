import type { UsersModelProps } from '@/models'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Col, Dropdown, Row, Space, Typography } from 'antd'

import React, { useCallback } from 'react'
import { useScreens } from '@/hooks/useScreens'

import { useLogout } from '@/services/auth/hooks'
import styles from './CurrentUser.module.scss'

const { Text } = Typography

type CurrentUserProps = {
  currentUser: UsersModelProps
}

const UserName = ({ currentUser }: { currentUser: UsersModelProps }) => (
  <Space direction='vertical'>
    {currentUser?.first_name || currentUser?.last_name
      ? (
          <Text>
            {currentUser?.first_name} {currentUser?.last_name}
          </Text>
        )
      : null}

    <Text>{currentUser?.email || currentUser?.username}</Text>
  </Space>
)

// Выносим DropdownRender на верхний уровень
const DropdownRender = ({
  onLogout,
  currentUser,
}: {
  onLogout: (e: React.MouseEvent) => void
  currentUser: UsersModelProps
}) => {
  const { isMobile, isTablet } = useScreens()

  return (
    <Card>
      <Space direction='vertical' size='large'>
        {isMobile || isTablet ? <UserName currentUser={currentUser} /> : null}
        <Button
          type='primary'
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
}

export const CurrentUser: React.FC<CurrentUserProps> = ({ currentUser }) => {
  const { mutate: logout }: any = useLogout()
  const { isMobile, isTablet } = useScreens()

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
    () => (
      <>
        <DropdownRender onLogout={handleLogout} currentUser={currentUser} />
      </>
    ),
    [handleLogout, currentUser],
  )

  return (
    <Row>
      <Col xs={24}>
        <Dropdown
          placement='bottom'
          trigger={['click']}
          popupRender={dropdownRender}
        >
          <Space
            className={styles.spaceRow}
            direction='horizontal'
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type='text'
              size='large'
              icon={<UserOutlined />}
              style={{
                fontSize: 16,
              }}
            />
            {!isMobile && !isTablet
              ? (
                  <UserName currentUser={currentUser} />
                )
              : null}
          </Space>
        </Dropdown>
      </Col>
    </Row>
  )
}

CurrentUser.displayName = 'CurrentUser'

export default CurrentUser
