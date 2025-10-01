import type { NextRequest } from 'next/server'
import { detectBot } from '@arcjet/next'
import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import arcjet from '@/libs/Arcjet'
import { routing } from './libs/I18nRouting'

const API_URL = process.env.API_URL || 'http://localhost:8000/api/v1'

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
  '/shop/purchases',
  '/:locale/shop/purchases',
  '/layout-log',
  '/:locale/layout-log',
  '/admin',
  '/:locale/admin',
  '/admin/missions',
  '/:locale/admin/missions',
  '/admin/lor',
  '/:locale/admin/lor',
  '/admin/statistics',
  '/:locale/admin/statistics',
  '/admin/shop',
  '/:locale/admin/shop',
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
    try {
      // проверяем сессию через backend
      const res = await fetch(`${API_URL}/user/users/info`, {
        headers: {
          Cookie: `sessionid=${sessionId}`,
        },
      })
      if (!res.ok) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }
    } catch (e) {
      console.error('Session check error:', e)
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  // i18n маршрутизация
  return handleI18nRouting(request)
}

export const config = {
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
}
