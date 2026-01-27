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
      try {
        const response = await getAllRatings();
        this.ratings = response.data.data;
      } catch (error) {
        // Error handled silently
      }
    },
  },
});
