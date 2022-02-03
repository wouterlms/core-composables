import useStorage from './useStorage'

import { Storage } from '../enums'

export default <T>(key: string, defaultValue?: T) => useStorage(
  Storage.SESSION, key, defaultValue
)
