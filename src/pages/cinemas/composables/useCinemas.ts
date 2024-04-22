import { Ref, ref, unref } from 'vue'
import { getCinemas, addCinema, updateCinema, removeCinema } from '../../../data/pages/cinemas'
import { Cinema, Pagination } from '../types'
import { watchIgnorable } from '@vueuse/core'

// default pagination
const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })

// declare hook
export const useCinemas = (options?: { pagination?: Ref<Pagination> }) => {
  const isLoading = ref(false)
  const cinemas = ref<Cinema[]>([])

  const { pagination = makePaginationRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getCinemas({
      ...unref(pagination),
    })

    cinemas.value = data as Cinema[]

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination], fetch, { deep: true })

  fetch()
  return {
    isLoading,
    cinemas,
    pagination,
    async add(cinema: Omit<Cinema, '_id'>) {
      isLoading.value = true
      await addCinema({
        ...cinema,
      })
      await fetch()
      isLoading.value = false
    },
    async update(cinema: Cinema) {
      isLoading.value = true
      await updateCinema({
        ...cinema,
      })
      await fetch()
      isLoading.value = false
    },

    async remove(cinema: Cinema) {
      isLoading.value = true
      await removeCinema({
        ...cinema,
      })
      await fetch()
      isLoading.value = false
    },
  }
}
