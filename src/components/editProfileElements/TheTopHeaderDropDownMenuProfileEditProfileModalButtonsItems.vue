<template>
  <div class="modal-footer d-flex justify-content-between align-items-center">
    <!-- Update Image Button -->
    <button
      type="button"
      class="btn btn-primary"
      :disabled="loading"
      @click="$emit(updateimage)"
    >
      <span
        v-if="loading"
        class="spinner-border spinner-border-sm me-2"
        role="status"
        aria-hidden="true"
      ></span>
      {{ loading ? t("buttons.updating") : t("buttons.update") }}
    </button>

    <button
      type="button"
      class="btn btn-secondary"
      :disabled="loading"
      @click="handleClose"
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
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, { emit }) {
    const toast = useToast();
    const { t } = useI18n();

    const handleUpdate = () => {
      console.log("Update button clicked");
      //emit("update-image");
      console.log("Event emitted");
    };

    const handleClose = () => {
      console.log("Close button clicked in ProfileButtons component");
      emit("cancel-image");
      try {
        const modal = document.getElementById("EditProfileModal");
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          document
            .querySelectorAll(".modal-backdrop")
            .forEach((b) => b.remove());
          document.body.classList.remove("modal-open");
        }
      } catch (error) {
        console.error("Error closing modal:", error);
        toast.error(t("errors.profileClosedError") || "Error closing modal", {
          timeout: 3000,
        });
      }
    };

    return {
      handleClose,
      handleUpdate,
      t,
    };
  },
};
</script>
