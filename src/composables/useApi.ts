import { Ref, UnwrapRef, ref } from 'vue'

import axios, { AxiosResponse } from 'axios'

import { HttpMethod } from '@/enums'

export default <T>(url: string): {
  data: Ref<UnwrapRef<T> | null>
  isLoading: Ref<boolean>
  get: () => Promise<AxiosResponse>
  post: (data: Record<string, unknown> | unknown[] | FormData) => Promise<AxiosResponse>
  put: (data: Record<string, unknown> | FormData) => Promise<AxiosResponse>
  delete: () => Promise<AxiosResponse>
} => {
  const isLoading = ref(false)
  const requestData = ref<T | null>(null)

  const createRequest = async (
    httpMethod: HttpMethod,
    data?: Record<string, unknown> | unknown[] | FormData
  ): Promise<AxiosResponse> => {
    const request = axios[httpMethod](url, data)

    isLoading.value = true

    request
      .then((responseData) => {
        requestData.value = responseData.data
      })
      .finally(() => {
        isLoading.value = false
      })

    return await request
  }

  const get = async (): Promise<AxiosResponse> => await createRequest(HttpMethod.GET)

  const post = async (
    data: Record<string, unknown> | unknown[] | FormData
  ): Promise<AxiosResponse> => await createRequest(HttpMethod.POST, data)

  const put = async (data: Record<string, unknown> | FormData): Promise<AxiosResponse> => (
    await createRequest(HttpMethod.PUT, data)
  )

  const deleteOne = async (): Promise<AxiosResponse> => await createRequest(HttpMethod.DELETE)

  return {
    data: requestData,
    isLoading,
    get,
    post,
    put,
    delete: deleteOne
  }
}
