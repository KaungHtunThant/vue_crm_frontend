<template>
  <div
    class="modal-footer btns d-flex justify-content-between align-items-center"
  >
    <div class="btns">
      <button
        type="submit"
        class="btn btn-success text-white me-2"
        :disabled="loading"
      >
        <span v-if="loading">
          <i class="fas fa-spinner fa-spin"></i
          >{{ t("users-modal-filter-button-submit") }}
        </span>
        <span v-else>{{ t("users-modal-filter-button-submit") }}</span>
      </button>
      <button
        type="button"
        class="btn btn-warning"
        @click="$emit('reset-filters')"
      >
        {{ t("users-modal-filter-button-reset") }}
      </button>
    </div>

    <button
      type="button"
      class="btn btn-danger text-white"
      @click="$emit('close')"
    >
      {{ t("users-modal-filter-button-close") }}
    </button>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  name: "UserViewFilterModalButtonsItems",
  props: ["loading"],
  emits: ["close", "reset-filters"],
  setup() {
    const { t } = useI18n();
    return { t };
  },
};
</script>
