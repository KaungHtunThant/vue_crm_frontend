import { createRouter, createWebHistory } from "vue-router";
import { requireGuest, requirePermission } from "@/router/guards";
import { PERMISSIONS } from "@/stores/PermissionStore";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import UsersView from "@/views/UsersView.vue";
import ContactsView from "@/views/ContactsView.vue";
import GeneralSettingView from "@/views/GeneralSettingView.vue";
import RoleSettingsView from "@/views/RoleSettingsView.vue";
import DocumentsFolderView from "@/views/DocumentsFolderView.vue";
import FolderFilesView from "@/views/FolderFilesView.vue";
import CrmDealKanbanView from "@/views/CrmDealKanbanView.vue";
import Cookies from "js-cookie";
import CrmDealTasksView from "@/views/CrmDealTasksView.vue";
import CrmListView from "@/views/CrmListView.vue";
import BroadcastSettingsView from "@/views/BroadcastSettingsView.vue";
import StagingSettingView from "@/views/StagingSettingView.vue";
import WebWhatsapp from "@/views/WebWhatsapp.vue";
import PatientRegistrationView from "@/views/PatientRegistrationView.vue";
import ApprovalsView from "@/views/ApprovalsView.vue";
import CompleteCase from "@/views/CompleteCase.vue";
import EMRDealKanbanView from "@/views/EMRDealKanbanView.vue";
import TestKanbanView from "@/views/TestKanbanView.vue";
import CrmDealAfterSalesView from "@/views/CrmDealAfterSalesView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "LoginView",
    component: LoginView,
    meta: {
      requiresAuth: false,
      hideNavigation: true,
    },
    beforeEnter: requireGuest(),
  },
  // {
  //   path: "/unauthorized",
  //   name: "Unauthorized",
  //   component: Unauthorized,
  //   meta: {
  //     requiresAuth: false,
  //     hideNavigation: true,
  //     title: "غير مصرح",
  //   },
  // },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: HomeView,
    meta: {
      requiresAuth: true,
      title: "Dashboard",
      titleKey: "sidebar-nav-item-dashboard",
    },
    beforeEnter: requirePermission(PERMISSIONS.DASHBOARD),
  },
  {
    path: "/crm-kanban",
    name: "CrmDealKanbanView",
    component: CrmDealKanbanView,
    meta: {
      requiresAuth: true,
      title: "CRM Kanban",
      titleKey: "sidebar-nav-item-kanban",
    },
    beforeEnter: requirePermission(PERMISSIONS.DEALS_KANBAN),
  },
  {
    path: "/approvals",
    name: "ApprovalsView",
    component: ApprovalsView,
    meta: {
      requiresAuth: true,
      title: "Approvals",
      titleKey: "sidebar-nav-item-approvals",
    },
    // beforeEnter: requirePermission(PERMISSIONS.DEALS_KANBAN),
  },
  {
    path: "/crm-tasks",
    name: "CrmDealTasksView",
    component: CrmDealTasksView,
    meta: {
      requiresAuth: true,
      title: "CRM Tasks",
      titleKey: "header-subnav-item-kanban-tasks",
    },
    beforeEnter: requirePermission(PERMISSIONS.TASKS_KANBAN),
  },
  {
    path: "/crm-after-sales",
    name: "CrmDealAfterSalesView",
    component: CrmDealAfterSalesView,
    meta: {
      requiresAuth: true,
      title: "CRM After Sales",
      titleKey: "sidebar-nav-item-after-sales-kanban",
    },
    beforeEnter: requirePermission(PERMISSIONS.TASKS_KANBAN),
  },
  {
    path: "/users",
    name: "UsersView",
    component: UsersView,
    meta: {
      requiresAuth: true,
      title: "Users",
      titleKey: "sidebar-nav-item-users",
    },
    beforeEnter: requirePermission(PERMISSIONS.USERS),
  },
  {
    path: "/crmlist",
    name: "CrmListView",
    component: CrmListView,
    meta: {
      requiresAuth: true,
      title: "CRM List",
      titleKey: "sidebar-nav-item-crmlist",
    },
    beforeEnter: requirePermission(PERMISSIONS.DEALS_LIST),
  },
  {
    path: "/contacts",
    name: "ContactsView",
    component: ContactsView,
    meta: {
      requiresAuth: true,
      title: "Contacts",
      titleKey: "sidebar-nav-item-contacts",
    },
    beforeEnter: requirePermission(PERMISSIONS.CONTACTS),
  },
  {
    path: "/general-settings",
    name: "GeneralSettingView",
    component: GeneralSettingView,
    meta: {
      requiresAuth: true,
      title: "General Settings",
      titleKey: "sidebar-nav-item-settings",
    },
    beforeEnter: requirePermission(PERMISSIONS.GENERAL_SETTINGS),
  },
  {
    path: "/stage-settings",
    name: "StagingSettingView",
    component: StagingSettingView,
    meta: {
      requiresAuth: true,
      title: "Stage Settings",
      titleKey: "sidebar-nav-item-stage-settings",
    },
    beforeEnter: requirePermission(PERMISSIONS.GENERAL_SETTINGS),
  },
  {
    path: "/role-settings",
    name: "RoleSettingsView",
    component: RoleSettingsView,
    meta: {
      requiresAuth: true,
      title: "Role Settings",
    },
    beforeEnter: requirePermission(PERMISSIONS.ROLES_SETTINGS),
  },
  {
    path: "/broadcast-settings",
    name: "BroadcastSettingsView",
    component: BroadcastSettingsView,
    meta: {
      requiresAuth: true,
      title: "Broadcast Settings",
    },
    beforeEnter: requirePermission(PERMISSIONS.ROLES_SETTINGS),
  },
  {
    path: "/patient-registration",
    name: "PatientRegistrationView",
    component: PatientRegistrationView,
    meta: {
      requiresAuth: true,
      title: "Patient Registration",
    },
    beforeEnter: requirePermission(PERMISSIONS.ROLES_SETTINGS),
  },
  {
    path: "/documents",
    name: "DocumentsFolderView",
    component: DocumentsFolderView,
    meta: {
      requiresAuth: true,
      title: "Documents",
      titleKey: "sidebar-nav-item-documents",
    },
    beforeEnter: requirePermission(PERMISSIONS.DOCUMENTS),
  },
  {
    path: "/documents/:folderName+",
    name: "FolderFilesView",
    component: FolderFilesView,
    meta: {
      requiresAuth: true,
      title: "Documents Files",
    },
    beforeEnter: requirePermission(PERMISSIONS.DOCUMENTS),
  },
  // {
  //   path: "/tasks-kanban",
  //   component: TasksKanban,
  //   beforeEnter: requirePermission(PERMISSIONS.TASKS_KANBAN),
  // },
  {
    path: "/test-kanban",
    name: "Test Kanban View",
    component: TestKanbanView,
    meta: {
      requiresAuth: true,
      title: "Test Kanban View",
    },
    beforeEnter: requirePermission(PERMISSIONS.DEALS_KANBAN),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/crm-kanban",
  },
  {
    path: "/WebWhatsapp",
    name: "webwhatsapp",
    component: WebWhatsapp,
    meta: {
      requiresAuth: true,
      title: "Web Whatsapp",
    },
  },
  {
    path: "/CompleteCase",
    name: "CompleteCase",
    component: CompleteCase,
    meta: {
      layout: "print",
    },
  },
  {
    path: "/emr-kanban",
    name: "EmrDealKanbanView",
    component: EMRDealKanbanView,
    meta: {
      requiresAuth: true,
      title: "EMR Kanban",
    },
    beforeEnter: requirePermission(PERMISSIONS.ROLES_SETTINGS),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const token = Cookies.get("authToken");
  const isAuthRoute = to.matched.some(
    (record) => record.meta.requiresAuth !== false
  );

  if (isAuthRoute && !token) {
    const redirectPath = to.fullPath;
    next({
      path: "/login",
      query: { redirect: redirectPath },
      replace: true,
    });
    return;
  }

  if (to.path === "/login" && token) {
    const user_role = Cookies.get("user_role");
    let redirectPath = "/crm-kanban";
    if (user_role === "after-sales") {
      redirectPath = "/crm-after-sales";
    }
    next({ path: redirectPath, replace: true });
    return;
  }

  next();
});

export default router;
