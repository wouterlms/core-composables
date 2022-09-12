import { ComputedRef, computed } from 'vue'

export default (
  url: string, parameters: Record<string, string | number | null>
): ComputedRef<string> => computed(() => {
  let urlWithQueryParams = url

  Object.entries(parameters).forEach(([key, value]) => {
    const appendChar = !urlWithQueryParams.includes('?') ? '?' : '&'

    if (value !== null && (typeof value === 'number' || value.length > 0)) {
      urlWithQueryParams += `${appendChar}${key}=${encodeURI(`${value}`)}`
    }
  })

  return urlWithQueryParams
})
