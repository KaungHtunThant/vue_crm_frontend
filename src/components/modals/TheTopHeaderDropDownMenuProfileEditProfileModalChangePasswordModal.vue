<template>
  <div
    class="modal fade"
    id="changePasswordModal"
    tabindex="-1"
    aria-labelledby="changePasswordModalLabel"
    aria-hidden="true"
    ref="changePasswordModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="changePasswordModalLabel">
            {{ t("modals.changePassword") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeChangePassword"
          ></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <change-password-form v-model="password" />
          </div>
          <change-password-buttons
            :loading="loading"
            @close="closeChangePassword"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import ChangePasswordForm from "@/components/changePasswordElements/TheTopHeaderDropDownMenuProfileEditProfileModalChangePasswordModalFormItems.vue";
import ChangePasswordButtons from "@/components/changePasswordElements/TheTopHeaderDropDownMenuProfileEditProfileModalChangePasswordModalButtonsItems.vue";
import { ref } from "vue";
// import { useToast } from "vue-toastification";
// import { showSuccess, showError } from "@/plugins/services/toastService";
import { useNotificationStore } from "@/stores/notificationStore";

import { useI18n } from "vue-i18n";
export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModalChangePasswordModal",
  components: { ChangePasswordForm, ChangePasswordButtons },
  setup() {
    const { t } = useI18n();
    const notificationStore = useNotificationStore();
    // const toast = useToast();
    const password = ref("");
    const loading = ref(false);

    const openChangePassword = () => {
      try {
        const modal = document.getElementById("changePasswordModal");
        const modalInstance = new Modal(modal);
        modalInstance.show();
        // toast.info(t("success.openChangePassword"), {
        //   timeout: 3000,
        //   id: "change-password-open",
        //   singleton: true,
        // });
      } catch (error) {
        notificationStore.error(t("error.openChangePassword"), {
          timeout: 3000,
          id: "change-password-error",
          singleton: true,
        });
      }
    };

    const closeChangePassword = () => {
      try {
        const modal = document.getElementById("changePasswordModal");
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          document.querySelector(".modal-backdrop")?.remove();
          document.body.classList.remove("modal-open");
          password.value = "";
        }
      } catch (error) {
        notificationStore.error(t("error.closeChangePassword"), {
          timeout: 3000,
          id: "change-password-close-error",
          singleton: true,
        });
      }
    };

    const submitForm = async () => {
      try {
        loading.value = true;
        if (!password.value) {
          notificationStore.error(t("error.passwordRequired"), {
            timeout: 3000,
            id: "change-password-validation",
            singleton: true,
          });
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        notificationStore.success(t("success.changePassword"), {
          timeout: 3000,
          id: "change-password-success",
          singleton: true,
        });
        closeChangePassword();
      } catch (error) {
        notificationStore.error(t("error.changePassword"), {
          timeout: 3000,
          id: "change-password-submit-error",
          singleton: true,
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      password,
      loading,
      openChangePassword,
      closeChangePassword,
      submitForm,
      t,
    };
  },
};
</script>
