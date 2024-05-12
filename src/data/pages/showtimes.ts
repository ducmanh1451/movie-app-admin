import axios from 'axios'
import { Showtime, Pagination } from '../../pages/showtimes/types'

// get showtimes by page number
export const getShowtimes = async (options: Pagination) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/showtime`)
    const data = response.data.payload
    const normalizedData = data.slice((options.page - 1) * options.perPage, options.page * options.perPage)
    const totalRecord = data.length

    return {
      data: normalizedData,
      pagination: {
        page: options.page,
        perPage: options.perPage,
        total: totalRecord,
      },
    }
  } catch (error) {
    console.error('Error fetching showtimes:', error)
    throw error
  }
}

// create showtime
export const addShowtime = async (showtime: Omit<Showtime, '_id'>) => {
  await axios.post('http://localhost:8000/api/v1/showtime', showtime)
}

// update showtime
export const updateShowtime = async (showtime: Showtime) => {
  await axios.put(`http://localhost:8000/api/v1/showtime/${showtime._id}`, showtime)
}

// delete showtime
export const removeShowtime = async (showtime: Showtime) => {
  await axios.delete(`http://localhost:8000/api/v1/showtime/${showtime._id}`)
}
