export type Cinema = {
  _id: string
  cinema_name: string
  address: string
  phone_number: string
  district: string
  city: string
}

export type EmptyCinema = Omit<Cinema, '_id'> & {
  cinema_name: Cinema['cinema_name'] | undefined
  address: Cinema['address'] | undefined
  phone_number: Cinema['phone_number'] | undefined
  district: Cinema['district'] | undefined
  city: Cinema['city'] | undefined
}

export type Pagination = {
  page: number
  perPage: number
  total: number
}
