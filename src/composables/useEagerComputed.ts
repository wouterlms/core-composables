import {
  DeepReadonly,
  Ref,
  readonly,
  shallowRef,
  watchEffect
} from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default <T>(fn: (...args: any) => T): Readonly<Ref<DeepReadonly<T>>> => {
  const result = shallowRef()

  watchEffect(() => {
    result.value = fn()
  }, {
    flush: 'sync'
  })

  return readonly<Ref<T>>(result)
}
