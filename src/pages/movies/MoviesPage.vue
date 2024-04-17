<script setup lang="ts">
import { useMovies } from './composables/useMovies'
import MovieTable from './widgets/MovieTable.vue'

const { isLoading, movies, pagination } = useMovies()
</script>

<template>
  <h1 class="page-title">Movies</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start"></div>
        <VaButton icon="add">Movie</VaButton>
      </div>
      <MovieTable v-model:pagination="pagination" :movies="movies" :loading="isLoading" />
    </VaCardContent>
  </VaCard>
</template>
