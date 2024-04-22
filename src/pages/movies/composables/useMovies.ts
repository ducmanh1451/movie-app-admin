import { Ref, ref, unref } from 'vue'
import { getMovies, addMovie, updateMovie, removeMovie } from '../../../data/pages/movies'
import { Movie, Pagination } from '../types'
import { watchIgnorable } from '@vueuse/core'

// default pagination
const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })

// declare hook
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
    async add(movie: Omit<Movie, '_id'>) {
      isLoading.value = true
      await addMovie({
        ...movie,
      })
      await fetch()
      isLoading.value = false
    },
    async update(movie: Movie) {
      isLoading.value = true
      await updateMovie({
        ...movie,
      })
      await fetch()
      isLoading.value = false
    },

    async remove(movie: Movie) {
      isLoading.value = true
      await removeMovie({
        ...movie,
      })
      await fetch()
      isLoading.value = false
    },
  }
}
