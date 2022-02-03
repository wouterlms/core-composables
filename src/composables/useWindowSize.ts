import {
  Ref,
  ref,
} from 'vue'
import useEventListener from './useEventListener'

export default (): { width: Ref<number>; height: Ref<number> } => {
  const width = ref(window?.innerWidth || 0)
  const height = ref(window?.innerHeight || 0)

  useEventListener('resize', () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  })

  return {
    width,
    height,
  }
}
