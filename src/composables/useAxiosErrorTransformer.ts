import { AxiosError } from 'axios'

export default () => {
  const transform = (errors: AxiosError) => {
    const errorsObj: Record<string, string[]> = errors.response?.data.errors

    if (!errorsObj) {
      return {}
    }

    const errorsMapped: Record<string, string> = {}

    Object.entries(errorsObj).forEach(([ key, value ]) => {
      [ errorsMapped[key] ] = value
    })

    return errorsMapped
  }

  return transform
}
