import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

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

    success(message, options = {}) {
      if (this.enabled) toast.success(message, options);
    },

    error(message, options = {}) {
      if (this.enabled) toast.error(message, options);
    },

    info(message, options = {}) {
      if (this.enabled) toast.info(message, options);
    },

    warning(message, options = {}) {
      if (this.enabled) toast.warning(message, options);
    },
  },
});
