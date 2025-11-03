import { defineStore } from "pinia";
import {
  getIndex,
  getAll,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "@/plugins/services/roleService";

export const useRoleStore = defineStore("roleStore", {
  state: () => ({
    all: [],
    rows: [],
    totalRows: 0,
    currentPage: 0,
    rowsPerPage: 10,
    filters: {},
    currentRow: {},
  }),
  getters: {
    getIndexRoles: (state) => {
      return state.rows;
    },
    getAllRoles: (state) => {
      return state.all;
    },
    getCurrentRole: (state) => {
      return state.currentRow;
    },
    getRoleById: (state) => (id) => {
      return state.rows.find((role) => role.id === id);
    },
    getByParentId: (state) => (parentId) => {
      return state.rows.filter((role) => role.parent_id === parentId);
    },
  },
  actions: {
    async fetchRoles(params = {}) {
      try {
        const response = await getIndex({
          search: params.search || "",
          filters: params.filters || {},
          page: params.page || 1,
          per_page: params.per_page || 10,
        });
        if (response.status === 200) {
          this.rows = response.data.data;
          this.totalRows = response.data.meta.total;
          this.currentPage = params.page || 1;
          this.rowsPerPage = params.per_page || 10;
          this.filters = params.filters || {};
        }
      } catch (error) {
        console.error(error.message);
      }
    },
    async fetchAllRoles() {
      try {
        const response = await getAll();
        if (response.status === 200) {
          this.all = response.data.data;
        }
      } catch (error) {
        console.error(error.message);
      }
    },
    async fetchRoleById(roleId) {
      try {
        const response = await getRoleById(roleId);
        if (response.status === 200) {
          this.currentRow = response.data.data;
        }
      } catch (error) {
        console.error(error.message);
      }
    },
    async createRole(roleData) {
      try {
        const response = await createRole(roleData);
        if (response.status === 201) {
          this.all.push(response.data.data);
        }
      } catch (error) {
        console.error(error.message);
      }
    },
    async updateRole(roleId, roleData) {
      try {
        const response = await updateRole(roleId, roleData);
        if (response.status === 200) {
          const index = this.all.findIndex((role) => role.id === roleId);
          if (index !== -1) {
            this.all[index] = response.data.data;
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    },
    async deleteRole(roleId) {
      try {
        const response = await deleteRole(roleId);
        if (response.status === 204) {
          this.all = this.all.filter((role) => role.id !== roleId);
        }
      } catch (error) {
        console.error(error.message);
      }
    },
  },
});
