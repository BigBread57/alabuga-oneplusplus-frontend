type FieldType = 'field' | 'choice' | 'nested object' | 'integer' | 'string'
type Choice = {
  value: string
  display_name: string
}

type Child = {
  type: FieldType
  required: boolean
  read_only: boolean
  label: string
  max_length?: number
  children?: Record<string, Child>
  choices?: Choice[]
  child?: Child
}

type Options = {
  [key: string]: {
    type: FieldType
    required: boolean
    read_only: boolean
    label: string
    choices?: Choice[]
    children?: Record<string, Child>
    child?: Child
  }
}

type Data = {
  [key: string]: any
}

export function mergeObjects(options: Options, data: Data) {
  const resultOption: any = { ...options }

  const { hasOwnProperty } = Object.prototype

  Object.keys(data || {}).forEach((key) => {
    if (hasOwnProperty.call(data, key) && hasOwnProperty.call(options, key)) {
      if (
        options?.[key]?.type === 'nested object'
        && typeof data[key] === 'object'
        && !Array.isArray(data[key])
      ) {
        resultOption[key].children = mergeObjects(
          options[key]?.children || {},
          data[key],
        )
      } else if (
        options[key]?.type === 'nested object'
        && Array.isArray(data[key])
      ) {
        resultOption[key].value = data[key]
      } else {
        resultOption[key].value = data[key]
      }
    }
  })

  return resultOption
}
