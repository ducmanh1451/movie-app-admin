<script setup lang="ts">
import { ref, watch } from 'vue'
import { EmptyBooking, Booking } from '../types'
// import { useI18n } from 'vue-i18n'
import MovieSeat from '../../movie-rooms/widgets/MovieSeat.vue'

// language
// const { t } = useI18n()
// props
const props = defineProps<{
  booking: Booking | null
}>()
// declare empty booking
const defaultNewBooking: EmptyBooking = {
  cinema_id: '',
  cinema_name: '',
  room_id: '',
  room_name: '',
  movie_id: '',
  movie_name: '',
  expected_start_date: undefined,
  expected_end_date: undefined,
  opening_date: undefined,
  opening_start_time: undefined,
  opening_end_time: undefined,
  seats: [],
  rows: 0,
  columns: 0,
}
const newBooking = ref({ ...defaultNewBooking })

// watch change item in popup
watch(
  () => props.booking,
  () => {
    if (!props.booking) {
      return
    }

    newBooking.value = {
      ...props.booking,
    }
  },
  { immediate: true },
)
</script>

<template>
  <VaForm class="flex flex-col gap-2">
    <div class="row">
      <div class="flex flex-col md12">
        <MovieSeat
          :rows="newBooking.rows"
          :columns="newBooking.columns"
          :init-seats="newBooking.seats"
          module-use="booking"
        ></MovieSeat>
      </div>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped>
@import 'vuestic-ui/styles/grid';
</style>
