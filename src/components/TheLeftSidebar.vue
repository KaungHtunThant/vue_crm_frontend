<template>
  <div
    class="sidebar vh-100 overflow-hidden text-white"
    :class="{ 'sidebar-collapsed': isCollapsed }"
  >
    <div class="d-flex justify-content-start align-items-center ps-2 mt-3">
      <div class="imgLogo me-2">
        <img
          src="@/assets/new-nokta-logo.png"
          style="width: 35px; height: 35px"
          alt=""
        />
      </div>
      <span class="pe-1" v-if="!isCollapsed"
        >{{ $t("sidebar-heading") }}:
      </span>
    </div>
    <div class="sidebar-items overflow-auto">
      <div
        v-if="permissionStore.hasPermission(PERMISSIONS.DEALS_KANBAN)"
        class="sidebar-item d-flex align-items-center"
        :title="$t('sidebar-nav-item-kanban')"
      >
        <router-link to="/crm-kanban" class="text-decoration-none text-white">
          <i class="fa-solid fa-chart-column fs-5 me-2"></i>
          <span v-if="!isCollapsed">{{ $t("sidebar-nav-item-kanban") }}</span>
        </router-link>
      </div>
      <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.DEALS_LIST)"
        to="/crmlist"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center"
          :title="$t('sidebar-nav-item-crmlist')"
        >
          <i class="fa-solid fa-table-list fs-5 me-2"></i>
          <span v-if="!isCollapsed">{{ $t("sidebar-nav-item-crmlist") }}</span>
        </div>
      </router-link>
      <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.USERS)"
        to="/users"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center"
          :title="$t('sidebar-nav-item-users')"
        >
          <i class="fa-solid fa-users fs-5 me-2"></i>
          <span v-if="!isCollapsed">{{ $t("sidebar-nav-item-users") }}</span>
        </div>
      </router-link>
      <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.CONTACTS)"
        to="/contacts"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center"
          :title="$t('sidebar-nav-item-contacts')"
        >
          <i class="fa-regular fa-address-book fs-5 me-2"></i>
          <span v-if="!isCollapsed">{{ $t("sidebar-nav-item-contacts") }}</span>
        </div>
      </router-link>
      <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.DOCUMENTS)"
        to="/documents"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center"
          :title="$t('sidebar-nav-item-documents')"
        >
          <i class="fa-regular fa-folder-open fs-5 me-2"></i>
          <span v-if="!isCollapsed">{{
            $t("sidebar-nav-item-documents")
          }}</span>
        </div>
      </router-link>
      <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.DASHBOARD)"
        to="/dashboard"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center"
          :title="$t('sidebar-nav-item-dashboard')"
        >
          <i class="fa-solid fa-chart-pie fs-5 me-2 ps-1"></i>

          <span v-if="!isCollapsed">{{
            $t("sidebar-nav-item-dashboard")
          }}</span>
        </div>
      </router-link>
      <!-- <div
        v-if="permissionStore.hasPermission(PERMISSIONS.DASHBOARD)"
        class="sidebar-item d-flex align-items-center"
        :title="$t('sidebar-nav-item-dashboard')"
      >
        <router-link
          to="/dashboard"
          class="text-decoration-none text-white d-flex align-items-center"
        >
          <i class="fa-solid fa-house fs-5 me-2"></i>
          <i class="fa-solid fa-chart-pie fs-5 me-2"></i>
          <i class="fa-solid fa-chart-line fs-5 me-2"></i>
          <span v-if="!isCollapsed">{{
            $t("sidebar-nav-item-dashboard")
          }}</span>
        </router-link>
      </div> -->
      <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.GENERAL_SETTINGS)"
        to="/general-settings"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center"
          :title="$t('sidebar-nav-item-settings')"
        >
          <i class="fa-solid fa-cog fs-5 me-2"></i>
          <span v-if="!isCollapsed">{{ $t("sidebar-nav-item-settings") }}</span>
        </div>
      </router-link>
      <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.GENERAL_SETTINGS)"
        to="/stage-settings"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center"
          :title="$t('sidebar-nav-item-settings')"
        >
          <i class="fa-solid fa-sliders fs-5 me-2"></i>
          <span v-if="!isCollapsed">{{ $t("sidebar-nav-item-settings") }}</span>
        </div>
      </router-link>
      <!-- <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.ROLES_SETTINGS)"
        to="/role-settings"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
          title="Role Settings"
        >
          <i class="fa-solid fa-cogs fs-5 me-2"></i>
          <span v-if="!isCollapsed">Role Settings</span>
        </div>
      </router-link> -->

      <div
        class="sidebar-item d-flex justify-content-start align-items-center toggle-icon border-0 text-center fs-6"
        @click="toggleSidebar"
        :title="$t('sidebar-nav-item-toggle')"
      >
        <i class="fa-solid fa-bars fs-5 me-2"></i>
        <span v-if="!isCollapsed">{{ $t("sidebar-nav-item-toggle") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { usePermissionStore, PERMISSIONS } from "@/stores/permissionStore";
import { useI18n } from "vue-i18n";

export default {
  name: "TheLeftSidebar",
  emits: ["toggle"],
  setup(props, { emit }) {
    const isCollapsed = ref(true);
    const { t } = useI18n();
    const permissionStore = usePermissionStore();
    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value;
      emit("toggle", isCollapsed.value);
    };

    return {
      isCollapsed,
      toggleSidebar,
      permissionStore,
      PERMISSIONS,
      t,
    };
  },
};
</script>

<style scoped>
.sidebar {
  width: 100%;
  transition: width 0.3s ease;
  position: relative;
  z-index: 1000;
}

.sidebar-collapsed {
  width: 55px;
}
.row {
  margin-left: 0;
  margin-right: 0;
}

[class^="col-"] {
  padding-left: 0;
  padding-right: 0;
}
.toggle-icon {
  cursor: pointer;
}

.sidebar-items {
  height: calc(100vh - 130px);
  padding: 8px;
}

.sidebar-item {
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 3px 5px;
  margin: 5px 0;
  border-radius: 4px;
}
.sidebar-item i {
  padding: 5px 5px 5px 5px;
  transition: all 0.3s ease;
  border-radius: 4px;
}
.sidebar-item i:hover {
  background-color: #34495e;
}
.sidebar-item:hover {
  background-color: #34495e;
}
.sidebar-item span {
  white-space: nowrap;
  font-size: 14px;
}
/*
.searchInput form i {
  top: 32%;
  left: 2%;
  font-size: 14px;
}
.searchInput form input:focus {
  box-shadow: 10px 10px 10px #605e5e80;
}
  */

.scale-enter-active {
  transition: all 0.4s ease;
}

.scale-enter-from,
.scale-leave-to {
  width: 30px;
  opacity: 0;
}

.scale-enter-to,
.scale-leave-from {
  opacity: 1;
}
/* scroll style */
.sidebar .sidebar-items::-webkit-scrollbar {
  width: 5px;
}

.sidebar .sidebar-items::-webkit-scrollbar-thumb {
  background: #c2c0c0a7;
  border-radius: 8px;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  -ms-border-radius: 8px;
  -o-border-radius: 8px;
}
</style>
