import { AxiosError } from 'axios'

export default (): (errors: AxiosError) => Record<string, string> => {
  const transform = (errors: AxiosError): Record<string, string> => {
    const errorsObj: Record<string, string[]> | null = errors.response?.data.errors ?? null

    if (errorsObj == null) {
      return {}
    }

    const errorsMapped: Record<string, string> = {}

    Object.entries(errorsObj).forEach(([key, value]) => {
      [errorsMapped[key]] = value
    })

    return errorsMapped
  }

  return transform
}
