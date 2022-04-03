import {
  Ref,
  WritableComputedRef,
  computed,
  getCurrentInstance
} from 'vue'

export default <T>(value: Ref<T>, key = 'modelValue'): WritableComputedRef<T> => {
  const instance = getCurrentInstance()

  if (instance === null) {
    throw new Error('No instance for vModel')
  }

  return computed<T>({
    get () {
      return value.value
    },
    set (newValue) {
      instance.emit(`update:${key}`, newValue)
    }
  })
}
