<template>
  <header class="mt-2" :class="{ 'crm-list-page': currentPage === 'crm-list' }">
    <nav class="container-fluid p-0">
      <div class="row">
        <div class="col-md-3">
          <task-counter-comp />
        </div>
        <div
          class="col-md-6 d-flex gap-2 justify-content-center align-items-center"
        >
          <button-group-comp />
        </div>
        <div class="col-md-3 d-flex justify-content-end">
          <salary-widget-comp />
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
import { Modal } from "bootstrap";
import CreateDealModal from "@/components/kanban/CrmKanbanTopHeaderCreateDealModal.vue";
import { usePermissionStore, PERMISSIONS } from "@/stores/PermissionStore";
import WhatsAppModal from "@/components/modals/CrmDealKanbanTopHeaderWhatsAppModal.vue";
import SearchModalIpad from "@/components/headers/CrmKanbanTopHeaderSearchModalIpad.vue";
import Cookies from "js-cookie";
import TaskCounterComp from "./KanbanTopHeaderTaskCounterComp.vue";
import ButtonGroupComp from "./KanbanTopHeaderButtonGroupComp.vue";
import SalaryWidgetComp from "./KanbanTopHeaderSalaryWidgetComp.vue";

export default {
  name: "CrmDealKanbanTopHeader",
  components: {
    FilterModal,
    CreateDealModal,
    WhatsAppModal,
    SearchModalIpad,
    TaskCounterComp,
    ButtonGroupComp,
    SalaryWidgetComp,
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
        created_date_start: "",
        created_date_end: "",
        updated_date_start: "",
        updated_date_end: "",
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
    const conversation = ref(null);
    const local_new_message = ref(null);
    const local_update_message = ref(null);
    const headerFilterData = ref({ ...props.initialFilters });
    const headerSelectedStatuses = ref([]);
    const permissionStore = usePermissionStore();
    const searchText = ref("");
    const route = useRoute();
    const showSearchInput = computed(() => {
      return route.name !== "CrmListView";
    });
    const user_role = ref(Cookies.get("user_role"));
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
    const openEMRKanban = () => {
      router.push({ name: "EmrDealKanbanView" });
    };
    const isSmallScreen = ref(window.innerWidth < 1050);
    const handleResize = () => {
      isSmallScreen.value = window.innerWidth < 1050;
    };
    onMounted(() => {
      window.addEventListener("resize", handleResize);
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
    const handleSearch = () => {
      const search = searchText.value.trim();
      emit("search-deals", search);
    };
    const updateMessage = (data) => {
      local_update_message.value = data;
    };
    return {
      openEMRKanban,
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
      openSearchModalIpad,
      lgIpadClass,
      conversation,
      setConversation,
      setNewMessage,
      local_new_message,
      local_update_message,
      handleSearch,
      searchText,
      updateMessage,
      user_role,
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
@media (max-width: 850px) {
  .btn-group .btn span {
    font-size: 12px;
  }
  .fs-7 {
    font-size: 12px;
  }
}
.btn {
  font-size: 0.9rem;
}
.btn-header {
  /* background-color: rgba(128, 128, 128, 0.8) !important; */
  background-color: #55555551 !important;
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
