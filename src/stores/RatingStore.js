import { getAllRatings } from "@/plugins/services/ratingService";
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
      // Skip if ratings are already loaded
      if (this.ratings.length > 0) {
        return;
      }
      try {
        const response = await getAllRatings();
        this.ratings = response.data.data;
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    },
  },
});
