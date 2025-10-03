import { defineStore } from "pinia";
import {
  getAllPackages,
  getAllPackageCategories,
} from "@/plugins/services/authService";

export const usePackageStore = defineStore("packageStore", {
  state: () => ({
    packages: [],
    categories: [],
  }),

  getters: {
    getPackagesWithCategory: (state) => (category_slug) => {
      const category_id = state.categories.find(
        (cat) => cat.slug === category_slug
      )?.id;
      if (!category_id) return [];
      return state.packages.filter((pkg) => pkg.category_id === category_id);
    },
    getCategories: (state) => {
      return state.categories;
    },
  },

  actions: {
    async fetchPackages() {
      const result = await getAllPackages();
      this.packages = result.data.data;
    },

    async fetchCategories() {
      const result = await getAllPackageCategories();
      this.categories = result.data.data;
    },

    async fetchAll() {
      await Promise.all([this.fetchPackages(), this.fetchCategories()]);
    },
  },
});
