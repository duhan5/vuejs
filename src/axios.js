import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://reqres.in/api', // Şu an test için bir fake API kullanıyoruz
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance;
