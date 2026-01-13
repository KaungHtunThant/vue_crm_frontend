<template>
  <div class="mt-2">
    <crm-kanban-header
      :initial-filters="filters"
      @filter-applied="applyFilters"
      @reset-filter="resetFilter"
      @search-deals="HandleSearch"
      :selected_conversation="selected_conversation"
      :new_message="new_message"
      :update_message="update_message"
      :apply-actual-filters-prop="applyFilters"
      :reset-actual-filters-prop="resetFilter"
    />
  </div>
  <!-- <div class="watsappIcon position-absolute z-3">
    <button class="position-relative fs-5 rounded-2" @click="openWhatsappModal">
      <p class="position-absolute">{{ $t("kanban-modal-edit-whatsapp") }}</p>
      <div class="text-white"><i class="fa-brands fa-whatsapp"></i></div>
    </button>
  </div> -->
  <crm-kanban-kanban-board
    :stages="stages"
    :viewType="'task'"
    defaultColor="#333"
    :filters="filters"
    @open-whatsapp-modal="openWhatsappModal"
    @receive-whatsapp-message="receiveWhatsappMessage"
    @update-whatsapp-message="updateWhatsappMessage"
    @change-deal-stage="changeDealStage"
  />
  <!-- <WhatsappModal ref="whatsappModalRef" /> -->
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import CrmKanbanHeader from "@/components/headers/CrmDealKanbanTopHeader.vue";
import CrmKanbanKanbanBoard from "@/components/kanban/CrmDealKanbanBoardDeals.vue";
import { getTasksKanban } from "@/plugins/services/kanbanService";
import { useNotificationStore } from "@/stores/notificationStore";

import { useI18n } from "vue-i18n";
import Cookies from "js-cookie";

export default {
  name: "CrmDealTasksView",

  components: {
    CrmKanbanHeader,
    CrmKanbanKanbanBoard,
    // WhatsappModal,
  },

  setup() {
    // const toast = useToast();
    const notificationStore = useNotificationStore();
    const { t } = useI18n();
    const stages = ref([]);

    const filters = ref({
      source: "",
      stage: "",
      supervisor: "",
      representative: "",
      package: "",
      created_date_start: "",
      created_date_end: "",
      updated_date_start: "",
      updated_date_end: "",
      status: [],
    });

    const selected_conversation = ref(null);
    const new_message = ref(null);
    const update_message = ref(null);
    const user_role = ref(null);

    const applyFilters = async (newFilters) => {
      try {
        filters.value = { ...newFilters };
        try {
          const formattedFilters = {};

          if (filters.value.source_id) {
            formattedFilters["filters[source_id]"] = filters.value.source_id;
          }
          if (filters.value.stage_id) {
            formattedFilters["filters[stage_id]"] = filters.value.stage_id;
          }
          if (filters.value.user_id) {
            formattedFilters["filters[user_id]"] = filters.value.user_id;
          }
          if (filters.value.created_date_start) {
            formattedFilters["filters[created_date_start]"] =
              filters.value.created_date_start;
          }
          if (filters.value.created_date_end) {
            formattedFilters["filters[created_date_end]"] =
              filters.value.created_date_end;
          }
          if (filters.value.updated_date_start) {
            formattedFilters["filters[updated_date_start]"] =
              filters.value.updated_date_start;
          }
          if (filters.value.updated_date_end) {
            formattedFilters["filters[updated_date_end]"] =
              filters.value.updated_date_end;
          }
          if (Array.isArray(filters.value.status)) {
            if (filters.value.status.includes("unassigned")) {
              formattedFilters["filters[unassigned]"] = 1;
            }
            if (filters.value.status.includes("no_comments")) {
              formattedFilters["filters[uncommented]"] = 1;
            }
            if (filters.value.status.includes("no_task")) {
              formattedFilters["filters[no_tasks]"] = 1;
            }
            if (filters.value.status.includes("overdue")) {
              formattedFilters["filters[overdue]"] = 1;
            }
            if (filters.value.status.includes("new")) {
              formattedFilters["filters[new]"] = 1;
            }
          }
          if (filters.value.sort_by) {
            formattedFilters["sort_by"] = filters.value.sort_by;
          }
          if (filters.value.sort_order) {
            formattedFilters["sort_order"] = filters.value.sort_order;
          }
          if (user_role.value == "after-sales") {
            formattedFilters["type"] = "after-sales";
          }

          const response = await getTasksKanban(formattedFilters);

          if (!response?.data?.data) {
            notificationStore.info(t("noDealsFound"));
            stages.value = [];
            return;
          }
          stages.value = response.data.data;

          notificationStore.success(t("success.applyFilters"), {
            timeout: 3000,
          });
        } catch (error) {
          console.error("Filter Error:", error);
          notificationStore.error(error.message, { timeout: 3000 });
          stages.value = [];
        }
      } catch (error) {
        console.error("Error applying filters:", error);
      }
    };

    const resetFilter = async () => {
      filters.value = {
        source: "",
        stage: "",
        supervisor: "",
        representative: "",
        package: "",
        created_date_start: "",
        created_date_end: "",
        updated_date_start: "",
        updated_date_end: "",
        status: [],
      };
    };

    const handleRightClick = (event) => {
      event.preventDefault();
      const modalElements = document.querySelectorAll(".modal");
      modalElements.forEach((modal) => {
        if (modal.classList.contains("show")) {
          const closeButton = modal.querySelector('[data-bs-dismiss="modal"]');
          if (closeButton) {
            closeButton.click();
          }
        }
      });
    };

    const fetchStages = async (params = null) => {
      try {
        const response = await getTasksKanban(params);
        if (Array.isArray(response.data.data)) {
          stages.value = response.data.data.map((stage) => ({
            id: stage.id,
            name: stage.name,
            name_key: stage.name_key || null,
            description: stage.description || null,
            color_code: stage.color_code,
            deals: stage.deals || [],
            deal_count: stage.deal_count,
          }));
          notificationStore.success(response.data.message);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        notificationStore.error(error.message);
      }
    };

    const openWhatsappModal = (conversation) => {
      selected_conversation.value = conversation;
    };

    const receiveWhatsappMessage = (message) => {
      new_message.value = message;
    };

    const updateWhatsappMessage = (data) => {
      update_message.value = data;
    };

    const HandleSearch = async (searchText) => {
      await fetchStages({
        search: searchText,
        type: user_role.value == "after-sales" ? "after-sales" : null,
      });
    };

    const changeDealStage = async (dealId, newStageIndex, oldStageId) => {
      try {
        const newStageId = stages.value[newStageIndex].id;
        const oldStageIndex = stages.value.findIndex(
          (stage) => stage.id == oldStageId
        );
        const oldDealIndex = stages.value[oldStageIndex].deals.findIndex(
          (deal) => deal.id == dealId
        );
        if (oldDealIndex !== -1) {
          stages.value[oldStageIndex].deals[oldDealIndex].stage_id = newStageId;
          const deal = stages.value[oldStageIndex].deals[oldDealIndex];
          stages.value[newStageIndex].deals.unshift(deal);
          stages.value[oldStageIndex].deals.splice(oldDealIndex, 1);
          stages.value[oldStageIndex].deal_count -= 1;
          stages.value[newStageIndex].deal_count += 1;
          notificationStore.success(t("success.dealMoved"));
        } else {
          console.error("Deal not found in the old stage");
        }
      } catch (error) {
        console.error("Error updating deal stage:", error.response?.data);
      }
    };

    // upload data
    onMounted(async () => {
      user_role.value = Cookies.get("user_role");
      fetchStages({
        type: user_role.value == "after-sales" ? "after-sales" : null,
      });
      window.addEventListener("contextmenu", handleRightClick);
    });

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    return {
      stages,
      filters,
      applyFilters,
      resetFilter,
      fetchStages,
      openWhatsappModal,
      receiveWhatsappMessage,
      updateWhatsappMessage,
      HandleSearch,
      changeDealStage,
      selected_conversation,
      new_message,
      update_message,
    };
  },
};
</script>

<style scoped>
.watsappIcon {
  bottom: 4%;
  right: 3%;
}

button {
  border: 2px solid #25d366;
  width: 6.8em;
  height: 2em;
  transition: 0.5s;
  background: #f6f5f5;
}

button p {
  top: 0.2em;
  left: 1.15em;
  transition: 0.5s;
  color: #25d366;
}

button i {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  opacity: 0;
  transition: 0.5s;
  height: 1em;
}

button:hover p {
  left: 0.5em;
  color: #fff;
}

button:hover i {
  opacity: 1;
}

button:hover {
  background-color: #25d366;
}
</style>
