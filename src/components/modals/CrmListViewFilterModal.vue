<template>
  <div
    class="modal fade"
    id="filterModal"
    tabindex="-1"
    aria-labelledby="filterModalLabel"
    aria-hidden="true"
    ref="filterModal"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="filterModalLabel">
            {{ t("crmlist-modal-filter-heading") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeFilterModal"
          ></button>
        </div>
        <form @submit.prevent="submitFilters">
          <crm-list-view-filter-modal-form
            :filters="filters"
            :selectedStatuses="localSelectedStatuses"
            :stages="local_stages"
            :sources="local_sources"
            @update:filters="updateFilters"
            @update:selectedStatuses="updateSelectedStatuses"
          />
          <crm-list-view-filter-modal-buttons
            @reset-filter="resetFilter"
            @close-modal="closeFilterModal"
            @submit-filters="submitFilters"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { Modal } from "bootstrap";
import CrmListViewFilterModalForm from "@/components/filterElements/CrmListViewFilterModalFormItems.vue";
import CrmListViewFilterModalButtons from "@/components/filterElements/CrmListViewFilterModalButtonsItems.vue";
import { useNotificationStore } from "@/stores/notificationStore";
import { useI18n } from "vue-i18n";

export default {
  name: "CrmListViewFilterModal",
  components: { CrmListViewFilterModalForm, CrmListViewFilterModalButtons },
  props: {
    modelValue: { type: Object, required: true },
    selectedStatuses: { type: Array, required: true, default: () => [] },
    stages: { type: Array, required: true, default: () => [] },
    sources: { type: Array, required: true, default: () => [] },
    users: { type: Array, required: true, default: () => [] },
  },
  emits: ["update:modelValue", "apply-filters", "reset-filter"],

  setup(props, { emit }) {
    const notificationStore = useNotificationStore();
    const { t } = useI18n();
    // const toast = useToast();
    const filters = ref({ ...props.modelValue });
    const localSelectedStatuses = ref([...props.selectedStatuses]);
    const local_stages = ref([]);
    const local_sources = ref([]);
    const filterModal = ref(null);

    watch(
      () => props.modelValue,
      (newFilters) => {
        if (newFilters) {
          filters.value = { ...newFilters };
          localSelectedStatuses.value = Array.isArray(newFilters.status)
            ? [...newFilters.status]
            : [];
        }
      },
      { immediate: true, deep: true }
    );

    watch(
      () => props.selectedStatuses,
      (newStatuses) => {
        if (Array.isArray(newStatuses)) {
          localSelectedStatuses.value = [...newStatuses];
          filters.value.status = [...newStatuses];
        }
      },
      { immediate: true }
    );

    const closeFilterModal = () => {
      try {
        const modal = filterModal.value;
        if (modal) {
          const modalInstance = Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
            document.querySelector(".modal-backdrop")?.remove();
            document.body.classList.remove("modal-open");
          }
        }
      } catch (error) {
        console.error(error);
        notificationStore.error(error.message, { timeout: 3000 });
      }
    };
    const submitFilters = () => {
      try {
        if (Array.isArray(localSelectedStatuses.value)) {
          filters.value.status = [...localSelectedStatuses.value];
        }

        emit("update:modelValue", { ...filters.value });
        emit("apply-filters", { ...filters.value });

        notificationStore.success("Filters applied", { timeout: 3000 });
        closeFilterModal();
      } catch (error) {
        console.error(error);
        notificationStore.error(error.message, { timeout: 3000 });
      }
    };

    const updateFilters = (newFilters) => {
      if (newFilters) {
        filters.value = { ...newFilters };
        emit("update:modelValue", { ...filters.value });
      }
    };

    const resetFilter = () => {
      try {
        const emptyFilters = {
          package_id: null,
          source_id: null,
          stage_id: null,
          user_id: null,
          nationality: null,
          country_code: null,
          created_date_start: null,
          created_date_end: null,
          updated_date_start: null,
          updated_date_end: null,
          status: [],
        };
        filters.value = emptyFilters;
        localSelectedStatuses.value = [];
        emit("update:modelValue", emptyFilters);
        emit("reset-filter");
        notificationStore.success("Filters reset", { timeout: 3000 });
        closeFilterModal();
      } catch (error) {
        console.error(error);
        notificationStore.error(error.message, { timeout: 3000 });
      }
    };

    const updateSelectedStatuses = (newStatuses) => {
      if (Array.isArray(newStatuses)) {
        localSelectedStatuses.value = [...newStatuses];
        filters.value.status = [...newStatuses];
        emit("update:modelValue", { ...filters.value });
      }
    };

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

    return {
      filters,
      localSelectedStatuses,
      closeFilterModal,
      submitFilters,
      updateFilters,
      updateSelectedStatuses,
      resetFilter,
      t,
      local_stages,
      local_sources,
      filterModal,
    };
  },
};
</script>
