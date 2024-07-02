import axios from "axios";
import { processAPI } from "../utils/function";
const headers = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
   "Access-Control-Allow-Headers": "*",
   "Access-Control-Allow-Credentials": "true",
};

const BE_URL = import.meta.env.VITE_BE_URL;

const api = {
   baseUrl: BE_URL,
   get: async (url) => {
      const token = localStorage.getItem("token");
      if (token) {
         headers["authorization"] = "Bearer " + token;
      }
      const { data } = await axios.get(BE_URL + url, { headers });
      return processAPI(data);
   },
   post: async (url, body) => {
      const token = localStorage.getItem("token");
      if (token) {
         headers["authorization"] = "Bearer " + token;
      }
      const { data } = await axios.post(BE_URL + url, body, { headers });
      return processAPI(data);
   },
   put: async (url, body) => {
      const token = localStorage.getItem("token");
      if (token) {
         headers["authorization"] = "Bearer " + token;
      }
      const { data } = await axios.put(BE_URL + url, body, { headers });
      return processAPI(data);
   },
   delete: async (url) => {
      const token = localStorage.getItem("token");
      if (token) {
         headers["authorization"] = "Bearer " + token;
      }
      const { data } = await axios.delete(BE_URL + url, { headers });
      return processAPI(data);
   },
};

export default api;
