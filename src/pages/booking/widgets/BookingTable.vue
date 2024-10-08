<script setup lang="ts">
import { defineVaDataTableColumns } from 'vuestic-ui'
import { PropType, computed } from 'vue'
import { Booking, Pagination } from '../types'
import { useI18n } from 'vue-i18n'
import { formatDateToDisplay, formatTimeToDisplay } from '../../../helpers/date'

// language
const { t } = useI18n()
// define columns
const columns = defineVaDataTableColumns([
  { label: t('cinemas.cinemaName'), key: 'cinema_name', thAlign: 'center', tdAlign: 'left' },
  { label: t('movieRooms.roomName'), key: 'room_name', thAlign: 'center', tdAlign: 'left' },
  { label: t('movies.movieName'), key: 'movie_name', thAlign: 'center', tdAlign: 'left' },
  { label: t('movies.expectedStartDate'), key: 'expected_start_date', thAlign: 'center', tdAlign: 'center' },
  { label: t('movies.expectedEndDate'), key: 'expected_end_date', thAlign: 'center', tdAlign: 'center' },
  { label: t('movies.openingDate'), key: 'opening_date', thAlign: 'center', tdAlign: 'center' },
  { label: t('movies.openingStartTime'), key: 'opening_start_time', thAlign: 'center', tdAlign: 'center' },
  { label: t('movies.openingEndTime'), key: 'opening_end_time', thAlign: 'center', tdAlign: 'center' },
  { label: ' ', key: 'actions' },
])
// emits
const emits = defineEmits(['show'])
// props
const props = defineProps({
  bookings: {
    type: Array as PropType<Booking[]>,
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
  <VaDataTable :loading="loading" :items="bookings" :columns="columns" striped>
    <template #cell(expected_start_date)="{ value }">
      {{ formatDateToDisplay(value) }}
    </template>
    <template #cell(expected_end_date)="{ value }">
      {{ formatDateToDisplay(value) }}
    </template>
    <template #cell(opening_date)="{ value }">
      <div class="text-red-400">
        {{ formatDateToDisplay(value) }}
      </div>
    </template>
    <template #cell(opening_start_time)="{ value }">
      <div class="text-red-400">
        {{ formatTimeToDisplay(value) }}
      </div>
    </template>
    <template #cell(opening_end_time)="{ value }">
      <div class="text-red-400">
        {{ formatTimeToDisplay(value) }}
      </div>
    </template>
    <template #cell(actions)="{ rowData: booking }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          color="primary"
          icon="visibility"
          aria-label="Show booking detail"
          @click="emits('show', booking as Booking)"
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
