import { onUnmounted } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (...args: any[]): (() => void) => {
  let target: typeof window | typeof document | HTMLElement
  let event: string
  let listener: () => void
  let options: AddEventListenerOptions

  if (typeof args[0] === 'string') {
    [
      event,
      listener,
      options
    ] = args
    target = window
  } else {
    [
      target,
      event,
      listener,
      options
    ] = args
  }

  target.addEventListener(
    event, listener, options
  )

  const destroy = () => {
    target.removeEventListener(event, listener)
  }

  onUnmounted(() => {
    destroy()
  })

  return destroy
}
