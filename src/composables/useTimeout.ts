import { onBeforeUnmount } from 'vue'

export default (
  fn: (...args: unknown[]) => unknown,
  ms: number, options: { immediate: boolean } = { immediate: true }
) => {
  const { immediate } = options
  let timeout: ReturnType<typeof setTimeout> | null = null

  const stop = () => {
    if (timeout) {
      clearTimeout(timeout)
    }
  }

  const start = () => {
    stop()

    timeout = setTimeout(() => {
      fn()
    }, ms)
  }

  onBeforeUnmount(() => {
    stop()
  })

  if (immediate) {
    start()
  }

  return {
    start,
    stop,
  }
}
