import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { QueryClientWrapper } from '@/components/_base/QueryClientWrapper'
import { CurrentUserProvider } from '@/components/CurrentUserProvider'
import { routing } from '@/libs/I18nRouting'
import { AntdProvider } from '@/providers/antd'
import { ThemeProvider } from '@/providers/ThemeProvider'
import '@/styles/global.css'

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <html lang={locale}>
      <body
        style={{
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        }}
      >
        <NextIntlClientProvider>
          <ThemeProvider>
            <AntdProvider>
              <QueryClientWrapper>
                <CurrentUserProvider>{props.children}</CurrentUserProvider>
              </QueryClientWrapper>
            </AntdProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
