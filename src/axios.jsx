import axios from "axios";

const API = axios.create({
  // ⚠️ Check karo: .env file mein 'VITE_BASE_URL' hai ya 'VITE_API_URL'? 
  // Jo wahan hai, wahi yahan hona chahiye.
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:8080", 
  timeout: 10000, // Optional: 10 seconds timeout taaki request infinite na latki rahe
});

// ✅ Common headers se Authorization hatana sahi hai agar aap publicly access kar rahe ho
delete API.defaults.headers.common["Authorization"];

// Optional: Response interceptor for better debugging
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;