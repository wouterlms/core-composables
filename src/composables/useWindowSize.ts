import {
  Ref,
  ref
} from 'vue'
import useEventListener from './useEventListener'

export default (): { width: Ref<number>, height: Ref<number> } => {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  useEventListener('resize', () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  })

  return {
    width,
    height
  }
}
