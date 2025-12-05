<template>
  <header class="me-2" :class="{ 'crm-list-page': currentPage === 'crm-list' }">
    <nav class="container-fluid p-0">
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-wrap align-items-center">
            <!-- Buttons Group -->
            <div class="col-md-auto">
              <button
                v-if="permissionStore.hasPermission(PERMISSIONS.CREATE_DEAL)"
                class="btn text-white me-2 fs-7 btnAddKanban btn-hover"
                @click="openCreateDealModal"
                style="padding: 0.5rem 1.3rem"
              >
                <span class="textAddKanban">{{
                  t("kanban-button-add-deal")
                }}</span>
                <span class="iconAddKanban d-none">+</span>
              </button>
              <button
                class="btn text-white me-2 fs-7 btnKanban btn-hover"
                @click="openCrmKanban"
                v-if="permissionStore.hasPermission(PERMISSIONS.DEALS_KANBAN)"
                style="padding: 0.5rem 2rem"
              >
                {{ t("header-subnav-item-kanban-crm") }}
              </button>
              <button
                class="btn text-white me-2 fs-7 btnKanban btn-hover"
                @click="openAfterSalesKanban"
                v-if="
                  permissionStore.hasPermission(
                    PERMISSIONS.AFTER_SALES_KANBAN
                  ) && !permissionStore.hasPermission(PERMISSIONS.DEALS_KANBAN)
                "
                style="padding: 0.5rem 2rem"
              >
                {{ t("sidebar-nav-item-after-sales-kanban") }}
              </button>
              <button
                class="btn text-white me-2 fs-7 btnKanban btn-hover"
                @click="openCrmTasks"
                v-if="permissionStore.hasPermission(PERMISSIONS.TASKS_KANBAN)"
                style="padding: 0.5rem 2rem"
              >
                {{ t("header-subnav-item-kanban-tasks") }}
              </button>
              <router-link
                class="btn text-white me-2 fs-7 btnKanban btn-hover"
                style="padding: 0.6rem 1.2rem"
                to="/crmlist"
                v-if="
                  permissionStore.hasPermission(PERMISSIONS.DEALS_LIST) &&
                  user_role == 'sales'
                "
              >
                {{ t("sidebar-nav-item-crmlist") }}
              </router-link>
            </div>

            <!-- Search Form -->
            <div :class="lgIpadClass" v-if="showSearchInput">
              <div class="input-group px-1">
                <button
                  class="btn btn-hover btnSearchIpad text-white"
                  @click="openSearchModalIpad"
                >
                  <i class="fa-solid fa-magnifying-glass"></i>
                </button>
                <input
                  type="search"
                  class="form-control bg-light border-light py-2 inputSearchIpad"
                  :placeholder="t('crmlist-placeholder-search')"
                  @search="handleSearch"
                  v-model="searchText"
                  id="dealSearchInput"
                />
                <button
                  class="btn btn-hover py-2 btnFilterIpad text-white"
                  :title="t('kanban-modal-filter-heading')"
                  @click="openFilterModal"
                >
                  <i class="fa-solid fa-filter"></i>
                </button>
              </div>
            </div>

            <!-- Tasks Status -->
            <div
              class="col-md-auto mb-2 mb-md-0 me-2 d-flex align-items-center"
            >
              <div class="btn-group w-100">
                <div
                  class="btn btn-header px-0 px-lg-2 d-flex align-items-center rounded-0 rounded-start"
                  style="padding-top: 0.4rem; padding-bottom: 0.4rem"
                >
                  <span
                    class="badge bg-secondary-subtle text-secondary fw-bold fs-6"
                    >{{ computed_unassign_count }}</span
                  >
                  <span class="ms-1 text-white">{{
                    t("kanban-task-status-unassign")
                  }}</span>
                </div>
                <div
                  class="btn btn-header px-0 px-lg-2 d-flex align-items-center"
                  style="padding-top: 0.4rem; padding-bottom: 0.4rem"
                >
                  <span
                    class="badge bg-secondary-subtle text-danger fw-bold fs-6"
                    >{{ computed_overdue_count }}</span
                  >
                  <span class="ms-1 text-white">{{
                    t("kanban-task-status-overdue")
                  }}</span>
                </div>
                <div
                  class="btn btn-header px-0 px-lg-2 d-flex align-items-center rounded-0"
                  style="padding-top: 0.4rem; padding-bottom: 0.4rem"
                >
                  <span
                    class="badge bg-secondary-subtle text-warning fw-bold fs-6"
                    >{{ computed_today_count }}</span
                  >
                  <span class="ms-1 text-white">{{
                    t("kanban-task-status-today")
                  }}</span>
                </div>
                <div
                  class="btn btn-header px-0 px-lg-2 d-flex align-items-center rounded-0 rounded-end"
                  style="padding-top: 0.4rem; padding-bottom: 0.4rem"
                >
                  <span
                    class="badge bg-secondary-subtle text-info fw-bold fs-6"
                    >{{ computed_tomorrow_count }}</span
                  >
                  <span class="ms-1 text-white">{{
                    t("kanban-task-status-tomorrow")
                  }}</span>
                </div>
              </div>
              <div class="watsappIcon me-2">
                <button
                  class="rounded-2 d-flex align-items-center justify-content-center gap-1 border-0 fs-7 ms-2 whatsappIpad btn-whatsapp py-2 px-4"
                  @click="openWhatsappModal"
                >
                  <i class="fa-brands fa-whatsapp fs-5"></i>
                  <span class="removeIpad" style="font-size: 16px">{{
                    $t("kanban-modal-edit-whatsapp")
                  }}</span>
                </button>
              </div>
              <div class="">
                <!-- v-if="permissionStore.hasPermission(PERMISSIONS.DOCUMENTS)" -->
                <router-link
                  to="/documents"
                  class="text-decoration-none documents btn btn-hover text-white py-2"
                >
                  <div
                    class="d-flex align-items-center fs-7 justify-content-center gap-2 documentsIpad"
                    :title="$t('sidebar-nav-item-documents')"
                  >
                    <i class="fa-regular fa-folder-open fs-6"></i>
                    <span class="fs-7 removeIpad">{{
                      $t("sidebar-nav-item-documents")
                    }}</span>
                  </div>
                </router-link>
              </div>
            </div>
            <!-- Import/Export Buttons -->
            <div
              v-if="permissionStore.hasPermission(PERMISSIONS.CREATE_DEAL)"
              class="col-md-auto d-flex align-items-center gap-2"
            >
              <button
                class="btn btn-hover flex-fill btnImport text-white"
                @click="openImportModal"
                style="padding: 0.5rem 1.7rem"
              >
                <span class="fs-7 textImport">{{
                  t("kanban-button-import")
                }}</span>
                <i class="fa-solid fa-upload ms-1 fs-7"></i>
              </button>
              <button
                v-if="permissionStore.hasPermission(PERMISSIONS.EXPORT_DEAL)"
                class="btn btn-hover flex-fill btnExport text-white"
                @click="openExportModal"
                style="padding: 0.5rem 1.7rem"
              >
                <span class="fs-7 textExport">{{
                  t("kanban-button-export")
                }}</span>
                <i class="fa-solid fa-download ms-1 fs-7"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <filter-modal
      v-if="!disableFilter"
      v-model="headerFilterData"
      v-model:headerSelectedStatuses="headerSelectedStatuses"
      :applyActualFiltersProp="applyActualFiltersProp"
      :resetActualFiltersProp="resetActualFiltersProp"
    />
    <import-modal ref="importModalRef" />
    <export-modal ref="exportModalRef" />
    <create-deal-modal ref="createDealModalRef" />
    <whats-app-modal
      :conversation="conversation"
      :new_message="local_new_message"
      :updated_message="local_update_message"
    />
    <search-modal-ipad ref="searchModalIpadRef" />
  </header>
</template>

<script>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import FilterModal from "@/components/modals/CrmDealKanbanViewTopHeaderFilterModal.vue";
import ImportModal from "@/components/modals/CrmListViewImportModal.vue";
import ExportModal from "@/components/modals/CrmKanbanTopHeaderExportModal.vue";
import { Modal } from "bootstrap";
import CreateDealModal from "@/components/kanban/CrmKanbanTopHeaderCreateDealModal.vue";
import { usePermissionStore, PERMISSIONS } from "@/stores/PermissionStore";
import { useI18n } from "vue-i18n";
import WhatsAppModal from "@/components/modals/CrmDealKanbanTopHeaderWhatsAppModal.vue";
import SearchModalIpad from "@/components/headers/CrmKanbanTopHeaderSearchModalIpad.vue";
import { getconversations } from "@/plugins/services/whatsappService";
import { fetchTasksCountByStageName } from "@/plugins/services/stageService";
import Cookies from "js-cookie";

export default {
  name: "CrmDealKanbanTopHeader",
  components: {
    FilterModal,
    ImportModal,
    ExportModal,
    CreateDealModal,
    WhatsAppModal,
    SearchModalIpad,
  },
  props: {
    initialFilters: {
      type: Object,
      default: () => ({
        source_id: "",
        stage_id: "",
        supervisor_id: "",
        representative_id: "",
        package_id: "",
        created_at_start: "",
        created_at_end: "",
        updated_at_start: "",
        updated_at_end: "",
        status: [],
      }),
      required: true,
    },
    disableFilter: { type: Boolean, required: true, default: false },
    selected_conversation: {
      type: Object,
      default: null,
      required: true,
    },

    new_message: {
      type: Object,
      default: null,
      required: true,
    },

    update_message: {
      type: Object,
      default: null,
      required: true,
    },
    currentPage: {
      type: String,
      default: null,
    },
    applyActualFiltersProp: { type: Function, required: true },
    resetActualFiltersProp: { type: Function, required: true },
  },
  emits: ["filter-applied", "reset-filter"],
  setup(props, { emit }) {
    const computed_overdue_count = computed(() =>
      overdue_count.value > 99 ? "99+" : overdue_count.value
    );
    const computed_today_count = computed(() =>
      today_count.value > 99 ? "99+" : today_count.value
    );
    const computed_tomorrow_count = computed(() =>
      tomorrow_count.value > 99 ? "99+" : tomorrow_count.value
    );
    const computed_unassign_count = computed(() =>
      unassign_count.value > 99 ? "99+" : unassign_count.value
    );
    const conversation = ref(null);
    const local_new_message = ref(null);
    const local_update_message = ref(null);
    const headerFilterData = ref({ ...props.initialFilters });
    const headerSelectedStatuses = ref([]);
    const permissionStore = usePermissionStore();
    const { t } = useI18n();
    const overdue_count = ref(0);
    const today_count = ref(0);
    const tomorrow_count = ref(0);
    const unassign_count = ref(0);
    const searchText = ref("");
    const route = useRoute();
    const showSearchInput = computed(() => {
      return route.name !== "CrmListView";
    });
    const user_role = ref(Cookies.get("user_role"));

    const openWhatsappModal = async () => {
      try {
        const response = await getconversations();
        const conversations = response.data.data;
        emit("load-conversations", conversations);

        const modal = new Modal(document.getElementById("whatsappModal"));
        modal.show();
      } catch (error) {
        console.error("Error opening WhatsApp modal:", error);
      }
    };
    watch(
      () => props.initialFilters,
      (newFilters) => {
        if (!newFilters) return;
        headerFilterData.value = { ...newFilters };
      },
      { deep: true }
    );
    const openFilterModal = () => {
      const modal = new Modal(document.getElementById("filterModal"));
      modal.show();
    };
    // Import Modal
    const openImportModal = () => {
      const modal = new Modal(document.getElementById("importModal"));
      modal.show();
    };
    const openExportModal = () => {
      const modal = new Modal(document.getElementById("exportModal"));
      modal.show();
    };
    const openCreateDealModal = () => {
      const modal = new Modal(document.getElementById("createDealModal"));
      modal.show();
    };
    const handleFilters = (filters) => {
      emit("filter-applied", filters);
    };

    const handleResetFilter = () => {
      emit("reset-filter");
    };
    const router = useRouter();
    const openCrmTasks = () => {
      router.push({ name: "CrmDealTasksView" });
    };
    const openCrmKanban = () => {
      router.push({ name: "CrmDealKanbanView" });
    };
    const openAfterSalesKanban = () => {
      router.push({ name: "CrmDealAfterSalesView" });
    };
    const isSmallScreen = ref(window.innerWidth < 1050);
    const handleResize = () => {
      isSmallScreen.value = window.innerWidth < 1050;
    };
    onMounted(() => {
      window.addEventListener("resize", handleResize);
      fetchTasksCounter();
    });

    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
    });
    const openSearchModalIpad = () => {
      if (isSmallScreen.value) {
        const modal = new Modal(document.getElementById("searchIpadModal"));
        modal.show();
      }
    };
    const lgIpadClass = computed(() => {
      return isSmallScreen.value
        ? "col-md-auto me-2"
        : "col-md me-2 flex-grow-1";
    });
    const setConversation = (data) => {
      conversation.value = data;
    };
    const setNewMessage = (data) => {
      local_new_message.value = data;
    };
    const fetchTasksCounter = async () => {
      // Simulate fetching data from an API
      try {
        const overdueResponse = await fetchTasksCountByStageName("Overdue");
        overdue_count.value = overdueResponse?.data?.data || 0;

        const todayResponse = await fetchTasksCountByStageName("Due Today");
        today_count.value = todayResponse?.data?.data || 0;

        const tomorrowResponse = await fetchTasksCountByStageName(
          "Due Tomorrow"
        );
        tomorrow_count.value = tomorrowResponse?.data?.data || 0;

        const noTasksResponse = await fetchTasksCountByStageName(
          "unassign-soon"
        );
        unassign_count.value = noTasksResponse?.data?.data || 0;
      } catch (error) {
        console.error("Error fetching task counts:", error);
      }
    };
    const handleSearch = () => {
      const search = searchText.value.trim();
      emit("search-deals", search);
    };
    const updateMessage = (data) => {
      local_update_message.value = data;
    };
    return {
      headerFilterData,
      openFilterModal,
      handleFilters,
      handleResetFilter,
      openImportModal,
      openExportModal,
      openCreateDealModal,
      openCrmTasks,
      openCrmKanban,
      permissionStore,
      PERMISSIONS,
      t,
      openWhatsappModal,
      openSearchModalIpad,
      lgIpadClass,
      conversation,
      setConversation,
      setNewMessage,
      local_new_message,
      local_update_message,
      overdue_count,
      today_count,
      tomorrow_count,
      unassign_count,
      fetchTasksCounter,
      handleSearch,
      searchText,
      updateMessage,
      user_role,
      computed_overdue_count,
      computed_today_count,
      computed_tomorrow_count,
      computed_unassign_count,
      showSearchInput,
      headerSelectedStatuses,
      openAfterSalesKanban,
    };
  },

  watch: {
    selected_conversation(newValue) {
      if (newValue) {
        this.openWhatsappModal();
        this.setConversation(newValue);
      }
    },
    new_message(newValue) {
      if (newValue) {
        this.setNewMessage(newValue);
      }
    },
    update_message(newValue) {
      if (newValue) {
        this.updateMessage(newValue);
      }
    },
  },
};
</script>

<style scoped>
input:focus {
  box-shadow: none;
}

@media (max-width: 1200px) {
  .btn-group {
    display: flex !important;
  }
}
@media (max-width: 850px) {
  .btn-group .btn span {
    font-size: 12px;
  }
  .fs-7 {
    font-size: 12px;
  }
}
.btn {
  font-size: 14px;
}
.btn-header {
  /* background-color: rgba(128, 128, 128, 0.8) !important; */
  background-color: #55555551 !important;
}
.btn-hover {
  /* background-color: rgba(128, 128, 128, 0.8) !important; */
  background-color: #55555551 !important;
}
.btn-hover:hover {
  background-color: #ffffff !important;
  color: #333333 !important;
}
.btn-whatsapp {
  background-color: #25d365cc;
  transition: 0.3s ease-in-out;
  color: #ffffff !important;
}
.btn-whatsapp:hover {
  background-color: #ffffff !important;
  color: #25d365 !important;
  transition: 0.3s ease-in-out;
}
.crm-list-page .btn-hover {
  background-color: #555555 !important;
}
.crm-list-page .btn-header {
  background-color: #555555 !important;
}
@media (max-width: 1200px) {
  .removeIpad {
    display: none;
  }
  .whatsappIpad {
    background-color: #25d365cc;
    padding: 0.35rem 0.7rem !important;
  }
  .whatsappIpad:hover {
    background-color: #ffffff;
    color: #25d365 !important;
    padding: 0.35rem 0.7rem !important;
  }
  .whatsappIpad i {
    font-size: 1.7rem !important;
  }
  .documentsIpad {
    padding: 0px 7px !important;
  }
  .documentsIpad i {
    font-size: 1.3rem !important;
  }
  .textAddKanban {
    display: none;
  }
  .iconAddKanban {
    display: inline-block !important;
    font-size: 1.6rem !important;
    padding: 0 5px !important;
  }
  .btnAddKanban {
    padding: 0px 10px !important;
  }
  .textImport {
    display: none;
  }
  .textExport {
    display: none;
  }
  .btnImport {
    /* padding-right: 8px !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important; */
    padding: 4px 13px 4px 10px !important;
    font-size: 1.2rem !important;
  }
  .btnExport {
    padding: 4px 13px 4px 10px !important;
    font-size: 1.2rem !important;
  }
  @media screen and (max-width: 1050px) {
    .inputSearchIpad {
      display: none;
    }
    .input-group {
      gap: 0.5rem;
    }
    .btnFilterIpad {
      border-radius: 0.35rem !important;
      font-size: 0.9rem !important;
    }
    .btnSearchIpad {
      border-radius: 0.35rem !important;
      font-size: 1rem !important;
    }
    .btnKanban {
      padding: 9px 10px !important;
    }
  }
}
.btnHeaderBg {
  background-color: #919191;
}
</style>
