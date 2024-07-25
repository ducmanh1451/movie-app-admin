import { Ref, ref, unref } from 'vue'
import { getStaffs, addStaff, updateStaff, removeStaff } from '../../../data/pages/staffs'
import { Staff, EmptyStaff, Pagination } from '../types'
import { watchIgnorable } from '@vueuse/core'

// default pagination
const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })

// declare hook
export const useStaffs = (options?: { pagination?: Ref<Pagination> }) => {
  const isLoading = ref(false)
  const staffs = ref<Staff[]>([])

  const { pagination = makePaginationRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getStaffs({
      ...unref(pagination),
    })

    staffs.value = data as Staff[]

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination], fetch, { deep: true })

  fetch()
  return {
    isLoading,
    staffs,
    pagination,
    async add(staff: EmptyStaff) {
      isLoading.value = true
      await addStaff({
        ...staff,
      })
      await fetch()
      isLoading.value = false
    },
    async update(staff: Staff) {
      isLoading.value = true
      await updateStaff({
        ...staff,
      })
      await fetch()
      isLoading.value = false
    },

    async remove(staff: Staff) {
      isLoading.value = true
      await removeStaff({
        ...staff,
      })
      await fetch()
      isLoading.value = false
    },
  }
}
