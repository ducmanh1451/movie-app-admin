import axios from 'axios'
import { MovieRoom } from '../../pages/movie-rooms/types'

// create movie room
export const addMovieRoom = async (movieRoom: Omit<MovieRoom, '_id'>) => {
  await axios.post('http://localhost:8000/api/v1/movie-room', movieRoom)
}
