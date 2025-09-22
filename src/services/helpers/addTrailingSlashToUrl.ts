/**
 * Проверяем строку на наличие закрывающего слэша,
 * если его нет, то добавляем его к URL
 * @param URLString
 */
export const addTrailingSlashToUrl = (URLString: string) => {
  const lastChar = URLString.at(-1)
  if (lastChar !== '/') {
    return `${URLString}/`
  }
  return URLString
}
