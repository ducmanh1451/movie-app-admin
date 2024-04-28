import axios from 'axios'

export const getLibrary = async (lib_cd: number) => {
  const response = await axios.get(`http://localhost:9000/api/v1/helpers/get-libraries/${lib_cd}`)
  return {
    library: response.data.payload[0],
  }
}
