import { Ref, ref, unref } from 'vue'
import {
  getMovies,
  // addProject,
  // updateProject,
  // removeProject,
  // Sorting,
  Pagination,
} from '../../../data/pages/movies'

import { Movie } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 2, total: 0 })

export const useMovies = (options?: { pagination?: Ref<Pagination> }) => {
  const isLoading = ref(false)
  const movies = ref<Movie[]>([])

  const { pagination = makePaginationRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getMovies({
      ...unref(pagination),
    })

    movies.value = data as Movie[]

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination], fetch, { deep: true })

  fetch()
  return {
    isLoading,
    movies,
    pagination,
  }
}
