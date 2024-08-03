import axios from 'axios'
import { Staff, EmptyStaff, Pagination } from '../../pages/staffs/types'
import { useAuthStore } from '../../stores/auth-store'

const authStore = useAuthStore()
const userId = authStore.staffData.user_id ?? ''
// get staffs by page number
export const getStaffs = async (options: Pagination) => {
  try {
    const response = await axios.get(`http://localhost:8003/api/v1/staff/${userId}`)
    const data = response.data.payload
    const normalizedStaffs = data.slice((options.page - 1) * options.perPage, options.page * options.perPage)
    const totalRecord = data.length

    return {
      data: normalizedStaffs,
      pagination: {
        page: options.page,
        perPage: options.perPage,
        total: totalRecord,
      },
    }
  } catch (error) {
    console.error('Error fetching staffs:', error)
    throw error
  }
}

// create staff
export const addStaff = async (staff: EmptyStaff) => {
  await axios.post('http://localhost:8003/api/v1/staff', staff)
}

// update staff
export const updateStaff = async (staff: Staff) => {
  await axios.put(`http://localhost:8003/api/v1/staff/${staff._id}`, staff)
}

// delete staff
export const removeStaff = async (staff: Staff) => {
  await axios.delete(`http://localhost:8003/api/v1/staff/${staff._id}`)
}
