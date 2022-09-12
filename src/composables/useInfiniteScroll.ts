import { Ref, isRef, onMounted, ref } from 'vue'
import useEventListener from './useEventListener'

enum Direction {
  TOP = 'top',
  BOTTOM = 'bottom'
}

interface Options {
  direction?: 'top' | 'bottom'
  offset?: number
}

export default (
  element: Ref<HTMLElement | null> | HTMLElement | Window,
  cb: () => Promise<void>,
  options: Options = {
    direction: Direction.BOTTOM,
    offset: 0
  }): void => {
  const direction = options.direction ?? Direction.BOTTOM
  const offset = options.offset ?? 0

  const isLoading = ref(false)

  const handleLoadMore = async (): Promise<void> => {
    isLoading.value = true
    await cb()
    isLoading.value = false
  }

  onMounted(() => {
    const el = isRef(element) ? element.value as NonNullable<HTMLElement | Window> : element

    useEventListener(el, 'scroll', async (e: Event) => {
      if (isLoading.value) {
        return
      }

      const target = (
        e.target === document ? (e.target as Document).documentElement : e.target
      ) as HTMLElement

      const { scrollHeight, clientHeight, scrollTop } = target

      if (
        (direction === Direction.BOTTOM && scrollTop >= scrollHeight - clientHeight - offset) ||
        (direction === Direction.TOP && scrollTop <= offset)
      ) {
        await handleLoadMore()

        if (direction === Direction.TOP) {
          el.scrollTo({
            top: target.scrollHeight - scrollHeight
          })
        }
      }
    })
  })
}
