<script setup lang="ts">
import { defineVaDataTableColumns } from 'vuestic-ui'
import { PropType, computed } from 'vue'
import { Movie, Pagination } from '../types'
import { useI18n } from 'vue-i18n'

// language
const { t } = useI18n()
// define columns
const columns = defineVaDataTableColumns([
  { label: t('movies.movieName'), key: 'movie_name', thAlign: 'center', tdAlign: 'left' },
  { label: t('movies.genre'), key: 'genre', thAlign: 'center', tdAlign: 'left' },
  { label: t('movies.director'), key: 'director', thAlign: 'center', tdAlign: 'left' },
  { label: t('movies.actors'), key: 'actors', thAlign: 'center', tdAlign: 'left' },
  { label: t('movies.rating'), key: 'rating', thAlign: 'center', tdAlign: 'right' },
  { label: t('movies.movieType'), key: 'movie_type', thAlign: 'center', tdAlign: 'left' },

  { label: t('movies.expectedStartDate'), key: 'expected_start_date', thAlign: 'center', tdAlign: 'center' },
  { label: t('movies.expectedEndDate'), key: 'expected_end_date', thAlign: 'center', tdAlign: 'center' },

  { label: ' ', key: 'actions' },
])
// emits
const emits = defineEmits(['show', 'edit', 'delete'])
// props
const props = defineProps({
  movies: {
    type: Array as PropType<Movie[]>,
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
  permissionEdit: {
    type: Boolean,
  },
})

// compute totalPage
const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))
</script>

<template>
  <VaDataTable :loading="loading" :items="movies" :columns="columns" striped>
    <template #cell(movie_type)="{ value }">
      <span>{{ value == '0' ? t('movies.upcomingMovie') : t('movies.showingMovie') }}</span>
    </template>
    <template #cell(expected_start_date)="{ value }">
      <span>{{ new Date(value).toLocaleDateString('en-GB') }}</span>
    </template>
    <template #cell(expected_end_date)="{ value }">
      <span>{{ new Date(value).toLocaleDateString('en-GB') }}</span>
    </template>
    <template #cell(actions)="{ rowData: movie }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          color="primary"
          icon="visibility"
          aria-label="Show movie"
          @click="emits('show', movie as Movie)"
        />
        <VaButton
          v-if="props.permissionEdit"
          preset="primary"
          size="small"
          color="primary"
          icon="mso-edit"
          aria-label="Edit movie"
          @click="emits('edit', movie as Movie)"
        />
        <VaButton
          v-if="props.permissionEdit"
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete movie"
          @click="emits('delete', movie as Movie)"
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
