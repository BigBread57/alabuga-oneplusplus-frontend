import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PostsCard } from '@/components/News/PostsCard'

type PostProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(props: PostProps): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale,
    namespace: 'Post',
  })

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  }
}

export default async function Post(_props: PostProps) {
  return <PostsCard />
}
