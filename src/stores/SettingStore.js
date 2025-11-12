import { defineStore } from "pinia";
import { generateOTP } from "@/plugins/services/settingService";
import { useAuthStore } from "./authStore";

export const useSettingStore = defineStore("setting", {
  state: () => ({
    is_idle: false,
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
        window.addEventListener(event, this.resetIdleTimer);
      });
    },
    resetIdleTimer() {
      if (this.is_idle) {
        this.is_idle = false;
        const authStore = useAuthStore();
        authStore.logout();
      }
    },
  },
});
