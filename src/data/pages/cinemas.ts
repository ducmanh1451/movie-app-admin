import axios from 'axios'
import { Cinema, Pagination } from '../../pages/cinemas/types'

// get cinemas by page number
export const getCinemas = async (options: Pagination) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/cinema`)
    const data = response.data.payload
    const normalizedCinemas = data.slice((options.page - 1) * options.perPage, options.page * options.perPage)
    const totalRecord = data.length

    return {
      data: normalizedCinemas,
      pagination: {
        page: options.page,
        perPage: options.perPage,
        total: totalRecord,
      },
    }
  } catch (error) {
    console.error('Error fetching cinemas:', error)
    throw error
  }
}

// create cinema
export const addCinema = async (cinema: Omit<Cinema, '_id'>) => {
  await axios.post('http://localhost:8000/api/v1/cinema', cinema)
}

// update cinema
export const updateCinema = async (cinema: Cinema) => {
  await axios.put(`http://localhost:8000/api/v1/cinema/${cinema._id}`, cinema)
}

// delete cinema
export const removeCinema = async (cinema: Cinema) => {
  await axios.delete(`http://localhost:8000/api/v1/cinema/${cinema._id}`)
}
