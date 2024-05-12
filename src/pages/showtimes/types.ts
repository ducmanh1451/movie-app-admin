export type Showtime = {
  _id: string
  cinema_id: string
  cinema_name: string
  room_id: string
  room_name: string
  showtime_detail: ShowtimeDetail[]
}

export type EmptyShowtime = Omit<Showtime, '_id'> & {
  cinema_id: Showtime['cinema_id'] | undefined
  cinema_name: Showtime['cinema_name'] | undefined
  room_id: Showtime['room_id'] | undefined
  room_name: Showtime['room_name'] | undefined
  showtime_detail: Showtime['showtime_detail'] | undefined
}

export type ShowtimeDetail = {
  movie_id: string
  movie_name: string
  expected_start_date: Date | undefined
  expected_end_date: Date | undefined
  movie_duration: number
  opening_date: Date | undefined // need to save into database => use type date
  opening_start_time: Date | undefined // only need hour and minute => use type date (ex: 20:15)
  opening_end_time: Date | undefined // only need hour and minute => use type date (ex: 20:15)
}

export type Pagination = {
  page: number
  perPage: number
  total: number
}
