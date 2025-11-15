const axios = require("axios");

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_EXPRESS_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
