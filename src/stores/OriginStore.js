import { defineStore } from "pinia";
import {
  getIndex,
  getAll,
  getById,
  create,
  update,
  remove,
} from "@/plugins/services/originService";

export const useOriginStore = defineStore("origin", {
  state: () => ({
    origins_index: [],
    currentOrigin: null,
    origins: [],
    origins_all: [],
  }),
  getters: {
    getOrigins: (state) => {
      return state.origins_index;
    },
    getAllOrigins: (state) => {
      return state.origins_all;
    },
    getCurrentOrigin: (state) => {
      return state.currentOrigin;
    },
    getOriginById: (state) => (id) => {
      return state.origins_all.find((origin) => origin.id === id);
    },
  },
  actions: {
    async fetchOrigins() {
      try {
        const response = await getIndex();
        this.origins_index = response.data.data;
        return {
          message: response.data.message,
          status: response.status === 200,
        };
      } catch (error) {
        return {
          message: error.message,
          status: false,
        };
      }
    },
    async fetchAllOrigins() {
      try {
        const response = await getAll();
        this.origins_all = response.data.data;
        return {
          message: response.data.message,
          status: response.status === 200,
        };
      } catch (error) {
        return {
          message: error.message,
          status: false,
        };
      }
    },
    async fetchOriginById(id) {
      try {
        const response = await getById(id);
        this.currentOrigin = response.data.data;
        return {
          message: response.data.message,
          status: response.status === 200,
        };
      } catch (error) {
        return {
          message: error.message,
          status: false,
        };
      }
    },
    async createOrigin(data) {
      try {
        const response = await create(data);
        this.origins_index.push(response.data.data);
        return {
          message: response.data.message,
          status: response.status === 200,
        };
      } catch (error) {
        return {
          message: error.message,
          status: false,
        };
      }
    },
    async updateOrigin(id, data) {
      try {
        const response = await update(id, data);
        const index = this.origins.findIndex((origin) => origin.id === id);
        if (index !== -1) {
          this.origins_index[index] = response.data.data;
        }
        return {
          message: response.data.message,
          status: response.status === 200,
        };
      } catch (error) {
        return {
          message: error.message,
          status: false,
        };
      }
    },
    async deleteOrigin(id) {
      try {
        const response = await remove(id);
        this.origins_index = this.origins_index.filter(
          (origin) => origin.id !== id
        );
        return {
          message: response.data.message,
          status: response.status === 200,
        };
      } catch (error) {
        return {
          message: error.message,
          status: false,
        };
      }
    },
  },
});
