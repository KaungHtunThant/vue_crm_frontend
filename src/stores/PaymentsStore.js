import { defineStore } from "pinia";
import { getAllPaymentTypes } from "@/plugins/services/paymentService";

export const usePaymentTypesStore = defineStore("paymentTypes", {
  state: () => ({
    paymentTypes: [],
  }),
  getters: {
    getAllPaymentTypes: (state) => {
      return state.paymentTypes;
    },
  },
  actions: {
    async fetchPaymentTypes() {
      const result = await getAllPaymentTypes();
      this.paymentTypes = result.data.data;
    },
  },
});
