<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { useMovieRooms } from './composables/useMovieRooms'
import MovieSeat from '../movie-rooms/widgets/MovieSeat.vue'
import { MovieRoom } from './types'
// import { useToast } from 'vuestic-ui'
// import { useRoute, useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

// language
const { t } = useI18n()
// hook
const { find } = useMovieRooms()
// router
// const router = useRouter()
// declare
const movieRoom = ref<MovieRoom>({
  _id: '',
  cinema_id: '',
  cinema_name: '',
  room_name: '',
  rows: 0,
  columns: 0,
  seats: [],
})
// notify
// const { init: notify } = useToast()
// loading when save
const loadingScreen = ref(false)
// Modal error
const showErrorModal = ref(false)
// rules validate when change input
const roomNameRules = [(v: string) => !!v || t('common.messageRequired')]

// get data by id
onMounted(async () => {
  try {
    const route = useRoute()
    const _id = route.params._id
    const response = await find(_id as string)
    const data = response.data.payload[0]
    movieRoom.value = data
  } catch (error) {
    console.error('Error fetching genre data:', error)
  }
})

// emit
const handleUpdateSeats = (seats: any[]) => {
  movieRoom.value.seats = seats
}
</script>
<template>
  <h1 class="page-title">{{ t('menu.detail-movie-room') }}</h1>
  <VaInnerLoading :loading="loadingScreen">
    <VaCard>
      <VaCardContent>
        <div class="row">
          <div class="flex flex-col md4">
            <div class="item">
              <VaSelect v-model="movieRoom.cinema_name" :label="t('movieRooms.cinemas')" disabled />
            </div>
          </div>
          <div class="flex flex-col md8">
            <div class="item">
              <VaInput v-model="movieRoom.room_name" :label="t('movieRooms.roomName')" :rules="roomNameRules" />
            </div>
          </div>
        </div>
        <div class="row mt-10">
          <div class="flex flex-col md2">
            <div class="item">
              <VaInput v-model="movieRoom.rows" :label="t('movieRooms.row')" type="number" disabled />
            </div>
          </div>
          <div class="flex flex-col md2">
            <div class="item">
              <VaInput v-model="movieRoom.columns" :label="t('movieRooms.column')" type="number" disabled />
            </div>
          </div>
        </div>
        <div class="row justify-center">
          <MovieSeat
            :rows="movieRoom.rows"
            :columns="movieRoom.columns"
            :init-seats="movieRoom.seats"
            module-use=""
            @updateSeats="handleUpdateSeats"
          ></MovieSeat>
        </div>
        <div class="row justify-end mt-10">
          <div class="flex flex-col">
            <div class="item">
              <VaButton disabled>{{ t('common.buttonSave') }}</VaButton>
            </div>
          </div>
        </div>
      </VaCardContent>
      <VaModal v-model="showErrorModal" hide-default-actions size="small">
        <template #footer>
          <VaButton @click="showErrorModal = false">{{ t('common.buttonCancel') }}</VaButton>
        </template>
        {{ t('common.messageErrorSystem') }}
      </VaModal>
    </VaCard>
  </VaInnerLoading>
</template>

<style scoped>
@import 'vuestic-ui/styles/grid';

.mt-10 {
  margin-top: 5px;
}
</style>
