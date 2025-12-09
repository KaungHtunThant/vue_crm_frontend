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
          <filter-modal-form-items
            :headerFilters="headerFilterData"
            :headerSelectedStatuses="headerSelectedStatuses"
            @update:headerFilters="updateFilters"
            @update:headerSelectedStatuses="updateSelectedStatuses"
          />
          <filter-modal-buttons-items
            @reset-filter="resetFilter"
            @close-modal="closeFilterModal"
            :isApplyingFilters="isApplyingFilters"
            :isResettingFilters="isResettingFilters"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { Modal } from "bootstrap";
import FilterModalFormItems from "@/components/filterElements/CrmDealKanbanViewTopHeaderFilterModalFormItems.vue";
import FilterModalButtonsItems from "@/components/filterElements/CrmDealKanbanViewTopHeaderFilterModalButtonsItems.vue";
// import { useToast } from "vue-toastification";
// import { showError } from "@/plugins/services/toastService";
import { useNotificationStore } from "@/stores/notificationStore";

import { useI18n } from "vue-i18n";

export default {
  name: "CrmDealKanbanViewTopHeaderFilterModal",
  components: { FilterModalFormItems, FilterModalButtonsItems },
  props: {
    modelValue: { type: Object, required: true },
    selectedStatuses: { type: Array, required: true, default: () => [] },
    applyActualFiltersProp: { type: Function, required: true },
    resetActualFiltersProp: { type: Function, required: true },
  },
  emits: ["update:modelValue"],
  // emits: ["update:modelValue", "apply-filters", "reset-filter"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const notificationStore = useNotificationStore();
    // const toast = useToast();
    const headerFilterData = ref({ ...props.modelValue });
    const headerSelectedStatuses = ref([]);
    const filterModal = ref(null);
    const isApplyingFilters = ref(false);
    const isResettingFilters = ref(false);

    watch(
      () => props.modelValue,
      (newFilters) => {
        if (newFilters) {
          headerFilterData.value = { ...newFilters };
          headerSelectedStatuses.value = Array.isArray(newFilters.status)
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
          headerSelectedStatuses.value = [...newStatuses];
          headerFilterData.value.status = [...newStatuses];
        }
      },
      { immediate: true }
    );

    const closeFilterModal = () => {
      try {
        const modal = filterModal.value;
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
      } catch (error) {
        notificationStore.error(t("error.closeModal"), { timeout: 3000 });
        console.error("Error closing modal:", error);
      }
    };

    const submitFilters = async () => {
      try {
        isApplyingFilters.value = true;
        if (Array.isArray(headerSelectedStatuses.value)) {
          headerFilterData.value.status = [...headerSelectedStatuses.value];
        }

        await props.applyActualFiltersProp({ ...headerFilterData.value });

        emit("update:modelValue", { ...headerFilterData.value });
        closeFilterModal();
      } catch (error) {
        console.error("Error applying filters:", error);
        notificationStore.error(error.message, { timeout: 3000 });
      } finally {
        isApplyingFilters.value = false;
      }
    };

    const updateFilters = (newFilters) => {
      if (newFilters) {
        headerFilterData.value = { ...newFilters };
        emit("update:modelValue", { ...headerFilterData.value });
      }
    };

    const resetFilter = async () => {
      try {
        isResettingFilters.value = true;
        const emptyFilters = {
          package_id: null,
          updated_at_start: null,
          updated_at_end: null,
          source_id: null,
          stage_id: null,
          user_id: null,
          created_at_start: null,
          created_at_end: null,
          status: [],
        };
        headerFilterData.value = emptyFilters;
        headerSelectedStatuses.value = [];

        await props.resetActualFiltersProp();

        emit("update:modelValue", emptyFilters);
        closeFilterModal();
      } catch (error) {
        notificationStore.error(t("error.resetFilters"), { timeout: 3000 });
      } finally {
        isResettingFilters.value = false;
      }
    };

    const updateSelectedStatuses = (newStatuses) => {
      if (Array.isArray(newStatuses)) {
        headerSelectedStatuses.value = [...newStatuses];
        headerFilterData.value.status = [...newStatuses];
        emit("update:modelValue", { ...headerFilterData.value });
      }
    };

    return {
      headerFilterData,
      headerSelectedStatuses,
      closeFilterModal,
      submitFilters,
      updateFilters,
      updateSelectedStatuses,
      resetFilter,
      t,
      filterModal,
      isApplyingFilters,
      isResettingFilters,
    };
  },
};
</script>
