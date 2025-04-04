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
            <div class="mb-3 d-flex justify-content-center flex-wrap gap-2">
              <button
                v-for="status in statuses"
                :key="status.value"
                type="button"
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
        <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-source") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.source"
                class="form-select text-secondary"
              >
                <option
                  v-for="source in sources"
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
                v-model="localFilters.stage"
                class="form-select text-secondary"
              >
                <option
                  v-for="stage in stages"
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
        <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("modals.supervisor") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.supervisor"
                class="form-select text-secondary"
              >
                <option
                  v-for="supervisor in supervisors"
                  :key="supervisor.value"
                  :value="supervisor.value"
                >
                  {{ supervisor.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Representative Filter -->
        <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-representative") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.representative"
                class="form-select text-secondary"
              >
                <option
                  v-for="representative in representatives"
                  :key="representative.value"
                  :value="representative.value"
                >
                  {{ representative.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Package Filter -->
        <div class="row">
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
        </div>

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
              v-model="localFilters.createdStart"
            />
            <input
              type="date"
              class="form-control text-secondary"
              v-model="localFilters.createdEnd"
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
              v-model="localFilters.modifiedStart"
            />
            <input
              type="date"
              class="form-control text-secondary"
              v-model="localFilters.modifiedEnd"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { getStages, getSources } from "@/plugins/services/authService";

export default {
  name: "FilterCrmListFormVue",
  props: {
    filters: { type: Object, required: true },
    selectedStatuses: {
      type: Array,
      required: true,
    },
  },
  emits: ["update:filters", "update:selectedStatuses"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const localFilters = ref({
      source: "facebook",
      stage: "newDeal",
      supervisor: "any",
      representative: "any",
      package: "any",
      createdStart: "",
      createdEnd: "",
      modifiedStart: "",
      modifiedEnd: "",
      status: [],
      ...props.filters,
    });
    const stages = ref([]);
    const sources = ref([]);
    const fetchStages = async () => {
      try {
        const response = await getStages();
        if (response.status === 200) {
          stages.value = response.data.data.map((stage) => ({
            value: stage.id,
            name: stage.name,
          }));
        }
      } catch (error) {
        console.error("Error fetching stages:", error);
      }
    };
    const fetchSources = async () => {
      try {
        const response = await getSources();
        if (response.status === 200) {
          sources.value = response.data.data.map((source) => ({
            value: source.id,
            name: source.name,
          }));
        } else {
          // alert("Failed to fetch sources");
        }
      } catch (error) {
        console.error("Error fetching sources:", error);
        // alert("Failed to fetch sources");
      }
    };
    const statuses = ref([
      { value: "unassigned", label: "Unassigned" },
      { value: "no_comments", label: "No Comments" },
      { value: "no_task", label: "No Task" },
      { value: "overdue", label: "Overdue" },
      { value: "new", label: "New" },
      { value: "reclaimed", label: "Reclaimed" },
    ]);

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

      localFilters.value = {
        ...localFilters.value,
        status: newSelectedStatuses,
      };
      emit("update:filters", localFilters.value);
    };
    watch(
      () => props.filters,
      (newFilters) => {
        localFilters.value = { ...newFilters };
      },
      { deep: true }
    );
    watch(
      () => props.selectedStatuses,
      (newStatuses) => {
        localFilters.value.status = newStatuses;
      },
      { deep: true }
    );

    onMounted(() => {
      fetchStages();
      fetchSources();
    });

    return {
      localFilters,
      statuses,
      stages,
      sources,
      toggleStatus,
      t,
      // sources: [
      //   { value: "facebook", label: "Facebook" },
      //   { value: "twitter", label: "Twitter" },
      //   { value: "instagram", label: "Instagram" },
      //   { value: "linkedin", label: "LinkedIn" },
      // ],
      // stages: [
      //   { value: "newDeal", label: "New Deal" },
      //   { value: "oldData", label: "Old Data" },
      //   { value: "medicines", label: "Medicines" },
      // ],
      supervisors: [
        { value: "any", label: "Any" },
        { value: "eurasia", label: "Eurasia Admin" },
        { value: "sup", label: "Sup Sup" },
      ],
      representatives: [
        { value: "any", label: "Any" },
        { value: "bader", label: "Bader Rep" },
        { value: "reem", label: "Reem Rep" },
      ],
      packages: [
        { value: "any", label: "Any" },
        { value: "basic", label: "Basic Package" },
        { value: "premium", label: "Premium Package" },
      ],
    };
  },
};
</script>

<style scoped>
span {
  font-size: 14px;
}
</style>
