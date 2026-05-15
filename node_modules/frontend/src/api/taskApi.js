import axios from 'axios'

const taskApi = axios.create({
  baseURL: "https://task-manager-production-e8f4.up.railway.app/api/tasks",
  headers: {
    'Content-Type': 'application/json',
  },
})

taskApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getTasks = async () => {
  const response = await taskApi.get('/')
  return response.data
}

export const createTask = async (taskData) => {
  const response = await taskApi.post('/', taskData)
  return response.data
}

export const updateTask = async (taskId, taskData) => {
  const response = await taskApi.put(`/${taskId}`, taskData)
  return response.data
}

export const deleteTask = async (taskId) => {
  const response = await taskApi.delete(`/${taskId}`)
  return response.data
}

export default taskApi
