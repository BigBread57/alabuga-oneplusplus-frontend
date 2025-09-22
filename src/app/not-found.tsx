import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function GlobalNotFound() {
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language') || ''

  // Определяем локаль
  const locale = acceptLanguage.includes('ru') ? 'ru' : 'en'

  // Редиректим на локализованную 404
  redirect(`/${locale}/404`)
}
