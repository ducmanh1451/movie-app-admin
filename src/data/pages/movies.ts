import { sleep } from '../../services/utils'
import moviesDb from './movies-db.json'

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
  pageNumber: number
  recordInPage: number
  totalRecord: number
  totalPages: number
}

// get movies by page number
// return movie (array), pagination (object)
export const getMovies = async (pageNumber = 1): Promise<{ data: Movie[]; pagination: Pagination }> => {
  await sleep(1000)

  const movies = moviesDb.map((movie) => ({
    ...movie,
  }))
  const normalizedMovies = movies.slice((pageNumber - 1) * 2, pageNumber * 2)
  const totalRecord = movies.length
  const totalPages = Math.floor(totalRecord / 2) + (totalRecord % 2 === 0 ? 0 : 1)
  return {
    data: normalizedMovies,
    pagination: {
      pageNumber: pageNumber,
      recordInPage: 2,
      totalRecord: totalRecord,
      totalPages: totalPages,
    },
  }
}
