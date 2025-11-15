<template>
  <div
    class="modal-footer btns d-flex justify-content-between align-items-center"
  >
    <button
      type="submit"
      class="btn btn-success text-white"
      :disabled="loading"
    >
      <span v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> {{ t("modals.adding") }}
      </span>
      <span v-else>{{ t("buttons.add") }}</span>
    </button>

    <button
      type="button"
      class="btn btn-danger text-white"
      @click="handleClose"
    >
      {{ t("buttons.close") }}
    </button>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useI18n } from "vue-i18n";
export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModalCalenderModalFormButtonsItems",
  props: ["loading"],
  setup() {
    const { t } = useI18n();
    const handleClose = () => {
      const modal = document.getElementById("calenderModal");
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    };
    return {
      t,
      handleClose,
    };
  },
};
</script>
