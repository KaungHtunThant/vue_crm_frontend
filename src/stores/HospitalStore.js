import {
  // index,
  all,
  // create,
  // update,
  // destroy,
  // show,
} from "@/plugins/services/hospitalService";
import { defineStore } from "pinia";

export const useHospitalStore = defineStore("hospital", {
  state: () => ({
    hospitals: [],
  }),
  getters: {
    getAll: (state) => {
      return state.hospitals;
    },
    getHospitalById: (state) => (hospital_id) => {
      return state.hospitals.find((hospital) => hospital.id === hospital_id);
    },
  },
  actions: {
    async fetchAll() {
      try {
        const response = await all();
        console.log("Hospital fetchAll response:", response);
        if (response.status === 200) {
          this.hospitals = response.data.data;
        } else {
          throw new Error(response.data.message);
        }
        return {
          success: true,
          message: "Hospitals fetched successfully",
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
