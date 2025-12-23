import { defineStore } from "pinia";
import {
  generateOTP,
  getServerVersion,
  getTreatmentTask,
} from "@/plugins/services/settingService";
import { useAuthStore } from "./AuthStore";

export const useSettingStore = defineStore("setting", {
  state: () => ({
    idleTimer: null,
    idleTimeLimit: 15 * 60 * 1000, // 15 minute
    backendAppVersion: null,
    emr_calendar_drawer_open: false,
    treatmentTaskEventId: null,
  }),
  getters: {
    getOTPCode: (state) => {
      return state.otp_code;
    },
    getBackendAppVersion: (state) => {
      return state.backendAppVersion;
    },
    getIsEmrCalendarDrawerOpen: (state) => {
      return state.emr_calendar_drawer_open;
    },
    getTreatmentTaskEventId: (state) => {
      return state.treatmentTaskEventId;
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
    async fetchServerVersion() {
      const response = await getServerVersion();
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      this.backendAppVersion = response.data.data.version;
      return response.data.data.version;
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
    toggleEmrCalendarDrawer() {
      this.emr_calendar_drawer_open = !this.emr_calendar_drawer_open;
    },
    async fetchTreatmentTaskEventId() {
      if (this.treatmentTaskEventId === null) {
        const response = await getTreatmentTask();
        if (response.status !== 200) {
          throw new Error(response.data.message);
        }
        this.treatmentTaskEventId = Number(response.data.data.id);
      }
      return this.treatmentTaskEventId;
    },
  },
});
