import { defineStore } from "pinia";
import { getSources } from "@/plugins/services/authService";

export const useSourceStore = defineStore("source", {
  state: () => ({
    sources: [],
  }),
  getters: {
    getAllSources: (state) => state.sources,
  },
  actions: {
    async fetchSources() {
      const result = await getSources();
      this.sources = result.data.data;
    },
  },
});
