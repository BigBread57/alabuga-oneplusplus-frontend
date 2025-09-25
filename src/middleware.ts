import type { NextRequest } from 'next/server'
import { detectBot } from '@arcjet/next'
import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import arcjet from '@/libs/Arcjet'
import { routing } from './libs/I18nRouting'

// i18n маршрутизация
const handleI18nRouting = createMiddleware(routing)

// защищённые роуты
const protectedRoutes = [
  '/journal',
  '/:locale/journal',
  '/news',
  '/:locale/news',
  '/profile',
  '/:locale/profile',
  '/rang',
  '/:locale/rang',
  '/shop',
  '/:locale/shop',
  '/layout-log',
  '/:locale/layout-log',
]

// Arcjet — защита от ботов
const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW', 'CATEGORY:MONITOR'],
  }),
)

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace(':locale', '[a-z]{2}')}(.*)$`)
    return regex.test(pathname)
  })
}

export default async function middleware(request: NextRequest) {
  console.error('Middleware called for', request.url)
  // Проверка на ботов
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request)
    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const { pathname } = request.nextUrl

  // Если защищённый маршрут — проверяем сессию
  if (isProtectedRoute(pathname)) {
    const sessionId = request.cookies.get('sessionid')?.value

    if (!sessionId) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // проверяем сессию через backend
    const res = await fetch(`${process.env.API_URL}/user/users/info`, {
      headers: {
        Cookie: `sessionid=${sessionId}`,
      },
    })

    if (!res.ok) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  // i18n маршрутизация
  return handleI18nRouting(request)
}

export const config = {
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
}
