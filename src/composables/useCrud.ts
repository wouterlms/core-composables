import {
  Ref,
  computed,
  onBeforeUnmount,
  ref,
} from 'vue'

import axios,
{
  AxiosResponse,
} from 'axios'

import { HttpMethod } from '../enums'

type GetOverload<T> = {
  (id: string | number): Promise<AxiosResponse<{ data: Readonly<T> }>>
  (): Promise<AxiosResponse<{ data: Readonly<T[]> }>>
}

type Options<R> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformer?: (obj: any) => R,
}

type Crud<T> = {
  one: Readonly<Ref<T | null>>,
  all: Readonly<Ref<NonNullable<T>[]>>,
  isLoading: Readonly<Ref<boolean>>
  delete: (id: string | number) => Promise<AxiosResponse<{ data: null }>>
  get: GetOverload<T>
  post: (data: Partial<Record<keyof T, unknown>> | FormData) =>
    Promise<AxiosResponse<{ data: NonNullable<T> }>>
  put: (data: Partial<Record<keyof T, unknown>> & { id: number | string } | FormData) =>
    Promise<AxiosResponse<{ data: NonNullable<T> }>>
  cancelRequest: () => void
}

// eslint-disable-next-line @typescript-eslint/ban-types
type InferReturnType<U, V> = U extends Options<infer R> ? U['transformer'] extends Function ? R : V : V

export default <
  R,
  O extends Options<unknown> = Options<unknown>,
  T = NonNullable<InferReturnType<O, R>>,
>(baseUrl: string, options: O = {} as O): Crud<T> => {
  const { transformer } = options as Options<unknown>

  const one = ref(null) as Ref<T | null>
  const all = ref([]) as Ref<NonNullable<T>[]>

  const oneTransformed = transformer
    ? computed(() => transformer(one.value))
    : undefined

  const allTransformed = transformer
    ? computed(() => all.value.map((v) => transformer(v)))
    : undefined

  const isLoading = ref(false)

  const source = axios.CancelToken.source()

  const cancelRequest = (msg?: string) => source.cancel(msg)

  onBeforeUnmount(() => {
    cancelRequest('onBeforeUnmount')
  })

  const buildRequest = <O>(
    httpMethod: HttpMethod, url: string, data?: unknown
  ) => {
    const request = httpMethod === HttpMethod.GET || httpMethod === HttpMethod.DELETE
      ? axios[httpMethod]<O>(url, {
        cancelToken: source.token,
      })
      : axios[httpMethod]<O>(
        url, data, {
          cancelToken: source.token,
        }
      )

    isLoading.value = true

    request.finally(() => {
      isLoading.value = false
    })

    return request
  }

  const get: GetOverload<T> = (id?: string | number) => {
    const request = buildRequest<{ data:(typeof id extends undefined ? T[] : T) }>(
      HttpMethod.GET, id ? `${baseUrl}/${id}` : baseUrl)

    request.then(({ data }) => {
      if (id) {
        one.value = data.data
      } else {
        all.value = data.data as unknown as NonNullable<T>[]
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return request as any
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  const deleteOne = (
    id: number | string
  ) => buildRequest<{ data: null }>(HttpMethod.DELETE, `${baseUrl}/${id}`)

  const post = (data: Partial<Record<keyof T, unknown>> | FormData) => (
    buildRequest<{ data: NonNullable<T> }>(
      HttpMethod.POST, baseUrl, data
    )
  )

  const put = (data: Partial<Record<keyof T, unknown>> & { id: number | string } | FormData) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT')

      const id = data.get('id')

      return buildRequest<{ data: NonNullable<T> }>(
        HttpMethod.POST, `${baseUrl}${id ? `/${id}` : ''}`, data
      )
    }

    return buildRequest<{ data: NonNullable<T> }>(
      HttpMethod.PUT, `${baseUrl}${data.id ? `/${data.id}` : ''}`, data
    )
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    one: (transformer ? oneTransformed : one) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    all: (transformer ? allTransformed : all) as any,
    isLoading,
    delete: deleteOne,
    get,
    post,
    put,
    cancelRequest,
  }
}
