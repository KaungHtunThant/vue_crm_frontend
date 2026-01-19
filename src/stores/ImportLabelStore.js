import {
  // index,
  all,
  // create,
  // update,
  // destroy,
  // show,
} from "@/plugins/services/importLabelService";
import { defineStore } from "pinia";

export const useImportLabelStore = defineStore("importLabel", {
  state: () => ({
    import_labels: [],
  }),
  getters: {
    getAll: (state) => {
      return state.import_labels;
    },
    getImportLabelById: (state) => (import_label_id) => {
      return state.import_labels.find(
        (import_label) => import_label.id === import_label_id
      );
    },
  },
  actions: {
    async fetchAll() {
      try {
        const response = await all();
        if (response.status === 200) {
          this.import_labels = response.data.data;
        } else {
          throw new Error(response.data.message);
        }
        return {
          success: true,
          message: response.data.message,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
  },
});
