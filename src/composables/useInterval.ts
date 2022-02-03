import { onBeforeUnmount } from 'vue'

export default (
  fn: (...args: unknown[]) => unknown,
  ms: number,
  options: { immediate: boolean } = { immediate: true }
) => {
  const { immediate } = options

  let interval: ReturnType<typeof setInterval> | null = null

  const stop = () => {
    if (interval) {
      clearInterval(interval)
    }
  }

  const start = () => {
    stop()

    interval = setInterval(() => {
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
