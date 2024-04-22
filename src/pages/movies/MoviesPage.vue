<script setup lang="ts">
import { useMovies } from './composables/useMovies'
import MovieTable from './widgets/MovieTable.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { Movie } from './types'
import MovieForm from './widgets/MovieForm.vue'
import { useModal, useToast } from 'vuestic-ui'

// language
const { t } = useI18n()
// hook
const { isLoading, movies, pagination, add, update, remove } = useMovies()
// variable check mode create or update
const movieToEdit = ref<Movie | null>(null)
// varable manage show/hide modal
const showModal = ref(false)
// notify
const { init: notify } = useToast()
// modal confirm
const { confirm } = useModal()

// click btn create movie
const createNewMovie = () => {
  movieToEdit.value = null
  showModal.value = true
}
// click btn edit
const editMovie = (movie: Movie) => {
  movieToEdit.value = movie
  showModal.value = true
}
// click btn delete
const onMovieDeleted = async (movie: Movie) => {
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
  await remove(movie)
  notify({
    message: t('common.messageDeleteSuccess'),
    color: 'success',
  })
}

// after click btn ok in popup
const onMovieSaved = async (movie: Movie) => {
  showModal.value = false
  try {
    if ('_id' in movie) {
      await update(movie as Movie)
      notify({
        message: t('common.messageUpdateSuccess'),
        color: 'success',
      })
    } else {
      await add(movie as Movie)
      notify({
        message: t('common.messageCreateSuccess'),
        color: 'success',
      })
    }
  } catch (error) {
    const errorResponse = error as { response?: { status?: number; data?: { error: string } } }
    if (errorResponse.response?.status === 500) {
      notify({
        message: t('common.messageErrorSystem'),
        color: 'danger',
      })
      isLoading.value = false
    }
  }
}
</script>

<template>
  <h1 class="page-title">{{ t('movies.pageTitle') }}</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start"></div>
        <VaButton icon="add" @click="createNewMovie">{{ t('common.buttonCreateNew') }}</VaButton>
      </div>
      <MovieTable
        v-model:pagination="pagination"
        :movies="movies"
        :loading="isLoading"
        @edit="editMovie"
        @delete="onMovieDeleted"
      />
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="showModal"
      size="large"
      mobile-fullscreen
      stateful
      hide-default-actions
      max-height="550px"
    >
      <h1 v-if="movieToEdit === null" class="va-h5 mb-4">{{ t('movies.popupCreateTitle') }}</h1>
      <h1 v-else class="va-h5 mb-4">{{ t('movies.popupUpdateTitle') }}</h1>
      <MovieForm
        :movie="movieToEdit"
        @close="cancel"
        @save="
          (movie) => {
            onMovieSaved(movie)
            ok()
          }
        "
      />
    </VaModal>
  </VaCard>
</template>
