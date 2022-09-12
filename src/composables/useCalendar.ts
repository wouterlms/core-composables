import { ComputedRef, Ref, computed, ref } from 'vue'

interface UseCalendar {
  month: Ref<number>
  year: Ref<number>
  dates: ComputedRef<Date[]>
  previousMonth: () => void
  nextMonth: () => void
  isToday: (date: Date) => boolean
  isOtherMonth: (date: Date) => boolean
}

export default (): UseCalendar => {
  const today = new Date()

  const year = ref(today.getFullYear())
  const month = ref(today.getMonth() + 1)

  const areEqualDate = (date1: Date, date2: Date): boolean => (
    date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
  )

  /**
   * Date object of the current month and year
   */
  const currentMonthYear = computed(
    () => new Date(year.value, month.value, 0)
  )

  /**
   * Number of days of the current month
   */
  const daysOfMonth = computed(() => currentMonthYear.value.getDate())

  /**
   * Number of days of the previous month
   */
  const daysOfPreviousMonth = computed(
    () => new Date(year.value, month.value === 11 ? 0 : month.value - 1, 0).getDate()
  )

  /**
   * Number of week days before the 1st date of the current month
   */
  const indent = computed(() => {
    const indentDay = new Date(year.value, month.value - 1, 1).getDay() - 1

    if (indentDay < 0) {
      return 7 + indentDay
    }

    return indentDay
  })

  /**
   * Number of week days after the last date of the current month
   */
  const adjenct = computed(() => {
    if ((daysOfMonth.value + indent.value) % 7 === 0) {
      return 0
    }

    const rows = Math.floor((daysOfMonth.value + indent.value) / 7) + 1

    return 7 * rows - daysOfMonth.value - indent.value
  })

  const dateArray = computed(() => {
    const prev: Date[] = []
    const current: Date[] = []
    const next: Date[] = []

    for (let i = 1; i <= indent.value; i += 1) {
      prev.push(new Date(
        month.value === 1 ? year.value - 1 : year.value,
        month.value === 1 ? 11 : month.value - 2,
        daysOfPreviousMonth.value - indent.value + i,
        23,
        59,
        0
      ))
    }

    for (let i = 1; i <= daysOfMonth.value; i += 1) {
      current.push(new Date(year.value, month.value - 1, i, 23, 59))
    }

    for (let i = 1; i <= adjenct.value; i += 1) {
      const date = new Date(
        month.value === 12 ? year.value + 1 : year.value,
        month.value === 12 ? 0 : month.value,
        i,
        23,
        59
      )

      next.push(date)
    }

    return [
      ...prev,
      ...current,
      ...next
    ]
  })

  const previousMonth = (): void => {
    year.value = month.value === 1 ? year.value - 1 : year.value
    month.value = month.value === 1 ? 12 : month.value - 1
  }

  const nextMonth = (): void => {
    year.value = month.value === 12 ? year.value + 1 : year.value
    month.value = month.value === 12 ? 1 : month.value + 1
  }

  const isToday = (date: Date): boolean => areEqualDate(date, today)

  const isOtherMonth = (date: Date): boolean => date.getMonth() !== month.value - 1

  return {
    month,
    year,
    dates: dateArray,
    previousMonth,
    nextMonth,
    isToday,
    isOtherMonth
  }
}
