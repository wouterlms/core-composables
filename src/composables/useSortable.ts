import { Ref, ref } from 'vue'

enum Direction {
  ASC = 'asc',
  DESC = 'desc'
}

export default (defaultColumn: string): {
  direction: Ref<Direction>
  column: Ref<string>
  sortBy: (key: string) => void
} => {
  const direction = ref(Direction.ASC)
  const column = ref(defaultColumn)

  const sortBy = (key: string): void => {
    if (key === column.value) {
      direction.value = direction.value === Direction.DESC ? Direction.ASC : Direction.DESC
    } else {
      column.value = key
      direction.value = Direction.ASC
    }
  }

  return {
    direction,
    column,
    sortBy
  }
}
