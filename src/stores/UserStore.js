import { defineStore } from "pinia";
import {
  getUser,
  updateUser,
  deleteUser,
} from "@/plugins/services/authService";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    rows: [],
    totalRows: 0,
    currentPage: 0,
    rowsPerPage: 10,
    loading: false,
    search: "",
    filters: {},
  }),
  getters: {
    getUserById: (state) => (id) => {
      return state.rows.find((user) => user.id === id);
    },
    getAllUsers: (state) => {
      return state.rows;
    },
  },
  actions: {
    mapApiUserToRow(user) {
      return {
        ...user,
        status: user.status === "active" || user.status === true,
      };
    },

    async fetchUsers(params = {}) {
      this.loading = true;
      try {
        const page = params.page ?? this.currentPage;
        const perPage = params.per_page ?? this.rowsPerPage;

        this.currentPage = page;
        this.rowsPerPage = perPage;

        const requestParams = {
          page: page + 1,
          per_page: perPage,
          ...(this.search ? { search: this.search } : {}),
          ...this.filters,
        };

        const response = await getUser(requestParams);
        const data = response.data;

        this.rows = data.data.map(this.mapApiUserToRow);
        this.totalRows = data.meta?.total ?? data.data.length;
      } catch (error) {
        this.rows = [];
        this.totalRows = 0;
      } finally {
        this.loading = false;
      }
    },

    async applyFilters(nextFilters = {}) {
      this.filters = { ...nextFilters };
      this.currentPage = 0;
      await this.fetchUsers({ page: 0 });
    },

    async resetFilters() {
      this.filters = {};
      this.search = "";
      this.currentPage = 0;
      await this.fetchUsers({ page: 0 });
    },

    updateUserLocal(updatedUser) {
      const index = this.rows.findIndex((u) => u.id === updatedUser.id);
      const normalized = this.mapApiUserToRow(updatedUser);
      if (index !== -1) {
        this.rows.splice(index, 1, normalized);
      } else {
        this.rows.unshift(normalized);
        this.totalRows += 1;
      }
    },

    async toggleStatus(user) {
      const newStatus = user.status ? "active" : "inactive";
      const response = await updateUser(user.id, { status: newStatus });
      const index = this.rows.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        this.rows[index] = {
          ...this.rows[index],
          status: newStatus === "active",
        };
      }
      return {
        success: response.status === 200,
        message: response.data?.message || "",
      };
    },

    async removeUser(id) {
      const response = await deleteUser(id);
      if (response.status === 200) {
        this.rows = this.rows.filter((u) => u.id !== id);
        this.totalRows = Math.max(0, this.totalRows - 1);
        return { success: true, message: response.data?.message || "" };
      }
      return { success: false, message: response.data?.message || "" };
    },
  },
});
