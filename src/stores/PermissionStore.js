import { defineStore } from "pinia";

export const PERMISSIONS = {
  DASHBOARD: "view-dashboard-page",
  DEALS_KANBAN: "view-deals-kanban-page",
  DEALS_LIST: "view-deals-list-page",
  DEALS_LIST_KANBAN: "view-deals-list-kanban-page",
  USERS: "view-users-page",
  CONTACTS: "view-contacts-page",
  DOCUMENTS: "view-documents-page",
  GENERAL_SETTINGS: "view-general-settings-page",
  TASKS_KANBAN: "view-tasks-kanban-page",
  ROLES_SETTINGS: "view-roles-settings-page",
  CREATE_DEAL: "create-deal",
  UPDATE_DEAL: "edit-deal",
  DELETE_DEAL: "delete-deal",
  READ_DEAL: "read-deal",
  READ_TASK: "read-task",
  VIEW_SIDEBAR: "view-sidebar",
  BROADCAST_SETTINGS: "view-broadcast-settings-page",
  EDIT_STAGE: "edit-stage",
  CREATE_FOLDER: "create-folder",
  DELETE_FOLDER: "delete-folder",
  UPDATE_FOLDER: "edit-folder",
  READ_FOLDER: "read-folder",
  CREATE_FILE: "create-file",
  UPDATE_FILE: "edit-file",
  DELETE_FILE: "delete-file",
  VIEW_FILE: "view-file",
  SHOW_HISTORY: "show-history",
  SHOW_ASSIGNED_TO: "show-assigned-to",
  ADD_ASSIGN_BY_DEAL: "add-assign-by-deal",
  ADD_ASSIGNED_TO_DEAL: "add-assigned-to-deal",
  ADD_OWNER_DEAL: "add-owner-deal",
};

export const usePermissionStore = defineStore("permissions", {
  state: () => ({
    userPermissions: JSON.parse(localStorage.getItem("userPermissions")) || [],
  }),

  getters: {
    hasPermission: (state) => (permission) => {
      return state.userPermissions.includes(permission);
    },

    hasAnyPermission: (state) => (permissions) => {
      return permissions.some((permission) =>
        state.userPermissions.includes(permission)
      );
    },
  },

  actions: {
    setPermissions(permissions) {
      this.userPermissions = permissions;
      localStorage.setItem("userPermissions", JSON.stringify(permissions));
    },

    addPermission(permission) {
      if (!this.userPermissions.includes(permission)) {
        this.userPermissions.push(permission);
        localStorage.setItem(
          "userPermissions",
          JSON.stringify(this.userPermissions)
        );
      }
    },

    removePermission(permission) {
      this.userPermissions = this.userPermissions.filter(
        (p) => p !== permission
      );
      localStorage.setItem(
        "userPermissions",
        JSON.stringify(this.userPermissions)
      );
    },

    clearPermissions() {
      this.userPermissions = [];
      localStorage.removeItem("userPermissions");
    },
  },
});
