import { onBeforeUnmount } from 'vue'

export default (
  fn: (...args: unknown[]) => unknown,
  ms: number, options: { immediate: boolean } = { immediate: true }
): {
    start: () => void
    stop: () => void
  } => {
  const { immediate } = options
  let timeout: ReturnType<typeof setTimeout> | null = null

  const stop = (): void => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
  }

  const start = (): void => {
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
    stop
  }
}
