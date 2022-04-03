
import {
  Ref,
  UnwrapRef,
  ref,
  watch
} from 'vue'
import useEventListener from './useEventListener'

import { Storage } from '@/enums'

export default <T>(storageKey: Storage, key: string, defaultValue?: T): Ref<UnwrapRef<T>> => {
  const storage = window[storageKey]

  const valueRef = ref<T>(storage.getItem(key) !== null
    ? JSON.parse(storage.getItem(key) as string)
    : defaultValue)

  watch(
    valueRef, () => {
      if (valueRef.value === null) {
        storage.removeItem(key)
      } else {
        storage.setItem(key, JSON.stringify(valueRef.value))
      }

      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(valueRef.value)
      }))
    }, { deep: true }
  )

  if ((defaultValue != null) && storage.getItem(key) === null) {
    storage.setItem(key, JSON.stringify(defaultValue))
  }

  useEventListener('storage', ({ key: keyChanged, newValue }: StorageEvent) => {
    if (keyChanged === key && newValue !== JSON.stringify(valueRef.value)) {
      valueRef.value = newValue !== null ? JSON.parse(newValue) : newValue
    }
  })

  return valueRef
}
