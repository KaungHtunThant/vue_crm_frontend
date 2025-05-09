<template>
  <div class="mt-2">
    <TopHeader2
      :initial-filters="filters"
      @filter-applied="applyFilters"
      @reset-filter="resetFilter"
      @search-deals="HandleSearch"
      :selected_conversation="selected_conversation"
      :new_message="new_message"
      :update_message="update_message"
    />
  </div>
  <KanbanBoard
    :stages="stages"
    defaultColor="#333"
    @open-whatsapp-modal="openWhatsappModal"
    @receive-whatsapp-message="receiveWhatsappMessage"
    @update-whatsapp-message="updateWhatsappMessage"
    @change-deal-stage="changeDealStage"
  />
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import TopHeader2 from "@/components/headers/TopHeader2.vue";
import KanbanBoard from "@/components/kanban/KanbanBoard.vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { getDealsKanban } from "@/plugins/services/authService";
export default {
  name: "CrmKanban",
  components: {
    TopHeader2,
    KanbanBoard,
  },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    // const stages = ref(kanbanStages);
    const stages = ref([]);
    // const whatsappModalRef = ref(null);
    const selected_conversation = ref(null);
    const filters = ref({
      source: "",
      stage: "",
      supervisor: "",
      representative: "",
      package: "",
      created_at_start: "",
      created_at_end: "",
      updated_at_start: "",
      updated_at_end: "",
      status: [],
    });
    const new_message = ref(null);
    const update_message = ref(null);
    const searching = ref(false);
    const fetchStages = async (searchText) => {
      if (searching.value) return;
      try {
        searching.value = true;
        const response = await getDealsKanban(searchText);
        if (Array.isArray(response.data.data)) {
          stages.value = response.data.data.map((stage) => ({
            id: stage.id,
            name: stage.name,
            description: stage.description || null,
            color_code: stage.color_code,
            deal_count: stage.deal_count,
            deals: stage.deals || [],
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
      try {
        filters.value = { ...newFilters };
        // toast.success("تم تطبيق الفلتر بنجاح", {
        //   timeout: 3000,
        // });
      } catch (error) {
        console.error("Error applying filters:", error);
        toast.error(t("error.applyFilters"), {
          timeout: 3000,
        });
      }
    };

    const resetFilter = async () => {
      try {
        filters.value = {
          source: "",
          stage: "",
          supervisor: "",
          representative: "",
          package: "",
          created_at_start: "",
          created_at_end: "",
          updated_at_start: "",
          updated_at_end: "",
          status: [],
        };
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

    const HandleSearch = (search) => {
      fetchStages(search);
      // Handle search logic here
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
