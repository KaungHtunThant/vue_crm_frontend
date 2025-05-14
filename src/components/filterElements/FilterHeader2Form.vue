<template>
  <div class="modal-body">
    <div class="row">
      <div class="col-12">
        <!-- Status Filter -->
        <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-status") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3 d-flex justify-content-center flex-nowrap gap-2">
              <button
                v-for="status in statuses"
                :key="status.value"
                type="button"
                class="p-2"
                @click.prevent="toggleStatus(status.value)"
                :class="[
                  'btn',
                  headerSelectedStatuses.includes(status.value)
                    ? 'btn-dark'
                    : 'btn-outline-dark',
                ]"
                style="font-size: 14px"
              >
                {{ status.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Source Filter -->
        <div
          class="row"
          v-if="permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)"
        >
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-source") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localHeaderFilters.source_id"
                class="form-select text-secondary"
              >
                <option value="" selected>All</option>
                <option
                  v-for="source in local_sources"
                  :key="source.value"
                  :value="source.value"
                >
                  {{ source.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <!-- Stage Filter -->
        <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-stage") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localHeaderFilters.stage_id"
                class="form-select text-secondary"
              >
                <option value="1" selected>All</option>
                <option
                  v-for="stage in local_stages"
                  :key="stage.value"
                  :value="stage.value"
                >
                  {{ stage.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Supervisor Filter -->
        <div
          class="row"
          v-if="permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)"
        >
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-user") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localHeaderFilters.user_id"
                class="form-select text-secondary"
              >
                <option value="" selected>All</option>
                <option
                  v-for="user in local_users"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Package Filter -->
        <!-- <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-packages") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localHeaderFilters.package"
                class="form-select text-secondary"
              >
                <option
                  v-for="pkg in packages"
                  :key="pkg.value"
                  :value="pkg.value"
                >
                  {{ pkg.label }}
                </option>
              </select>
            </div>
          </div>
        </div> -->

        <!-- Created Date Range -->
        <div class="row mb-3">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-created-at") }}</span>
          </div>
          <div
            class="col-9 d-flex justify-content-center align-items-center gap-3"
          >
            <input
              type="date"
              class="form-control text-secondary"
              v-model="localHeaderFilters.created_at_start"
            />
            <input
              type="date"
              class="form-control text-secondary"
              v-model="localHeaderFilters.created_at_end"
            />
          </div>
        </div>

        <!-- Modified Date Range -->
        <div class="row mb-3">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-updated-at") }}</span>
          </div>
          <div
            class="col-9 d-flex justify-content-center align-items-center gap-3"
          >
            <input
              type="date"
              class="form-control text-secondary"
              v-model="localHeaderFilters.updated_at_start"
            />
            <input
              type="date"
              class="form-control text-secondary"
              v-model="localHeaderFilters.updated_at_end"
            />
          </div>
        </div>

        <!-- Sorting Section -->
        <div class="row mb-3">
          <div class="col-3">
            <span>Sort By</span>
          </div>
          <div class="col-9">
            <div class="d-flex gap-3">
              <select
                v-model="localHeaderFilters.sort_by"
                class="form-select text-secondary"
              >
                <option value="" selected>None</option>
                <option value="created_at">Created At</option>
                <option value="updated_at">Updated At</option>
                <option value="source_id">Source</option>
                <option value="stage_id">Stage</option>
              </select>
              <select
                v-model="localHeaderFilters.sort_order"
                class="form-select text-secondary"
              >
                <option value="" selected>None</option>
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { usePermissionStore, PERMISSIONS } from "@/stores/permissionStore";

export default {
  name: "FilterCrmListFormVue",
  props: {
    headerFilters: { type: Object, required: true },
    headerSelectedStatuses: { type: Array, required: true },
    stages: {
      type: Array,
      default: () => [],
    },
    sources: {
      type: Array,
      default: () => [],
    },
    users: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:headerFilters", "update:headerSelectedStatuses"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const localHeaderFilters = ref({
      source_id: null,
      stage_id: null,
      user_id: null,
      created_at_start: null,
      created_at_end: null,
      updated_at_start: null,
      updated_at_end: null,
      status: [],
      sort_by: "created_at",
      sort_order: "desc",
      ...props.headerFilters,
    });
    const local_stages = ref(props.stages);
    const local_sources = ref(props.sources);
    const local_users = ref([]);
    const local_packages = ref([]);

    const statuses = ref([
      { value: "no_comments", label: "No Comments" },
      { value: "no_task", label: "No Task" },
      { value: "overdue", label: "Overdue" },
      { value: "new", label: "New" },
    ]);

    const updateLocalFilters = (newFilters) => {
      if (newFilters) {
        Object.keys(localHeaderFilters.value).forEach((key) => {
          localHeaderFilters.value[key] = newFilters[key] ?? null;
        });
      }
    };

    const permissionStore = usePermissionStore();

    updateLocalFilters(props.headerFilters);

    watch(
      () => props.headerFilters,
      (newFilters) => {
        if (
          JSON.stringify(localHeaderFilters.value) !==
          JSON.stringify(newFilters)
        ) {
          Object.keys(localHeaderFilters.value).forEach((key) => {
            localHeaderFilters.value[key] = newFilters[key] ?? null;
          });
        }
      },
      { deep: true }
    );

    watch(
      () => props.headerSelectedStatuses,
      (newStatuses) => {
        if (Array.isArray(newStatuses)) {
          localHeaderFilters.value.status = [...newStatuses];
        }
      }
    );

    const toggleStatus = (status) => {
      let newSelectedStatuses;
      if (props.headerSelectedStatuses.includes(status)) {
        newSelectedStatuses = props.headerSelectedStatuses.filter(
          (s) => s !== status
        );
      } else {
        newSelectedStatuses = [...props.headerSelectedStatuses, status];
      }
      emit("update:headerSelectedStatuses", newSelectedStatuses);
      localHeaderFilters.value.status = newSelectedStatuses;
      emit("update:headerFilters", localHeaderFilters.value);
    };

    watch(
      () => localHeaderFilters.value,
      (newFilters) => {
        if (
          JSON.stringify(newFilters) !== JSON.stringify(props.headerFilters)
        ) {
          emit("update:headerFilters", newFilters);
        }
      },
      { deep: true }
    );

    watch(
      () => props.stages,
      (newStages) => {
        local_stages.value = newStages;
      },
      { deep: true }
    );

    watch(
      () => props.sources,
      (newSources) => {
        local_sources.value = newSources;
      },
      { deep: true }
    );

    watch(
      () => props.users,
      (newUsers) => {
        local_users.value = newUsers;
      },
      { deep: true }
    );

    watch(
      () => props.packages,
      (newPackages) => {
        local_packages.value = newPackages;
      },
      { deep: true }
    );

    onMounted(() => {
      if (permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)) {
        statuses.value.push({
          value: "unassigned",
          label: "Unassigned",
        });
        statuses.value.push({
          value: "reclaimed",
          label: "Reclaimed",
        });
      }
    });

    return {
      localHeaderFilters,
      statuses,
      toggleStatus,
      t,
      local_users,
      local_packages,
      local_stages,
      local_sources,
      permissionStore,
      PERMISSIONS,
    };
  },
};
</script>

<style scoped>
span {
  font-size: 14px;
}
</style>
