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
        <i class="fas fa-spinner fa-spin"></i> {{ t("modals.updating") }}
      </span>
      <span v-else>{{ t("buttons.confirm") }}</span>
    </button>

    <button
      type="button"
      class="btn btn-danger text-white"
      @click="handleClose"
      data-bs-dismiss="modal"
    >
      {{ t("buttons.close") }}
    </button>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModalChangePasswordModalButtonsItems",
  props: ["loading"],
  emits: ["close"],
  setup(props, { emit }) {
    const toast = useToast();
    const { t } = useI18n();
    const handleClose = () => {
      try {
        const modal = document.getElementById("changePasswordModal");
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          document.querySelector(".modal-backdrop")?.remove();
          document.body.classList.remove("modal-open");
          emit("close");
        }
      } catch (error) {
        toast.error(error.message, {
          timeout: 3000,
        });
      }
    };

    return {
      handleClose,
      t,
    };
  },
};
</script>
