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
  seat_name: string
  row: number
  column: number
  type: number
  available: boolean
  price: number
}

export type Pagination = {
  page: number
  perPage: number
  total: number
}
