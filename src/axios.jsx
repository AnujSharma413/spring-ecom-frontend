import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
delete API.defaults.headers.common["Authorization"];
export default API;
