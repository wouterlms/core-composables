interface ReadableDateOptions {
  weekday?: 'long' | 'short' | 'narrow' | undefined
  month?: 'long' | 'short' | 'narrow' | undefined
  year?: 'numeric'
  day?: 'numeric'
  hour?: 'numeric',
  minute?: 'numeric',
  second?: 'numeric'
}

let defaultLocale = navigator.language

export default () => {
  const setLocale = (locale: string) => {
    defaultLocale = locale
  }

  const areEqualDate = (date1: Date, date2: Date) => (
    date1.getDate() === date2.getDate()
    && date1.getMonth() === date2.getMonth()
    && date1.getFullYear() === date2.getFullYear()
  )

  const getDaysBetweenDates = (from: Date, until: Date) => {
    const oneDay = 1000 * 60 * 60 * 24

    const differenceInTime = until.getTime() - from.getTime()

    return Math.ceil(differenceInTime / oneDay) + 1
  }

  const isBefore = (date: Date, compareTo: Date) => date.getTime() < compareTo.getTime()

  const isAfter = (date: Date, compareTo: Date) => date.getTime() > compareTo.getTime()

  const toReadableDate = (
    date: Date, options: ReadableDateOptions = {}, locale = defaultLocale
  ) => (
    date.toLocaleDateString(locale, options)
  )

  return {
    setLocale,
    areEqualDate,
    toReadableDate,
    getDaysBetweenDates,
    isBefore,
    isAfter,
  }
}
