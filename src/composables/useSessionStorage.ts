import { Storage } from '../enums'
import useStorage from './useStorage'

export default <T>(key: string, defaultValue?: T): ReturnType<typeof useStorage> => useStorage(
  Storage.SESSION, key, defaultValue
)
