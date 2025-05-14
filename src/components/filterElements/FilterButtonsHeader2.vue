<template>
  <div class="modal-footer d-flex justify-content-between align-items-center">
    <div class="btns d-flex justify-content-end align-items-center gap-3">
      <button type="submit" class="btn btn-primary" @click="submitFilters">
        {{ t("crmlist-modal-filter-button-submit") }}
      </button>
      <button type="button" class="btn btn-warning" @click="removeFilter">
        {{ t("crmlist-modal-filter-button-reset") }}
      </button>
    </div>
    <button
      type="button"
      class="btn btn-secondary"
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
  name: "FilterButtonCrmList",
  emits: ["reset-filter", "close-modal", "submit-filters"],
  setup(props, { emit }) {
    const { t } = useI18n();

    const closeFilterModal = () => {
      emit("close-modal");
    };

    const removeFilter = () => {
      emit("reset-filter");
    };

    const submitFilters = () => {
      emit("submit-filters");
    };

    return {
      t,
      closeFilterModal,
      removeFilter,
      submitFilters,
    };
  },
};
</script>
