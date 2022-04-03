import { ComputedRef, computed } from 'vue'

export default (
  url: string, parameters: Record<string, string | number | null>
): ComputedRef<string> => computed(() => {
  let fullUrl = url

  Object.entries(parameters).forEach(([key, value]) => {
    const appendCharacter = !fullUrl.includes('?') ? '?' : '&'

    if (value !== null) {
      fullUrl += `${appendCharacter}${key}=${value}`
    }
  })

  return fullUrl
})
