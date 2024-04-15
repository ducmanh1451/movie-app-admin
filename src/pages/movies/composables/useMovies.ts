import { ref } from 'vue'
import { getMovies, Pagination } from '../../../data/pages/movies'

import { Movie } from '../types'

export const useMovies = (pageNumber = 1) => {
  const isLoading = ref(false)
  const movies = ref<Movie[]>([])
  const pagination = ref<Pagination>({ pageNumber: 1, recordInPage: 2, totalRecord: 0, totalPages: 0 })

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getMovies(pageNumber)
    movies.value = data as Movie[]
    pagination.value = newPagination as Pagination
    isLoading.value = false
  }
  fetch()
  return {
    isLoading,
    movies,
    pagination,
  }
}
