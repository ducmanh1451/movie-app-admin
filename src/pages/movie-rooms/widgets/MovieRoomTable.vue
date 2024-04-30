<script setup lang="ts">
import { defineVaDataTableColumns } from 'vuestic-ui'
import { PropType, computed } from 'vue'
import { MovieRoom, Pagination } from '../types'
import { useI18n } from 'vue-i18n'

// language
const { t } = useI18n()
// define columns
const columns = defineVaDataTableColumns([
  { label: t('movieRooms.cinemas'), key: 'cinema_name', thAlign: 'center', tdAlign: 'left' },
  { label: t('movieRooms.roomName'), key: 'room_name', thAlign: 'center', tdAlign: 'left' },
  { label: t('movieRooms.row'), key: 'rows', thAlign: 'center', tdAlign: 'right' },
  { label: t('movieRooms.column'), key: 'columns', thAlign: 'center', tdAlign: 'right' },
  { label: ' ', key: 'actions' },
])
// emits
const emits = defineEmits(['edit', 'delete'])
// props
const props = defineProps({
  movieRooms: {
    type: Array as PropType<MovieRoom[]>,
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
  <VaDataTable :loading="loading" :items="movieRooms" :columns="columns" striped>
    <template #cell(actions)="{ rowData: movieRoom }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          color="primary"
          icon="mso-edit"
          aria-label="Edit movie room"
          @click="emits('edit', movieRoom as MovieRoom)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete movie room"
          @click="emits('delete', movieRoom as MovieRoom)"
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
