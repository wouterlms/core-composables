import {
  Ref,
  isRef,
  ref,
  watch
} from 'vue'

import axios from 'axios'

interface Pagination {
  previous: string | null
  next: string | null
  total: number
  pages: number
  page: number
}

interface Options {
  replaceResults?: boolean
}

export default <R>(
  url: string | Ref<string>,
  options: Options = {
    replaceResults: false
  }
): {
  results: Ref<R[]>
  pagination: Ref<{
    previous: string | null
    next: string | null
    total: number
    pages: number
    page: number
  } | null>
  isLoading: Ref<boolean>
  fetchPrevious: () => Promise<void>
  fetchNext: (resetResults?: boolean | undefined) => Promise<void>
  refresh: () => Promise<void>
} => {
  const { replaceResults } = options

  const urlRef = isRef(url) ? url : ref(url)
  const pagination = ref<Pagination | null>(null)
  const results = ref<R[]>([]) as Ref<R[]>
  const isLoading = ref(false)

  const setData = (data: {
    data: R[]
    links: { next: string | null, previous: string | null }
    meta: { total: number, pages: number, page: number }
  }): void => {
    if (replaceResults === true) {
      results.value = data.data
    } else {
      results.value = [...results.value, ...data.data]
    }

    isLoading.value = false

    pagination.value = {
      ...data.meta,
      ...data.links
    }
  }

  const fetchPrevious = async (): Promise<void> => {
    if (typeof pagination.value?.previous === 'string' && !isLoading.value) {
      isLoading.value = true

      const { data } = await axios.get(pagination.value.previous)

      setData(data)
    }
  }

  const refresh = async (): Promise<void> => {
    isLoading.value = true

    const { data } = await axios.get(urlRef.value)

    results.value = []

    setData(data)
  }

  const fetchNext = async (resetResults?: boolean): Promise<void> => {
    if (isLoading.value || (pagination.value !== null && typeof pagination.value?.next !== 'string')) {
      return
    }

    const url = typeof pagination.value?.next === 'string' ? pagination.value.next : urlRef.value

    isLoading.value = true

    const { data } = await axios.get(url)

    if (resetResults === true) {
      results.value = []
    }

    setData(data)
  }

  watch(urlRef, () => {
    pagination.value = null
    void fetchNext(true)
  })

  return {
    results,
    pagination,
    isLoading,
    fetchPrevious,
    fetchNext,
    refresh
  }
}
