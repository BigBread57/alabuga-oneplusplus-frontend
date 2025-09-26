import type { UserProps } from '@/models'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Col, Dropdown, Row, Space, Typography } from 'antd'

import { useTranslations } from 'next-intl'
import React, { useCallback } from 'react'

import { useLogout } from '@/services/auth/hooks'
import styles from './CurrentUser.module.scss'

const { Text } = Typography

type CurrentUserProps = {
  currentUser: UserProps
}

const UserName = ({ currentUser }: { currentUser: UserProps }) => {
  return (
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
}

// Выносим DropdownRender на верхний уровень
const DropdownRender = ({
  onLogout,
  currentUser,
}: {
  onLogout: (e: React.MouseEvent) => void
  currentUser: UserProps
}) => {
  const t = useTranslations('CurrentUser')

  return (
    <Card>
      <Space direction='vertical' size='large'>
        <UserName currentUser={currentUser} />
        <Button
          type='primary'
          icon={<LogoutOutlined />}
          onClick={(e) => {
            e.stopPropagation()
            onLogout(e)
          }}
        >
          {t('logout')}
        </Button>
      </Space>
    </Card>
  )
}

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
          </Space>
        </Dropdown>
      </Col>
    </Row>
  )
}

CurrentUser.displayName = 'CurrentUser'

export default CurrentUser
