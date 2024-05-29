import { MovieRoomSeat } from '../movie-rooms/types'

export type Booking = {
  _id: string
  cinema_id: string
  cinema_name: string
  room_id: string
  room_name: string
  movie_id: string
  movie_name: string
  expected_start_date: Date | undefined
  expected_end_date: Date | undefined
  opening_date: Date | undefined
  opening_start_time: Date | undefined
  opening_end_time: Date | undefined
  seats: MovieRoomSeat[]
  rows: number
  columns: number
}

export type EmptyBooking = Omit<Booking, '_id'> & {
  cinema_id: Booking['cinema_id'] | undefined
  cinema_name: Booking['cinema_name'] | undefined
  room_id: Booking['room_id'] | undefined
  room_name: Booking['room_name'] | undefined
  movie_id: Booking['movie_id'] | undefined
  movie_name: Booking['movie_name'] | undefined
  expected_start_date: Booking['expected_start_date'] | undefined
  expected_end_date: Booking['expected_end_date'] | undefined
  opening_date: Booking['opening_date'] | undefined
  opening_start_time: Booking['opening_start_time'] | undefined
  opening_end_time: Booking['opening_end_time'] | undefined
  seats: Booking['seats'] | undefined
  rows: Booking['rows']
  columns: Booking['columns']
}

export type Pagination = {
  page: number
  perPage: number
  total: number
}
