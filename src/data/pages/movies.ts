import axios from 'axios'
import { Movie, Pagination } from '../../pages/movies/types'

// get movies by page number
export const getMovies = async (options: Pagination) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/movie`)
    const data = response.data.payload
    const normalizedMovies = data.slice((options.page - 1) * options.perPage, options.page * options.perPage)
    const totalRecord = data.length

    return {
      data: normalizedMovies,
      pagination: {
        page: options.page,
        perPage: options.perPage,
        total: totalRecord,
      },
    }
  } catch (error) {
    console.error('Error fetching movies:', error)
    throw error
  }
}

// create movie
export const addMovie = async (movie: Omit<Movie, '_id'>) => {
  await axios.post('http://localhost:8000/api/v1/movie', movie)
}

// update movie
export const updateMovie = async (movie: Movie) => {
  await axios.put(`http://localhost:8000/api/v1/movie/${movie._id}`, movie)
}

// delete movie
export const removeMovie = async (movie: Movie) => {
  await axios.delete(`http://localhost:8000/api/v1/movie/${movie._id}`)
}
