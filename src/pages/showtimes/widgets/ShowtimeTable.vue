<script setup lang="ts">
import { defineVaDataTableColumns } from 'vuestic-ui'
import { PropType, computed } from 'vue'
import { Showtime, Pagination } from '../types'
import { useI18n } from 'vue-i18n'
import { formatDateToDisplay } from '../../../helpers/date'

// language
const { t } = useI18n()
// define columns
const columns = defineVaDataTableColumns([
  { label: t('cinemas.cinemaName'), key: 'cinema_name', thAlign: 'center', tdAlign: 'left' },
  { label: t('movieRooms.roomName'), key: 'room_name', thAlign: 'center', tdAlign: 'left' },
  { label: t('movies.opening_date'), key: 'opening_date', thAlign: 'center', tdAlign: 'center' },
  { label: t('showtimes.countShowtimeDetail'), key: 'count', thAlign: 'center', tdAlign: 'center' },
  { label: ' ', key: 'actions' },
])
// emits
const emits = defineEmits(['edit', 'delete'])
// props
const props = defineProps({
  showtimes: {
    type: Array as PropType<Showtime[]>,
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

// check row can be remove
const checkCanDeleted = (showtime: any) => {
  if (new Date(showtime['opening_date']) <= new Date()) {
    alert('Lịch chiếu đã bắt đầu')
    return
  }
  emits('delete', showtime as Showtime)
}
</script>

<template>
  <VaDataTable :loading="loading" :items="showtimes" :columns="columns" striped>
    <template #cell(opening_date)="{ value }">
      {{ formatDateToDisplay(value) }}
    </template>
    <template #cell(actions)="{ rowData: showtime }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          color="primary"
          icon="mso-edit"
          aria-label="Edit showtime"
          @click="emits('edit', showtime as Showtime)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete showtime"
          @click="checkCanDeleted(showtime)"
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
