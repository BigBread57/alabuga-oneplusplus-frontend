import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LocalizedNotFound() {
  // Получаем locale из заголовков или URL
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-url') || ''

  // Извлекаем locale из pathname
  const segments = pathname.split('/').filter(Boolean)
  const locale = segments[0] || 'en'

  redirect(`/${locale}/404`)
}
