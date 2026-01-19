<template>
  <div class="calendar-container p-2 bg-white rounded shadow-sm">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div class="calendar-toolbar-title">
        <button class="btn btn-link-dark fs-6" @click="toggleEMRCalendarDrawer">
          <i class="fa fa-xmark"></i>
        </button>
        <span>{{ today_date }}</span>
      </div>
      <div class="calendar-toolbar-controls d-flex align-items-center gap-2">
        <div v-if="deletable">
          <button
            class="btn btn-outline-danger px-0 py-1 me-2 fs-6"
            @click="delete_mode = !delete_mode"
            v-show="!delete_mode"
          >
            <i class="fa fa-trash"></i>
          </button>
          <button
            class="btn btn-outline-primary px-0 py-1 me-2 fs-6"
            @click="handleCancelDeleteSelectedTasks"
            v-show="delete_mode && !delete_mode_loading"
          >
            <i class="fa fa-times"></i>
          </button>
          <button
            class="btn btn-danger px-0 py-1 me-2 fs-6"
            @click="handleDeleteSelectedTasks"
            v-show="delete_mode && !delete_mode_loading"
          >
            <i class="fa fa-check"></i>
          </button>
          <button
            class="btn btn-danger px-0 py-1 me-2 fs-6"
            v-show="delete_mode_loading"
            disabled
          >
            <i class="fa fa-spinner spin-icon"></i>
          </button>
        </div>
        <button
          class="btn btn-primary text-white px-0 py-1 fs-6"
          @click="goToNext"
        >
          <i class="fa fa-chevron-left"></i>
        </button>
        <button
          class="btn btn-primary text-white px-0 py-1 fs-6"
          @click="goToPrev"
        >
          <i class="fa fa-chevron-right"></i>
        </button>
        <button class="btn btn-primary px-0 py-1 fs-6" @click="goToToday">
          {{ $t("emr-calendar-go-to-today") }}
        </button>
        <select
          v-model="currentView"
          class="form-select form-select-sm ms-2"
          style="width: 120px"
          @change="changeCalendarView"
        >
          <option value="dayGridMonth">
            {{ $t("emr-calendar-view-type-month") }}
          </option>
          <option value="dayGridWeek">
            {{ $t("emr-calendar-view-type-week") }}
          </option>
          <option value="dayGridDay">
            {{ $t("emr-calendar-view-type-day") }}
          </option>
        </select>
      </div>
    </div>
    <FullCalendar ref="fullCalendarRef" :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <span class="align-middle">{{ arg.event.title }}</span>
        <button
          v-show="
            currentView === 'dayGridDay' &&
            permissionStore.hasPermission(permissions.UPDATE_EMR_TASK)
          "
          class="btn btn-success btn-sm ms-3"
          @click.stop="
            handleCalendarTaskStatusChange(arg.event.id, 'completed')
          "
          :title="$t('emr-calendar-item-button-tooltip-complete')"
        >
          <i class="fa fa-check"></i>
        </button>
        <button
          v-show="
            currentView === 'dayGridDay' &&
            permissionStore.hasPermission(permissions.UPDATE_EMR_TASK) &&
            !arg.event.extendedProps.is_processing
          "
          class="btn btn-warning btn-sm ms-2"
          @click.stop="handleCalendarTaskStatusChange(arg.event.id, null, true)"
          :title="$t('emr-calendar-item-button-tooltip-processing')"
        >
          <i class="fa fa-spinner"></i>
        </button>
        <button
          v-show="
            currentView === 'dayGridDay' &&
            permissionStore.hasPermission(permissions.UPDATE_EMR_TASK)
          "
          class="btn btn-danger btn-sm ms-2"
          @click.stop="
            handleCalendarTaskStatusChange(arg.event.id, 'cancelled')
          "
          :title="$t('emr-calendar-item-button-tooltip-cancel')"
        >
          <i class="fa fa-times"></i>
        </button>
      </template>
    </FullCalendar>
  </div>
</template>
<script>
import { useSettingStore } from "@/stores/SettingStore";
import { ref, computed, nextTick, watch, onMounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTaskStore } from "@/stores/TaskStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { createTask } from "@/plugins/services/taskService";
import { useDealStore } from "@/stores/DealStore";
import { usePermissionStore, PERMISSIONS } from "@/stores/PermissionStore";

export default {
  name: "CustomFullCalendarComp",
  components: {
    FullCalendar,
  },
  setup() {
    const settingStore = useSettingStore();
    const taskStore = useTaskStore();
    const notificationStore = useNotificationStore();
    const dealStore = useDealStore();
    const permissionStore = usePermissionStore();
    const permissions = PERMISSIONS;
    const fullCalendarRef = ref(null);
    const currentView = ref("dayGridDay");
    const delete_mode = ref(false);
    const delete_mode_loading = ref(false);
    const today_date = new Date().toISOString().split("T")[0];
    const selectedTasks = ref([]);
    const deletable = computed(() =>
      permissionStore.hasPermission(PERMISSIONS.DELETE_EMR_TASK)
    );
    const getEventClass = (arg) => {
      if (delete_mode.value && selectedTasks.value.includes(arg.event.id)) {
        return ["selected-for-deletion"];
      }
      return [];
    };
    const calendarEvents = computed(() => taskStore.calendar_tasks);
    const calendarOptions = ref({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: currentView.value,
      locale: localStorage.getItem("locale") || "ar",
      editable: permissionStore.hasPermission(PERMISSIONS.UPDATE_EMR_TASK),
      droppable: true,
      events(fetchInfo, successCallback, failureCallback) {
        taskStore
          .fetchCalendarTasksByDate(fetchInfo.startStr, fetchInfo.endStr)
          .then(() => {
            successCallback(taskStore.getCalendarTasks);
          })
          .catch(() => {
            failureCallback();
          });
      },
      dropAccept: ".deal-card-calendar",
      eventReceive: (info) => {
        info.revert();
        let ticketData;
        try {
          ticketData = JSON.parse(info.draggedEl.dataset.ticket);
        } catch {
          ticketData = { name: info.event.title };
        }
        handleAddTask(ticketData.id, info.event.startStr);
        dealStore.toggleFetchStagesIndicator(true);
      },
      eventDrop: async (info) => {
        const idx = calendarEvents.value.findIndex(
          (e) => e.id == info.event.id
        );
        if (idx !== -1) {
          calendarEvents.value[idx].start = info.event.startStr;
        }
        const response = await taskStore.updateTask(
          info.event.id,
          info.event.startStr
        );
        if (response.success) {
          notificationStore.success(response.message);
        } else {
          console.error(response.message);
          notificationStore.error(response.message);
          info.revert();
        }
      },
      eventClick: async (info) => {
        if (permissionStore.hasPermission(PERMISSIONS.READ_EMR_TASK)) {
          if (delete_mode.value) {
            const el = info.el;
            if (selectedTasks.value.includes(info.event.id)) {
              selectedTasks.value = selectedTasks.value.filter(
                (id) => id !== info.event.id
              );
              el.classList.remove("selected-for-deletion");
            } else {
              selectedTasks.value.push(info.event.id);
              el.classList.add("selected-for-deletion");
            }
          } else {
            const ticketId = info.event.extendedProps.ticketId;
            if (ticketId) {
              dealStore.changeCurrentDeal(ticketId);
              dealStore.toggleDealModalStatus(true);
            } else {
              notificationStore.error("Task has no deal");
            }
          }
        }
      },
      headerToolbar: false,
      width: "100%",
      height: "100%",
      eventBackgroundColor: "#2d2e2e",
      eventBorderColor: "#2d2e2e",
      eventClassNames: getEventClass,
      dayMaxEventRows: 3,
      fixedWeekCount: false,
      dayHeaderClassNames: "calendar-day-header",
      dayCellClassNames: "calendar-day-cell",
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
          dayHeaderFormat: {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        },
      },
    });

    const goToNext = () => {
      const calendarApi = fullCalendarRef.value.getApi();
      calendarApi.next();
    };

    const goToPrev = () => {
      const calendarApi = fullCalendarRef.value.getApi();
      calendarApi.prev();
    };

    const goToToday = () => {
      const calendarApi = fullCalendarRef.value.getApi();
      calendarApi.changeView(currentView.value);
      calendarApi.today();
    };

    const changeCalendarView = () => {
      taskStore.setDayGridMode(currentView.value);
      const calendarApi = fullCalendarRef.value.getApi();
      calendarApi.changeView(currentView.value);
      calendarApi.refetchEvents();
    };

    const toggleEMRCalendarDrawer = () => {
      settingStore.toggleEmrCalendarDrawer();
    };

    const handleDeleteSelectedTasks = async () => {
      delete_mode_loading.value = true;
      if (selectedTasks.value.length === 0) {
        notificationStore.error("No tasks selected for deletion");
      } else {
        const response = await taskStore.bulkDeleteTasks(selectedTasks.value);
        if (response.success) {
          fullCalendarRef.value.getApi().refetchEvents();
          dealStore.toggleFetchStagesIndicator(true);
          notificationStore.success(response.message);
          selectedTasks.value = [];
          delete_mode.value = false;
        } else {
          notificationStore.error(response.message);
        }
      }
      delete_mode_loading.value = false;
    };
    const handleCancelDeleteSelectedTasks = () => {
      delete_mode.value = false;
      selectedTasks.value = [];
      nextTick(() => {
        document.querySelectorAll(".selected-for-deletion").forEach((el) => {
          el.classList.remove("selected-for-deletion");
        });
      });
    };

    const handleAddTask = async (deal_id, date) => {
      try {
        const formData = {
          description: "Appointment",
          duedate: date,
          duetime: null,
          deal_id: deal_id,
          type: "hospital",
        };
        const response = await createTask(formData);
        if (response.status === 200 || response.status === 201) {
          fullCalendarRef.value.getApi().refetchEvents();
          notificationStore.success(response.data.message, {
            timeout: 3000,
          });
        } else {
          notificationStore.error(response.data.message, {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error adding task:", error);
        notificationStore.error(error.message, {
          timeout: 3000,
        });
      }
    };
    const task_status_change_trigger = computed(
      () => taskStore.getStatusChangeTrigger
    );
    const handleCalendarTaskStatusChange = async (
      task_id,
      status,
      is_processing
    ) => {
      try {
        const response = await taskStore.updateTask(
          task_id,
          null,
          null,
          null,
          status,
          is_processing
        );
        if (response.success) {
          fullCalendarRef.value.getApi().refetchEvents();
          notificationStore.success(response.message);
        } else {
          notificationStore.error(response.message);
        }
      } catch (error) {
        console.error("Error completing task:", error);
        notificationStore.error("An error occurred while completing the task.");
      }
    };

    watch(
      () => settingStore.getIsEmrCalendarDrawerOpen,
      (is_open) => {
        if (is_open) {
          nextTick(() => {
            fullCalendarRef.value.getApi().render();
          });
        }
      }
    );
    watch(task_status_change_trigger, () => {
      if (task_status_change_trigger.value) {
        fullCalendarRef.value.getApi().refetchEvents();
      }
    });

    onMounted(() => {
      taskStore.setDayGridMode(currentView.value);
    });

    return {
      deletable,
      permissionStore,
      permissions,
      calendarOptions,
      fullCalendarRef,
      currentView,
      goToNext,
      goToPrev,
      goToToday,
      changeCalendarView,
      today_date,
      delete_mode,
      delete_mode_loading,
      toggleEMRCalendarDrawer,
      handleCancelDeleteSelectedTasks,
      handleDeleteSelectedTasks,
      handleCalendarTaskStatusChange,
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
