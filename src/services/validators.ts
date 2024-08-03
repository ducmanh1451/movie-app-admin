import { useI18n } from 'vue-i18n'

// const { t } = useI18n()

// export const sleep = (ms = 0) => {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }

// /** Validation */
// export const validators = {
//   email: (v: string) => {
//     const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     return pattern.test(v) || 'Please enter a valid email address'
//   },
//   required: (v: any) => !!v || t('common.messageRequired'),
// }

export const useValidators = () => {
  const { t } = useI18n()

  const email = (v: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || 'Please enter a valid email address'
  }

  const required = (v: any) => !!v || t('common.messageRequired')

  return { email, required }
}
