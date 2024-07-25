<script setup lang="ts">
import { defineVaDataTableColumns } from 'vuestic-ui'
import { PropType, computed } from 'vue'
import { Staff, Pagination } from '../types'
import { useI18n } from 'vue-i18n'

// language
const { t } = useI18n()
// define columns
const columns = defineVaDataTableColumns([
  { label: t('staffs.user_id'), key: 'user_id', thAlign: 'center', tdAlign: 'left' },
  { label: t('staffs.user_name'), key: 'user_name', thAlign: 'center', tdAlign: 'left' },
  { label: t('staffs.authority'), key: 'authority', thAlign: 'center', tdAlign: 'left' },
  { label: t('staffs.belong_cinema'), key: 'belong_cinema', thAlign: 'center', tdAlign: 'left' },
  { label: t('staffs.gender'), key: 'gender', thAlign: 'center', tdAlign: 'left' },
  { label: t('staffs.email'), key: 'email', thAlign: 'center', tdAlign: 'left' },
  { label: t('staffs.phone_number'), key: 'phone_number', thAlign: 'center', tdAlign: 'left' },
  { label: t('staffs.address'), key: 'address', thAlign: 'center', tdAlign: 'left' },
  { label: ' ', key: 'actions' },
])
// emits
const emits = defineEmits(['edit', 'delete'])
// props
const props = defineProps({
  staffs: {
    type: Array as PropType<Staff[]>,
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
// compute totalPage
const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))
</script>

<template>
  <VaDataTable :loading="loading" :items="staffs" :columns="columns" striped>
    <template #cell(authority)="{ value }">
      <span v-if="value == '1'">Quản trị viên</span>
      <span v-if="value == '2'">Quản lý rạp</span>
      <span v-if="value == '3'">Nhân viên</span>
    </template>
    <template #cell(gender)="{ value }">
      <span v-if="value == '0'">Nam</span>
      <span v-if="value == '1'">Nữ</span>
    </template>
    <template #cell(belong_cinema)="{ rowData }">
      {{ rowData.belong_cinema_name ?? '' }}
    </template>
    <template #cell(actions)="{ rowData: staff }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          color="primary"
          icon="mso-edit"
          aria-label="Edit staff"
          @click="emits('edit', staff as Staff)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete staff"
          @click="emits('delete', staff as Staff)"
        />
      </div>
    </template>
  </VaDataTable>
  <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
    <div>
      <b>{{ $props.pagination.total }} {{ t('common.totalRecord') }}</b>
      {{ t('common.perPage') }}
      <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 20, 50]" />
    </div>
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
</template>
