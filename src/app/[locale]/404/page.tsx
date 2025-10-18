import type { Metadata } from 'next'
import { Rocket } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

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
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-8'>
      {/* Фоновые эффекты */}
      <div className='fixed inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500 opacity-10 mix-blend-screen blur-3xl filter' />
        <div className='absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-cyan-400 opacity-10 mix-blend-screen blur-3xl filter' />
      </div>

      <div className='relative z-10 w-full max-w-md text-center'>
        {/* 404 заголовок */}
        <div className='mb-8'>
          <h1 className='mb-4 bg-gradient-to-r from-cyan-400 via-pink-400 to-indigo-400 bg-clip-text text-6xl font-bold text-transparent md:text-7xl'>
            404
          </h1>
          <p className='text-lg text-gray-300'>{t('description')}</p>
        </div>

        {/* Декоративная ракета */}
        <div className='mb-10 flex justify-center'>
          <div className='relative h-24 w-24'>
            <Rocket
              size={80}
              className='animate-bounce text-indigo-400'
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Карточка с текстом */}
        <div className='mb-10 rounded-2xl border border-indigo-500/20 bg-transparent p-8 backdrop-blur-xs'>
          <p className='mb-4 text-sm text-gray-400'>{t('description')}</p>
          <p className='text-xs text-gray-500'>
            Страница, которую вы ищете, не существует или была перемещена.
          </p>
        </div>

        {/* Кнопка */}
        <Link href='/'>
          <button
            type='button'
            className='group relative overflow-hidden rounded-lg px-8 py-3 font-semibold text-white transition-all duration-300'
          >
            <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 opacity-100 transition-opacity group-hover:opacity-80' />
            <div className='absolute inset-0 bg-slate-900 opacity-0 transition-opacity group-hover:opacity-5' />
            <div className='relative flex items-center justify-center gap-2'>
              <Rocket size={18} />
              {t('go_home')}
            </div>
          </button>
        </Link>

        {/* Дополнительная информация */}
        <p className='mt-8 text-xs text-gray-600'>
          Если проблема сохраняется, свяжитесь с поддержкой
        </p>
      </div>
    </div>
  )
}
