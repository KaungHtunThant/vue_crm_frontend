import { defineStore } from "pinia";
import {
  getUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "@/plugins/services/userService";
import Cookies from "js-cookie";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    all: [],
    rows: [],
    totalRows: 0,
    currentPage: 0,
    rowsPerPage: 10,
    loading: false,
    search: "",
    filters: {},
    current_user: null,
    selected_user: null,
  }),
  getters: {
    getUserById: (state) => (id) => {
      return state.all.find((user) => user.id === id);
    },
    getAllUsers: (state) => {
      return state.all;
    },
    getCurrentUser: (state) => {
      return state.current_user;
    },
    getSelectedUser: (state) => {
      return state.selected_user;
    },
    getUsersWithRole: (state) => (role) => {
      return state.all.filter((user) => user.role === role);
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

    async fetchAllUsers() {
      try {
        const response = await getAllUsers();
        this.all = response.data.data;
      } catch (error) {
        this.all = [];
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

    async updateUser(id, data) {
      try {
        console.log("Updating user with ID:", id, "Data:", data);
        const response = await updateUser(id, data);
        if (response.status === 200) {
          this.updateUserLocal(response.data.data);
        }
        return {
          success: response.status === 200 || response.status === 204,
          message: response.data?.message,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
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
        message: response.data?.message,
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
    async changePassword(userId, oldPassword, newPassword, confirmPassword) {
      try {
        const payload = {
          old_password: oldPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        };

        const response = await updateUser(userId, payload);

        if (response.status === 200) {
          return {
            success: true,
            message: response.data?.message,
          };
        } else {
          return {
            success: false,
            message: response.data?.message,
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    setCurrentUser(user) {
      this.current_user = user;
    },
    async fetchCurrentUser() {
      if (this.current_user) {
        return this.current_user;
      }
      const response = await getUserById(Cookies.get("user_id"));
      this.current_user = response.data.data;
      return this.current_user;
    },
    async fetchSelectedUser(userId) {
      const response = await getUserById(userId);
      this.selected_user = response.data.data;
      return this.selected_user;
    },
    async createUser(data) {
      try {
        const response = await createUser(data);
        if (response.status === 201 || response.status === 200) {
          this.updateUserLocal(response.data.data);
        }
        return {
          success: response.status === 201 || response.status === 200,
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
