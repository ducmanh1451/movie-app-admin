export type Movie = {
  _id: string
  movie_name: string
  genre: string[]
  director: string
  actors: string[]
  rating: number
  movie_type: number
  expected_start_date: Date
  expected_end_date: Date
  movie_duration: number
  poster: string
  trailer: string
  content: string
}

export type EmptyMovie = Omit<Movie, '_id'> & {
  movie_name: Movie['movie_name'] | undefined
  genre: Movie['genre'] | undefined
  director: Movie['director'] | undefined
  actors: Movie['actors'] | undefined
  rating: Movie['rating'] | undefined
  movie_type: Movie['movie_type'] | undefined
  expected_start_date: Movie['expected_start_date'] | undefined
  expected_end_date: Movie['expected_end_date'] | undefined
  movie_duration: Movie['movie_duration'] | undefined
  poster: Movie['poster'] | undefined
  trailer: Movie['trailer'] | undefined
  content: Movie['content'] | undefined
}

export type Pagination = {
  page: number
  perPage: number
  total: number
}
