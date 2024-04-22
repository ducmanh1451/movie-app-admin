<script setup lang="ts">
import { defineVaDataTableColumns } from 'vuestic-ui'
import { PropType, computed } from 'vue'
import { Cinema, Pagination } from '../types'
import { useI18n } from 'vue-i18n'

// language
const { t } = useI18n()
// define columns
const columns = defineVaDataTableColumns([
  { label: t('cinemas.cinemaName'), key: 'cinema_name', thAlign: 'center', tdAlign: 'left' },
  { label: t('cinemas.address'), key: 'address', thAlign: 'center', tdAlign: 'left' },
  { label: t('cinemas.phoneNumber'), key: 'phone_number', thAlign: 'center', tdAlign: 'left' },
  { label: t('cinemas.district'), key: 'district', thAlign: 'center', tdAlign: 'left' },
  { label: t('cinemas.city'), key: 'city', thAlign: 'center', tdAlign: 'left' },
  { label: ' ', key: 'actions' },
])
// props
const props = defineProps({
  cinemas: {
    type: Array as PropType<Cinema[]>,
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
  <VaDataTable :loading="loading" :items="cinemas" :columns="columns" striped>
    <template #cell(actions)="{ rowData: cinema }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          color="primary"
          icon="mso-edit"
          aria-label="Edit cinema"
          @click="$emit('edit', cinema as Cinema)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete cinema"
          @click="$emit('delete', cinema as Cinema)"
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
