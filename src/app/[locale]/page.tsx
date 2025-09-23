import { redirect } from 'next/navigation'

type IMainPageProps = {
  params: Promise<{ locale: string }>
}

export default async function MainPage(props: IMainPageProps) {
  const { locale } = await props.params
  redirect(`/${locale}/profile`)
}
