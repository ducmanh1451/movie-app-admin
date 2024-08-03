<template>
  <div class="container">
    <div v-if="seats.length > 0" class="screen"></div>
    <div
      class="seat-container"
      :class="{ 'module-booking': props.moduleUse == 'booking', 'module-movie-room': props.moduleUse != 'booking' }"
      :style="{ '--column': columns }"
      loading="true"
    >
      <div
        v-for="(seat, index) in seats"
        :key="index"
        :class="computedSeatClass(seat)"
        @click="props.moduleUse != 'booking' ? checkSeat(seat) : showCustomerInfo(seat)"
      >
        {{ String.fromCharCode(64 + seat.row) }}{{ seat.column }}
      </div>
    </div>
    <!-- moduleUse == movie-room -->
    <div v-if="seats.length > 0 && props.moduleUse == 'movie-room'" class="flex justify-center mt-4">
      <div class="flex-col item">
        <VaSelect
          v-model="type"
          :label="t('movieRooms.seatTypes')"
          :options="typeSeatOptions"
          value-by="seat_type_cd"
          text-by="seat_type_nm"
        />
      </div>
      <div class="flex justify-end flex-col item">
        <VaButton @click="validateAndProceed()"> {{ t('movieRooms.buttonSelectType') }} </VaButton>
      </div>
    </div>
    <!-- moduleUse == booking -->
    <div v-if="props.moduleUse == 'booking'" class="flex flex-col items-center mt-3">
      <div class="customer-info">
        <div><strong>Tên khách hàng: </strong>{{ customer?.customer_name }}</div>
        <div><strong>Email: </strong>{{ customer?.email }}</div>
        <div><strong>Trạng thái: </strong>{{ customer?.payment_status == true ? 'Đã thanh toán' : '' }}</div>
      </div>
    </div>
    <VaModal v-model="showErrorModal" hide-default-actions size="auto">
      <template #footer>
        <VaButton @click="showErrorModal = false">{{ t('common.buttonCancel') }}</VaButton>
      </template>
      {{ t('movieRooms.messageCheckTypeSeat') }}
    </VaModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getLibrary } from '../../../helpers/libraries'
import { MovieRoomSeat } from '../types'

// language
const { t } = useI18n()
// props
const props = defineProps({
  rows: {
    type: [Number, String],
    default: 0,
  },
  columns: {
    type: [Number, String],
    default: 0,
  },
  initSeats: {
    type: Array,
    default: () => [],
  },
  moduleUse: {
    type: String,
    default: 'movie-room',
  },
})
// emits
const emits = defineEmits(['updateSeats'])
// checkbox
const typeSeatOptions = ref([])
// customer info
const customer = ref<{ customer_id: string; customer_name: string; email: string; payment_status: boolean }>({
  customer_id: '',
  customer_name: '',
  email: '',
  payment_status: false,
})
const prevSelectedSeatId = ref<number>(0)
const type = ref()
const updateType = () => {
  const selectedTypeValue = type.value
  const selectedOption = typeSeatOptions.value.find((option: any) => option.seat_type_cd === selectedTypeValue)
  const selectedOptionPrice = selectedOption ? selectedOption['seat_price'] : typeSeatOptions.value[0]['seat_price']
  const selectedSeats = seats.value.filter((seat) => !seat.available)
  selectedSeats.forEach((seat) => {
    seat.type = selectedTypeValue
    seat.available = true
    seat.price = selectedOptionPrice
  })
  emits('updateSeats', seats.value)
}
// get seat type from database
onMounted(async () => {
  const response = await getLibrary(1)
  typeSeatOptions.value = response.library.lib_details
  // if movieSeat component is used in booking => call generateSeats
  if (props.moduleUse === 'booking') {
    seats.value = generateSeats(props.rows as number, props.columns as number)
  }
})

// Modal error
const showErrorModal = ref(false)

// Hàm kiểm tra và tiến hành
const validateAndProceed = () => {
  // Kiểm tra xem đã chọn type và đã check ít nhất một seat chưa
  if (!type.value || !seats.value.some((seat) => seat.available)) {
    // Hiển thị modal thông báo lỗi
    showErrorModal.value = true
  } else {
    // Nếu đã chọn type và đã check ít nhất một seat, thực hiện hành động updateType
    updateType()
  }
}
// generate seat
const generateSeats = (rows: number, columns: number) => {
  typeof rows === 'string' ? parseInt(rows) : rows
  typeof columns === 'string' ? parseInt(columns) : columns
  let seatsArray = []
  // if mode is update
  if (props.initSeats.length > 0) {
    seatsArray = props.initSeats
    return seatsArray
  }
  // if mode is create
  if (rows > 0 && rows < 13 && columns > 0 && columns < 13) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const seat_id = row * columns + col + 1
        seatsArray.push({
          seat_id: seat_id,
          seat_name: '',
          row: row + 1,
          column: col + 1,
          type: 1, // gồm các loại: standard, vip, disable
          available: true,
          price: typeSeatOptions.value[0]['seat_price'],
        })
      }
    }

    emits('updateSeats', seatsArray)
  }
  return seatsArray
}
// init
const seats = ref<Array<any>>([])

// computed
const computedSeatClass = (seat: MovieRoomSeat) => {
  let seatClass: string = 'seat '
  // make class by type
  if (seat.type == 1) {
    seatClass += 'seat-standard '
  } else if (seat.type == 2) {
    seatClass += 'seat-vip '
  } else if (seat.type == 3) {
    seatClass += 'not-display '
  }
  // check by booking (module booking)
  if (seat.booking && props.moduleUse == 'booking') {
    seatClass += 'booking '
  }
  // make class by available
  if (!seat.available) {
    seatClass += 'selecting '
  }
  return seatClass
}

// watch
watch([() => props.rows as number, () => props.columns as number], () => {
  seats.value = generateSeats(props.rows as number, props.columns as number)
})

// click seat
const checkSeat = (seat: any) => {
  seat.available = !seat.available
}
const showCustomerInfo = (seat: any) => {
  if (seat.type === 3) {
    return
  }
  if (prevSelectedSeatId.value != 0) {
    const selectedSeat = seats.value.find((seat) => seat.seat_id == prevSelectedSeatId.value)
    selectedSeat.available = true
  }
  if (seat.customer != undefined) {
    customer.value.customer_id = seat.customer.customer_id
    customer.value.customer_name = seat.customer.customer_name
    customer.value.email = seat.customer.email
    customer.value.payment_status = seat.customer.payment_status
  } else {
    customer.value.customer_id = ''
    customer.value.customer_name = ''
    customer.value.email = ''
    customer.value.payment_status = false
  }
  seat.available = !seat.available
  prevSelectedSeatId.value = seat.seat_id
}
</script>

<style scoped>
.container {
  margin-top: 15px;
}

.screen {
  background-image: url(../../../../public/bg-screen.png);
  background-repeat: no-repeat;
  height: 60px;
  background-position: center;
  margin-bottom: 15px;
}

.seat-container {
  display: grid;
  grid-template-columns: repeat(var(--column), auto);
  justify-content: center;
  gap: 10px;
}

.seat {
  width: 30px;
  height: 30px;
  background-color: #fff;
  border: 1px solid #ccc;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-size: small;
}

.seat.seat-standard {
  border-color: #01c73c;
}

.seat.seat-vip {
  border-color: #f71708;
}

.seat-container.module-movie-room .seat.not-display,
.seat-container.module-booking .seat.not-display {
  background-color: gainsboro;
}

.seat-container.module-booking .seat.not-display {
  cursor: not-allowed;
  opacity: 0.3;
}

.seat-container.module-booking .seat.booking {
  border-color: #bbb;
  background-color: #bbb;
  color: #fff;
}

.seat.selecting {
  background-color: #6ed9d9 !important;
  border-color: #6ed9d9 !important;
  color: #000 !important;
}
</style>
