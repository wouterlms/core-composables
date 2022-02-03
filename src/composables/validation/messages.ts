import { getI18nInstance } from '@/composables/i18nInstance'

import useDate from '../useDate'
import useFileHelper from '../useFileHelper'

const { toReadableDate } = useDate()
const { formatBytes } = useFileHelper()

export default () => {
  const t = getI18nInstance()

  if (!t) {
    throw new Error('Set!')
  }

  return {
    required: t('core.validation.required'),
    url: t('core.validation.url'),
    email: t('core.validation.email'),
    minLength: (value: string | Array<unknown>, min: number) => {
      if (Array.isArray(value)) {
        return t('core.validation.min', { min })
      }

      return t('core.validation.min_length', { min })
    },
    maxLength: (value: string | Array<unknown>, max: number) => {
      if (Array.isArray(value)) {
        return t('core.validation.max', { max })
      }

      return t('core.validation.max_length', { max })
    },
    min: (value: number | Date, min: number) => {
      if (typeof value === 'number') {
        return t('core.validation.min', { min })
      }

      return t('core.validation.min_date', { date: toReadableDate(value) })
    },
    max: (value: number | Date, max: number) => {
      if (typeof value === 'number') {
        return t('core.validation.max', { max })
      }

      return t('core.validation.max_date', { date: toReadableDate(value) })
    },
    fileSize: (maxFileSize: number) => t('core.validation.file_size', { maxFileSize: formatBytes(maxFileSize) }),
  }
}
