import {
  ComputedRef,
  Ref,
  ref,
  watch
} from 'vue'

const template = ref('{title}')

export default (): {
  documentTitle: Ref<string>
  setTemplate: (title: string) => void
  syncDocumentTitle: (value: Ref<string | null> | ComputedRef<string | null>) => void
} => {
  const documentTitle = ref<string>(document.title)

  const setTemplate = (title: string): void => {
    if (!title.includes('{title}')) {
      throw Error('Template must contain \'{title}\'')
    }

    template.value = title
  }

  const setTitle = (title: string): void => {
    document.title = template.value.replace('{title}', title)
  }

  const syncDocumentTitle = (value: Ref<string | null> | ComputedRef<string | null>): void => {
    watch(
      value, () => {
        if (typeof value.value === 'string') {
          setTitle(value.value)
        }
      }, { immediate: true }
    )
  }

  watch(documentTitle, () => {
    if (documentTitle.value !== document.title) {
      setTitle(documentTitle.value)
    }
  })

  return {
    documentTitle,
    setTemplate,
    syncDocumentTitle
  }
}
