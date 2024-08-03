<script setup lang="ts">
import { useShowtimes } from './composables/useShowtimes'
import ShowtimeTable from './widgets/ShowtimeTable.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { Showtime } from './types'
import ShowtimeForm from './widgets/ShowtimeForm.vue'
import { useModal, useToast } from 'vuestic-ui'
import { getDetailAuthorization } from '../../middlewares/auth'
import { useAuthStore } from '../../stores/auth-store'

// language
const { t } = useI18n()
// hook
const { isLoading, showtimes, pagination, add, update, remove } = useShowtimes()
// variable check mode create or update
const showtimeToEdit = ref<Showtime | null>(null)
// varable manage show/hide modal
const showModal = ref(false)
// notify
const { init: notify } = useToast()
// modal confirm
const { confirm } = useModal()
// auth store
const authStore = useAuthStore()
// check permission
const permissions: string[] | undefined = getDetailAuthorization('showtimes', authStore.staffData.authority)
const permissionEdit = ref<boolean>(true)
if (!permissions?.includes('edit')) {
  permissionEdit.value = false
}
// show or edit
const isShow = ref<boolean>(false)
// click btn create showtime
const createNewShowtime = () => {
  showtimeToEdit.value = null
  showModal.value = true
}
// click btn edit showtime
const editShowtime = (showtime: Showtime) => {
  showtimeToEdit.value = showtime
  showModal.value = true
  isShow.value = false
}
// click btn show
const showShowtime = (showtime: Showtime) => {
  showtimeToEdit.value = showtime
  showModal.value = true
  isShow.value = true
}
// click btn delete
const onShowtimeDeleted = async (showtime: Showtime) => {
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
  await remove(showtime)
  notify({
    message: t('common.messageDeleteSuccess'),
    color: 'success',
  })
}

// after click btn ok in popup
const onShowtimeSaved = async (showtime: Showtime) => {
  showModal.value = false
  try {
    if ('_id' in showtime) {
      await update(showtime as Showtime)
      notify({
        message: t('common.messageUpdateSuccess'),
        color: 'success',
      })
    } else {
      await add(showtime as Showtime)
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
  <h1 class="page-title">{{ t('showtimes.pageTitle') }}</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start"></div>
        <VaButton v-if="permissionEdit" icon="add" @click="createNewShowtime">{{
          t('common.buttonCreateNew')
        }}</VaButton>
      </div>
      <ShowtimeTable
        v-model:pagination="pagination"
        :showtimes="showtimes"
        :loading="isLoading"
        :permission-edit="permissionEdit"
        @edit="editShowtime"
        @delete="onShowtimeDeleted"
        @show="showShowtime"
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
      <h1 v-if="showtimeToEdit === null" class="va-h5 mb-4">{{ t('showtimes.popupCreateTitle') }}</h1>
      <h1 v-else-if="isShow" class="va-h5 mb-4">{{ t('showtimes.popupDetailTitle') }}</h1>
      <h1 v-else class="va-h5 mb-4">{{ t('showtimes.popupUpdateTitle') }}</h1>
      <ShowtimeForm
        :showtime="showtimeToEdit"
        :is-show="isShow"
        @close="cancel"
        @save="
          (showtime) => {
            onShowtimeSaved(showtime)
            ok()
          }
        "
      />
    </VaModal>
  </VaCard>
</template>
