<script setup lang="ts">
import { defineVaDataTableColumns } from 'vuestic-ui'
import { PropType, computed } from 'vue'
import { Movie } from '../types'
import { Pagination } from '../../../data/pages/projects'

const columns = defineVaDataTableColumns([
  { label: 'Movie name', key: 'movie_name', sortable: true },
  { label: 'Genre', key: 'genre', sortable: true },
  { label: 'Director', key: 'director', sortable: true },
  { label: 'Actors', key: 'actors', sortable: true },
  { label: 'Creation Date', key: 'creation_date', sortable: true },
])

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
})
const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))
</script>

<template>
  <VaDataTable :loading="loading" :items="movies" :columns="columns" striped> </VaDataTable>
  <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
    <div>
      <b>{{ $props.pagination.total }} results.</b>
      Results per page
      <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[2, 3, 5]" />
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
