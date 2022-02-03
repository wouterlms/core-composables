import {
  I18n,
  VueI18nTranslation,
} from 'vue-i18n'

// eslint-disable-next-line no-underscore-dangle
let t: VueI18nTranslation | null = null

export const setI18nInstance = (i18n: I18n) => {
  t = i18n.global.t
}

export const getI18nInstance = () => t
