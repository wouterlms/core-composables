let defaultLocale = navigator.language

export default (): {
  setLocale: (locale: string) => void
  areEqualDate: (date1: Date, date2: Date) => boolean
  toReadableDate: (date: Date, options?: Intl.DateTimeFormatOptions, locale?: string) => string
  getDaysBetween: (from: Date, until: Date) => number
  isBefore: (date: Date, compareTo: Date) => boolean
  isAfter: (date: Date, compareTo: Date) => boolean
} => {
  const setLocale = (locale: string): void => {
    defaultLocale = locale
  }

  const areEqualDate = (date1: Date, date2: Date): boolean => (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )

  const getDaysBetween = (from: Date, until: Date): number => {
    const oneDay = 1000 * 60 * 60 * 24

    const differenceInTime = until.getTime() - from.getTime()

    return Math.ceil(differenceInTime / oneDay) + 1
  }

  const isBefore = (date: Date, compareTo: Date): boolean => date.getTime() < compareTo.getTime()

  const isAfter = (date: Date, compareTo: Date): boolean => date.getTime() > compareTo.getTime()

  const toReadableDate = (
    date: Date, options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }, locale = defaultLocale
  ): string => (
    date.toLocaleString(locale, options)
  )

  return {
    setLocale,
    areEqualDate,
    toReadableDate,
    getDaysBetween,
    isBefore,
    isAfter
  }
}
