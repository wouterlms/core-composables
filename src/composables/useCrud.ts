import {
  Ref,
  onBeforeUnmount,
  ref
} from 'vue'

import axios,
{
  AxiosResponse
} from 'axios'

import { HttpMethod } from '../enums'

interface GetOverload<T> {
  (id: string | number): Promise<AxiosResponse<Readonly<T>>>
  (): Promise<AxiosResponse<Readonly<T[]>>>
}

interface Crud<T, C, U> {
  one: Readonly<Ref<T | null>>
  all: Readonly<Ref<Array<NonNullable<T>>>>
  isLoading: Readonly<Ref<boolean>>
  // eslint-disable-next-line @typescript-eslint/ban-types
  delete: (id: string | number) => Promise<AxiosResponse<{}>>
  get: GetOverload<T>
  post: (data: C | FormData) => Promise<AxiosResponse<NonNullable<T>>>
  put: (
    data: U & { id: number | string } | FormData
  ) => Promise<AxiosResponse<NonNullable<T>>>
  cancelRequest: () => void
}

export default <
  R,
  C = Partial<Record<keyof R, unknown>>,
  U = Partial<Record<keyof R, unknown>>
>(baseUrl: string): Crud<R, C, U> => {
  const one = ref(null) as Ref<R | null>
  const all = ref([]) as Ref<Array<NonNullable<R>>>

  const isLoading = ref(false)

  const source = axios.CancelToken.source()

  const cancelRequest = (msg?: string): void => {
    source.cancel(msg)
  }

  onBeforeUnmount(() => {
    cancelRequest('onBeforeUnmount')
  })

  const buildRequest = async <O>(
    httpMethod: HttpMethod,
    url: string,
    data?: unknown
  ): Promise<AxiosResponse<O>> => {
    const request = httpMethod === HttpMethod.GET || httpMethod === HttpMethod.DELETE
      ? axios[httpMethod]<O>(url, {
        cancelToken: source.token
      })
      : axios[httpMethod]<O>(
        url, data, {
          cancelToken: source.token
        }
      )

    isLoading.value = true

    request.finally(() => {
      isLoading.value = false
    })

    return await request
  }

  const get: GetOverload<R> = (id?: string | number) => {
    const request = buildRequest<typeof id extends undefined ? R[] : R>(
      HttpMethod.GET, id !== undefined ? `${baseUrl}/${id}` : baseUrl
    )

    void request.then(({ data }) => {
      if (id !== undefined) {
        one.value = data
      } else {
        all.value = data as unknown as Array<NonNullable<R>>
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return request as any
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  const deleteOne: Crud<R, C, U>['delete'] = async (id) => await buildRequest<{}>(HttpMethod.DELETE, `${baseUrl}/${id}`)

  const post: Crud<R, C, U>['post'] = async (data) => (
    await buildRequest<NonNullable<R>>(
      HttpMethod.POST, baseUrl, data
    )
  )

  const put: Crud<R, C, U>['put'] = async (data) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT')

      const id: FormDataEntryValue | null = data.get('id') ?? null

      return await buildRequest<NonNullable<R>>(
        HttpMethod.POST, `${baseUrl}${typeof id === 'string' ? `/${id}` : ''}`, data
      )
    }

    return await buildRequest<NonNullable<R>>(
      HttpMethod.PUT, `${baseUrl}${data.id !== undefined && data.id !== null ? `/${data.id}` : ''}`, data
    )
  }

  return {
    one,
    all,
    isLoading,
    delete: deleteOne,
    get,
    post,
    put,
    cancelRequest
  }
}
