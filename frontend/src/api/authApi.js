import axios from 'axios'

const authApi = axios.create({
  baseURL: "https://task-manager-production-e8f4.up.railway.app",
  // baseURL: "http://localhost:5000/api/auth",
  headers: {
    'Content-Type': 'application/json',
  },
})

export const registerUser = async (userData) => {
  const response = await authApi.post('/register', userData)
  return response.data
}

export const loginUser = async (credentials) => {
  const response = await authApi.post('/login', credentials)
  return response.data
}

export default authApi
