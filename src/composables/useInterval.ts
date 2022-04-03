import { onBeforeUnmount } from 'vue'

export default (
  fn: (...args: unknown[]) => unknown,
  ms: number,
  options: { immediate: boolean } = { immediate: true }
): {
    start: () => void
    stop: () => void
  } => {
  const { immediate } = options

  let interval: ReturnType<typeof setInterval> | null = null

  const stop = (): void => {
    if (interval !== null) {
      clearInterval(interval)
    }
  }

  const start = (): void => {
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
    stop
  }
}
