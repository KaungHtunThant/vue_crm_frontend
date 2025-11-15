<template>
  <div class="modal-footer d-flex justify-content-between align-items-center">
    <div class="btns d-flex justify-content-end align-items-center gap-3">
      <button type="submit" class="btn btn-success text-white">
        <span v-if="loading">
          <i class="fas fa-spinner fa-spin"></i>
          {{ t("crmlist-modal-import-button-submit") }}
        </span>
        <span v-else>
          {{ t("crmlist-modal-import-button-submit") }}
        </span>
      </button>
    </div>
    <button
      type="button"
      class="btn btn-danger text-white"
      data-bs-dismiss="modal"
      @click="closeImportModal"
    >
      {{ t("crmlist-modal-import-button-close") }}
    </button>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";

export default {
  name: "CrmListViewImportModalButtonsItems",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  methods: {
    closeImportModal() {
      this.$emit("close-modal");
    },
  },
};
</script>
