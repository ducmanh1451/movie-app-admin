import axios from 'axios'
import { ImageUpload, Pagination } from '../../pages/media/types'

// get images by page number
export const getImages = async (options: Pagination) => {
  try {
    const response = await axios.get(`http://localhost:8004/api/v1/upload/images`)
    const data = response.data.payload
    const normalizedImages = data.slice((options.page - 1) * options.perPage, options.page * options.perPage)
    const totalRecord = data.length

    return {
      data: normalizedImages,
      pagination: {
        page: options.page,
        perPage: options.perPage,
        total: totalRecord,
      },
    }
  } catch (error) {
    console.error('Error fetching images:', error)
    throw error
  }
}

// upload image
export const addImages = async (images: ImageUpload[]) => {
  const formData = new FormData()
  if (typeof images === 'object' && !Array.isArray(images)) {
    images = Object.values(images)
  }
  images.forEach((image, index) => {
    if (image instanceof File) {
      formData.append('files', image)
    } else {
      console.error(`Image at index ${index} is not valid:`, image)
    }
  })
  await axios.post('http://localhost:8004/api/v1/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// // update movie
// export const updateMovie = async (movie: Movie) => {
//   await axios.put(`http://localhost:8000/api/v1/movie/${movie._id}`, movie)
// }

// remove images
export const removeImages = async (images: string[]) => {
  await axios.delete('http://localhost:8004/api/v1/upload/images', {
    data: { images: images },
  })
}
