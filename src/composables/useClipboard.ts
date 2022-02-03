import {
  Ref,
  ref,
} from 'vue'

import useEventListener from './useEventListener'
import useTimeout from './useTimeout'

export default (): {
  copy: (value: string) => void
  text: Ref<string | null>
  copied: Ref<boolean>
} => {
  // const isSupported = !!(navigator && 'clipboard' in navigator)
  const text = ref<string | null>(null)
  const copied = ref(false)
  const events = [ 'copy', 'cut' ]

  const { start: startCopiedTimeout } = useTimeout(() => {
    copied.value = false
  }, 1500)

  const copy = (value: string) => {
    if (document.hasFocus()) {
      navigator.clipboard.writeText(value)

      copied.value = true
      startCopiedTimeout()
    }
  }

  const update = async () => {
    text.value = await navigator.clipboard.readText()
  }

  events.forEach((ev) => useEventListener(
    navigator.clipboard, ev, update
  ))

  return {
    copy,
    text,
    copied,
  }
}
