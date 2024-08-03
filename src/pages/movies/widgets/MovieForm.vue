<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { EmptyMovie, Movie } from '../types'
import { useI18n } from 'vue-i18n'
import { getLibrary } from '../../../helpers/libraries'
import { formatDateToDisplay } from '../../../helpers/date'
import ImageTable from '../../media/widgets/ImageTable.vue'
import { useImages } from '../../media/composables/useMedia'
// import { ImageDisplay, Pagination } from '../../media/types'

// language
const { t } = useI18n()
// hook
const { isLoading, images, pagination } = useImages()

// data selectbox genre
const genreOptions = ref([])
// init data for selectbox genre
onMounted(async () => {
  const response = await getLibrary(2)
  genreOptions.value = response.library.lib_details.map((item: any) => item.genre_nm)
})

// data selectbox movieType
const movieTypesOptions = [
  { value: 0, label: t('movies.upcomingMovie') }, // sắp chiếu
  { value: 1, label: t('movies.showingMovie') }, // đang chiếu
]
// props
const props = defineProps<{
  movie: Movie | null
  isShow: boolean
}>()
// emits
defineEmits<{
  (event: 'save', movie: Movie): void
  (event: 'close'): void
}>()
// declare empty movie
const maxVisibleOptions = 1
const showModalImportImage = ref<boolean>(false)
const config = { defaultSize: 'large', sizes: { large: 1600 } }

const disabledStartDate = ref(false)
const defaultStartDate = new Date()
defaultStartDate.setDate(defaultStartDate.getDate())
const defaultEndDate = new Date()
defaultEndDate.setDate(defaultEndDate.getDate() + 14)

const defaultNewMovie: EmptyMovie = {
  movie_name: '',
  genre: [],
  director: '',
  actors: [],
  rating: 0,
  movie_type: 0,
  expected_start_date: defaultStartDate,
  expected_end_date: defaultEndDate,
  movie_duration: 0,
  poster: '',
  trailer: '',
  content: '',
}

const newMovie = ref({ ...defaultNewMovie })

// start addActor and removeActor
const actorName = ref('')
const addActor = () => {
  if (actorName.value.trim() !== '') {
    newMovie.value.actors.push(actorName.value.trim())
    actorName.value = ''
  }
}
const removeActor = (index = 0) => {
  newMovie.value.actors.splice(index, 1)
}
// end addActor and removeActor

// watch change item in popup
watch(
  () => props.movie,
  () => {
    if (!props.movie) {
      return
    }

    newMovie.value = {
      ...props.movie,
    }
    // if mode is edit, and expected_start_date <= current_date => disabled expected_start_date
    if (new Date(props.movie.expected_start_date) < defaultStartDate) {
      disabledStartDate.value = true
    }
  },
  { immediate: true },
)

// watch(
//   () => showModalImportImage.value,
//   async (newValue) => {
//     if (newValue) {
//       const { isLoading, images, pagination } = await useImages()
//       isLoadingPopup.value = isLoading.value
//       imagesPopup.value = images.value
//       paginationPopup.value = pagination.value
//       console.log(images);
//     }
//   },
//   { immediate: true },
// )

const importImage = (image: string) => {
  newMovie.value.poster = image
  showModalImportImage.value = false
}

// validate
const requiredString = (v: string) => !!v || t('common.messageRequired')
const requiredOption = (v: any) => ('length' in v && v.length > 0) || t('common.messageRequired')
const ruleStartDate = (expected_start_date: any) => {
  // if expected_start_date is disabled (movie is showing), dont need validate
  if (disabledStartDate.value) {
    return true
  }
  return expected_start_date <= defaultStartDate ? t('common.messageDateGreaterCurrent') : true
}
const ruleEndDate = (expected_end_date: any) => {
  if (expected_end_date <= newMovie.value.expected_start_date) {
    return t('common.messageDateToGreaterDateFrom')
  } else if (expected_end_date <= defaultStartDate) {
    return t('common.messageDateGreaterCurrent')
  } else {
    return true
  }
}
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <div class="row">
      <div class="flex flex-col md12">
        <div class="item">
          <VaInput v-model="newMovie.movie_name" :label="t('movies.movieName')" :rules="[requiredString]" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md3">
        <div class="item">
          <VaSelect
            v-model="newMovie.genre"
            :label="t('movies.genre')"
            :rules="[requiredOption]"
            :options="genreOptions"
            multiple
            max-selections="3"
            :max-visible-options="maxVisibleOptions"
          />
        </div>
      </div>
      <div class="flex flex-col md3">
        <div class="item">
          <VaInput v-model="newMovie.rating" :label="t('movies.rating')" type="number" min="0" max="10" />
        </div>
      </div>
      <div class="flex flex-col md3">
        <div class="item">
          <VaSelect
            v-model="newMovie.movie_type"
            :label="t('movies.movieType')"
            :options="movieTypesOptions"
            value-by="value"
            text-by="label"
            disabled
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md3">
        <div class="item">
          <VaDateInput
            v-model="newMovie.expected_start_date"
            :label="t('movies.expectedStartDate')"
            :format-date="formatDateToDisplay"
            :rules="[ruleStartDate]"
            :disabled="disabledStartDate"
          />
        </div>
      </div>
      <div class="flex flex-col md3">
        <div class="item">
          <VaDateInput
            v-model="newMovie.expected_end_date"
            :label="t('movies.expectedEndDate')"
            :format-date="formatDateToDisplay"
            :rules="[ruleEndDate]"
          />
        </div>
      </div>
      <div class="flex flex-col md3">
        <div class="item">
          <VaInput v-model="newMovie.movie_duration" :label="t('movies.movieDuration')" type="number" min="0" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md12">
        <div class="item">
          <VaInput v-model="newMovie.director" :label="t('movies.director')" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md12 actors">
        <div class="item">
          <VaInput v-model="actorName" class="input-type-actor" :label="t('movies.actors')" />
          <VaButton :disabled="props.isShow" class="button-add-actor" @click="addActor"> + </VaButton>
        </div>
      </div>
      <div class="flex flex-col md12 actors-table">
        <div class="item">
          <div v-for="(actor, index) in newMovie.actors" :key="index" class="group">
            <VaInput v-model="newMovie.actors[index]" class="input-display-actor" />
            <VaButton :disabled="props.isShow" class="button-delete-actor" @click="removeActor(index)"> x </VaButton>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md12">
        <div class="item">
          <VaInput v-model="newMovie.poster" :label="t('movies.poster')" disabled />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md12">
        <div class="item">
          <VaButton :disabled="props.isShow" @click="showModalImportImage = !showModalImportImage"> Chọn ảnh </VaButton>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md12">
        <div class="item">
          <VaInput v-model="newMovie.trailer" :label="t('movies.trailer')" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md12">
        <div class="item">
          <VaTextarea v-model="newMovie.content" :label="t('movies.content')" />
        </div>
      </div>
    </div>
    <div class="row buttons">
      <div class="flex flex-col md12">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">
          {{ t('common.buttonCancel') }}
        </VaButton>
        <VaButton :disabled="props.isShow" @click="validate() && $emit('save', newMovie as Movie)">
          {{ t('common.buttonSave') }}
        </VaButton>
      </div>
    </div>
  </VaForm>
  <VaModal
    v-model="showModalImportImage"
    size="large"
    mobile-fullscreen
    stateful
    hide-default-actions
    :sizes-config="config"
    max-height="700px"
  >
    <h1 class="va-h5 mb-4">Chọn ảnh</h1>
    <ImageTable
      v-model:pagination="pagination"
      :images="images"
      :loading="isLoading"
      is-mode-import
      @import="importImage"
    />
  </VaModal>
</template>

<style lang="scss" scoped>
@import 'vuestic-ui/styles/grid';

.actors {
  position: relative;
}

.actors .input-type-actor {
  width: calc(100% - 150px);
}

.actors .button-add-actor {
  max-width: 150px;
  position: absolute;
  right: 111px;
  bottom: 0;
}

.actors-table {
  margin-top: 5px;
}

.actors-table .group {
  position: relative;
}

.actors-table .input-display-actor {
  margin: 5px 0px;
  width: calc(100% - 150px);
}

.actors-table .button-delete-actor {
  max-width: 150px;
  position: absolute;
  bottom: 5px;
  right: 106px;
}
</style>
