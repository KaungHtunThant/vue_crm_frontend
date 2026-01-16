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
  EMRKANBAN: "view-emr-kanban-page",
  CREATE_DEAL: "create-deal",
  UPDATE_DEAL: "edit-deal",
  DELETE_DEAL: "delete-deal",
  READ_DEAL: "read-deal",
  FILTER_DEAL_WITH_USER: "filter-deal-with-user",
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
  SHARE_WHATSAPP: "share-whatsapp",
  VIEW_FILE: "view-file",
  SHOW_HISTORY: "show-history",
  SHOW_ASSIGNED_TO: "show-assigned-to",
  ADD_ASSIGN_BY_DEAL: "add-assign-by-deal",
  ADD_ASSIGNED_TO_DEAL: "add-assigned-to-deal",
  ADD_OWNER_DEAL: "add-owner-deal",
  VIEW_SALES_PACKAGE: "view-sales-package",
  CREATE_SALES_PACKAGE: "create-sales-package",
  EDIT_SALES_PACKAGE: "edit-sales-package",
  DELETE_SALES_PACKAGE: "delete-sales-package",
  VIEW_HOSPITAL_PACKAGE: "view-hospital-package",
  CREATE_HOSPITAL_PACKAGE: "create-hospital-package",
  EDIT_HOSPITAL_PACKAGE: "edit-hospital-package",
  DELETE_HOSPITAL_PACKAGE: "delete-hospital-package",
  EXPORT_DEAL: "export-deal",
  IMPORT_DEAL: "import-deal",
  AFTER_SALES_KANBAN: "view-aftersales-kanban-page",
  EDIT_CONTACT_PHONE: "edit-contact-phone",
  GENERATE_OTP: "generate-otp",
  STAY_IDLE: "stay-idle",
  VIEW_EMR_CALENDAR: "view-emr-calendar",
  READ_EMR_TASK: "view-emr-task",
  UPDATE_EMR_TASK: "edit-emr-task",
  DELETE_EMR_TASK: "delete-emr-task",
  VIEW_RESPONSIBLE_USER: "view-responsible-user",
  READ_UNASSIGN_SOON_TASK_STAGE: "view-unassign-soon-task-stage",
  READ_OVERDUE_TASK_STAGE: "view-overdue-task-stage",
  READ_CHECKING_OUT_TASK_STAGE: "view-checking-out-task-stage",
  READ_OVERDUE_AFTER_SALES_TASK_STAGE: "view-overdue-after-sales-task-stage",
  DISTRIBUTE_INACTIVE_DEALS: "distribute-inactive-deals",
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
