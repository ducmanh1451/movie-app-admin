<script setup lang="ts">
import { ref, watch } from 'vue'
import { EmptyCinema, Cinema } from '../types'
import { useI18n } from 'vue-i18n'

// language
const { t } = useI18n()
// props
const props = defineProps<{
  cinema: Cinema | null
  isShow: boolean
}>()
// emits
defineEmits<{
  (event: 'save', cinema: Cinema): void
  (event: 'close'): void
}>()
// declare empty cinema
const defaultNewCinema: EmptyCinema = {
  cinema_name: '',
  address: '',
  phone_number: '',
  district: '',
  city: '',
}
const newCinema = ref({ ...defaultNewCinema })

// watch change item in popup
watch(
  () => props.cinema,
  () => {
    if (!props.cinema) {
      return
    }

    newCinema.value = {
      ...props.cinema,
    }
  },
  { immediate: true },
)

// validate
const requiredString = (v: string) => !!v || t('common.messageRequired')
const validatePhoneNumber = (phoneNumber: string): string | boolean => {
  // Nếu số điện thoại là chuỗi rỗng thì không có lỗi
  if (!phoneNumber.trim()) {
    return true
  }
  // Regex để kiểm tra số điện thoại
  const phoneRegex = /^[0-9]{10}$/
  // Kiểm tra xem số điện thoại có khớp với regex không
  if (!phoneRegex.test(phoneNumber)) {
    return t('common.messageValidatePhoneNumber')
  }
  // Số điện thoại hợp lệ
  return true
}
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <div class="row">
      <div class="flex flex-col md6">
        <div class="item">
          <VaInput v-model="newCinema.cinema_name" :label="t('cinemas.cinemaName')" :rules="[requiredString]" />
        </div>
      </div>
      <div class="flex flex-col md6">
        <div class="item">
          <VaInput v-model="newCinema.phone_number" :label="t('cinemas.phoneNumber')" :rules="[validatePhoneNumber]" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md12">
        <div class="item">
          <VaInput v-model="newCinema.address" :label="t('cinemas.address')" :rules="[requiredString]" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md6">
        <div class="item">
          <VaInput v-model="newCinema.district" :label="t('cinemas.district')" />
        </div>
      </div>
      <div class="flex flex-col md6">
        <div class="item">
          <VaInput v-model="newCinema.city" :label="t('cinemas.city')" />
        </div>
      </div>
    </div>
    <div class="row buttons">
      <div class="flex flex-col md12">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">
          {{ t('common.buttonCancel') }}
        </VaButton>
        <VaButton :disabled="props.isShow" @click="validate() && $emit('save', newCinema as Cinema)">
          {{ t('common.buttonSave') }}
        </VaButton>
      </div>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped>
@import 'vuestic-ui/styles/grid';
</style>
