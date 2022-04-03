import {
  ComputedRef,
  Ref,
  computed,
  ref
} from 'vue'

export default <T>(
  items: T[],
  key: (item: T) => string | null
): [filter: Ref<string | null>, filteredItems: ComputedRef<T[]>] => {
  const filter = ref<string | null>(null)

  const filteredItems = computed(() => {
    if (filter.value === null || filter.value.length < 1) {
      return items
    }

    return items.filter(
      (item) => key(item)?.toLocaleLowerCase().includes(filter.value?.toLowerCase() as string)
    )
  })

  return [filter, filteredItems]
}
