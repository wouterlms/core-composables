import {
  onUnmounted,
  ref,
} from 'vue'

export default (cb: () => void
): {
  start: () => void
  stop: () => void
} => {
  const isActive = ref(false)

  const update = () => {
    if (isActive.value) {
      cb()
      requestAnimationFrame(update)
    }
  }

  const start = () => {
    isActive.value = true
    update()
  }

  const stop = () => {
    isActive.value = false
  }

  start()

  onUnmounted(() => {
    stop()
  })

  return {
    start,
    stop,
  }
}
