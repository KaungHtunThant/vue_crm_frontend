<template>
  <nav class="w-100 d-flex flex-warp justify-content-between gap-2 mt-2 pe-2">
    <test-kanban-top-header-button
      icon=""
      text="kanban-button-add-deal"
      v-if="permissionStore.hasPermission(PERMISSIONS.CREATE_DEAL)"
    />
    <test-kanban-top-header-button
      icon=""
      text="header-subnav-item-kanban-crm"
      v-if="permissionStore.hasPermission(PERMISSIONS.DEALS_KANBAN)"
    />
    <test-kanban-top-header-button
      icon=""
      text="header-subnav-item-kanban-tasks"
      v-if="permissionStore.hasPermission(PERMISSIONS.TASKS_KANBAN)"
    />
    <router-link
      to="/crmlist"
      v-if="
        permissionStore.hasPermission(PERMISSIONS.DEALS_LIST) &&
        user_role == 'sales'
      "
    >
      <test-kanban-top-header-button icon="" text="sidebar-nav-item-crmlist" />
    </router-link>
    <div class="input-group w-auto flex-grow-1">
      <span
        class="input-group-text border-0 pe-auto"
        role="button"
        tabindex="0"
      >
        <i class="fa-solid fa-magnifying-glass"></i>
      </span>
      <input
        type="text"
        class="form-control"
        placeholder="Search..."
        aria-label="Search"
      />
      <span
        class="input-group-text border-0 pe-auto"
        role="button"
        tabindex="0"
      >
        <i class="fa-solid fa-filter"></i>
      </span>
    </div>
    <test-kanban-topheader-task-count-button
      :text="'kanban-task-status-overdue'"
      :count="0"
      :color="'text-danger'"
    />
    <test-kanban-topheader-task-count-button
      :text="'kanban-task-status-today'"
      :count="0"
      :color="'text-warning'"
    />
    <test-kanban-topheader-task-count-button
      :text="'kanban-task-status-tomorrow'"
      :count="0"
      :color="'text-info'"
    />
    <test-kanban-topheader-task-count-button
      :text="'kanban-task-status-notasks'"
      :count="0"
      :color="'text-secondary'"
    />
    <test-whatsapp-button />
    <router-link to="/documents">
      <test-kanban-top-header-button
        icon="folder-open"
        text="sidebar-nav-item-documents"
      />
    </router-link>
    <test-kanban-top-header-button
      icon="upload"
      text="kanban-button-import"
      v-if="permissionStore.hasPermission(PERMISSIONS.CREATE_DEAL)"
    />
    <test-kanban-top-header-button
      icon="download"
      text="kanban-button-export"
      v-if="permissionStore.hasPermission(PERMISSIONS.CREATE_DEAL)"
    />
  </nav>
  <!-- <filter-modal
    v-if="!disableFilter"
    v-model="headerFilterData"
    v-model:headerSelectedStatuses="headerSelectedStatuses"
    @apply-filters="handleFilters"
    @reset-filter="handleResetFilter"
  />
  <import-modal ref="importModalRef" />
  <export-modal ref="exportModalRef" />
  <create-deal-modal ref="createDealModalRef" />
  <whats-app-modal
    :conversation="conversation"
    :new_message="local_new_message"
    :updated_message="local_update_message"
  />
  <search-modal-ipad ref="searchModalIpadRef" /> -->
</template>
<script>
import { usePermissionStore, PERMISSIONS } from "@/stores/PermissionStore";
import { useI18n } from "vue-i18n";
import TestKanbanTopHeaderButton from "@/components/kanban/TestKanbanTopHeaderButton.vue";
import TestKanbanTopheaderTaskCountButton from "@/components/kanban/TestKanbanTopheaderTaskCountButton.vue";
import TestWhatsappButton from "./TestWhatsappButton.vue";
export default {
  name: "TestKanbanTopHeader",
  components: {
    TestKanbanTopHeaderButton,
    TestKanbanTopheaderTaskCountButton,
    TestWhatsappButton,
    // FilterModal: () => import('@/components/modals/FilterModal.vue'),
    // ImportModal: () => import('@/components/modals/ImportModal.vue'),
    // ExportModal: () => import('@/components/modals/ExportModal.vue'),
    // CreateDealModal: () => import('@/components/modals/CreateDealModal.vue'),
    // WhatsAppModal: () => import('@/components/modals/WhatsAppModal.vue'),
    // SearchModalIpad: () => import('@/components/modals/SearchModalIpad.vue'),
  },
  props: {
    conversation: {
      type: Object,
      default: null,
    },
    local_new_message: {
      type: Object,
      default: null,
    },
    local_update_message: {
      type: Object,
      default: null,
    },
  },
  setup() {
    const permissionStore = usePermissionStore();
    const { t } = useI18n();

    return {
      permissionStore,
      t,
      PERMISSIONS,
    };
  },
};
</script>
<style scoped>
.input-group-text {
  background-color: #55555551;
  color: #ffffff;
  transition: 0.3s;
}
.input-group-text:hover {
  background-color: #ffffff !important;
  color: #333333 !important;
  transition: 0.3s;
}
</style>
