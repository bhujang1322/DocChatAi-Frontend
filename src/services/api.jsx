import axios from "axios"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://doc-chat-ai-backend.vercel.app/"

const api = axios.create({
  baseURL: apiBaseUrl,
})

export default api
