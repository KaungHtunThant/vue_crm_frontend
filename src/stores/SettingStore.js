import { defineStore } from "pinia";
import { generateOTP } from "@/plugins/services/settingService";
import { useAuthStore } from "./AuthStore";

export const useSettingStore = defineStore("setting", {
  state: () => ({
    idleTimer: null,
    idleTimeLimit: 15 * 60 * 1000, // 15 minute
  }),
  getters: {
    getOTPCode: (state) => {
      return state.otp_code;
    },
  },
  actions: {
    async generateOTP() {
      const response = await generateOTP();
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      return {
        status: response.status == 200,
        message: response.data.message,
        otp: response.data.data.otp_code,
      };
    },
    setupUserActivityListeners() {
      ["mousemove", "keydown", "mousedown", "touchstart"].forEach((event) => {
        window.addEventListener(event, this.startIdleTimer);
      });
    },
    startIdleTimer() {
      this.clearIdleTimer();
      this.idleTimer = setTimeout(() => {
        const authStore = useAuthStore();
        authStore.initLogout();
      }, this.idleTimeLimit);
    },
    clearIdleTimer() {
      if (this.idleTimer) {
        clearTimeout(this.idleTimer);
        this.idleTimer = null;
      }
    },
  },
});
