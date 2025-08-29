<template>
  <div class="modal-footer d-flex justify-content-between align-items-center">
    <div class="btns d-flex justify-content-end align-items-center gap-3">
      <button type="submit" class="btn btn-success text-white">
        {{ t("kanban-modal-create-button-submit") }}
      </button>
    </div>
    <button
      type="button"
      class="btn btn-danger text-white"
      data-bs-dismiss="modal"
    >
      {{ t("kanban-modal-create-button-close") }}
    </button>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  name: "CrmListViewCreateDealModalButtonsItems",
  setup() {
    const { t } = useI18n();
    return { t };
  },
  methods: {
    closeFilterModal() {
      this.$emit("close-modal");
    },
  },
};
</script>
