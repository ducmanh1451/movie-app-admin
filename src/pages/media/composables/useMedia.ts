import { Ref, ref, unref } from 'vue'
import { getImages, addImages, removeImages } from '../../../data/pages/media'
import { ImageDisplay, ImageUpload, Pagination } from '../types'
import { watchIgnorable } from '@vueuse/core'

// default pagination
const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 8, total: 0 })

// declare hook
export const useImages = (options?: { pagination?: Ref<Pagination> }) => {
  const isLoading = ref(false)
  const images = ref<ImageDisplay[]>([])

  const { pagination = makePaginationRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getImages({
      ...unref(pagination),
    })

    images.value = data as ImageDisplay[]

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination], fetch, { deep: true })
  const resetPagination = () => {
    pagination.value = makePaginationRef().value
  }
  fetch()
  return {
    isLoading,
    images,
    pagination,
    async add(images: ImageUpload[]) {
      isLoading.value = true
      await addImages({
        ...images,
      })
      await fetch()
      isLoading.value = false
    },
    async reload() {
      isLoading.value = true
      resetPagination()
      await fetch()
      isLoading.value = false
    },
    // async update(movie: Movie) {
    //   isLoading.value = true
    //   await updateMovie({
    //     ...movie,
    //   })
    //   await fetch()
    //   isLoading.value = false
    // },
    async remove(images: string[]) {
      isLoading.value = true
      await removeImages({
        ...images,
      })
      await fetch()
      isLoading.value = false
    },
  }
}
