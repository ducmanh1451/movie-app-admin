import axios from 'axios'

// Simulate API calls
export type Movie = {
  id: number
  movie_name: string
  genre: string[]
  director: string
  actors: string[]
  rating: number
  creation_date: string
}
export type Pagination = {
  page: number
  perPage: number
  total: number
}

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
