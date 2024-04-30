import { Pagination } from '../../cinemas/types'
import { Ref, ref, unref } from 'vue'
import {
  getMovieRooms,
  findMovieRoom,
  addMovieRoom,
  updateMovieRoom,
  removeMovieRoom,
} from '../../../data/pages/movie-rooms'
import { MovieRoom } from '../types'
import { watchIgnorable } from '@vueuse/core'

// default pagination
const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })

export const useMovieRooms = (options?: { pagination?: Ref<Pagination> }) => {
  const isLoading = ref(false)
  const movieRooms = ref<MovieRoom[]>([])

  const { pagination = makePaginationRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getMovieRooms({
      ...unref(pagination),
    })

    movieRooms.value = data as MovieRoom[]

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination], fetch, { deep: true })

  fetch()

  return {
    isLoading,
    movieRooms,
    pagination,
    async find(_id: string) {
      return await findMovieRoom(_id)
    },

    async add(movieRoom: Omit<MovieRoom, '_id'>) {
      await addMovieRoom({
        ...movieRoom,
      })
    },

    async update(movieRoom: MovieRoom) {
      await updateMovieRoom({
        ...movieRoom,
      })
    },

    async remove(_id: string) {
      isLoading.value = true
      await removeMovieRoom(_id)
      await fetch()
      isLoading.value = false
    },
  }
}
