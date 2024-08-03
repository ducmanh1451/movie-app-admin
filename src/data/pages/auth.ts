import axios from 'axios'
import { LoginForm } from '../../pages/auth/types'

// login
export const login = async (form: LoginForm) => {
  return await axios.post('http://localhost:8002/api/v1/auth-staff/login', form)
}
