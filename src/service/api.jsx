import axios from "axios";
const headers = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    // "Content-type": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
    // "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true",
  },
};

const BE_URL = import.meta.env.VITE_BE_URL;

const api = {
  baseUrl: BE_URL,
  get: async (url) => {
    return axios.get(BE_URL + url, headers);
  },
  post: async (url, data) => {
    return axios.post(BE_URL + url, data, headers);
  },
  put: async (url, data) => {
    return axios.put(BE_URL + url, data, headers);
  },
  delete: async (url) => {
    return axios.delete(BE_URL + url, headers);
  },
};

export default api;
