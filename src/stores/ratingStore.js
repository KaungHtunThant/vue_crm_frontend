import { getAllRatings } from "@/plugins/services/authService";
import { defineStore } from "pinia";

export const useRatingStore = defineStore("rating", {
  state: () => ({
    ratings: [],
  }),
  getters: {
    getRatings: (state) => state.ratings,
  },
  actions: {
    async fetchRatings() {
      try {
        const response = await getAllRatings();
        this.ratings = response.data.data;
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    },
  },
});
