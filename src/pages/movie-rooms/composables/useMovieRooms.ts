// import { Cinema, Pagination } from '../../cinemas/types'
// import { Ref, ref, unref } from 'vue'
// import { getCinemas, addCinema, updateCinema, removeCinema } from '../../../data/pages/cinemas'
// import axios from 'axios'

// export const useMovieRooms = () => {
//   const isLoading = ref(false)
//   const cinemas = ref<Cinema[]>([])

//   const fetchCinemas = async () => {
//     const response = await axios.get(`http://localhost:8000/api/v1/cinema`)
//     const data = response.data.payload
//     debugger
//     // cinemas.value = response
//     // const data = await response.json()
//     // debugger
//     // isLoading.value = true
//     // const { data, pagination: newPagination } = await getCinemas({
//     //   ...unref(pagination),
//     // })
//     // cinemas.value = data as Cinema[]
//     // ignoreUpdates(() => {
//     //   pagination.value = newPagination
//     // })
//     // isLoading.value = false
//   }
//   fetchCinemas()

//   return {
//     isLoading,
//     cinemas,
//     async add() {

//     },
//     async update() {

//     },
//     async remove() {

//     }
//   }
// }
