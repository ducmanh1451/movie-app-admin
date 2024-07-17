<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { ImageDisplay, ImageUpload, Pagination } from '../types'
// import { useI18n } from 'vue-i18n'

// language
// const { t } = useI18n()
// props
const props = defineProps({
  images: {
    type: Array as PropType<ImageDisplay[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  pagination: {
    type: Object as PropType<Pagination>,
    required: true,
  },
})
// computed totalPage
const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))
// vars
const files = ref<any[]>([])
const showModalUploadPreview = ref<boolean>(false)
const selectedImages = ref<string[]>([])

// emits
const emits = defineEmits(['add', 'reload', 'delete'])

// funcs
const uploadImages = () => {
  showModalUploadPreview.value = true
}
const reloadImages = () => {
  emits('reload')
}
const toggleImageSelection = (event: Event, key: string) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    if (!selectedImages.value.includes(key)) {
      selectedImages.value.push(key)
    }
  } else {
    const index = selectedImages.value.indexOf(key)
    if (index !== -1) {
      selectedImages.value.splice(index, 1)
    }
  }
}
const deleteImages = () => {
  emits('delete', selectedImages.value)
}
watch(showModalUploadPreview, () => {
  if (!showModalUploadPreview.value) {
    files.value = []
  }
})
</script>

<template>
  <VaCardContent>
    <div class="container flex flex-col justity-center items-center">
      <div class="list-funcs flex justify-center gap-3">
        <div
          class="item flex items-center justify-center border border-solid border-blue-700 bg-blue-700 hover:bg-blue-800 cursor-pointer w-[40px] h-[40px]"
          @click="deleteImages"
        >
          <VaIcon name="delete" color="#fff" />
        </div>
        <div
          class="item flex items-center justify-center border border-solid border-blue-700 bg-blue-700 hover:bg-blue-800 cursor-pointer w-[40px] h-[40px]"
          @click="uploadImages"
        >
          <VaIcon name="upload" color="#fff" />
        </div>
        <div
          class="item flex items-center justify-center border border-solid border-blue-700 bg-blue-700 hover:bg-blue-800 cursor-pointer w-[40px] h-[40px]"
          @click="reloadImages"
        >
          <VaIcon name="autorenew" color="#fff" />
        </div>
        <div
          class="item flex items-center justify-center border border-solid border-blue-700 bg-blue-700 hover:bg-blue-800 cursor-pointer w-[40px] h-[40px]"
        >
          <VaIcon name="download" color="#fff" />
        </div>
      </div>
      <VaSkeleton v-if="props.loading" variant="squared" height="350px" class="mt-3" />
      <div v-if="props.images.length > 0 && !props.loading" class="w-full flex flex-wrap mt-3 min-h-[350px]">
        <div
          v-for="image in props.images"
          :key="image.key"
          class="item-image m-[5px] flex flex-col items-center gap-3 w-fit"
        >
          <div class="w-[200px] h-[300px] shadow-inner shadow-2xl">
            <img class="w-full h-full" :src="image.url" alt="" />
          </div>
          <div class="bg-red-400 w-full flex justify-center py-[5px] text-gray-100">
            <input
              :id="image.key"
              type="checkbox"
              class="w-[20px] h-[20px] mr-2 cursor-pointer"
              :name="image.key"
              @change="toggleImageSelection($event, image.key)"
            />
            <label :for="image.key" class="cursor-pointer">Xóa ảnh</label>
          </div>
        </div>
      </div>
    </div>
    <div class="flex md:flex-row gap-2 justify-end items-center py-2">
      <div v-if="totalPages > 1" class="flex">
        <VaButton
          preset="secondary"
          icon="va-arrow-left"
          aria-label="Previous page"
          :disabled="$props.pagination.page === 1"
          @click="$props.pagination.page--"
        />
        <VaButton
          class="mr-2"
          preset="secondary"
          icon="va-arrow-right"
          aria-label="Next page"
          :disabled="$props.pagination.page === totalPages"
          @click="$props.pagination.page++"
        />
        <VaPagination
          v-model="$props.pagination.page"
          buttons-preset="secondary"
          :pages="totalPages"
          :visible-pages="5"
          :boundary-links="false"
          :direction-links="false"
        />
      </div>
    </div>
  </VaCardContent>

  <VaModal
    v-model="showModalUploadPreview"
    size="medium"
    mobile-fullscreen
    stateful
    max-height="600px"
    cancel-text="Hủy"
    ok-text="Lưu"
    @ok="emits('add', files as ImageUpload[])"
  >
    <h1 class="va-h5 mb-4">Tải lên ảnh</h1>
    <VaForm>
      <div class="container min-h-[300px]">
        <VaFileUpload
          v-model="files"
          type="gallery"
          file-types="image/*"
          upload-button-text="Tải lên"
          dropzone
          drop-zone-text="Kéo file vào đây để tải lên"
        >
        </VaFileUpload>
      </div>
    </VaForm>
  </VaModal>
</template>
