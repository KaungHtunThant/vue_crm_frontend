<template>
  <div class="d-flex align-items-center">
    <div
      class="bg-custom d-flex align-items-center rounded-0 rounded-start p-1-5"
      v-if="
        permissionStore.hasPermission(PERMISSIONS.READ_UNASSIGN_SOON_TASK_STAGE)
      "
    >
      <span
        class="badge bg-secondary-subtle text-secondary fw-bold fs-6 py-1 px-2"
        >{{ unassign_count }}</span
      >
      <span class="ms-2 text-white">{{
        $t("kanban-task-status-unassign")
      }}</span>
    </div>
    <div
      class="bg-custom d-flex align-items-center rounded-0 p-1-5"
      v-if="permissionStore.hasPermission(PERMISSIONS.READ_OVERDUE_TASK_STAGE)"
    >
      <span
        class="badge bg-secondary-subtle text-danger fw-bold fs-6 py-1 px-2"
        >{{ overdue_count }}</span
      >
      <span class="ms-2 text-white">{{
        $t("kanban-task-status-overdue")
      }}</span>
    </div>
    <div
      class="bg-custom d-flex align-items-center rounded-0 rounded-start p-1-5"
      v-else-if="
        permissionStore.hasPermission(PERMISSIONS.READ_CHECKING_OUT_TASK_STAGE)
      "
    >
      <span
        class="badge bg-secondary-subtle text-danger fw-bold fs-6 rounded-0 rounded-start py-1 px-2"
        >{{ checking_out_count }}</span
      >
      <span class="ms-2 text-white">{{
        $t("kanban-task-status-checking-out")
      }}</span>
    </div>
    <div
      class="bg-custom d-flex align-items-center rounded-0 p-1-5"
      v-else-if="
        permissionStore.hasPermission(
          PERMISSIONS.READ_OVERDUE_AFTER_SALES_TASK_STAGE
        )
      "
    >
      <span
        class="badge bg-secondary-subtle text-danger fw-bold fs-6 py-1 px-2"
        >{{ overdue_after_sales_count }}</span
      >
      <span class="ms-2 text-white">{{
        $t("kanban-task-status-overdue")
      }}</span>
    </div>
    <div class="bg-custom d-flex align-items-center rounded-0 p-1-5">
      <span
        class="badge bg-secondary-subtle text-warning fw-bold fs-6 py-1 px-2"
        >{{ today_count }}</span
      >
      <span class="ms-2 text-white">{{ $t("kanban-task-status-today") }}</span>
    </div>
    <div
      class="bg-custom d-flex align-items-center rounded-0 rounded-end p-1-5"
    >
      <span class="badge bg-secondary-subtle text-info fw-bold fs-6 py-1 px-2">
        {{ tomorrow_count }}
      </span>
      <span class="ms-2 text-white">{{
        $t("kanban-task-status-tomorrow")
      }}</span>
    </div>
  </div>
</template>
<script>
import { computed, onMounted } from "vue";
import { useTaskStore } from "@/stores/TaskStore";
import { usePermissionStore, PERMISSIONS } from "@/stores/PermissionStore";

export default {
  name: "TaskCounterComp",
  setup() {
    const taskStore = useTaskStore();
    const permissionStore = usePermissionStore();
    const unassign_count = computed(() =>
      taskStore.getUnassignCount > 99 ? "99+" : taskStore.getUnassignCount
    );
    const overdue_count = computed(() =>
      taskStore.getOverdueCount > 99 ? "99+" : taskStore.getOverdueCount
    );
    const checking_out_count = computed(() =>
      taskStore.getCheckingOutCount > 99 ? "99+" : taskStore.getCheckingOutCount
    );
    const overdue_after_sales_count = computed(() =>
      taskStore.getOverdueAfterSalesCount > 99
        ? "99+"
        : taskStore.getOverdueAfterSalesCount
    );
    const today_count = computed(() =>
      taskStore.getTodayCount > 99 ? "99+" : taskStore.getTodayCount
    );
    const tomorrow_count = computed(() =>
      taskStore.getTomorrowCount > 99 ? "99+" : taskStore.getTomorrowCount
    );
    onMounted(() => {
      taskStore.fetchTaskCounts();
    });
    return {
      permissionStore,
      PERMISSIONS,
      unassign_count,
      overdue_count,
      checking_out_count,
      overdue_after_sales_count,
      today_count,
      tomorrow_count,
    };
  },
};
</script>
<style scoped>
.bg-custom {
  background-color: #55555551;
}
.p-1-5 {
  padding: 0.375rem 0.375rem;
}
</style>
