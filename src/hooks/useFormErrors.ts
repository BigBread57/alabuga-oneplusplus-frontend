import { useState } from 'react'

export type FormErrorsHook = {
  errors: FormErrorObj
  setFormErrors: (responseErrors: any) => void
}
export type FormError = {
  validateStatus:
    | ''
    | 'error'
    | 'success'
    | 'warning'
    | 'validating'
    | undefined
  help: string
}
export type FormErrorObj = {
  [key: string]: FormError | any
}

const getErrorsObj = (errors: string[]): FormError => {
  let errorsMessages = ''
  try {
    errorsMessages = errors?.join(', ')
  } catch (err) {
    console.error('Error parsing errors:', err)
  }
  return {
    validateStatus: 'error',
    help: errorsMessages,
  }
}
/**
 * Хук подготовки ошибок с бэка для формы
 * Для компонента _base/FormItem нужно передать errors={errors['propErrorName']}
 * В Form.Item нужно деструктуризировать объект ошибок {...errors['propErrorName']}
 */
export const useFormErrors = () => {
  const [errors, setErrors] = useState({})
  const setFormErrors = (responseErrors: Record<string, string[]>) => {
    const formErrorsObj = {} as FormErrorObj
    Object.entries(responseErrors).forEach(
      ([k, errorsList]: [k: string, errorsList: string[]]) => {
        formErrorsObj[k] = getErrorsObj(errorsList)
      },
    )
    setErrors(() => ({ ...formErrorsObj }))
  }

  return { errors, setFormErrors }
}
