import { computed } from 'vue'

export default (url: string, parameters: Record<string, string | number | null>) => computed(() => {
  let fullUrl = url

  Object.entries(parameters).forEach(([ key, value ]) => {
    const appendCharacter = !fullUrl.includes('?') ? '?' : '&'

    if (value) {
      fullUrl += `${appendCharacter}${key}=${value}`
    }
  })

  return fullUrl
})
