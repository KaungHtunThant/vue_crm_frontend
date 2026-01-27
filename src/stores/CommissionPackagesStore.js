import { payingLevels } from "@/plugins/services/salaryService";
import { defineStore } from "pinia";

export const usePackageStore = defineStore("package", {
  state: () => ({
    packages: [],
  }),
  getters: {
    getPackages: (state) => state.packages,
  },
  actions: {
    async fetchPackages() {
      try {
        const response = await payingLevels();
        this.packages = response.data.data;
      } catch (error) {
      }
    },
  },
});
