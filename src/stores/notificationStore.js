import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    enabled: localStorage.getItem("toastEnabled") !== "false",
  }),
  actions: {
    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem("toastEnabled", this.enabled);
    },
    set(value) {
      this.enabled = value;
      localStorage.setItem("toastEnabled", value);
    },
  },
});
