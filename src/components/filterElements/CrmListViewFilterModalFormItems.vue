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
                  selectedStatuses.includes(status.value)
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
                v-model="localFilters.source_id"
                class="form-select text-secondary"
              >
                <option :value="null" selected>
                  {{ t("crmlist-modal-filter-all") }}
                </option>
                <option
                  v-for="source in local_sources"
                  :key="source.id"
                  :value="source.id"
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
                v-model="localFilters.stage_id"
                class="form-select text-secondary"
              >
                <option :value="null" selected>
                  {{ t("crmlist-modal-filter-all") }}
                </option>
                <option
                  v-for="stage in local_stages"
                  :key="stage.id"
                  :value="stage.id"
                >
                  {{ stage.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- User Filter -->
        <div
          class="row"
          v-if="
            permissionStore.hasPermission(PERMISSIONS.FILTER_DEAL_WITH_USER)
          "
        >
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-user") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.user_id"
                class="form-select text-secondary"
              >
                <option :value="null" selected>
                  {{ t("crmlist-modal-filter-all") }}
                </option>
                <option
                  v-for="user in local_users"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }} ({{ user.origin }})
                </option>
              </select>
            </div>
          </div>
        </div>
        <div
          class="row"
          v-if="
            permissionStore.hasPermission(PERMISSIONS.FILTER_DEAL_WITH_USER)
          "
        >
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-excludeduser") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.excluded_user_id"
                class="form-select text-secondary"
              >
                <option :value="null" selected>
                  {{ t("crmlist-modal-filter-all") }}
                </option>
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
                v-model="localFilters.package"
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
        <div class="row">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-nationality") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.nationality"
                class="form-select text-secondary"
              >
                <option :value="null" selected>
                  {{ t("crmlist-modal-filter-label-all") }}
                </option>
                <option
                  v-for="nationality in nationalities"
                  :key="nationality"
                  :value="nationality"
                >
                  {{ nationality }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-country-code") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.country_code"
                class="form-select text-secondary"
              >
                <option :value="null" selected>
                  {{ t("crmlist-modal-filter-label-all") }}
                </option>
                <option
                  v-for="country_code in countries"
                  :key="country_code.code"
                  :value="country_code.code"
                >
                  {{ country_code.name }} (+{{ country_code.code }})
                </option>
              </select>
            </div>
          </div>
        </div>
        <!-- Origin -->
        <div class="row">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-origin") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.origin_id"
                class="form-select text-secondary"
              >
                <option :value="null" selected>
                  {{ t("crmlist-modal-filter-label-all") }}
                </option>
                <option
                  v-for="origin in origins"
                  :key="origin.id"
                  :value="origin.id"
                >
                  {{ origin.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Import Label -->
        <div class="row">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-import-label") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.import_label_id"
                class="form-select text-secondary"
              >
                <option :value="null" selected>
                  {{ t("crmlist-modal-filter-label-all") }}
                </option>
                <option
                  v-for="import_label in import_labels"
                  :key="import_label.id"
                  :value="import_label.id"
                >
                  {{ import_label.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <!-- Created Date Range -->
        <div class="row mb-3">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-created-at") }}</span>
          </div>
          <div class="col-9">
            <div class="row">
              <div class="col-6">
                <DatePicker
                  v-model="localFilters.created_date_start"
                  dateFormat="yy-mm-dd"
                  :showIcon="true"
                  class="w-100"
                  inputClass="form-control py-2 w-100"
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div class="col-6">
                <DatePicker
                  v-model="localFilters.created_date_end"
                  dateFormat="yy-mm-dd"
                  class="w-100"
                  :showIcon="true"
                  inputClass="form-control py-2 w-100"
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Modified Date Range -->
        <div class="row mb-3">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-updated-at") }}</span>
          </div>
          <div class="col-9">
            <div class="row">
              <div class="col-6">
                <DatePicker
                  v-model="localFilters.updated_date_start"
                  dateFormat="yy-mm-dd"
                  :showIcon="true"
                  class="w-100"
                  inputClass="form-control py-2 w-100"
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div class="col-6">
                <DatePicker
                  v-model="localFilters.updated_date_end"
                  dateFormat="yy-mm-dd"
                  class="w-100"
                  :showIcon="true"
                  inputClass="form-control py-2 w-100"
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sorting Section -->
        <div class="row mb-3">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-sort-by") }}</span>
          </div>
          <div class="col-9">
            <div class="d-flex gap-4">
              <select
                v-model="localFilters.sort_by"
                class="form-select text-secondary"
              >
                <option :value="null" selected>
                  {{ t("crmlist-modal-filter-none") }}
                </option>
                <option value="created_at">
                  {{ t("crmlist-modal-filter-sort-created-at") }}
                </option>
                <option value="updated_at">
                  {{ t("crmlist-modal-filter-sort-updated-at") }}
                </option>
                <option value="source_id">
                  {{ t("crmlist-modal-filter-sort-source") }}
                </option>
                <option value="stage_id">
                  {{ t("crmlist-modal-filter-sort-stage") }}
                </option>
              </select>
              <select
                v-model="localFilters.sort_order"
                class="form-select text-secondary"
              >
                <option :value="null" selected>
                  {{ t("crmlist-modal-filter-none") }}
                </option>
                <option value="desc">
                  {{ t("crmlist-modal-filter-sort-desc") }}
                </option>
                <option value="asc">
                  {{ t("crmlist-modal-filter-sort-asc") }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { usePermissionStore, PERMISSIONS } from "@/stores/PermissionStore";
import { useUserStore } from "@/stores/UserStore";
import { nationalities as nationalities_enum } from "@/enums/NationalitiesEnum";
import { countries as countries_enum } from "@/enums/CountriesEnum";
import DatePicker from "primevue/datepicker";
import { useOriginStore } from "@/stores/OriginStore";
import { useImportLabelStore } from "@/stores/ImportLabelStore";

export default {
  name: "CrmListViewFilterModalFormItems",
  components: { DatePicker },
  props: {
    filters: { type: Object, required: true },
    selectedStatuses: {
      type: Array,
      required: true,
    },
    stages: {
      type: Array,
      required: true,
      default: () => [],
    },
    sources: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ["update:filters", "update:selectedStatuses"],
  setup(props, { emit }) {
    const { t, locale } = useI18n();
    const localFilters = ref({
      source_id: null,
      stage_id: null,
      user_id: null,
      excluded_user_id: null,
      country_code: null,
      nationality: null,
      created_date_start: null,
      created_date_end: null,
      updated_date_start: null,
      updated_date_end: null,
      status: [],
      sort_by: "created_at",
      sort_order: "desc",
      origin_id: null,
      import_label_id: null,
      ...props.filters,
    });
    const local_stages = ref(props.stages);
    const local_sources = ref(props.sources);
    const userStore = useUserStore();
    const originStore = useOriginStore();
    const importLabelStore = useImportLabelStore();
    const origins = computed(() => originStore.getAllOrigins);
    const import_labels = computed(() => importLabelStore.getAll);
    const local_users = computed(() => userStore.getAllUsers);
    const local_packages = ref([]);
    const nationalities_options = nationalities_enum;
    const countries = countries_enum;

    const nationalities = computed(() => {
      return Object.fromEntries(
        Object.entries(nationalities_options).map(([key, value]) => [
          key,
          locale.value === "ar" ? value.ar : value.en,
        ])
      );
    });

    const statuses = ref([
      {
        value: "no_comments",
        label: t("kanban-modal-filter-status-nocomments"),
      },
      { value: "no_task", label: t("kanban-modal-filter-status-notasks") },
      { value: "overdue", label: t("kanban-modal-filter-status-overdue") },
      { value: "new", label: t("kanban-modal-filter-status-new") },
      {
        value: "admin_comments",
        label: t("kanban-modal-filter-status-admincomment"),
      },
    ]);

    const updateLocalFilters = (newFilters) => {
      if (newFilters) {
        Object.keys(localFilters.value).forEach((key) => {
          localFilters.value[key] = newFilters[key] ?? null;
        });
      }
    };

    const permissionStore = usePermissionStore();

    updateLocalFilters(props.filters);

    watch(
      () => props.filters,
      (newFilters) => {
        updateLocalFilters(newFilters);
      },
      { deep: true }
    );

    watch(
      () => props.selectedStatuses,
      (newStatuses) => {
        if (Array.isArray(newStatuses)) {
          localFilters.value.status = [...newStatuses];
        }
      }
    );

    const toggleStatus = (status) => {
      let newSelectedStatuses;
      if (props.selectedStatuses.includes(status)) {
        newSelectedStatuses = props.selectedStatuses.filter(
          (s) => s !== status
        );
      } else {
        newSelectedStatuses = [...props.selectedStatuses, status];
      }
      emit("update:selectedStatuses", newSelectedStatuses);
      localFilters.value.status = newSelectedStatuses;
      emit("update:filters", localFilters.value);
    };

    watch(
      () => localFilters.value,
      (newFilters) => {
        emit("update:filters", newFilters);
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
      () => props.packages,
      (newPackages) => {
        local_packages.value = newPackages;
      },
      { deep: true }
    );

    onMounted(() => {
      if (!userStore.getAllUsers.length) {
        userStore.fetchAllUsers();
      }
      if (!originStore.getAllOrigins.length) {
        originStore.fetchAllOrigins();
      }
      if (!importLabelStore.getAll.length) {
        importLabelStore.fetchAll();
      }
      if (permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)) {
        statuses.value.push({
          value: "unassigned",
          label: t("kanban-modal-filter-status-unassigned"),
        });
      }
    });

    return {
      countries,
      nationalities,
      localFilters,
      statuses,
      toggleStatus,
      t,
      local_users,
      local_packages,
      local_stages,
      local_sources,
      permissionStore,
      PERMISSIONS,
      origins,
      import_labels,
    };
  },
};
</script>

<style scoped>
span {
  font-size: 14px;
}
</style>
