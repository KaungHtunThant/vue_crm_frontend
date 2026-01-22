<template>
  <div class="">
    <the-loader-component
      :is-loading="loadingStore.isLoading"
      :loader-image="loaderImage"
      :loader-colors="loaderColors"
    />
    <div v-if="!isLoggedIn">
      <login-view @loginSuccess="handleLoginSuccess" />
    </div>
    <div v-else class="app overflow-hidden">
      <div
        v-if="!$route.meta.hideNavigation"
        class="row g-0 flex-nowrap app-layout"
      >
        <div :class="headerClass" class="ps-2 pe-2 pt-2 main-content">
          <the-top-header />
          <div class="content">
            <router-view />
          </div>
        </div>
      </div>
      <div v-else>
        <router-view />
      </div>
      <!-- Right EMR Calendar Drawer -->
      <right-drawer-comp v-if="hasPermissionTo(PERMISSIONS.VIEW_EMR_CALENDAR)">
        <custom-full-calendar-comp />
      </right-drawer-comp>
      <!-- News Bar -->
      <theNewsBar v-if="showNewsBar" />
    </div>
  </div>
</template>

<script>
import TheTopHeader from "@/components/headers/TheTopHeader.vue";
import LoginView from "@/views/LoginView.vue";
import Cookies from "js-cookie";
import TheLoaderComponent from "@/components/TheLoaderComponent.vue";
import TheNewsBar from "@/components/TheNewsBar.vue";
import { useLoadingStore } from "@/plugins/loadingStore";
import { getBackgroundId } from "@/plugins/services/backgroundService";
import { PERMISSIONS, usePermissionStore } from "@/stores/PermissionStore";
import { useAuthStore } from "./stores/AuthStore";
import { useSettingStore } from "./stores/SettingStore";
import { useNotificationStore } from "./stores/notificationStore";
import RightDrawerComp from "@/components/customWrappers/RightDrawerComp.vue";
import CustomFullCalendarComp from "@/components/calenderElements/CustomFullCalendarComp.vue";
import { useDealStore } from "./stores/DealStore";

export default {
  name: "App",
  components: {
    TheTopHeader,
    LoginView,
    TheLoaderComponent,
    TheNewsBar,
    RightDrawerComp,
    CustomFullCalendarComp,
  },

  setup() {
    const loadingStore = useLoadingStore();
    const permissionStore = usePermissionStore();
    const authStore = useAuthStore();
    const settingStore = useSettingStore();
    const notificationStore = useNotificationStore();
    const dealStore = useDealStore();
    const hasPermissionTo = (permission) => {
      return permissionStore.hasPermission(permission);
    };

    return {
      dealStore,
      hasPermissionTo,
      PERMISSIONS,
      loadingStore,
      permissionStore,
      authStore,
      settingStore,
      notificationStore,
    };
  },

  data() {
    return {
      loaderImage: "/images/" + process.env.VUE_APP_LOGO_NAME,
      loaderColors: process.env.VUE_APP_COLORS
        ? process.env.VUE_APP_COLORS.split(",")
        : [],
      isLoggedIn: false,
      isSidebarCollapsed: true,
    };
  },

  computed: {
    headerClass() {
      if (this.isSidebarCollapsed) {
        return "col";
      }
      return "col-sm-9 col-lg";
    },

    showNewsBar() {
      return (
        this.$route.path === "/crm-kanban" || this.$route.path === "/crm-tasks"
      );
    },

    showSidebar() {
      return this.permissionStore.hasPermission(PERMISSIONS.VIEW_SIDEBAR);
    },
  },

  methods: {
    handleSidebarToggle(isCollapsed) {
      this.isSidebarCollapsed = isCollapsed;
    },

    handleLoginSuccess() {
      this.isLoggedIn = true;
      this.$router.push("/crm-kanban");
    },

    async loadSavedBackground() {
      try {
        const bg_id = localStorage.getItem("backgroundImage_id");
        if (bg_id) {
          let response = await getBackgroundId(bg_id);
          if (response.status !== 200) {
            throw new Error(response.data.message);
          }
          const savedImage = response.data.data.url;
          document.body.style.backgroundImage = `url(${savedImage})`;
          document.body.style.backgroundSize = "cover";
          document.body.style.backgroundPosition = "center";
          document.body.style.backgroundRepeat = "no-repeat";
          document.body.style.backgroundAttachment = "fixed";
        }
      } catch (error) {
        console.error(error);
        this.notificationStore.error(error.message);
      }
    },

    checkAuthStatus() {
      const token = Cookies.get("authToken");
      this.isLoggedIn = !!token;

      if (!token && this.$route.path !== "/login") {
        this.$router.push("/login");
      } else if (token) {
        if (!this.permissionStore.hasPermission(PERMISSIONS.STAY_IDLE)) {
          this.settingStore.startIdleTimer();
          this.settingStore.setupUserActivityListeners();
        }
        if (this.$route.path === "/login") {
          this.$router.push("/dashboard");
        }
      }
    },

    closeAllModals() {
      this.dealStore.toggleDealModalStatus();
      this.$root.$emit("close-all-modals");
    },
  },

  mounted() {
    this.loadSavedBackground();
    this.checkAuthStatus();
  },

  watch: {
    $route() {
      this.checkAuthStatus();
    },
  },
};
</script>

<style>
#app {
  font-family: "Alexandria", "Poppins", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.Vue-Toastification__container {
  max-width: 320px !important;
}
/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #988e8e;
  border-radius: 3px;
  cursor: pointer;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #6b6767;
}
.app-layout {
  width: 100%;
  overflow: hidden;
}

.main-content {
  height: 100vh;
  width: 100%;
  min-width: 0;
  flex-grow: 1;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.content {
  flex-grow: 1;
  overflow-x: hidden;
}

.p-inputtext {
  min-width: 100px;
}
</style>
