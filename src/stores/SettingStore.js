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
      console.log("activity listeners set up");
      ["mousemove", "keydown", "mousedown", "touchstart"].forEach((event) => {
        window.addEventListener(event, this.startIdleTimer);
      });
    },
    startIdleTimer() {
      console.log("User activity detected, resetting idle timer");
      this.clearIdleTimer();
      this.idleTimer = setTimeout(() => {
        console.log("User has been idle for too long, logging out");
        const authStore = useAuthStore();
        authStore.initLogout();
      }, this.idleTimeLimit);
    },
    clearIdleTimer() {
      console.log("Clearing idle timer");
      if (this.idleTimer) {
        clearTimeout(this.idleTimer);
        this.idleTimer = null;
      }
    },
  },
});
