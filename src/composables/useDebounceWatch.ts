import {
  Ref,
  WatchOptions,
  isRef,
  watch
} from 'vue'

export default <T>(
  ref: Ref<T> | (() => T),
  cb: (value: T) => void,
  timeout: number,
  options?: WatchOptions
  // eslint-disable-next-line max-params
): void => {
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null

  watch(
    ref,
    () => {
      if (debounceTimeout !== null) {
        clearTimeout(debounceTimeout)
      }

      debounceTimeout = setTimeout(() => {
        cb(isRef(ref) ? ref.value : ref())
      }, timeout)
    },
    options
  )
}
