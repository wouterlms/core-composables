import { ref } from 'vue'

enum Direction {
  ASC = 'asc',
  DESC = 'desc'
}

export default (defaultColumn: string) => {
  const direction = ref(Direction.ASC)
  const column = ref(defaultColumn)

  const sortBy = (key: string) => {
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
    sortBy,
  }
}
