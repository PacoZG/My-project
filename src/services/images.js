import axios from 'axios'
const baseUrl = '/api/images'
//var cloudinary = require('cloudinary').v2

const postImage = async (data) => {
  const response = await axios.post(baseUrl, data)
  console.log('RESPONSE: ', response.data)
  return response.data
}

export default { postImage }