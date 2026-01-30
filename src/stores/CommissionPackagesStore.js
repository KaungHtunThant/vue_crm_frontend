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
      // Skip if packages are already loaded
      if (this.packages.length > 0) {
        return;
      }
      try {
        const response = await payingLevels();
        this.packages = response.data.data;
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    },
  },
});
