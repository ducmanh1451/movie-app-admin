<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, watch } from 'vue'
import { Cinema } from '../cinemas/types'
import axios from 'axios'
import MovieSeat from '../movie-rooms/widgets/MovieSeat.vue'
import { MovieRoom } from './types'
import { useMovieRooms } from './composables/useMovieRooms'
import { useToast } from 'vuestic-ui'
import { useRouter } from 'vue-router'

// language
const { t } = useI18n()
// hook
const { add } = useMovieRooms()
// router
const router = useRouter()
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
const cinemaId = ref<string>('')
const roomName = ref<string>('')
const rows = ref<number>(0)
const columns = ref<number>(0)
const loadingOption = ref(true)
const loadingScreen = ref(false)
const cinemasOptions = ref([])

// notify
const { init: notify } = useToast()
// Modal error
const showErrorModal = ref(false)
// rules validate when change input
const rowRules = [
  (v: string) => !!v || t('common.messageRequired'),
  (v: string) => (parseInt(v) > 0 && parseInt(v) <= 12) || t('movieRooms.messageCheckMaxNumber'),
]
const columnRules = [
  (v: string) => !!v || t('common.messageRequired'),
  (v: string) => (parseInt(v) > 0 && parseInt(v) <= 12) || t('movieRooms.messageCheckMaxNumber'),
]
const roomNameRules = [(v: string) => !!v || t('common.messageRequired')]
// init data for selectbox
onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/cinema`)
    const data = response.data.payload
    cinemasOptions.value = data.map((cinema: Cinema) => ({
      text: cinema.cinema_name,
      value: cinema._id,
    }))
    loadingOption.value = false
  } catch (error) {
    console.error('Error fetching genre data:', error)
  }
})

// click button save
const saveMovieRoom = async () => {
  try {
    // validate
    if (cinemaId.value === '' || roomName.value === '' || rows.value <= 0 || columns.value <= 0) {
      showErrorModal.value = true
      return
    }
    // process
    loadingScreen.value = true
    await add(movieRoom.value as MovieRoom)
    loadingScreen.value = false
    // after create success => show notify and redirect to screen list data
    notify({
      message: t('common.messageCreateSuccess'),
      color: 'success',
    })
    setTimeout(() => {
      router.push('/movie-rooms/list-movie-rooms')
    }, 3000)
  } catch (error) {
    console.error('Error fetching genre data:', error)
  }
}
// emit
const handleUpdateSeats = (seats: any[]) => {
  movieRoom.value.seats = seats
}
// watch
watch([cinemaId, roomName, rows, columns], ([newCinemaId, newRoomName, newRow, newColumn]) => {
  const selectedCinema = (cinemasOptions.value as any[]).find((cinema: any) => cinema.value === newCinemaId)
  movieRoom.value.cinema_id = newCinemaId
  movieRoom.value.cinema_name = selectedCinema !== undefined ? selectedCinema.text : ''
  movieRoom.value.room_name = newRoomName
  movieRoom.value.rows = newRow
  movieRoom.value.columns = newColumn
})
</script>

<template>
  <h1 class="page-title">{{ t('menu.create-movie-room') }}</h1>
  <VaInnerLoading :loading="loadingScreen">
    <VaCard>
      <VaCardContent>
        <div class="row">
          <div class="flex flex-col md4">
            <div class="item">
              <VaSelect
                v-model="cinemaId"
                :loading="loadingOption"
                :label="t('movieRooms.cinemas')"
                :options="cinemasOptions"
                value-by="value"
                text-by="text"
              />
            </div>
          </div>
          <div class="flex flex-col md8">
            <div class="item">
              <VaInput v-model="roomName" :label="t('movieRooms.roomName')" :rules="roomNameRules" />
            </div>
          </div>
        </div>
        <div class="row mt-10">
          <div class="flex flex-col md2">
            <div class="item">
              <VaInput v-model="rows" :label="t('movieRooms.row')" type="number" :rules="rowRules" />
            </div>
          </div>
          <div class="flex flex-col md2">
            <div class="item">
              <VaInput v-model="columns" :label="t('movieRooms.column')" type="number" :rules="columnRules" />
            </div>
          </div>
        </div>
        <div class="row justify-center">
          <MovieSeat :rows="rows" :columns="columns" @updateSeats="handleUpdateSeats"></MovieSeat>
        </div>
        <div class="row justify-end mt-10">
          <div class="flex flex-col">
            <div class="item">
              <VaButton @click="saveMovieRoom()">{{ t('common.buttonSave') }}</VaButton>
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
