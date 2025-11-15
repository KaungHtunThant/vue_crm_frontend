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
    />
  </div>
  <div class="row g-0 align-items-start">
    <div style="width: 49%">
      <crm-kanban-kanban-board
        :stages="stages"
        :draggable="true"
        defaultColor="#333"
        :show-calendar-drag="true"
        @open-whatsapp-modal="openWhatsappModal"
        @receive-whatsapp-message="receiveWhatsappMessage"
        @update-whatsapp-message="updateWhatsappMessage"
        @change-deal-stage="changeDealStage"
      />
    </div>
    <div style="width: 51%" class="mt-1">
      <div class="calendar-container p-2 bg-white rounded shadow-sm">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="calendar-toolbar-title">
            <span>{{ calendarTitle }}</span>
          </div>
          <div
            class="calendar-toolbar-controls d-flex align-items-center gap-2"
          >
            <button
              class="btn btn-primary text-white px-0 py-1"
              style="background-color: #515151; font-size: 16px"
              @click="goToNext"
            >
              <i class="fa fa-chevron-left"></i>
            </button>
            <button
              class="btn btn-primary text-white px-0 py-1"
              style="background-color: #515151; font-size: 16px"
              @click="goToPrev"
            >
              <i class="fa fa-chevron-right"></i>
            </button>
            <button
              class="btn btn-primary px-0 py-1"
              style="font-size: 16px"
              @click="goToToday"
            >
              اليوم
            </button>
            <select
              v-model="currentView"
              class="form-select form-select-sm ms-2"
              style="width: 120px"
              @change="changeCalendarView"
            >
              <option value="dayGridMonth">شهر</option>
              <option value="dayGridWeek">أسبوع</option>
              <option value="dayGridDay">يوم</option>
            </select>
          </div>
        </div>
        <FullCalendar ref="fullCalendarRef" :options="calendarOptions" />
      </div>
    </div>
  </div>
  <deal-data-card
    v-if="selectedDeal"
    :key="selectedDeal.id"
    :deal="selectedDeal"
    :logs="logs"
    :comments="comments"
    :tasks="tasks"
    :packages="packages"
    :stages="stages"
    :currentStageId="selectedDeal.stage_id"
    @close="selectedDeal = null"
  />
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import CrmKanbanHeader from "@/components/headers/CrmDealKanbanTopHeader.vue";
import CrmKanbanKanbanBoard from "@/components/kanban/CrmDealKanbanBoardDeals.vue";
// import { useToast } from "vue-toastification";
// import {
//   showSuccess,
//   showError,
//   showInfo,
// } from "@/plugins/services/toastService";
import { useNotificationStore } from "@/stores/notificationStore";
import { useI18n } from "vue-i18n";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import DealDataCard from "@/components/modals/CrmDealKanbanDealDataModal.vue";
import { Modal } from "bootstrap";
import { showDeal } from "@/plugins/services/dealService";

export default {
  name: "EmrDealKanbanView",
  components: {
    CrmKanbanHeader,
    CrmKanbanKanbanBoard,
    FullCalendar,
    DealDataCard,
  },
  setup() {
    const notificationStore = useNotificationStore();
    // const toast = useToast();
    const { t } = useI18n();
    const fullCalendarRef = ref(null);
    const currentView = ref("dayGridMonth");
    const calendarTitle = ref("");
    const stages = ref([]);
    const calendarEvents = ref([]);
    const selectedDeal = ref(null);
    const logs = ref([]);
    const comments = ref([]);
    const tasks = ref([]);
    const packages = ref([]);
    const calendarOptions = ref({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: currentView.value,
      locale: localStorage.getItem("locale") || "ar",
      editable: true,
      droppable: true,
      events: calendarEvents.value,
      dropAccept: ".deal-card-calendar",
      eventReceive: (info) => {
        let ticketData;
        try {
          ticketData = JSON.parse(info.draggedEl.dataset.ticket);
        } catch {
          ticketData = { name: info.event.title };
        }
        const newEvent = {
          id: String(Date.now()),
          title: ticketData.name,
          start: info.event.startStr,
          extendedProps: {
            ticketId: ticketData.id,
          },
        };
        calendarEvents.value.push(newEvent);
        notificationStore.success("تمت إضافة الموعد للتقويم");
      },
      eventDrop: (info) => {
        const idx = calendarEvents.value.findIndex(
          (e) => e.id == info.event.id
        );
        if (idx !== -1) {
          calendarEvents.value[idx].start = info.event.startStr;
        }
        notificationStore.info("تم تغيير موعد المريض");
      },
      eventClick: async (info) => {
        const ticketId = info.event.extendedProps.ticketId;
        if (ticketId) {
          await openDealDataCard(ticketId);
        } else {
          notificationStore.error(
            "لم يتم العثور على رقم التذكرة لفتح بياناتها"
          );
        }
      },
      headerToolbar: false,
      height: "calc(100vh - 150px)",
      eventBackgroundColor: "#dc3545",
      eventBorderColor: "#dc3545",
      eventTextColor: "#fff",
      dayMaxEventRows: 3,
      fixedWeekCount: false,
      dayHeaderClassNames: "calendar-day-header",
      dayCellClassNames: "calendar-day-cell",
      datesSet: (arg) => {
        calendarTitle.value = formatCalendarTitle(arg.view.title);
      },
      viewDidMount: (arg) => {
        nextTick(() => {
          calendarTitle.value = formatCalendarTitle(arg.view.title);
        });
      },
      views: {
        dayGridMonth: {
          dayMaxEventRows: 3,
        },
        dayGridWeek: {
          dayMaxEventRows: false,
          dayMaxEvents: false,
          eventMaxStack: 10,
        },
        dayGridDay: {
          dayMaxEventRows: false,
          dayMaxEvents: false,
          eventMaxStack: 10,
        },
      },
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
      fullCalendarRef.value.getApi().changeView(currentView.value);
      calendarTitle.value = formatCalendarTitle(
        fullCalendarRef.value.getApi().view.title
      );
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
    const HandleSearch = async () => {};
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
    const openDealDataCard = async (dealId) => {
      try {
        const dealData = await showDeal(dealId);
        if (dealData.data && dealData.data.data) {
          selectedDeal.value = null;
          await nextTick();
          selectedDeal.value = dealData.data.data;
          await nextTick();
          const modalEl = document.getElementById("dealDataCard");
          if (modalEl) {
            const modal = new Modal(modalEl);
            modal.show();
          }
        } else {
          console.error("No matching deal found for ID:", dealId);
        }
      } catch (error) {
        console.error("Error fetching deal data:", error);
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
    onMounted(() => {
      window.addEventListener("contextmenu", handleRightClick);
      nextTick(() => {
        const draggables = document.querySelectorAll(".deal-card-calendar");
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
        });
      });
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
      receiveWhatsappMessage,
      updateWhatsappMessage,
      HandleSearch,
      changeDealStage,
      selected_conversation,
      new_message,
      update_message,
      calendarOptions,
      fullCalendarRef,
      currentView,
      calendarTitle,
      goToToday,
      goToPrev,
      goToNext,
      changeCalendarView,
      openDealDataCard,
      selectedDeal,
      logs,
      comments,
      tasks,
      packages,
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
  background: #da1b2fd5 !important;
  border: none !important;
  color: #fff !important;
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
</style>
