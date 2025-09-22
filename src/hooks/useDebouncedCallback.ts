import { debounce } from 'lodash'
import { useRef } from 'react'

export type UseDebouncedCallbackArgs = Parameters<typeof debounce>
export type DebouncedCallback = UseDebouncedCallbackArgs[0]
export type DebounceDelay = UseDebouncedCallbackArgs[1]
export type DebounceOptions = UseDebouncedCallbackArgs[2]

export const useDebouncedCallback = (
  callback: DebouncedCallback,
  delay?: DebounceDelay,
  options?: DebounceOptions,
): DebouncedCallback => {
  const debouncedCallback = useRef(debounce(callback, delay, options))
  return debouncedCallback.current
}
