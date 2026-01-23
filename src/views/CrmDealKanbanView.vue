<template>
  <crm-kanban-header
    :initial-filters="filters"
    @filter-applied="applyFilters"
    @reset-filter="resetFilter"
    :selected_conversation="selected_conversation"
    :new_message="new_message"
    :update_message="update_message"
    :apply-actual-filters-prop="applyFilters"
    :reset-actual-filters-prop="resetFilter"
  />
  <crm-kanban-kanban-board
    :stages="stages"
    :searchVal="searchVal"
    :filters="filters"
    :search_result="search_result"
    defaultColor="#333"
    @open-whatsapp-modal="openWhatsappModal"
    @receive-whatsapp-message="receiveWhatsappMessage"
    @update-whatsapp-message="updateWhatsappMessage"
    @change-deal-stage="changeDealStage"
  />
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from "vue";
import CrmKanbanHeader from "@/components/headers/CrmDealKanbanTopHeader.vue";
import CrmKanbanKanbanBoard from "@/components/kanban/CrmDealKanbanBoardDeals.vue";
import { useI18n } from "vue-i18n";
import { getDealsKanban } from "@/plugins/services/kanbanService";
import { useSourceStore } from "@/stores/SourceStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useDealStore } from "@/stores/DealStore";
import { useStageStore } from "@/stores/StageStore";
import { usePermissionStore, PERMISSIONS } from "@/stores/PermissionStore";
import { rules } from "@/enums/StageRulesEnum";
import Swal from "sweetalert2";

export default {
  name: "CrmDealKanbanView",

  components: {
    CrmKanbanHeader,
    CrmKanbanKanbanBoard,
  },

  setup() {
    const { t } = useI18n();
    const notificationStore = useNotificationStore();
    const dealStore = useDealStore();
    const sourceStore = useSourceStore();
    const stageStore = useStageStore();
    const permissionStore = usePermissionStore();
    const stages = ref([]);
    const selected_conversation = ref(null);
    const searchVal = ref("");
    const filters = ref({
      source_id: null,
      stage_id: null,
      supervisor_id: null,
      representative_id: null,
      package_id: null,
      created_date_start: null,
      created_date_end: null,
      updated_date_start: null,
      updated_date_end: null,
      status: [],
      sort_by: null,
      sort_order: null,
    });

    const new_message = ref(null);
    const update_message = ref(null);
    const searching = ref(false);
    const search_result = ref(null);

    const fetchStages = async (searchText) => {
      if (searching.value) return;
      try {
        searching.value = true;
        searchVal.value = searchText || "";
        const response = await getDealsKanban(searchText);
        if (response.status == 200) {
          stages.value = response.data.data.map((stage) => ({
            id: stage.id,
            name: stage.name,
            name_key: stage.name_key || null,
            description: stage.description || null,
            color_code: stage.color_code,
            icon: stage.icon || "cricle",
            deal_count: stage.deal_count,
            deals: stage.deals || [],
            filterable_tags: stage.filterable_tags || [],
            parent_id: stage.parent_id || null,
            has_children: stage.has_children,
          }));
          notificationStore.success(response.data.message);
          search_result.value = response.data.search_result || null;
        } else {
          notificationStore.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching stages:", error);
        notificationStore.error(error.message);
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
          formattedFilters["filters[user_id]"] = filters.value.user_id;
        }
        if (filters.value.recontact_count) {
          formattedFilters["filters[recontact_count]"] =
            filters.value.recontact_count;
        }
        if (filters.value.created_date_start) {
          formattedFilters["filters[created_date_start]"] = new Date(
            filters.value.created_date_start
          )
            .toISOString()
            .slice(0, 10);
        }
        if (filters.value.created_date_end) {
          formattedFilters["filters[created_date_end]"] = new Date(
            filters.value.created_date_end
          )
            .toISOString()
            .slice(0, 10);
        }
        if (filters.value.updated_date_start) {
          formattedFilters["filters[updated_date_start]"] = new Date(
            filters.value.updated_date_start
          )
            .toISOString()
            .slice(0, 10);
        }
        if (filters.value.updated_date_end) {
          formattedFilters["filters[updated_date_end]"] = new Date(
            filters.value.updated_date_end
          )
            .toISOString()
            .slice(0, 10);
        }
        if (filters.value.nationality) {
          formattedFilters["filters[nationality]"] = filters.value.nationality;
        }
        if (filters.value.country_code) {
          formattedFilters["filters[country_code]"] =
            filters.value.country_code;
        }
        if (filters.value.origin_id) {
          formattedFilters["filters[origin_id]"] = filters.value.origin_id;
        }
        if (filters.value.import_label_id) {
          formattedFilters["filters[import_label_id]"] =
            filters.value.import_label_id;
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
          if (filters.value.status.includes("admin_comments")) {
            formattedFilters["filters[admin_comments]"] = 1;
          }
          if (filters.value.status.includes("recontact_only")) {
            formattedFilters["filters[recontact_only]"] = 1;
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
          notificationStore.info(t("noDealsFound"));
          stages.value = [];
          search_result.value = response?.data?.search_result || null;
          return;
        }
        stages.value = response.data.data;
        search_result.value = response.data.search_result || null;

        notificationStore.success(t("success.applyFilters"), { timeout: 3000 });
      } catch (error) {
        console.error("Filter Error:", error);
        notificationStore.error(error.message, { timeout: 3000 });
        stages.value = [];
      }
    };

    const resetFilter = async () => {
      try {
        filters.value = {
          source_id: null,
          stage_id: null,
          supervisor_id: null,
          representative_id: null,
          package_id: null,
          created_date_start: null,
          created_date_end: null,
          updated_date_start: null,
          updated_date_end: null,
          recontact_count: null,
          status: [],
          sort_by: null,
          sort_order: null,
        };
        const response = await fetchStages();
        notificationStore.success(response.data.message, {
          timeout: 3000,
        });
      } catch (error) {
        console.error(error);
        notificationStore.error(error.message, {
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
            dealStore.toggleDealModalStatus();
          }
        }
      });
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
      await fetchStages({ search: searchText });
    };

    const changeDealStage = async (dealId, newStageIndex, oldStageId) => {
      try {
        const newStageId = stages.value[newStageIndex].id;
        if (
          !permissionStore.hasPermission(PERMISSIONS.IGNORE_STAGE_RULES) &&
          stageStore.hasRules(newStageId, [
            rules.MOVEFROMREQUIRECOOLDOWNMINUTESAFTERDEALLASTMOVEDDATE,
          ])
        ) {
          const confirmed = await Swal.fire({
            title: t("deal-move-confirmation-title"),
            text: t("deal-move-confirmation-description"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: t("success.moveConfirm"),
            cancelButtonText: t("error.moveCancel"),
            reverseButtons: true,
          });
          if (!confirmed.isConfirmed) {
            return;
          }
        }
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

    watch(
      () => dealStore.getSearchVal,
      (newVal) => {
        HandleSearch(newVal);
      }
    );

    onMounted(async () => {
      try {
        sourceStore.fetchSources();
        await fetchStages();
        window.addEventListener("contextmenu", handleRightClick);
        if (stageStore.getAllStages.length === 0) {
          stageStore.fetchStages();
        }
      } catch (error) {
        console.error(error);
        notificationStore.error(error.message, {
          timeout: 3000,
        });
      }
    });

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    return {
      search_result,
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
