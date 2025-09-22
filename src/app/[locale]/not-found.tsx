import { redirect } from 'next/navigation'

type NotFoundProps = {
  params: Promise<{ locale: string }>
}

export default async function LocalizedNotFound(props: NotFoundProps) {
  const { locale } = await props.params
  redirect(`/${locale}/404`)
}
