import type { LocalizationResource } from '@clerk/types'
import type { LocalePrefixMode } from 'next-intl/routing'
import { enUS, ruRU } from '@clerk/localizations'

const localePrefix: LocalePrefixMode = 'always'

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'Nextjs Starter',
  locales: ['en', 'ru'],
  defaultLocale: 'ru',
  localePrefix,
}

const supportedLocales: Record<string, LocalizationResource> = {
  en: enUS,
  ru: ruRU,
}

export const ClerkLocalizations = {
  defaultLocale: enUS,
  supportedLocales,
}
