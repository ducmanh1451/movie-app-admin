import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    staffData: JSON.parse(localStorage.getItem('staffData') || '{}') || {
      user_id: '',
      email: '',
      user_name: '',
      belong_cinema: '',
      authority: '',
    },
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
  }),
  actions: {
    login(
      staffData: {
        user_id: string
        email: string
        user_name: string
        belong_cinema: string
        authority: string
      },
      accessToken: string,
      refreshToken: string,
    ) {
      this.staffData = staffData
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      localStorage.setItem('staffData', JSON.stringify(staffData))
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },
    logout() {
      this.staffData = {}
      this.accessToken = ''
      this.refreshToken = ''
      localStorage.removeItem('staffData')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
    async refreshAccessToken() {
      try {
        const response = await axios.post('http://localhost:8002/api/v1/auth-staff/refresh-access-token', {
          user_id: this.staffData.user_id,
          refresh_token: this.refreshToken,
        })
        const newAccessToken = response.data.accessToken
        this.accessToken = newAccessToken
        localStorage.setItem('accessToken', newAccessToken)
      } catch (error) {
        console.error('Error refreshing token:', error)
      }
    },
  },
  getters: {
    // Các getters có thể được thêm vào đây để truy cập và sử dụng trong các component khác
  },
})
