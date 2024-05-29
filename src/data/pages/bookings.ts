import axios from 'axios'
import { Pagination } from '../../pages/booking/types'

// get bookings by page number
export const getBookings = async (options: Pagination) => {
  try {
    const response = await axios.get(`http://localhost:8001/api/v1/booking`)
    const data = response.data.payload
    const normalizedBookings = data.slice((options.page - 1) * options.perPage, options.page * options.perPage)
    const totalRecord = data.length

    return {
      data: normalizedBookings,
      pagination: {
        page: options.page,
        perPage: options.perPage,
        total: totalRecord,
      },
    }
  } catch (error) {
    console.error('Error fetching bookings:', error)
    throw error
  }
}

// // create cinema
// export const addCinema = async (cinema: Omit<Cinema, '_id'>) => {
//   await axios.post('http://localhost:8000/api/v1/cinema', cinema)
// }

// // update cinema
// export const updateCinema = async (cinema: Cinema) => {
//   await axios.put(`http://localhost:8000/api/v1/cinema/${cinema._id}`, cinema)
// }

// // delete cinema
// export const removeCinema = async (cinema: Cinema) => {
//   await axios.delete(`http://localhost:8000/api/v1/cinema/${cinema._id}`)
// }
