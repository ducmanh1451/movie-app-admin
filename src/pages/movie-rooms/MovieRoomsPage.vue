<script setup lang="ts">
import { useMovieRooms } from './composables/useMovieRooms'
import { MovieRoom } from './types'
import MovieRoomTable from './widgets/MovieRoomTable.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useModal, useToast } from 'vuestic-ui'
// language
const { t } = useI18n()
// hook
const { isLoading, movieRooms, pagination, remove } = useMovieRooms()
// router
const router = useRouter()
// modal confirm
const { confirm } = useModal()
// notify
const { init: notify } = useToast()
// click btn edit
const editMovieRoom = (movieRoom: MovieRoom) => {
  router.push(`/movie-rooms/update-movie-room/${movieRoom._id}`)
}
// click btn delete
const onMovieRoomDeleted = async (movieRoom: MovieRoom) => {
  const response = await confirm({
    title: t('common.confirm'),
    message: t('common.messageConfirmDelete'),
    okText: t('common.buttonDelete'),
    cancelText: t('common.buttonCancel'),
    size: 'small',
    maxWidth: '380px',
  })
  if (!response) {
    return
  }
  await remove(movieRoom._id)
  notify({
    message: t('common.messageDeleteSuccess'),
    color: 'success',
  })
}
</script>
<template>
  <h1 class="page-title">{{ t('menu.list-movie-rooms') }}</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start"></div>
      </div>
      <MovieRoomTable
        v-model:pagination="pagination"
        :movie-rooms="movieRooms"
        :loading="isLoading"
        @edit="editMovieRoom"
        @delete="onMovieRoomDeleted"
      />
    </VaCardContent>
  </VaCard>
</template>
