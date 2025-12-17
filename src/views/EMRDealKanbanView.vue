<template>
  <div class="mt-2">
    <crm-kanban-header
      :initial-filters="filters"
      @filter-applied="applyFilters"
      @reset-filter="resetFilter"
      @search-deals="handleSearch"
      :selected_conversation="selected_conversation"
      :new_message="new_message"
      :update_message="update_message"
    />
  </div>
  <div :class="kanbanSizeAdjust">
    <crm-kanban-kanban-board
      :stages="stages"
      :isDraggable="false"
      defaultColor="#333"
      :show-calendar-drag="true"
      :view-type="'emr'"
      @open-whatsapp-modal="openWhatsappModal"
      @receive-whatsapp-message="receiveWhatsappMessage"
      @update-whatsapp-message="updateWhatsappMessage"
      @change-deal-stage="changeDealStage"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from "vue";
import CrmKanbanHeader from "@/components/headers/CrmDealKanbanTopHeader.vue";
import CrmKanbanKanbanBoard from "@/components/kanban/CrmDealKanbanBoardDeals.vue";
import { useNotificationStore } from "@/stores/notificationStore";
import { useI18n } from "vue-i18n";
import { getEmrKanban } from "@/plugins/services/kanbanService";
import { useTaskStore } from "@/stores/TaskStore";
import { useDealStore } from "@/stores/DealStore";
import { useSettingStore } from "@/stores/SettingStore";
import { Draggable } from "@fullcalendar/interaction";

export default {
  name: "EmrDealKanbanView",
  emits: ["search-deals"],
  components: {
    CrmKanbanHeader,
    CrmKanbanKanbanBoard,
  },
  setup() {
    const notificationStore = useNotificationStore();
    const dealStore = useDealStore();
    const taskStore = useTaskStore();
    const { t } = useI18n();
    const fullCalendarRef = ref(null);
    const currentView = ref("dayGridDay");
    const calendarTitle = ref("");
    const today_date = new Date().toISOString().split("T")[0];
    const stages = ref([]);
    const calendarEvents = computed(() => taskStore.calendar_tasks);
    const selectedDeal = ref(null);
    const logs = ref([]);
    const comments = ref([]);
    const packages = ref([]);
    const searching = ref(false);
    const searchVal = ref("");
    const setting_store = useSettingStore();
    const toggleEMRCalendarDrawer = () => {
      setting_store.toggleEmrCalendarDrawer();
    };
    const kanbanSizeAdjust = computed(() => {
      return setting_store.getIsEmrCalendarDrawerOpen ? "w-50" : "w-100";
    });
    const task_status_change_trigger = computed(
      () => taskStore.getStatusChangeTrigger
    );
    const deal_scroll_status = computed(() => dealStore.getDealScrollStatus);
    watch(task_status_change_trigger, () => {
      if (task_status_change_trigger.value) {
        fetchStages();
        taskStore.toggleStatusChangeTrigger();
      }
    });
    watch(deal_scroll_status, (newStatus) => {
      if (newStatus) {
        const draggables = document.querySelectorAll(
          ".deal-card-calendar:not(.draggable-initialized)"
        );
        draggables.forEach((el) => {
          new Draggable(el, {
            itemSelector: ".deal-card-calendar",
            eventData: function (eventEl) {
              try {
                return JSON.parse(eventEl.dataset.ticket);
              } catch {
                return { title: eventEl.innerText };
              }
            },
          });
          el.classList.add("draggable-initialized");
        });
        dealStore.toggleDealScrollStatus();
      }
    });
    const goToToday = () => {
      fullCalendarRef.value.getApi().today();
      calendarTitle.value = formatCalendarTitle(
        fullCalendarRef.value.getApi().view.title
      );
    };
    const goToPrev = () => {
      fullCalendarRef.value.getApi().prev();
      calendarTitle.value = formatCalendarTitle(
        fullCalendarRef.value.getApi().view.title
      );
    };
    const goToNext = () => {
      fullCalendarRef.value.getApi().next();
      calendarTitle.value = formatCalendarTitle(
        fullCalendarRef.value.getApi().view.title
      );
    };
    const changeCalendarView = () => {
      taskStore.setDayGridMode(currentView.value);
      fullCalendarRef.value.getApi().changeView(currentView.value);
      fullCalendarRef.value.getApi().refetchEvents();
    };
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
    const selected_conversation = ref(null);
    const new_message = ref(null);
    const update_message = ref(null);
    const applyFilters = async (newFilters) => {
      try {
        filters.value = { ...newFilters };
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
        created_at_start: "",
        created_at_end: "",
        updated_at_start: "",
        updated_at_end: "",
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
    const openWhatsappModal = (conversation) => {
      selected_conversation.value = conversation;
    };
    const receiveWhatsappMessage = (message) => {
      new_message.value = message;
    };
    const updateWhatsappMessage = (data) => {
      update_message.value = data;
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
    function formatCalendarTitle(title) {
      const yearMatch = title.match(/\d{4}/);
      let year = yearMatch ? yearMatch[0] : "";
      const numMatch = title.match(/\d{1,2}/);
      let month = numMatch ? numMatch[0] : "";
      const months = {
        يناير: "01",
        فبراير: "02",
        مارس: "03",
        أبريل: "04",
        مايو: "05",
        يونيو: "06",
        يوليو: "07",
        أغسطس: "08",
        سبتمبر: "09",
        أكتوبر: "10",
        نوفمبر: "11",
        ديسمبر: "12",
        January: "01",
        February: "02",
        March: "03",
        April: "04",
        May: "05",
        June: "06",
        July: "07",
        August: "08",
        September: "09",
        October: "10",
        November: "11",
        December: "12",
      };
      let monthText = Object.keys(months).find((m) => title.includes(m));
      if (monthText) month = months[monthText];
      if (month.length === 1) month = "0" + month;
      if (month && year) return ` ${year} - ${month}`;
      return title;
    }
    const handleSearch = async (searchText) => {
      searchVal.value = searchText || "";
      await fetchStages({ search: searchText });
    };
    const fetchStages = async (searchText) => {
      try {
        searching.value = true;
        const response = await getEmrKanban(searchText);
        if (response.status == 200) {
          stages.value = response.data.data;
          nextTick(() => {
            const draggables = document.querySelectorAll(
              ".deal-card-calendar:not(.draggable-initialized)"
            );
            draggables.forEach((el) => {
              new Draggable(el, {
                itemSelector: ".deal-card-calendar",
                eventData: function (eventEl) {
                  try {
                    return JSON.parse(eventEl.dataset.ticket);
                  } catch {
                    return { title: eventEl.innerText };
                  }
                },
              });
              el.classList.add("draggable-initialized");
            });
          });
        }
      } catch (error) {
        console.error("Error fetching stages:", error);
      }
    };
    watch(
      () => dealStore.getDealFetchIndicator,
      (is_true) => {
        if (is_true) {
          fetchStages();
          dealStore.toggleFetchStagesIndicator();
        }
      }
    );
    onMounted(async () => {
      taskStore.setDayGridMode(currentView.value);
      await fetchStages();
      window.addEventListener("contextmenu", handleRightClick);
    });
    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });
    return {
      kanbanSizeAdjust,
      toggleEMRCalendarDrawer,
      stages,
      filters,
      applyFilters,
      resetFilter,
      openWhatsappModal,
      receiveWhatsappMessage,
      updateWhatsappMessage,
      handleSearch,
      changeDealStage,
      selected_conversation,
      new_message,
      update_message,
      fullCalendarRef,
      currentView,
      calendarTitle,
      goToToday,
      goToPrev,
      goToNext,
      changeCalendarView,
      selectedDeal,
      logs,
      comments,
      packages,
      calendarEvents,
      today_date,
      searching,
      searchVal,
    };
  },
};
</script>

<style scoped>
.calendar-container {
  background: #f7f7f7;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  min-height: 85vh;
  margin-top: 10px;
  height: calc(100vh - 125px);
  display: flex;
  flex-direction: column;
}
:deep(.fc) {
  background: #f7f7f7;
  font-family: "Cairo", Arial, sans-serif;
  font-size: 1.13rem;
  color: #212529;
}
:deep(.fc-toolbar-title),
:deep(.calendar-toolbar-title span) {
  color: #212529;
  font-size: 1.45rem;
  letter-spacing: 0.5px;
  border-bottom: none !important;
}
:deep(.fc-daygrid-day-number) {
  color: #212529;
  font-size: 12px;
  border-bottom: none !important;
  font-weight: 300;
}
:deep(.fc-daygrid-day.fc-day-today) .fc-daygrid-day-number {
  color: #1976d2 !important;
  font-weight: 700 !important;
}
:deep(.fc-daygrid-event) {
  /* background: #da1b2fd5 !important;
  border: none !important; */
  /* color: #fff !important; */
  border-radius: 7px !important;
  font-size: 14px;
  padding: 4px 12px;
  margin-bottom: 2px;
  text-align: center;
}
:deep(.fc-daygrid-day) {
  background: #f7f7f7;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}
:deep(.fc-daygrid-day.fc-day-today) {
  background: #e3f2fd;
  border: 2px solid #212529;
}
:deep(.fc-scrollgrid) {
  background: #f7f7f7;
  border-radius: 12px;
  overflow: hidden;
}
:deep(.fc-col-header-cell) {
  background: #f7f7f7;
  font-size: 1.13rem;
  font-weight: 400;
}
:deep(.fc-col-header-cell) a {
  text-decoration: none !important;
  color: #000 !important;
  font-weight: 400 !important;
}
:deep(.fc-daygrid-day-top) {
  border-bottom: none !important;
}
:deep(.fc-daygrid-day-frame) {
  min-height: 90px;
}
.calendar-toolbar-title {
  font-size: 1.45rem;
  color: #212529;
  letter-spacing: 0.5px;
}
.calendar-toolbar-controls .btn,
.calendar-toolbar-controls .form-select {
  font-size: 1.08rem;
  min-width: 80px;
}
.spin-icon {
  animation: spin 1s linear infinite;
  display: inline-block; /* ensures rotation behaves properly */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
<style>
.selected-for-deletion {
  background-color: #fc0909 !important;
  border-color: #722525 !important;
}
</style>
