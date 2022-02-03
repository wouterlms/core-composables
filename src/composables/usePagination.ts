import {
  Ref,
  computed,
  isRef,
  ref,
  watch,
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

type Options<R> = {
  replaceOnFetch?: boolean,
  hasContainer?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformer?: (obj: any) => R,
}

// eslint-disable-next-line @typescript-eslint/ban-types
type InferReturnType<U, V> = U extends Options<infer R> ? U['transformer'] extends Function ? R : V : V

export default <
  R,
  O extends Options<unknown> = Options<unknown>,
  T = InferReturnType<O, R>
>(
  url: string | Ref<string>,
  options: O = {
    replaceOnFetch: false,
    hasContainer: false,
  } as O
) => {
  const urlRef = isRef(url) ? url : ref(url)

  const {
    replaceOnFetch,
    hasContainer,
    transformer,
  } = options

  const pagination = ref<Pagination | null>(null)

  const results = ref<T[]>([]) as Ref<T[]>
  const resultsTransformed = transformer
    ? computed<T[]>({
      get() {
        return results.value.map((v) => transformer(v))as T[]
      },
      set(value: T[]) {
        results.value = value
      },
    })
    : undefined

  const isLoading = ref(false)

  const setData = (data: {
    data: T[],
    links: { next: string | null, previous: string | null },
    meta: { total: number, pages: number, page: number }
  }) => {
    if (replaceOnFetch) {
      results.value = data.data
    } else {
      results.value = [ ...results.value || [], ...data.data ]
    }

    isLoading.value = false

    pagination.value = {
      ...data.meta,
      ...data.links,
    }
  }

  const fetchPrevious = async () => {
    if (pagination.value?.previous && !isLoading.value) {
      isLoading.value = true

      const { data } = await axios.get(pagination.value.previous)

      setData(data)
    }
  }

  const refresh = async () => {
    isLoading.value = true

    const { data } = await axios.get(urlRef.value)

    results.value = []

    setData(data)
  }

  const fetchNext = async (resetResults?: boolean) => {
    if (isLoading.value || (pagination.value && !pagination.value?.next)) {
      return
    }

    const url = pagination.value?.next || urlRef.value

    isLoading.value = true

    const { data } = await axios.get(url)

    if (resetResults) {
      results.value = []
    }

    setData(data)
  }

  const fetchNextIfReachedScrollBottom = () => {
    const { scrollHeight } = document.body
    const { scrollY, innerHeight } = window

    const scrollPosition = scrollY + innerHeight
    const hasReachedBottom = scrollPosition >= scrollHeight

    if (hasReachedBottom) {
      fetchNext()
    }
  }

  if (!hasContainer) {
    useEventListener('scroll', () => {
      fetchNextIfReachedScrollBottom()
    })
  }

  watch(urlRef, () => {
    pagination.value = null
    fetchNext(true)
  })

  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    results: transformer ? resultsTransformed! : results,
    pagination,
    isLoading,
    fetchPrevious,
    fetchNext,
    refresh,
  }
}
