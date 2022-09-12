import { computed, ref } from 'vue'

interface BrowseOptions {
  mimeTypes?: string[]
  multiple?: boolean
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default () => {
  const files = ref<File[]>([])

  const handleFileInput = (results: File[]): void => {
    if (results.length > 0) {
      files.value = []
      files.value.push(...results)
    }
  }

  const browse = ({
    mimeTypes,
    multiple
  }: BrowseOptions): void => {
    const input = document.createElement('input')

    input.style.transform = 'scale(0)'

    document.body.appendChild(input)

    input.type = 'file'
    input.accept = mimeTypes?.join(',') ?? ''
    input.multiple = multiple ?? false

    const handleClose = (): void => {
      document.body.removeChild(input)
      window.removeEventListener('focus', close)
    }

    input.addEventListener('change', (e: Event) => {
      const { files: results } = e.target as HTMLInputElement

      if (results != null) {
        handleFileInput([...results])
      }
    }, { once: true })

    window.addEventListener('focus', handleClose)

    input.click()
  }

  return {
    file: computed<File | null>(() => files.value[0] ?? null),
    files,
    browse
  }
}
