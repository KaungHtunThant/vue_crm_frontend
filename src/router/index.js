import { createRouter, createWebHistory } from "vue-router";
import { requirePermission } from "./guards";
import { PERMISSIONS } from "@/stores/permissionStore";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import UsersView from "../views/UsersView.vue";
import ContactsView from "@/views/ContactsView.vue";
import GeneralSetting from "@/views/GeneralSetting.vue";
import RoleSettings from "@/views/RoleSettings.vue";
import DocumentsFolder from "@/views/DocumentsFolderView.vue";
import DocumentsFiles from "@/views/FolderFilesView.vue";
import CrmKanban from "@/views/CrmKanban.vue";
import Cookies from "js-cookie";
import CrmTasks from "@/views/CrmTasks.vue";
import CrmList from "@/views/CrmListView.vue";
import TasksKanban from "@/views/CrmTasks.vue";

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
    },
    beforeEnter: requirePermission(PERMISSIONS.DASHBOARD),
  },
  {
    path: "/crm-kanban",
    name: "CrmKanban",
    component: CrmKanban,
    meta: {
      requiresAuth: true,
      title: "CRM Kanban",
    },
    beforeEnter: requirePermission(PERMISSIONS.DEALS_KANBAN),
  },
  {
    path: "/crm-tasks",
    name: "CrmTasks",
    component: CrmTasks,
    meta: {
      requiresAuth: true,
      title: "CRM Tasks",
    },
    beforeEnter: requirePermission(PERMISSIONS.TASKS_KANBAN),
  },
  {
    path: "/users",
    name: "Users",
    component: UsersView,
    meta: {
      requiresAuth: true,
      title: "Users",
    },
    beforeEnter: requirePermission(PERMISSIONS.USERS),
  },
  {
    path: "/crmlist",
    name: "CrmList",
    component: CrmList,
    meta: {
      requiresAuth: true,
      title: "CRM List",
    },
    beforeEnter: requirePermission(PERMISSIONS.DEALS_LIST),
  },
  {
    path: "/contacts",
    name: "Contacts",
    component: ContactsView,
    meta: {
      requiresAuth: true,
      title: "Contacts",
    },
    beforeEnter: requirePermission(PERMISSIONS.CONTACTS),
  },
  {
    path: "/general-setting",
    name: "Settings",
    component: GeneralSetting,
    meta: {
      requiresAuth: true,
      title: "General Setting",
    },
    beforeEnter: requirePermission(PERMISSIONS.GENERAL_SETTINGS),
  },
  {
    path: "/role-settings",
    name: "RoleSettings",
    component: RoleSettings,
    meta: {
      requiresAuth: true,
      title: "Role Settings",
    },
    beforeEnter: requirePermission(PERMISSIONS.ROLES_SETTINGS),
  },
  {
    path: "/documents",
    name: "Documents",
    component: DocumentsFolder,
    meta: {
      requiresAuth: true,
      title: "Documents Folders",
    },
    beforeEnter: requirePermission(PERMISSIONS.DOCUMENTS),
  },
  {
    path: "/documents/folders/:path*",
    name: "FolderFiles",
    component: DocumentsFiles,
    meta: {
      requiresAuth: true,
      title: "Documents Files",
    },
    beforeEnter: requirePermission(PERMISSIONS.DOCUMENTS),
  },
  {
    path: "/tasks-kanban",
    component: TasksKanban,
    beforeEnter: requirePermission(PERMISSIONS.TASKS_KANBAN),
  },
  // {
  //   path: "/:pathMatch(.*)*",
  //   name: "NotFound",
  //   component: Unauthorized,
  //   meta: {
  //     requiresAuth: false,
  //     hideNavigation: true,
  //     title: "غير موجود",
  //   },
  // },
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
    next({ path: "/dashboard", replace: true });
    return;
  }

  next();
});

export default router;
