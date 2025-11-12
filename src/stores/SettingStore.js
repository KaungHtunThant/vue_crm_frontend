import { defineStore } from "pinia";
import { generateOTP } from "@/plugins/services/settingService";
import { useAuthStore } from "./AuthStore";

export const useSettingStore = defineStore("setting", {
  state: () => ({
    idleTimer: null,
    idleTimeLimit: 15 * 60 * 1000, // 1 minute
  }),
  actions: {
    async requestOTP() {
      const response = await generateOTP();
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      return {
        message: response.data.message,
        otp: response.data.data.otp,
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
