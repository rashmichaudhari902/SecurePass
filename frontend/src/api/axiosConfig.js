// api/axiosConfig.js — Flask server connection

import axios from "axios";

const api = axios.create({
  baseURL: "https://securepass-dr6e.onrender.com",
});

export default api;