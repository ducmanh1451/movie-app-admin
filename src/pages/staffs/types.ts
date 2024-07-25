export type Staff = {
  _id: string
  user_name: string
  password: string
  authority: number
  belong_cinema: string
  belong_cinema_name: string
  gender: number
  email: string
  phone_number: string
  address: string
}

export type EmptyStaff = {
  user_name: string
  password: string
  authority: number
  belong_cinema: string
  belong_cinema_name: string
  gender: number
  email: string
  phone_number: string
  address: string
}

export type Pagination = {
  page: number
  perPage: number
  total: number
}
