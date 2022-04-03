import {
  Ref,
  ref
} from 'vue'

import useEventListener from './useEventListener'
import useTimeout from './useTimeout'

export default (): {
  copy: (value: string) => void
  text: Ref<string | null>
  copied: Ref<boolean>
} => {
  const text = ref<string | null>(null)
  const copied = ref(false)

  const { start: startCopiedTimeout } = useTimeout(() => {
    copied.value = false
  }, 1500)

  const copy = async (value: string): Promise<void> => {
    if (document.hasFocus()) {
      await navigator.clipboard.writeText(value)

      copied.value = true
      startCopiedTimeout()
    }
  }

  const update = async (): Promise<void> => {
    text.value = await navigator.clipboard.readText()
  }

  ['copy', 'cut'].forEach((ev) => useEventListener(
    navigator.clipboard, ev, update
  ))

  return {
    copy,
    text,
    copied
  }
}
