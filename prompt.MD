вот мой packaje.json
{
  "name": "next-js-boilerplate",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "dev:spotlight": "npx @spotlightjs/spotlight --port 8080",
    "dev:next": "next dev --turbopack --port 8080",
    "dev": "run-p dev:*",
    "build:next": "next build",
    "build": "run-p build:* --race",
    "start": "next start --port 8080",
    "build-stats": "cross-env ANALYZE=true npm run build",
    "clean": "rimraf .next out coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "check:types": "tsc --noEmit --pretty",
    "check:deps": "knip",
    "check:i18n": "i18n-check -l src/locales -s en -u src -f next-intl",
    "commit": "commit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "storybook": "storybook dev -p 6006",
    "storybook:test": "vitest run --config .storybook/vitest.config.mts",
    "build-storybook": "storybook build",
    "new:component": "hygen new component",
    "new:model": "hygen new model"
  },
  "dependencies": {
    "@ant-design/nextjs-registry": "^1.1.0",
    "@arcjet/next": "^1.0.0-beta.10",
    "@clerk/localizations": "^3.22.0",
    "@clerk/nextjs": "^6.31.3",
    "@hookform/resolvers": "^5.2.1",
    "@logtape/logtape": "^1.0.4",
    "@sentry/nextjs": "^9.46.0",
    "@t3-oss/env-nextjs": "^0.13.8",
    "@tanstack/react-query": "^5.89.0",
    "antd": "^5.27.4",
    "clsx": "^2.1.1",
    "js-cookie": "^3.0.5",
    "lodash": "^4.17.21",
    "next": "^15.5.0",
    "next-intl": "^4.3.4",
    "qs": "^6.14.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.62.0",
    "react-infinite-scroll-component": "^6.1.0",
    "zod": "^4.0.17"
  },
  "devDependencies": {
    "@ant-design/static-style-extract": "^1.0.3",
    "@antfu/eslint-config": "^4.19.0",
    "@chromatic-com/playwright": "^0.12.6",
    "@commitlint/cli": "^19.8.1",
    "@commitlint/config-conventional": "^19.8.1",
    "@commitlint/prompt-cli": "^19.8.1",
    "@electric-sql/pglite-socket": "^0.0.12",
    "@eslint-react/eslint-plugin": "^1.52.6",
    "@faker-js/faker": "^9.9.0",
    "@lingual/i18n-check": "^0.8.5",
    "@next/bundle-analyzer": "^15.5.0",
    "@next/eslint-plugin-next": "^15.5.0",
    "@playwright/test": "^1.54.2",
    "@spotlightjs/spotlight": "^3.0.2",
    "@storybook/addon-a11y": "^9.1.2",
    "@storybook/addon-docs": "^9.1.2",
    "@storybook/addon-vitest": "^9.1.2",
    "@storybook/nextjs-vite": "^9.1.2",
    "@types/js-cookie": "^3.0.6",
    "@types/lodash": "^4.17.20",
    "@types/node": "^24.3.0",
    "@types/pg": "^8.15.5",
    "@types/qs": "^6.14.0",
    "@types/react": "^18.0.37",
    "@types/react-dom": "^18.0.11",
    "@vitejs/plugin-react": "^4.7.0",
    "@vitest/browser": "^3.2.4",
    "@vitest/coverage-v8": "^3.2.4",
    "checkly": "^6.4.0",
    "conventional-changelog-conventionalcommits": "^9.1.0",
    "cross-env": "^10.0.0",
    "dotenv-cli": "^10.0.0",
    "eslint": "^9.33.0",
    "eslint-plugin-format": "^1.0.1",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-playwright": "^2.2.2",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "eslint-plugin-storybook": "^9.1.2",
    "hygen": "^6.2.11",
    "knip": "^5.62.0",
    "lefthook": "^1.12.3",
    "npm-run-all": "^4.1.5",
    "postcss": "^8.5.6",
    "postcss-load-config": "^6.0.1",
    "rimraf": "^6.0.1",
    "semantic-release": "^24.2.7",
    "storybook": "^9.1.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.3",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.2.4",
    "vitest-browser-react": "^1.0.1"
  },
  "release": {
    "branches": [
      "main"
    ],
    "plugins": [
      [
        "@semantic-release/commit-analyzer",
        {
          "preset": "conventionalcommits"
        }
      ],
      "@semantic-release/release-notes-generator",
      "@semantic-release/github"
    ]
  }
}

стили я пишу в отдельном файле import styles from './LocalizedNotFound.module.scss'
не надо использовать БЭМ, если нужны кастомные стили, то пиши в отдельный файл, 
или используй инлайн стили, но лучше дефолтные компоненты Ant Design

Вот пример компонента с локализацией
import type { Metadata } from 'next'
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import styles from './LocalizedNotFound.module.scss'

type NotFoundProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(
  props: NotFoundProps,
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: 'NotFound',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function LocalizedNotFound(props: NotFoundProps) {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: 'NotFound',
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Result
        status='404'
        title='404'
        subTitle={t('description')}
        extra={[
          <Link href={`/${locale}`} key='home'>
            <Button type='primary' icon={<HomeOutlined />} size='large'>
              {t('go_home')}
            </Button>
          </Link>,
          <Button
            key='back'
            icon={<ArrowLeftOutlined />}
            size='large'
            onClick={() => window.history.back()}
          >
            {t('go_back')}
          </Button>,
        ]}
      />
    </div>
  )
}
вот пример простого компонета 
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

мой eslint.config.js
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import playwright from 'eslint-plugin-playwright'
import storybook from 'eslint-plugin-storybook'
import tailwind from 'eslint-plugin-tailwindcss'

export default antfu(
  {
    react: true,
    nextjs: true,
    typescript: true,
    lessOpinionated: true,
    isInEditor: false,
    stylistic: {
      semi: false,
      quotes: 'single',
    },
    formatters: {
      css: true,
    },
    ignores: ['migrations/**/*'],
  },
  jsxA11y.flatConfigs.recommended,
  ...tailwind.configs['flat/recommended'],
  {
    settings: {
      tailwindcss: {
        config: `${dirname(fileURLToPath(import.meta.url))}/src/styles/global.css`,
      },
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e.ts'],
    ...playwright.configs['flat/recommended'],
  },
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      'antfu/no-top-level-await': 'off',
      'style/brace-style': ['error', '1tbs'],
      'ts/consistent-type-definitions': ['error', 'type'],
      'react/prefer-destructuring-assignment': 'off',
      'node/prefer-global/process': 'off',
      'test/padding-around-all': 'error',
      'test/prefer-lowercase-title': 'off',
      'style/jsx-quotes': ['error', 'prefer-single'],
      'style/quotes': ['error', 'single'],

      // Отключить конфликтующее правило
      'style/jsx-one-expression-per-line': 'off',
    },
  },
)
а вот prettier.
{
  "arrowParens": "always",
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "htmlWhitespaceSensitivity": "strict",
  "jsxSingleQuote": true,
  "printWidth": 80,
  "proseWrap": "never",
  "quoteProps": "as-needed"
}

всегда следи за типизацией и старайся писать на typescript
всегда следи за eslint и prettier
всегда используй локализацию через next-intl
а также пищи файлы локализации на ru и en
в формате 
{
    "namespace": {
        "key": "translation"
    } 
}
пиши код только в соответствии с моим package.json
пиши код только в соответствии с моим eslint.config.js
пиши код только в соответствии с моим prettier.config.js
пиши код только в соответствии с моим next.config.js
пиши код только в соответствии с моим tsconfig.json

