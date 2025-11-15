<template>
  <div
    class="modal-footer btns d-flex justify-content-between align-items-center"
  >
    <button type="submit" class="btn btn-primary" :disabled="loading">
      <span v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> {{ t("modals.updating") }}...
      </span>
      <span v-else>{{ t("buttons.edit") }}</span>
    </button>

    <button type="button" class="btn btn-secondary" @click="$emit('close')">
      {{ t("buttons.close") }}
    </button>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModalChangeLangModalButtonsItems",
  props: ["loading"],
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
};
</script>
