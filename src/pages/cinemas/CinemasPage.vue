<script setup lang="ts">
import { useCinemas } from './composables/useCinemas'
import CinemaTable from './widgets/CinemaTable.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { Cinema } from './types'
import CinemaForm from './widgets/CinemaForm.vue'
import { useModal, useToast } from 'vuestic-ui'
import { getDetailAuthorization } from '../../middlewares/auth'
import { useAuthStore } from '../../stores/auth-store'

// language
const { t } = useI18n()
// hook
const { isLoading, cinemas, pagination, add, update, remove } = useCinemas()
// variable check mode create or update
const cinemaToEdit = ref<Cinema | null>(null)
// varable manage show/hide modal
const showModal = ref(false)
// notify
const { init: notify } = useToast()
// modal confirm
const { confirm } = useModal()
// auth store
const authStore = useAuthStore()
// check permission
const permissions: string[] | undefined = getDetailAuthorization('cinemas', authStore.staffData.authority)
const permissionEdit = ref<boolean>(true)
if (!permissions?.includes('edit')) {
  permissionEdit.value = false
}
// show or edit
const isShow = ref<boolean>(false)
// click btn create cinema
const createNewCinema = () => {
  cinemaToEdit.value = null
  showModal.value = true
}
// click btn edit
const editCinema = (cinema: Cinema) => {
  cinemaToEdit.value = cinema
  showModal.value = true
  isShow.value = false
}
// click btn show
const showCinema = (cinema: Cinema) => {
  cinemaToEdit.value = cinema
  showModal.value = true
  isShow.value = true
}
// click btn delete
const onCinemaDeleted = async (cinema: Cinema) => {
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
  await remove(cinema)
  notify({
    message: t('common.messageDeleteSuccess'),
    color: 'success',
  })
}

// after click btn ok in popup
const onCinemaSaved = async (cinema: Cinema) => {
  showModal.value = false
  try {
    if ('_id' in cinema) {
      await update(cinema as Cinema)
      notify({
        message: t('common.messageUpdateSuccess'),
        color: 'success',
      })
    } else {
      await add(cinema as Cinema)
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
  <h1 class="page-title">{{ t('cinemas.pageTitle') }}</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start"></div>
        <VaButton v-if="permissionEdit" icon="add" @click="createNewCinema">{{ t('common.buttonCreateNew') }}</VaButton>
      </div>
      <CinemaTable
        v-model:pagination="pagination"
        :cinemas="cinemas"
        :loading="isLoading"
        :permission-edit="permissionEdit"
        @show="showCinema"
        @edit="editCinema"
        @delete="onCinemaDeleted"
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
      <h1 v-if="cinemaToEdit === null" class="va-h5 mb-4">{{ t('cinemas.popupCreateTitle') }}</h1>
      <h1 v-else class="va-h5 mb-4">{{ t('cinemas.popupUpdateTitle') }}</h1>
      <CinemaForm
        :cinema="cinemaToEdit"
        :is-show="isShow"
        @close="cancel"
        @save="
          (cinema) => {
            onCinemaSaved(cinema)
            ok()
          }
        "
      />
    </VaModal>
  </VaCard>
</template>
