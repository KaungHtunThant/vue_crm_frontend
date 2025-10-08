import { getApprovals, updateApproval } from "@/plugins/services/authService";
import { defineStore } from "pinia";

export const useApprovalStore = defineStore("approval", {
  state: () => ({
    approvals: [],
    total: 0,
    perPage: 10,
    page: 1,
    search: "",
  }),
  getters: {
    getApprovals: (state) => (type) => {
      return state.approvals
        .filter((approval) => {
          return approval.type === type;
        })
        .map((approval) => {
          return {
            ...approval,
            created_at: new Date(approval.created_at).toLocaleDateString(),
            status_changed_at: approval.updated_at
              ? new Date(approval.updated_at).toLocaleDateString()
              : "N/A",
          };
        });
    },
    getTotal: (state) => {
      return state.total;
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
    async updateApproval(approval) {
      await updateApproval(approval).then((response) => {
        const index = this.approvals.findIndex((a) => a.id === approval.id);
        if (index !== -1) {
          this.approvals[index] = response.data;
        }
      });
    },
  },
});
