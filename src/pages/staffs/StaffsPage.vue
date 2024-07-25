<script setup lang="ts">
import { useStaffs } from './composables/useStaffs'
import StaffTable from './widgets/StaffTable.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { Staff } from './types'
import StaffForm from './widgets/StaffForm.vue'
import { useModal, useToast } from 'vuestic-ui'

// language
const { t } = useI18n()
// hook
const { isLoading, staffs, pagination, add, update, remove } = useStaffs()

// variable check mode create or update
const staffToEdit = ref<Staff | null>(null)
// varable manage show/hide modal
const showModal = ref(false)
// notify
const { init: notify } = useToast()
// modal confirm
const { confirm } = useModal()

// click btn create staff
const createNewStaff = () => {
  staffToEdit.value = null
  showModal.value = true
}
// click btn edit
const editStaff = (staff: Staff) => {
  staffToEdit.value = staff
  showModal.value = true
}
// click btn delete
const onStaffDeleted = async (staff: Staff) => {
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
  await remove(staff)
  notify({
    message: t('common.messageDeleteSuccess'),
    color: 'success',
  })
}

// after click btn ok in popup
const onStaffSaved = async (staff: Staff) => {
  showModal.value = false
  try {
    if ('_id' in staff) {
      await update(staff as Staff)
      notify({
        message: t('common.messageUpdateSuccess'),
        color: 'success',
      })
    } else {
      await add(staff as Staff)
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
  <h1 class="page-title">{{ t('staffs.pageTitle') }}</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start"></div>
        <VaButton icon="add" @click="createNewStaff">{{ t('common.buttonCreateNew') }}</VaButton>
      </div>
      <StaffTable
        v-model:pagination="pagination"
        :staffs="staffs"
        :loading="isLoading"
        @edit="editStaff"
        @delete="onStaffDeleted"
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
      <h1 v-if="staffToEdit === null" class="va-h5 mb-4">{{ t('staffs.popupCreateTitle') }}</h1>
      <h1 v-else class="va-h5 mb-4">{{ t('staffs.popupUpdateTitle') }}</h1>
      <StaffForm
        :staff="staffToEdit"
        @close="cancel"
        @save="
          (staff) => {
            onStaffSaved(staff)
            ok()
          }
        "
      />
    </VaModal>
  </VaCard>
</template>
