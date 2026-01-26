import {
  getApprovals,
  updateApproval,
  getTotals,
} from "@/plugins/services/approvalService";
import { defineStore } from "pinia";

export const useApprovalStore = defineStore("approval", {
  state: () => ({
    approvals: [],
    totals: [],
    perPage: 10,
    page: 1,
    search: "",
  }),
  getters: {
    getApprovals: (state) => {
      return state.approvals;
    },
    getTotalWithType: (state) => (type) => {
      return state.totals[type] || 0;
    },
    getTotal: (state) => {
      let total = 0;
      for (const key in state.totals) {
        total += state.totals[key];
      }
      return total;
    },
    getPerPage: (state) => {
      return state.perPage;
    },
    getSearch: (state) => {
      return state.search;
    },
    getCurrentPage: (state) => {
      return state.page;
    },
  },
  actions: {
    async fetchApprovals(search = "", page = 1, perPage = 50, type = "") {
      this.search = search;
      this.page = page;
      this.perPage = perPage;
      await getApprovals({
        search: this.search,
        perPage: this.perPage,
        page: this.page,
        type: type,
      }).then((response) => {
        this.approvals = response.data.data;
        this.total = response.data.meta.total;
        this.perPage = response.data.meta.per_page;
      });
    },
    async fetchTotals() {
      try {
        await getTotals().then((response) => {
          if (response.status === 200) {
            this.totals = response.data.data;
            return {
              success: true,
              message: response.data.message,
            };
          } else {
            throw new Error(response.data.message);
          }
        });
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    async updateApproval(id, status) {
      try {
        return await updateApproval(id, status).then((response) => {
          if (response.status === 200 || response.status === 204) {
            const index = this.approvals.findIndex((a) => a.id === id);
            if (index !== -1) {
              this.approvals[index] = response.data;
            }
            return {
              success: true,
              message: response.data.message,
            };
          } else {
            throw new Error(response.data.message);
          }
        });
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
  },
});
