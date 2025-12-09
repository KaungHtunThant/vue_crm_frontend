import { defineStore } from "pinia";
import { login, logout } from "@/plugins/services/authService";
import Cookies from "js-cookie";
import axiosInstance from "@/plugins/axios";

export const useAuthStore = defineStore("authStore", {
  state: () => ({}),
  actions: {
    async login(credentials) {
      const response = await login(credentials);
      return response;
    },
    async initLogout() {
      await logout();
      Cookies.remove("authToken");
      Cookies.remove("name");
      Cookies.remove("image");
      Cookies.remove("email");
      Cookies.remove("user_role");
      Cookies.remove("user_id");
      localStorage.removeItem("backgroundImage");
      localStorage.removeItem("backgroundImage_id");
      localStorage.removeItem("locale");
      localStorage.removeItem("userPermissions");
      delete axiosInstance.defaults.headers["Authorization"];
      window.location.href = "/login";
    },
  },
});
