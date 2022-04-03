import {
  Ref,
  isRef,
  ref,
  watch
} from 'vue'

import axios from 'axios'

import useEventListener from './useEventListener'

interface Pagination {
  previous: string | null
  next: string | null
  total: number
  pages: number
  page: number
}

interface Options {
  replaceOnFetch?: boolean
  hasContainer?: boolean
}

export default <R, O extends Options = Options>(
  url: string | Ref<string>,
  options: O = {
    replaceOnFetch: false,
    hasContainer: false
  } as unknown as O
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
  const urlRef = isRef(url) ? url : ref(url)

  const {
    replaceOnFetch,
    hasContainer
  } = options

  const pagination = ref<Pagination | null>(null)

  const results = ref<R[]>([]) as Ref<R[]>

  const isLoading = ref(false)

  const setData = (data: {
    data: R[]
    links: { next: string | null, previous: string | null }
    meta: { total: number, pages: number, page: number }
  }): void => {
    if (replaceOnFetch === true) {
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
    if (isLoading.value || ((pagination.value != null) && typeof pagination.value?.next === 'string')) {
      return
    }

    isLoading.value = true

    const url = typeof pagination.value?.next === 'string' ? pagination.value.next : urlRef.value
    const { data } = await axios.get(url)

    if (resetResults === true) {
      results.value = []
    }

    setData(data)
  }

  const fetchNextIfReachedScrollBottom = (): void => {
    const { scrollHeight } = document.body
    const { scrollY, innerHeight } = window

    const scrollPosition = scrollY + innerHeight
    const hasReachedBottom = scrollPosition >= scrollHeight

    if (hasReachedBottom) {
      void fetchNext()
    }
  }

  if (hasContainer !== true) {
    useEventListener('scroll', () => {
      fetchNextIfReachedScrollBottom()
    })
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
