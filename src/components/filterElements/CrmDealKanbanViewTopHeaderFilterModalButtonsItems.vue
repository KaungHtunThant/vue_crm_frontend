<template>
  <div class="modal-footer d-flex justify-content-between align-items-center">
    <div class="btns d-flex justify-content-end align-items-center gap-3">
      <button
        type="submit"
        class="btn btn-success text-white"
        @click="submitFilters"
      >
        <span v-if="isApplyingFilters">
          <i class="fas fa-spinner fa-spin"></i>
          {{ t("crmlist-modal-filter-button-submit") }}
        </span>
        <span v-else>
          {{ t("crmlist-modal-filter-button-submit") }}
        </span>
      </button>
      <button type="button" class="btn btn-warning" @click="resetFilter">
        <span v-if="isResettingFilters">
          <i class="fas fa-spinner fa-spin"></i>
          {{ t("crmlist-modal-filter-button-reset") }}
        </span>
        <span v-else>
          {{ t("crmlist-modal-filter-button-reset") }}
        </span>
      </button>
    </div>
    <button
      type="button"
      class="btn btn-danger text-white"
      data-bs-dismiss="modal"
      @click="closeFilterModal"
    >
      {{ t("crmlist-modal-filter-button-close") }}
    </button>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  name: "CrmDealKanbanViewTopHeaderFilterModalButtonsItems",
  props: {
    isApplyingFilters: { type: Boolean, default: false },
    isResettingFilters: { type: Boolean, default: false },
  },
  emits: ["submit", "reset-filter", "close-modal"],
  setup(props, { emit }) {
    const { t } = useI18n();

    const closeFilterModal = () => {
      emit("close-modal");
    };

    const resetFilter = () => {
      emit("reset-filter");
    };

    const submitFilters = () => {
      emit("submit");
    };

    return {
      t,
      closeFilterModal,
      resetFilter,
      submitFilters,
    };
  },
};
</script>
