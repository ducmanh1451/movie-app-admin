import axios from 'axios'
import { Showtime, Pagination } from '../../pages/showtimes/types'
import { findMovieRoom } from '../../data/pages/movie-rooms'

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
  try {
    // create showtime
    await axios.post('http://localhost:8000/api/v1/showtime', showtime)
    // create booking
    const response = await findMovieRoom(showtime['room_id'])
    const data = response.data.payload[0]
    const bookings = showtime.showtime_detail.map((element) => {
      return {
        ...element,
        cinema_id: data.cinema_id,
        cinema_name: data.cinema_name,
        room_id: data._id,
        room_name: data.room_name,
        seats: data.seats,
      }
    })
    await axios.post('http://localhost:8001/api/v1/booking/create', bookings)
  } catch (error) {
    console.error('Error create showtimes:', error)
    throw error
  }
}

// update showtime
export const updateShowtime = async (showtime: Showtime) => {
  await axios.put(`http://localhost:8000/api/v1/showtime/${showtime._id}`, showtime)
}

// delete showtime
export const removeShowtime = async (showtime: Showtime) => {
  await axios.delete(`http://localhost:8000/api/v1/showtime/${showtime._id}`)
  await axios.post('http://localhost:8001/api/v1/booking/delete', showtime)
}
