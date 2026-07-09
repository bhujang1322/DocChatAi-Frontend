import axios from "axios";

const api =  axios.create({
    baseURL: "https://doc-chat-ai-backend.vercel.app/"
});

export default api;
