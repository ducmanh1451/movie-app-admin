export type MovieRoom = {
  _id: string
  cinema_id: string
  cinema_name: string
  room_name: string
  rows: number
  columns: number
  seats: MovieRoomSeat[]
}

export type MovieRoomSeat = {
  seat_id: number
  selected: boolean
  type: number
  available: boolean
  price: number
}

export type Pagination = {
  page: number
  perPage: number
  total: number
}
