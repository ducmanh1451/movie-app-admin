<template>
  <div class="container">
    <div v-if="seats.length > 0" class="screen"></div>
    <div class="seat-container" :style="{ '--column': columns }" loading="true">
      <div
        v-for="(seat, index) in seats"
        :key="index"
        :class="{
          seat: true,
          standard: seat.type === 1,
          vip: seat.type === 2,
          disabled: seat.type === 3,
          checked: seat.checked,
        }"
        @click="checkSeat(seat)"
      >
        {{ seat.seat_id }}
      </div>
    </div>
    <div v-if="seats.length > 0" class="flex justify-center mt-4">
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
  initialSeats: {
    type: Array,
    default: () => [],
  },
})
// emits
const emits = defineEmits(['updateSeats'])
// checkbox
const typeSeatOptions = ref([])

const type = ref()
const updateType = () => {
  const selectedTypeValue = type.value
  const selectedSeats = seats.value.filter((seat) => seat.checked)
  selectedSeats.forEach((seat) => {
    seat.type = selectedTypeValue
    seat.checked = false
  })
  emits('updateSeats', seats.value)
}

// get seat type from database
onMounted(async () => {
  const response = await getLibrary(1)
  typeSeatOptions.value = response.library.lib_details
})

// Modal error
const showErrorModal = ref(false)

// Hàm kiểm tra và tiến hành
const validateAndProceed = () => {
  // Kiểm tra xem đã chọn type và đã check ít nhất một seat chưa
  if (!type.value || !seats.value.some((seat) => seat.checked)) {
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
  if (props.initialSeats.length > 0) {
    seatsArray = props.initialSeats
    return seatsArray
  }
  // if mode is create
  if (rows > 0 && rows < 13 && columns > 0 && columns < 13) {
    const totalSeats = rows * columns
    for (let i = 0; i < totalSeats; i++) {
      seatsArray.push({
        seat_id: i + 1,
        selected: false,
        type: 1, // gồm các loại: standard, vip, disable
        checked: false,
        available: true,
        price: typeSeatOptions.value[0]['seat_price'],
      })
    }
    emits('updateSeats', seatsArray)
  }
  return seatsArray
}
// init
const seats = ref<Array<any>>([])

// watch
watch([() => props.rows as number, () => props.columns as number], () => {
  seats.value = generateSeats(props.rows as number, props.columns as number)
})

// click seat
const checkSeat = (seat: any) => {
  seat.checked = !seat.checked
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
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-size: small;
  color: #fff;
}

.seat.standard {
  background-color: green;
}

.seat.vip {
  background-color: purple;
}

.seat.disabled {
  background-color: gainsboro;
}

.seat.checked {
  background-color: #b11500;
}
</style>
