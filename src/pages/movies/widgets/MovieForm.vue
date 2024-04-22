<script setup lang="ts">
import { ref, watch } from 'vue'
import { EmptyMovie, Movie } from '../types'
import { useI18n } from 'vue-i18n'

// language
const { t } = useI18n()
// data selectbox genre
const genreOptions = ['Hành động', 'Giả tưởng', 'Chính kịch']
// data selectbox movieType
const movieTypesOptions = [
  { value: 0, label: t('movies.upcomingMovie') },
  { value: 1, label: t('movies.showingMovie') },
]
// props
const props = defineProps<{
  movie: Movie | null
}>()
// emits
defineEmits<{
  (event: 'save', movie: Movie): void
  (event: 'close'): void
}>()
// declare empty movie
const defaultNewMovie: EmptyMovie = {
  movie_name: '',
  genre: [],
  director: '',
  actors: [],
  rating: 0,
  movie_type: 0,
  poster: '',
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
  },
  { immediate: true },
)

// validate
const requiredString = (v: string) => !!v || t('common.messageRequired')
const requiredOption = (v: any) => ('length' in v && v.length > 0) || t('common.messageRequired')
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
      <div class="flex flex-col md4">
        <div class="item">
          <VaSelect
            v-model="newMovie.genre"
            :label="t('movies.genre')"
            :rules="[requiredOption]"
            :options="genreOptions"
            multiple
          />
        </div>
      </div>
      <div class="flex flex-col md4">
        <div class="item">
          <VaInput v-model="newMovie.rating" :label="t('movies.rating')" />
        </div>
      </div>
      <div class="flex flex-col md4">
        <div class="item">
          <VaSelect
            v-model="newMovie.movie_type"
            :label="t('movies.movieType')"
            :options="movieTypesOptions"
            value-by="value"
            text-by="label"
          />
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
          <VaButton class="button-add-actor" @click="addActor"> + </VaButton>
        </div>
      </div>
      <div class="flex flex-col md12 actors-table">
        <div class="item">
          <div v-for="(actor, index) in newMovie.actors" :key="index" class="group">
            <VaInput v-model="newMovie.actors[index]" class="input-display-actor" />
            <VaButton class="button-delete-actor" @click="removeActor(index)"> x </VaButton>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="flex flex-col md12">
        <div class="item">
          <VaInput v-model="newMovie.poster" :label="t('movies.poster')" />
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
        <VaButton @click="validate() && $emit('save', newMovie as Movie)"> {{ t('common.buttonSave') }} </VaButton>
      </div>
    </div>
  </VaForm>
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
