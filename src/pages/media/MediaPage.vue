<script setup lang="ts">
import { useImages } from './composables/useMedia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ImageTable from './widgets/ImageTable.vue'
import { ImageUpload } from './types'
import { useToast } from 'vuestic-ui'

// language
const { t } = useI18n()
// notify
const { init: notify } = useToast()
// hook
const { isLoading, images, pagination, add, reload, remove } = useImages()

// functions
const collapseImage = ref<boolean>(true)
const addImages = async (files: ImageUpload[]) => {
  try {
    if (files.length > 0) {
      await add(files as ImageUpload[])
      notify({
        message: t('common.messageUploadImageSuccess'),
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
const reloadImages = async () => {
  await reload()
}
const deleteImages = async (images: string[]) => {
  if (images.length == 0) {
    notify({
      message: t('common.messageErrorDeleteImage'),
      color: 'danger',
    })
  } else {
    try {
      await remove(images as string[])
      notify({
        message: t('common.messageDeleteImagesSuccess'),
        color: 'success',
      })
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
}
</script>
<template>
  <h1 class="page-title">{{ t('media.pageTitle') }}</h1>
  <VaCard class="mb-2">
    <VaCollapse v-model="collapseImage" header="Ảnh" color="primary">
      <ImageTable
        v-model:pagination="pagination"
        :images="images"
        :loading="isLoading"
        @add="addImages"
        @reload="reloadImages"
        @delete="deleteImages"
      />
    </VaCollapse>
  </VaCard>
</template>
