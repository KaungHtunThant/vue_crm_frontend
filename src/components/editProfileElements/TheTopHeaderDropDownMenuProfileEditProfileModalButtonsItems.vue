<template>
  <div
    class="modal-footer btns d-flex justify-content-between align-items-center"
  >
    <button type="submit" class="btn btn-primary" :disabled="loading">
      <span v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> {{ t("modals.editing") }}
      </span>
      <span v-else>{{
        t("header-user-menu-item-profile-modal-button-confirm")
      }}</span>
    </button>

    <button
      type="button"
      class="btn btn-secondary"
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
  name: "TheTopHeaderDropDownMenuProfileEditProfileModalButtonsItems",
  props: ["loading"],
  setup() {
    const toast = useToast();
    const { t } = useI18n();
    const handleClose = () => {
      try {
        const modal = document.getElementById("EditProfileModal");
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          document.querySelector(".modal-backdrop")?.remove();
          document.body.classList.remove("modal-open");
        }
      } catch (error) {
        toast.error(t("errors.profileClosedError"), {
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
