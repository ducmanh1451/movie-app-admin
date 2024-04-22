export type Movie = {
  _id: string
  movie_name: string
  genre: string[]
  director: string
  actors: string[]
  rating: number
  movie_type: number
  poster: string
  content: string
}

export type EmptyMovie = Omit<Movie, '_id'> & {
  movie_name: Movie['movie_name'] | undefined
  genre: Movie['genre'] | undefined
  director: Movie['director'] | undefined
  actors: Movie['actors'] | undefined
  rating: Movie['rating'] | undefined
  movie_type: Movie['movie_type'] | undefined
  poster: Movie['poster'] | undefined
  content: Movie['content'] | undefined
}

export type Pagination = {
  page: number
  perPage: number
  total: number
}
