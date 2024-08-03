<template>
  <VaForm ref="form" class="bg-gray-100 p-5" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">{{ t('auth.login') }}</h1>
    <VaInput v-model="formData.user_id" :rules="[required]" class="mb-4" :label="t('auth.userId')" type="user_id" />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        :label="t('auth.password')"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>
    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit">{{ t('auth.login') }}</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { useValidators } from '../../services/validators'
import { useAuth } from './composables/useAuth'
import { LoginForm } from './types'
import { useAuthStore } from '../../stores/auth-store'
import { useI18n } from 'vue-i18n'

// vars
const { required } = useValidators()
const { validate } = useForm('form')
const authStore = useAuthStore()
const { push } = useRouter()
const { init } = useToast()
const formData = reactive({
  user_id: '',
  password: '',
})
const { login } = useAuth()
const { t } = useI18n()
// funcs
const submit = async () => {
  if (validate()) {
    try {
      const response = await login(formData as LoginForm)
      if (response.status == 200) {
        authStore.login(response.data.payload, response.data.accessToken, response.data.refreshToken)
        // go to home page after login success
        init({ message: t('common.messageLoginSuccess'), color: 'success' })
        push({ name: 'dashboard' })
      }
    } catch (error: any) {
      const errorMsg = error.response.data.error
      init({ message: errorMsg, color: 'danger' })
    }
  }
}
</script>
