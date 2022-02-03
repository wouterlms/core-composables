import {
  ComputedRef,
  Ref,
  ref,
  watch,
} from 'vue'

const template = ref('{title}')

export default () => {
  const documentTitle = ref<string>(document.title)

  const setTemplate = (title: string) => {
    if (!title.includes('{title}')) {
      throw Error('Template must contain \'{title}\'')
    }

    template.value = title
  }

  const setTitle = (title: string) => {
    document.title = template.value.replace('{title}', title)
  }

  const syncDocumentTitle = (value: Ref<string | null> | ComputedRef<string | null>) => {
    watch(
      value, () => {
        if (value.value) {
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
    syncDocumentTitle,
  }
}
