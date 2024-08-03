import { login } from '../../../data/pages/auth'
import { LoginForm } from '../types'

// declare hook
export const useAuth = () => {
  return {
    async login(form: LoginForm) {
      return await login({
        ...form,
      })
    },
    // async update(cinema: Cinema) {
    //   isLoading.value = true
    //   await updateCinema({
    //     ...cinema,
    //   })
    //   await fetch()
    //   isLoading.value = false
    // },
  }
}
