<script setup lang="ts">
import { PropType } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { Movie } from '../types'
import { Pagination } from '../../../data/pages/movies'

// import { ref, computed, watchEffect } from "vue";
// import { useMovies } from '../composables/useMovies'

defineProps({
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

// const filter = ref("");
// const filtered = ref([]);

const columns = defineVaDataTableColumns([
  { label: 'Movie name', key: 'movie_name', sortable: true },
  { label: 'Genre', key: 'genre', sortable: true },
  { label: 'Director', key: 'director', sortable: true },
  { label: 'Actors', key: 'actors', sortable: true },
  { label: 'Creation Date', key: 'creation_date', sortable: true },
])

// const value = ref(3)
// const currentPage = ref(1)
// const totalPages = ref(0)
// watchEffect(() => {
// useMovies(props.pagination.pageNumber)
// console.log(props.pagination.pageNumber);

// const { isLoading, movies, pagination } = useMovies()
// debugger
// })
</script>

<template>
  <VaDataTable :items="movies" :loading="loading" :columns="columns" striped> </VaDataTable>
  <VaPagination
    v-model="$props.pagination.pageNumber"
    :pages="$props.pagination.totalPages"
    :visible-pages="3"
    buttons-preset="secondary"
    rounded
    gapped
    border-color="primary"
    class="justify-center sm:justify-start py-2"
  />
</template>
