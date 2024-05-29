<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useBookings } from './composables/useBookings'
import BookingTable from './widgets/BookingTable.vue'
import BookingForm from './widgets/BookingForm.vue'
import { Booking } from './types'
import { ref } from 'vue'
// import { useModal, useToast } from 'vuestic-ui'

// language
const { t } = useI18n()
// hook
const { isLoading, bookings, pagination } = useBookings()
// variable check mode create or update
const bookingToEdit = ref<Booking | null>(null)
// varable manage show/hide modal
const showModal = ref(false)
// notify
// const { init: notify } = useToast()
// modal confirm
// const { confirm } = useModal()
// click btn show
const showBookingDetail = (booking: Booking) => {
  bookingToEdit.value = booking
  showModal.value = true
}
</script>
<template>
  <h1 class="page-title">{{ t('bookings.pageTitle') }}</h1>
  <VaCard>
    <VaCardContent>
      <BookingTable
        v-model:pagination="pagination"
        :bookings="bookings"
        :loading="isLoading"
        @show="showBookingDetail"
      />
    </VaCardContent>
    <VaModal
      v-slot="{ cancel }"
      v-model="showModal"
      size="large"
      mobile-fullscreen
      stateful
      hide-default-actions
      max-height="550px"
    >
      <h1 class="va-h5 mb-4">{{ t('bookings.popupDetailTitle') }}</h1>
      <BookingForm :booking="bookingToEdit" @close="cancel" />
    </VaModal>
  </VaCard>
</template>
