import { Ref, ref, unref } from 'vue'
import { getBookings } from '../../../data/pages/bookings'
import { Booking, Pagination } from '../types'
import { watchIgnorable } from '@vueuse/core'

// default pagination
const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })

// declare hook
export const useBookings = (options?: { pagination?: Ref<Pagination> }) => {
  const isLoading = ref(false)
  const bookings = ref<Booking[]>([])

  const { pagination = makePaginationRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getBookings({
      ...unref(pagination),
    })

    bookings.value = data as Booking[]

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination], fetch, { deep: true })

  fetch()
  return {
    isLoading,
    bookings,
    pagination,
    // async add(cinema: Omit<Cinema, '_id'>) {
    //   isLoading.value = true
    //   await addCinema({
    //     ...cinema,
    //   })
    //   await fetch()
    //   isLoading.value = false
    // },
    // async update(cinema: Cinema) {
    //   isLoading.value = true
    //   await updateCinema({
    //     ...cinema,
    //   })
    //   await fetch()
    //   isLoading.value = false
    // },

    // async remove(cinema: Cinema) {
    //   isLoading.value = true
    //   await removeCinema({
    //     ...cinema,
    //   })
    //   await fetch()
    //   isLoading.value = false
    // },
  }
}
