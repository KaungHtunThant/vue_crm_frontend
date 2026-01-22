<template>
  <div class="d-flex">
    <div
      class="btn btn-header px-0 px-lg-2 d-flex align-items-center rounded-0 rounded-start"
      style="padding-top: 0.4rem; padding-bottom: 0.4rem"
      v-if="
        permissionStore.hasPermission(PERMISSIONS.READ_UNASSIGN_SOON_TASK_STAGE)
      "
    >
      <span class="badge bg-secondary-subtle text-secondary fw-bold fs-6">{{
        computed_unassign_count
      }}</span>
      <span class="ms-2 text-white">{{
        $t("kanban-task-status-unassign")
      }}</span>
    </div>
    <div
      class="btn btn-header px-0 px-lg-2 d-flex align-items-center rounded-0"
      style="padding-top: 0.4rem; padding-bottom: 0.4rem"
      v-if="permissionStore.hasPermission(PERMISSIONS.READ_OVERDUE_TASK_STAGE)"
    >
      <span class="badge bg-secondary-subtle text-danger fw-bold fs-6">{{
        computed_overdue_count
      }}</span>
      <span class="ms-2 text-white">{{
        $t("kanban-task-status-overdue")
      }}</span>
    </div>
    <div
      class="btn btn-header px-0 px-lg-2 d-flex align-items-center rounded-0 rounded-start"
      style="padding-top: 0.4rem; padding-bottom: 0.4rem"
      v-else-if="
        permissionStore.hasPermission(PERMISSIONS.READ_CHECKING_OUT_TASK_STAGE)
      "
    >
      <span
        class="badge bg-secondary-subtle text-danger fw-bold fs-6 rounded-0 rounded-start"
        >{{ computed_checking_out_count }}</span
      >
      <span class="ms-2 text-white">{{
        $t("kanban-task-status-checking-out")
      }}</span>
    </div>
    <div
      class="btn btn-header px-0 px-lg-2 d-flex align-items-center"
      style="padding-top: 0.4rem; padding-bottom: 0.4rem"
      v-else-if="
        permissionStore.hasPermission(
          PERMISSIONS.READ_OVERDUE_AFTER_SALES_TASK_STAGE
        )
      "
    >
      <span class="badge bg-secondary-subtle text-danger fw-bold fs-6">{{
        computed_overdue_after_sales_count
      }}</span>
      <span class="ms-2 text-white">{{
        $t("kanban-task-status-overdue")
      }}</span>
    </div>
    <div
      class="btn btn-header px-0 px-lg-2 d-flex align-items-center rounded-0"
      style="padding-top: 0.4rem; padding-bottom: 0.4rem"
    >
      <span class="badge bg-secondary-subtle text-warning fw-bold fs-6">{{
        computed_today_count
      }}</span>
      <span class="ms-2 text-white">{{ $t("kanban-task-status-today") }}</span>
    </div>
    <div
      class="btn btn-header px-0 px-lg-2 d-flex align-items-center rounded-0 rounded-end"
      style="padding-top: 0.4rem; padding-bottom: 0.4rem"
    >
      <span class="badge bg-secondary-subtle text-info fw-bold fs-6">
        {{ computed_tomorrow_count }}
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
    const computed_unassign_count = computed(() =>
      taskStore.getUnassignCount > 99 ? "99+" : taskStore.getUnassignCount
    );
    const computed_overdue_count = computed(() =>
      taskStore.getOverdueCount > 99 ? "99+" : taskStore.getOverdueCount
    );
    const computed_checking_out_count = computed(() =>
      taskStore.getCheckingOutCount > 99 ? "99+" : taskStore.getCheckingOutCount
    );
    const computed_overdue_after_sales_count = computed(() =>
      taskStore.getOverdueAfterSalesCount > 99
        ? "99+"
        : taskStore.getOverdueAfterSalesCount
    );
    const computed_today_count = computed(() =>
      taskStore.getTodayCount > 99 ? "99+" : taskStore.getTodayCount
    );
    const computed_tomorrow_count = computed(() =>
      taskStore.getTomorrowCount > 99 ? "99+" : taskStore.getTomorrowCount
    );
    onMounted(() => {
      taskStore.fetchTaskCounts();
    });
    return {
      permissionStore,
      PERMISSIONS,
      computed_unassign_count,
      computed_overdue_count,
      computed_checking_out_count,
      computed_overdue_after_sales_count,
      computed_today_count,
      computed_tomorrow_count,
    };
  },
};
</script>
<style scoped>
.btn-header {
  background-color: #55555551;
}
</style>
