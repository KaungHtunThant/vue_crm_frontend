import Cookies from "js-cookie";
import router from "@/router";
const axios = require("axios");

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(
      new Error(error.response?.data?.message || error.message)
    );
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error response:", error);
    if (error.response?.status === 401 || error.code === "ERR_NETWORK") {
      Cookies.remove("authToken");
      Cookies.remove("name");
      Cookies.remove("email");
      Cookies.remove("image");
      router.push("/login");
    }
    return Promise.reject(
      new Error(error.response?.data?.message || error.message)
    );
  }
);

export default axiosInstance;
