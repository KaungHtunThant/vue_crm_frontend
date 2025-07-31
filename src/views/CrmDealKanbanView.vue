<template>
  <div class="mt-2">
    <crm-kanban-header
      :initialFilters="filters"
      @filter-applied="applyFilters"
      @reset-filter="resetFilter"
      @search-deals="HandleSearch"
      :selected_conversation="selected_conversation"
      :new_message="new_message"
      :update_message="update_message"
    />
  </div>
  <crm-kanban-kanban-board
    :stages="stages"
    :searchVal="searchVal"
    defaultColor="#333"
    @open-whatsapp-modal="openWhatsappModal"
    @receive-whatsapp-message="receiveWhatsappMessage"
    @update-whatsapp-message="updateWhatsappMessage"
    @change-deal-stage="changeDealStage"
  />
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import CrmKanbanHeader from "@/components/headers/CrmDealKanbanTopHeader.vue";
import CrmKanbanKanbanBoard from "@/components/kanban/CrmDealKanbanBoardDeals.vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { getDealsKanban } from "@/plugins/services/authService";
export default {
  name: "CrmDealKanbanView",

  components: {
    CrmKanbanHeader,
    CrmKanbanKanbanBoard,
  },

  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const stages = ref([]);
    const selected_conversation = ref(null);
    const searchVal = ref("");
    const filters = ref({
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
      sort_by: "",
      sort_order: "",
    });

    const new_message = ref(null);
    const update_message = ref(null);
    const searching = ref(false);

    const fetchStages = async (searchText) => {
      if (searching.value) return;
      try {
        searching.value = true;
        searchVal.value = searchText || "";
        const response = await getDealsKanban(searchText);
        if (Array.isArray(response.data.data)) {
          stages.value = response.data.data.map((stage) => ({
            id: stage.id,
            name: stage.name,
            description: stage.description || null,
            color_code: stage.color_code,
            icon: stage.icon || "cricle",
            deal_count: stage.deal_count,
            deals: stage.deals || [],
            filterable_tags: stage.filterable_tags || [],
            parent_id: stage.parent_id || null,
            has_children: stage.has_children,
          }));
          toast.success(t("success.loadKanban"));
        } else {
          toast.error(t("error.loadKanban"));
        }
      } catch (error) {
        console.error("Error fetching stages:", error);
        toast.error(t("error.loadKanban"));
      }
      searching.value = false;
    };

    const applyFilters = async (newFilters) => {
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
          formattedFilters["filters[assigned_to_id]"] = filters.value.user_id;
        }
        if (filters.value.created_at_start) {
          formattedFilters["filters[created_date_start]"] =
            filters.value.created_at_start;
        }
        if (filters.value.created_at_end) {
          formattedFilters["filters[created_date_end]"] =
            filters.value.created_at_end;
        }
        if (filters.value.updated_at_start) {
          formattedFilters["filters[updated_date_start]"] =
            filters.value.updated_at_start;
        }
        if (filters.value.updated_at_end) {
          formattedFilters["filters[updated_date_end]"] =
            filters.value.updated_at_end;
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
          if (filters.value.status.includes("reclaimed")) {
            formattedFilters["filters[reclaimed]"] = 1;
          }
        }
        if (filters.value.sort_by) {
          formattedFilters["sort_by"] = filters.value.sort_by;
        }
        if (filters.value.sort_order) {
          formattedFilters["sort_order"] = filters.value.sort_order;
        }

        const response = await getDealsKanban(formattedFilters);

        if (!response?.data?.data) {
          toast.info(t("noDealsFound"));
          stages.value = [];
          return;
        }
        stages.value = response.data.data;

        toast.success(t("success.applyFilters"), { timeout: 3000 });
      } catch (error) {
        console.error("Filter Error:", error);
        toast.error(t("error.applyFilters"), { timeout: 3000 });
        stages.value = [];
      }
    };

    const resetFilter = async () => {
      try {
        filters.value = {
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
          sort_by: "",
          sort_order: "",
        };
        await fetchStages();
        // console.log("reset filter kanban");

        toast.success(t("success.resetFilters"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error resetting filters:", error);
        toast.error(t("error.resetFilters"), {
          timeout: 3000,
        });
      }
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

    const openWhatsappModal = (conversation) => {
      console.log(
        "selected conversation in Crm kanban component",
        conversation
      );
      selected_conversation.value = conversation;
    };

    const receiveWhatsappMessage = (message) => {
      new_message.value = message;
    };

    const updateWhatsappMessage = (data) => {
      update_message.value = data;
    };

    const HandleSearch = async (searchText) => {
      await fetchStages({ search: searchText });
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
          toast.success(t("success.dealMoved"));
        } else {
          console.error("Deal not found in the old stage");
        }
      } catch (error) {
        console.error("Error updating deal stage:", error.response?.data);
      }
    };

    onMounted(async () => {
      try {
        await fetchStages();
        window.addEventListener("contextmenu", handleRightClick);
      } catch (error) {
        toast.error(t("error.loadKanban"), {
          timeout: 3000,
        });
      }
    });

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    return {
      stages,
      filters,
      applyFilters,
      resetFilter,
      openWhatsappModal,
      selected_conversation,
      receiveWhatsappMessage,
      updateWhatsappMessage,
      new_message,
      update_message,
      HandleSearch,
      fetchStages,
      searching,
      changeDealStage,
      searchVal,
    };
  },
};
</script>

<style scoped>
.watsappIcon {
  bottom: 3.7%;
  right: 3%;
}
.textWhats {
  font-size: 16px;
}
button {
  border: 2px solid #25d366;
  width: 6.8em;
  height: 2em;
  transition: 0.5s;
  background: #f6f5f5;
}

button p {
  top: 0.4em;
  left: 1.5em;
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
  left: 0.8em;
  color: #fff;
}

button:hover i {
  opacity: 1;
}

button:hover {
  background-color: #25d366;
}
</style>
