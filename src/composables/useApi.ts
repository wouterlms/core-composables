import { ref } from 'vue'

import axios from 'axios'

import { HttpMethod } from '@/enums'

export default <T>(url: string) => {
  const isLoading = ref(false)
  const requestData = ref<T | null>(null)

  const createRequest = async (
    httpMethod: HttpMethod,
    data?: Record<string, unknown> | Array<unknown> | FormData
  ) => {
    const request = axios[httpMethod](url, data)

    isLoading.value = true

    request
      .then((responseData) => {
        requestData.value = responseData.data
      })
      .finally(() => {
        isLoading.value = false
      })

    return request
  }

  const get = () => createRequest(HttpMethod.GET)

  const post = (
    data: Record<string, unknown> | Array<unknown> | FormData
  ) => createRequest(HttpMethod.POST, data)

  const put = (data: Record<string, unknown> | FormData) => createRequest(HttpMethod.PUT, data)

  const deleteOne = () => createRequest(HttpMethod.DELETE)

  return {
    data: requestData,
    isLoading,
    get,
    post,
    put,
    delete: deleteOne,
  }
}
