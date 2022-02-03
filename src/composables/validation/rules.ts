// eslint-disable-next-line @typescript-eslint/no-explicit-any
const required = (value: any) => {
  if (value === null || value === undefined) {
    return false
  }

  if (typeof value === 'string') {
    return !!value.trim().length
  }

  if (typeof value === 'boolean') {
    return value
  }

  if (Array.isArray(value)) {
    return !!value.length
  }

  return !!value
}

const minLength = (value: string | Array<unknown> | null, minLength: number) => {
  if (typeof value === 'string') {
    return !value || value.trim().length >= minLength
  }

  return value && value.length >= minLength
}

const maxLength = (value: string | Array<unknown> | null, maxLength: number) => {
  if (typeof value === 'string') {
    return !value || value.trim().length <= maxLength
  }

  return value && value.length <= maxLength
}

const min = (value: number | Date, min: number | Date) => {
  if (value === null) {
    return true
  }

  if (value instanceof Date) {
    return value.getTime() >= (min as Date).getTime()
  }

  return value >= (min as number)
}

const max = (value: number | Date | null, max: number | Date) => {
  if (value === null) {
    return true
  }

  if (value instanceof Date) {
    return value.getTime() <= (max as Date).getTime()
  }

  return value <= (max as number)
}

const fileSize = (file: File | null, maxFileSize: number) => {
  if (!file) {
    return true
  }

  return file.size <= maxFileSize
}

// eslint-disable-next-line max-len
const email = (
  value: string | null
) => !value || /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)

// eslint-disable-next-line max-len
const url = (
  value: string
) => !value || /^(http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/.test(value)

export default {
  required,
  minLength,
  maxLength,
  min,
  max,
  fileSize,
  email,
  url,
}
