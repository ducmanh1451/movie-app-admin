<script setup lang="ts">
import { ref, watch, onMounted, reactive } from 'vue'
import { EmptyShowtime, Showtime, ShowtimeDetail } from '../types'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { Cinema } from '../../cinemas/types'
import { MovieRoom } from '../../movie-rooms/types'
import { Movie } from '../../movies/types'
import { formatDateToDisplay, subtractDate, formatTimeToDisplay } from '../../../helpers/date'

import { defineVaDataTableColumns } from 'vuestic-ui'

// language
const { t } = useI18n()

// props
const props = defineProps<{
  showtime: Showtime | null
}>()
// emits
defineEmits<{
  (event: 'save', showtime: Showtime): void
  (event: 'close'): void
}>()
// disabled selectbox when edit
const isModeEdit = ref(false)

// declare empty showtime
const defaultNewShowtime: EmptyShowtime = {
  cinema_id: '',
  cinema_name: '',
  room_id: '',
  room_name: '',
  showtime_detail: [],
}
const newShowtime = ref({ ...defaultNewShowtime })

const showtimeDetail: ShowtimeDetail = {
  movie_id: '',
  movie_name: '',
  expected_start_date: undefined,
  expected_end_date: undefined,
  movie_duration: 0,
  opening_date: undefined,
  opening_start_time: undefined,
  opening_end_time: undefined,
}
const newShowtimeDetail = ref({ ...showtimeDetail })

// validate
const required = (v: any) => !!v || t('common.messageRequired')

// init data for selectbox
const cinemasOptions = ref([])
const movieRoomsOptions = ref([])
const moviesOptions = ref([])
onMounted(async () => {
  try {
    // fetch data cinema
    const cinemas = await axios.get(`http://localhost:8000/api/v1/cinema`)
    cinemasOptions.value = cinemas.data.payload.map((cinema: Cinema) => ({
      text: cinema.cinema_name,
      value: cinema._id,
    }))
    // fetch data movie
    const movies = await axios.get(`http://localhost:8000/api/v1/movie`)
    moviesOptions.value = movies.data.payload.map((movie: Movie) => ({
      text: movie.movie_name,
      value: movie._id,
      expected_start_date: new Date(movie.expected_start_date),
      expected_end_date: new Date(movie.expected_end_date),
      movie_duration: movie.movie_duration,
    }))
  } catch (error) {
    console.error('Error fetching genre data:', error)
  }
})

// on change cinema selectbox
const updateCinemaName = (selectedCinemaId: string) => {
  const selectedCinema = cinemasOptions.value.find((option: any) => option.value === selectedCinemaId)
  if (selectedCinema) {
    newShowtime.value.cinema_name = selectedCinema['text']
    // call axios
    fetchDataMovieRooms(newShowtime.value.cinema_id)
  }
}

// fetch data movie rooms selectbox
const fetchDataMovieRooms = async (cinema_id: string) => {
  try {
    const movieRooms = await axios.get(`http://localhost:8000/api/v1/movie-room/by-cinema/${cinema_id}`)
    movieRoomsOptions.value = movieRooms.data.payload.map((movieRoom: MovieRoom) => ({
      text: movieRoom.room_name,
      value: movieRoom._id,
    }))
  } catch (error) {
    console.error('Error fetching movie rooms data:', error)
  }
}

// click btn clear cinema option
const onClearCinemaSelectBox = () => {
  movieRoomsOptions.value = []
  newShowtime.value.room_id = ''
  newShowtime.value.room_name = ''
}

// click btn clear room option
const onClearRoomSelectBox = () => {
  newShowtime.value.room_id = ''
  newShowtime.value.room_name = ''
}

// on change room selectbox
const updateRoomName = (selectedRoomId: string) => {
  const selectedRoom = movieRoomsOptions.value.find((option: any) => option.value === selectedRoomId)
  if (selectedRoom) {
    newShowtime.value.room_name = selectedRoom['text']
  }
}

// on change movie options
const changeMovieOption = (movieId: string) => {
  const selectedMovie = moviesOptions.value.find((option: any) => option.value === movieId)
  if (selectedMovie) {
    newShowtimeDetail.value.movie_id = selectedMovie['value']
    newShowtimeDetail.value.movie_name = selectedMovie['text']
    newShowtimeDetail.value.movie_duration = selectedMovie['movie_duration']
    newShowtimeDetail.value.expected_start_date = selectedMovie['expected_start_date']
    newShowtimeDetail.value.expected_end_date = selectedMovie['expected_end_date']
  }
}
// click btn clear movie option
const onClearMovieSelectBox = () => {
  newShowtimeDetail.value.movie_id = ''
  newShowtimeDetail.value.movie_name = ''
  newShowtimeDetail.value.movie_duration = 0
  newShowtimeDetail.value.expected_start_date = undefined
  newShowtimeDetail.value.expected_end_date = undefined
}

// declare items display rows data
const items: any = reactive([])

const columns = defineVaDataTableColumns([
  { label: t('movies.movieName'), key: 'movie_name', thAlign: 'center', tdAlign: 'left' },
  { label: t('movies.movieDuration'), key: 'movie_duration', thAlign: 'center', tdAlign: 'right' },
  { label: t('movies.expectedStartDate'), key: 'expected_start_date', thAlign: 'center', tdAlign: 'center' },
  { label: t('movies.expectedEndDate'), key: 'expected_end_date', thAlign: 'center', tdAlign: 'center' },
  { label: t('movies.opening_date'), key: 'opening_date', thAlign: 'center', tdAlign: 'center' },
  { label: t('movies.opening_start_time'), key: 'opening_start_time', thAlign: 'center', tdAlign: 'center' },
  { label: t('movies.opening_end_time'), key: 'opening_end_time', thAlign: 'center', tdAlign: 'center' },
  { label: ' ', key: 'actions', thAlign: 'center', tdAlign: 'center' },
])

// update opening end time
const changeOpeningStartTime = (time: Date) => {
  const startDateTime = new Date(time)
  const movieDurationInMinutes = newShowtimeDetail.value.movie_duration
  const totalMinutes = startDateTime.getMinutes() + movieDurationInMinutes
  startDateTime.setMinutes(totalMinutes)
  newShowtimeDetail.value.opening_end_time = startDateTime
}

// click button add new row
const addNewRow = () => {
  // validate
  if (!validateRowData()) {
    return
  }
  // continue process
  items.push({ ...newShowtimeDetail.value })

  // reset
  newShowtimeDetail.value = { ...showtimeDetail }
}

// validate after add row
const validateRowData = () => {
  // check not exists selected movie
  if (newShowtimeDetail.value.movie_id === '') {
    alert('Vui lòng chọn bộ phim')
    return false
  }
  // check not exists opening_date
  if (newShowtimeDetail.value.opening_date == undefined) {
    alert('Ngày dự kiến mở bán không được để trống')
    return false
  }
  // check not exists opening_start_time
  if (newShowtimeDetail.value.opening_start_time == undefined) {
    alert('Thời gian bắt đầu chiếu không được để trống')
    return false
  }
  // check the expected opening date within the allowed time period ̣(Open 3 days in advance)
  // ex: expected_start_date: 10/05/2024, expected_end_date: 10/06/2024 => opening from 07/05/2024 ~ 10/06/2024
  if (
    newShowtimeDetail.value.opening_date != undefined &&
    newShowtimeDetail.value.expected_start_date != undefined &&
    newShowtimeDetail.value.opening_date < subtractDate(newShowtimeDetail.value.expected_start_date, 3)
  ) {
    alert('Ngày dự kiến mở bán không được bé hơn ngày dự kiến bắt đầu')
    return false
  }
  // check expected opening date not < current
  if (newShowtimeDetail.value.opening_date != undefined && newShowtimeDetail.value.opening_date < new Date()) {
    alert('Ngày dự kiến mở bán không được bé hơn hoặc bằng ngày hiện tại')
    return false
  }
  if (
    newShowtimeDetail.value.opening_date != undefined &&
    newShowtimeDetail.value.expected_end_date != undefined &&
    newShowtimeDetail.value.opening_date > newShowtimeDetail.value.expected_end_date
  ) {
    alert('Ngày dự kiến mở bán không được lớn hơn ngày dự kiến kết thúc')
    return false
  }
  // check time
  if (!checkDuplicateShowtime()) {
    alert('Trùng lặp giờ chiếu')
    return false
  }

  return true
}

// check time start time and end time
const checkDuplicateShowtime = () => {
  if (
    newShowtimeDetail.value.opening_date === undefined ||
    newShowtimeDetail.value.opening_start_time === undefined ||
    newShowtimeDetail.value.opening_end_time === undefined
  ) {
    return false
  }
  const openingDate = new Date(newShowtimeDetail.value.opening_date)
  const openingStartTime = new Date(newShowtimeDetail.value.opening_start_time)
  const openingEndTime = new Date(newShowtimeDetail.value.opening_end_time)

  openingStartTime.setFullYear(openingDate.getFullYear())
  openingStartTime.setMonth(openingDate.getMonth())
  openingStartTime.setDate(openingDate.getDate())

  openingEndTime.setFullYear(openingDate.getFullYear())
  openingEndTime.setMonth(openingDate.getMonth())
  openingEndTime.setDate(openingDate.getDate())

  newShowtimeDetail.value.opening_start_time = openingStartTime
  newShowtimeDetail.value.opening_end_time = openingEndTime
  // validate
  const filterItems = items.filter(
    (row: any) =>
      newShowtimeDetail.value.opening_date != undefined &&
      new Date(row.opening_date).getTime() === newShowtimeDetail.value.opening_date.getTime(),
  )
  let hasError = 0
  filterItems.forEach((row: any) => {
    if (
      newShowtimeDetail.value.opening_start_time != undefined &&
      newShowtimeDetail.value.opening_start_time >= new Date(row.opening_start_time) &&
      newShowtimeDetail.value.opening_start_time != undefined &&
      newShowtimeDetail.value.opening_start_time < new Date(row.opening_end_time)
    ) {
      hasError++
    }
    if (
      newShowtimeDetail.value.opening_end_time != undefined &&
      newShowtimeDetail.value.opening_end_time > new Date(row.opening_start_time) &&
      newShowtimeDetail.value.opening_end_time != undefined &&
      newShowtimeDetail.value.opening_end_time <= new Date(row.opening_end_time)
    ) {
      hasError++
    }
    if (
      newShowtimeDetail.value.opening_start_time != undefined &&
      newShowtimeDetail.value.opening_start_time >= new Date(row.opening_start_time) &&
      newShowtimeDetail.value.opening_end_time != undefined &&
      newShowtimeDetail.value.opening_end_time <= new Date(row.opening_end_time)
    ) {
      hasError++
    }
  })
  return hasError > 0 ? false : true
}

// validate must have min 1 row in table
const checkExistsRowInTable = () => {
  if (items.length === 0) {
    alert('Vui lòng thêm ít nhất một dòng vào bảng trước khi lưu.')
    return false
  }
  newShowtime.value.showtime_detail = items
  return true
}

// click button delete row
const deleteShowtimeDetail = (rowIndex: number) => {
  items.splice(rowIndex, 1)
}

// check disabled button delete
const disableButtonDeleteDetail = (rowData: any) => {
  if (new Date(rowData['opening_start_time']) <= new Date()) {
    return true
  }
  return false
}

// watch change item in popup
watch(
  () => props.showtime,
  async () => {
    if (!props.showtime) {
      return
    }

    newShowtime.value = {
      ...props.showtime,
    }

    isModeEdit.value = true

    await fetchDataMovieRooms(newShowtime.value.cinema_id)

    items.splice(0, items.length, ...newShowtime.value.showtime_detail)
  },
  { immediate: true },
)
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <div class="row">
      <div class="flex flex-col md4">
        <div class="item">
          <VaSelect
            v-model="newShowtime.cinema_id"
            :label="t('movieRooms.cinemas')"
            :rules="[required]"
            :options="cinemasOptions"
            value-by="value"
            text-by="text"
            required-mark
            clearable
            :disabled="isModeEdit"
            @update:modelValue="updateCinemaName"
            @clear="onClearCinemaSelectBox"
          />
        </div>
      </div>
      <div class="flex flex-col md4">
        <div class="item">
          <VaSelect
            v-model="newShowtime.room_id"
            :label="t('movieRooms.roomName')"
            :rules="[required]"
            :options="movieRoomsOptions"
            :disabled="isModeEdit"
            value-by="value"
            text-by="text"
            required-mark
            clearable
            @update:modelValue="updateRoomName"
            @clear="onClearRoomSelectBox"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md12">
        <div class="item">
          <VaDataTable class="table-crud" :items="items" :columns="columns" striped>
            <template #headerAppend>
              <tr class="table-crud__slot">
                <td v-for="column in columns" :key="column['key']" class="p-1">
                  <VaSelect
                    v-if="column['key'] == 'movie_name'"
                    v-model="newShowtimeDetail.movie_id"
                    :options="moviesOptions"
                    value-by="value"
                    text-by="text"
                    clearable
                    @update:modelValue="changeMovieOption"
                    @clear="onClearMovieSelectBox"
                  />
                  <VaInput
                    v-if="column['key'] == 'movie_duration'"
                    v-model="newShowtimeDetail.movie_duration"
                    input-class="va-text-right"
                    disabled
                  />
                  <VaDateInput
                    v-if="column['key'] == 'expected_start_date'"
                    v-model="newShowtimeDetail.expected_start_date"
                    input-class="va-text-center"
                    :format-date="formatDateToDisplay"
                    disabled
                  />
                  <VaDateInput
                    v-if="column['key'] == 'expected_end_date'"
                    v-model="newShowtimeDetail.expected_end_date"
                    input-class="va-text-center"
                    :format-date="formatDateToDisplay"
                    disabled
                  />
                  <VaDateInput
                    v-if="column['key'] == 'opening_date'"
                    v-model="newShowtimeDetail.opening_date"
                    input-class="va-text-center"
                    :format-date="formatDateToDisplay"
                  />
                  <VaTimeInput
                    v-if="column['key'] == 'opening_start_time'"
                    v-model="newShowtimeDetail.opening_start_time"
                    input-class="va-text-center"
                    class="w-28"
                    @update:modelValue="changeOpeningStartTime"
                  />
                  <VaTimeInput
                    v-if="column['key'] == 'opening_end_time'"
                    v-model="newShowtimeDetail.opening_end_time"
                    input-class="va-text-center"
                    class="w-28"
                    disabled
                  />
                  <VaButton v-if="column['key'] == 'actions'" block input-class="va-text-center" @click="addNewRow">
                    {{ t('common.buttonCreateNew') }}
                  </VaButton>
                </td>
              </tr>
            </template>

            <template #cell(expected_start_date)="{ value }">
              {{ formatDateToDisplay(value) }}
            </template>
            <template #cell(expected_end_date)="{ value }">
              {{ formatDateToDisplay(value) }}
            </template>
            <template #cell(opening_date)="{ value }">
              {{ formatDateToDisplay(value) }}
            </template>
            <template #cell(opening_start_time)="{ value }">
              {{ formatTimeToDisplay(value) }}
            </template>
            <template #cell(opening_end_time)="{ value }">
              {{ formatTimeToDisplay(value) }}
            </template>

            <template #cell(actions)="{ rowData }">
              <VaButton
                preset="primary"
                size="small"
                icon="mso-delete"
                color="danger"
                :disabled="disableButtonDeleteDetail(rowData)"
                aria-label="Delete showtime detail"
                @click="deleteShowtimeDetail"
              />
            </template>
          </VaDataTable>
        </div>
      </div>
    </div>
    <div class="row buttons">
      <div class="flex flex-col md12">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">
          {{ t('common.buttonCancel') }}
        </VaButton>
        <VaButton @click="validate() && checkExistsRowInTable() && $emit('save', newShowtime as Showtime)">
          {{ t('common.buttonSave') }}
        </VaButton>
      </div>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped>
@import 'vuestic-ui/styles/grid';

// table crud
.table-crud {
  --va-form-element-default-width: 0;

  .va-input {
    display: block;
  }

  &__slot {
    th {
      vertical-align: middle;
    }
  }
}

.modal-crud {
  .va-input {
    display: block;
  }
}
</style>
