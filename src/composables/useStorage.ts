import {
  ref,
  watch,
} from 'vue'
import { Storage } from '@/enums'

import useEventListener from './useEventListener'

export default <T>(storageKey: Storage, key: string, defaultValue?: T) => {
  const storage = window[storageKey]

  // eslint-disable-next-line max-len
  const valueRef = ref<T>(storage.getItem(key)
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
        newValue: JSON.stringify(valueRef.value),
      }))
    }, { deep: true }
  )

  if (defaultValue && storage.getItem(key) === null) {
    storage.setItem(key, JSON.stringify(defaultValue))
  }

  useEventListener('storage', ({ key: keyChanged, newValue }: StorageEvent) => {
    if (keyChanged === key && newValue !== JSON.stringify(valueRef.value)) {
      valueRef.value = newValue !== null ? JSON.parse(newValue) : newValue
    }
  })

  return valueRef
}
