import {
  Ref,
  effectScope,
  ref,
} from 'vue'

import useLocalStorage from './useLocalStorage'
import useSessionStorage from './useSessionStorage'

import { Storage } from '../enums'

interface Options {
  storage?: Storage
  storageKey?: string
}

/*
Example:

const users = useGlobalState<User[]>([], {
  storage: Storage.SESSION,
  storageKey: 'users',
})

export default () => users
*/

export default <T>(defaultValue: T, options: Options = {}) => {
  const { storage, storageKey } = options

  if (storage !== undefined && !storageKey) {
    throw new Error('`storageKey` is required when using `storage`')
  }

  const scope = effectScope(true)

  const state = scope.run(() => {
    if (storage !== undefined) {
      if (storage === Storage.LOCAL) {
        return useLocalStorage<T>(storageKey as string, defaultValue)
      }

      return useSessionStorage<T>(storageKey as string, defaultValue)
    }

    return ref<T>(defaultValue)
  })

  return state as Ref<T>
}
