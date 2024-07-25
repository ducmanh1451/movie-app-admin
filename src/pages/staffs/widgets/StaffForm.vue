<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { EmptyStaff, Staff } from '../types'
import { useI18n } from 'vue-i18n'
import { getLibrary } from '../../../helpers/libraries'
import axios from 'axios'

// language
const { t } = useI18n()
// props
const props = defineProps<{
  staff: Staff | null
}>()
// emits
defineEmits<{
  (event: 'save', staff: Staff): void
  (event: 'close'): void
}>()
const isEditStaff = ref<boolean>(false)
// data selectbox authority
const authorityOptions = ref([])
const cinemasOptions = ref([])
const genderOptions = [
  {
    value: 0,
    text: 'Nam',
  },
  {
    value: 1,
    text: 'Nữ',
  },
]
// init data for selectbox genre
onMounted(async () => {
  const response = await getLibrary(3)
  authorityOptions.value = response.library.lib_details.map((item: any) => ({
    text: item.authority_nm,
    value: item.authority_cd,
  }))
  // fetch data cinema
  const cinemas = await axios.get(`http://localhost:8000/api/v1/cinema`)
  cinemasOptions.value = cinemas.data.payload.map((cinema: any) => ({
    text: cinema.cinema_name,
    value: cinema._id,
  }))
})

// declare empty staff
const defaultNewStaff: EmptyStaff = {
  user_name: '',
  password: '',
  authority: 3,
  belong_cinema: '',
  belong_cinema_name: '',
  gender: 0,
  email: '',
  phone_number: '',
  address: '',
}
const newStaff = ref({ ...defaultNewStaff })

// watch change item in popup
watch(
  () => props.staff,
  () => {
    if (!props.staff) {
      return
    }

    newStaff.value = {
      ...props.staff,
    }
    isEditStaff.value = true
  },
  { immediate: true },
)

// on change belong_cinema selectbox
const changeBelongCinema = (selectedCinemaId: string) => {
  const selectedCinema = cinemasOptions.value.find((option: any) => option.value === selectedCinemaId)
  if (selectedCinema) {
    newStaff.value.belong_cinema_name = selectedCinema['text']
  }
}

// validate
const required = (v: any) => !!v || t('common.messageRequired')
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
const validateEmail = (email: string): string | boolean => {
  if (!email.trim()) {
    return true
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return t('common.messageValidateEmail')
  }
  return true
}
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <div class="row">
      <div class="flex flex-col md6">
        <div class="item">
          <VaInput v-model="newStaff.user_name" :label="t('staffs.user_name')" :rules="[required]" required-mark />
        </div>
      </div>
      <div class="flex flex-col md6">
        <div class="item">
          <VaSelect
            v-model="newStaff.authority"
            :label="t('staffs.authority')"
            :options="authorityOptions"
            value-by="value"
            text-by="text"
            required-mark
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md6">
        <div class="item">
          <VaSelect
            v-model="newStaff.belong_cinema"
            :label="t('staffs.belong_cinema')"
            :options="cinemasOptions"
            :rules="[required]"
            value-by="value"
            text-by="text"
            required-mark
            @update:modelValue="changeBelongCinema"
          />
        </div>
      </div>
      <div class="flex flex-col md6">
        <div class="item">
          <VaSelect
            v-model="newStaff.gender"
            :label="t('staffs.gender')"
            :options="genderOptions"
            value-by="value"
            :disabled="isEditStaff"
            text-by="text"
            required-mark
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md6">
        <div class="item">
          <VaInput v-model="newStaff.email" :label="t('staffs.email')" :rules="[validateEmail]" />
        </div>
      </div>
      <div class="flex flex-col md6">
        <div class="item">
          <VaInput v-model="newStaff.phone_number" :label="t('staffs.phone_number')" :rules="[validatePhoneNumber]" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md12">
        <div class="item">
          <VaInput
            v-model="newStaff.password"
            :label="t('staffs.password')"
            type="password"
            :rules="[required]"
            required-mark
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md12">
        <div class="item">
          <VaInput v-model="newStaff.address" :label="t('staffs.address')" />
        </div>
      </div>
    </div>
    <div class="row buttons">
      <div class="flex flex-col md12">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">
          {{ t('common.buttonCancel') }}
        </VaButton>
        <VaButton @click="validate() && $emit('save', newStaff as Staff)"> {{ t('common.buttonSave') }} </VaButton>
      </div>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped>
@import 'vuestic-ui/styles/grid';
</style>
