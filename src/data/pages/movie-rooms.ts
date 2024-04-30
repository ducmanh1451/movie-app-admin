import axios from 'axios'
import { MovieRoom, Pagination } from '../../pages/movie-rooms/types'

// get movie rooms by page number
export const getMovieRooms = async (options: Pagination) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/movie-room`)
    const data = response.data.payload
    const normalizedMovieRooms = data.slice((options.page - 1) * options.perPage, options.page * options.perPage)
    const totalRecord = data.length

    return {
      data: normalizedMovieRooms,
      pagination: {
        page: options.page,
        perPage: options.perPage,
        total: totalRecord,
      },
    }
  } catch (error) {
    console.error('Error fetching movie rooms:', error)
    throw error
  }
}

export const findMovieRoom = async (_id: string) => {
  return await axios.get(`http://localhost:8000/api/v1/movie-room/${_id}`)
}

// create movie room
export const addMovieRoom = async (movieRoom: Omit<MovieRoom, '_id'>) => {
  await axios.post('http://localhost:8000/api/v1/movie-room', movieRoom)
}

// update movie room
export const updateMovieRoom = async (movieRoom: MovieRoom) => {
  await axios.put(`http://localhost:8000/api/v1/movie-room/${movieRoom._id}`, movieRoom)
}

// delete movie room
export const removeMovieRoom = async (_id: string) => {
  await axios.delete(`http://localhost:8000/api/v1/movie-room/${_id}`)
}
