import { getApprovals, updateApproval } from "@/plugins/services/authService";
import { defineStore } from "pinia";

export const useApprovalStore = defineStore("approval", {
  state: () => ({
    approvals: [],
    total: 0,
    perPage: 10,
    page: 1,
    search: "",
    approvalsByType: {},
  }),
  getters: {
    getApprovals: (state) => (type) => {
      const list =
        (type && state.approvalsByType[type]?.data) ?? state.approvals ?? [];
      return list
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
    getTotal: (state) => (type) => {
      if (type) return state.approvalsByType[type]?.total ?? 0;
      return state.total;
    },
    getPerPage: (state) => (type) => {
      if (type) return state.approvalsByType[type]?.perPage ?? 10;
      return state.perPage;
    },
    getSearch: (state) => (type) => {
      if (type) return state.approvalsByType[type]?.search ?? "";
      return state.search;
    },
    getCurrentPage: (state) => (type) => {
      if (type) return state.approvalsByType[type]?.page ?? 1;
      return state.page;
    },
  },
  actions: {
    async fetchApprovals(search = "", page = 1, perPage = 50, type = "") {
      this.search = search;
      this.page = page;
      this.perPage = perPage;
      const response = await getApprovals({
        search,
        per_page: perPage,
        page,
        type,
      });
      this.approvals = response.data.data;
      this.total = response.data.meta.total;
      this.perPage = response.data.meta.per_page;

      const key = type ?? "";
      if (!this.approvalsByType[key]) {
        this.approvalsByType[key] = {
          data: [],
          total: 0,
          perPage: perPage,
          page: page,
          search: search,
        };
      }
      this.approvalsByType[key].data = response.data.data;
      this.approvalsByType[key].total = response.data.meta.total;
      this.approvalsByType[key].perPage = response.data.meta.per_page;
      this.approvalsByType[key].page = page;
      this.approvalsByType[key].search = search;
      return response;
    },
    async updateApproval(approval) {
      const response = await updateApproval(approval);
      const updated = response.data;
      const index = this.approvals.findIndex((a) => a.id === approval.id);
      if (index !== -1) {
        this.approvals[index] = updated;
      }
      Object.keys(this.approvalsByType).forEach((key) => {
        const list = this.approvalsByType[key]?.data ?? [];
        const idx = list.findIndex((a) => a.id === approval.id);
        if (idx !== -1) {
          this.approvalsByType[key].data[idx] = updated;
        }
      });
      return response;
    },
  },
});
