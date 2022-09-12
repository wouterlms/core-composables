
import { Ref, ref } from 'vue'
import useLocalStorage from './useLocalStorage'
import useSessionStorage from './useSessionStorage'
import { Storage } from '@/enums'

const globalState = new Map()

export default <T>(id: string, state: T, persist?: Storage): Ref<T> => {
  if (persist === undefined) {
    if (globalState.get(id) === undefined) {
      globalState.set(id, ref(state))
    }

    return globalState.get(id)
  }

  if (persist === Storage.LOCAL) {
    return useLocalStorage<T>(id, state) as Ref<T>
  }

  return useSessionStorage<T>(id, state) as Ref<T>
}
