import axios from "axios";

const BASE_API_URL_APP = "http://localhost:8070";

export default axios.create({
  baseURL: "http://localhost:8070" || BASE_API_URL_APP,
  headers: { "Content-Type": "application/json" },
});

export const axiosAuth = axios.create({
  baseURL: "http://localhost:8070" || BASE_API_URL_APP,
  headers: { "Content-Type": "application/json" },
});
