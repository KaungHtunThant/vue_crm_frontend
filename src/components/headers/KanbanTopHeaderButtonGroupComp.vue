<template>
  <router-link
    to="/crm-kanban"
    class="btn btn-hover text-white fs-cus-1"
    v-if="permissionStore.hasPermission(PERMISSIONS.DEALS_KANBAN)"
  >
    <i class="fa fa-chart-line"></i>
    {{ $t("header-subnav-item-kanban-crm") }}
  </router-link>
  <router-link
    to="/crm-after-sales"
    class="btn btn-hover text-white fs-cus-1"
    v-if="
      permissionStore.hasPermission(PERMISSIONS.AFTER_SALES_KANBAN) &&
      !permissionStore.hasPermission(PERMISSIONS.DEALS_KANBAN)
    "
  >
    <i class="fa fa-chart-bar"></i>
    {{ $t("sidebar-nav-item-after-sales-kanban") }}
  </router-link>
  <router-link
    to="/crm-emr"
    class="btn btn-hover text-white fs-cus-1"
    v-if="
      permissionStore.hasPermission(PERMISSIONS.EMRKANBAN) &&
      !permissionStore.hasPermission(PERMISSIONS.DEALS_KANBAN)
    "
  >
    <i class="fa fa-chart-grant"></i>
    {{ $t("sidebar-nav-item-emr-kanban") }}
  </router-link>
  <router-link
    to="/crm-tasks"
    class="btn btn-hover text-white fs-cus-1"
    v-if="permissionStore.hasPermission(PERMISSIONS.TASKS_KANBAN)"
  >
    <i class="fa fa-chart-simple"></i>
    {{ $t("header-subnav-item-kanban-tasks") }}
  </router-link>
  <router-link
    to="/crmlist"
    class="btn btn-hover text-white fs-cus-1"
    v-if="
      permissionStore.hasPermission(PERMISSIONS.DEALS_LIST) &&
      user_role == 'sales'
    "
  >
    {{ $t("sidebar-nav-item-crmlist") }}
  </router-link>
  <a
    class="btn btn-hover text-white fs-cus-1 align-items-center d-flex gap-1"
    @click="openWhatsappModal"
  >
    <i class="fa-brands fa-whatsapp fs-cus-2"></i>
    {{ $t("kanban-modal-edit-whatsapp") }}
  </a>
  <router-link to="/documents" class="btn btn-hover text-white fs-cus-1">
    <i class="fa-regular fa-folder-open"></i>
    {{ $t("sidebar-nav-item-documents") }}
  </router-link>
  <a
    class="btn btn-hover text-white fs-cus-1 align-items-center d-flex gap-1"
    ref="notifiButton"
  >
    <i class="fa-solid fa-bell fs-cus-1"></i>
    {{ $t("header-user-menu-item-notification") }}
  </a>
</template>
<script>
import { ref, onMounted } from "vue";
import { usePermissionStore, PERMISSIONS } from "@/stores/PermissionStore";
import { Modal } from "bootstrap";
import { getconversations } from "@/plugins/services/whatsappService";

export default {
  name: "ButtonGroupComp",
  setup(props, { emit }) {
    const permissionStore = usePermissionStore();
    const user_role = ref("");
    onMounted(() => {
      user_role.value = localStorage.getItem("user_role") || "";
    });
    const notifiButton = ref(null);
    const openWhatsappModal = async () => {
      try {
        const response = await getconversations();
        const conversations = response.data.data;
        emit("load-conversations", conversations);

        const modal = new Modal(document.getElementById("whatsappModal"));
        modal.show();
      } catch (error) {
        // Error handled silently
      }
    };
    return {
      permissionStore,
      PERMISSIONS,
      user_role,
      notifiButton,
      openWhatsappModal,
    };
  },
};
</script>
<style scoped>
.btn-hover {
  /* background-color: rgba(128, 128, 128, 0.8) !important; */
  background-color: #55555551 !important;
}
.btn-hover:hover {
  background-color: #ffffff !important;
  color: #333333 !important;
}
.fs-cus-1 {
  font-size: 0.9rem !important;
}
.fs-cus-2 {
  font-size: 1.12rem !important;
}
</style>
