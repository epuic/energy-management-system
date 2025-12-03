import axios from "axios";

const http = axios.create({
  baseURL: "/",
});

http.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default http;
