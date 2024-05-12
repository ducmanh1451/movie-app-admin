import { Ref, ref, unref } from 'vue'
import { getShowtimes, addShowtime, updateShowtime, removeShowtime } from '../../../data/pages/showtimes'
import { Showtime, Pagination } from '../types'
import { watchIgnorable } from '@vueuse/core'

// default pagination
const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })

// declare hook
export const useShowtimes = (options?: { pagination?: Ref<Pagination> }) => {
  const isLoading = ref(false)
  const showtimes = ref<Showtime[]>([])

  const { pagination = makePaginationRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getShowtimes({
      ...unref(pagination),
    })

    showtimes.value = data as Showtime[]

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination], fetch, { deep: true })

  fetch()
  return {
    isLoading,
    showtimes,
    pagination,

    async add(showtime: Omit<Showtime, '_id'>) {
      isLoading.value = true
      await addShowtime({
        ...showtime,
      })
      await fetch()
      isLoading.value = false
    },
    async update(showtime: Showtime) {
      isLoading.value = true
      await updateShowtime({
        ...showtime,
      })
      await fetch()
      isLoading.value = false
    },

    async remove(showtime: Showtime) {
      isLoading.value = true
      await removeShowtime({
        ...showtime,
      })
      await fetch()
      isLoading.value = false
    },
  }
}
