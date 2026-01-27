<template>
  <div>
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
              @click="closeChangePassword"
              aria-label="Close"
            ></button>
          </div>

          <form @submit.prevent="submitForm">
            <div class="modal-body">
              <!-- الحقول -->
              <div class="mb-3">
                <label for="oldPassword" class="form-label">
                  {{ t("change-password-modal-old-password") }}
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  class="form-control"
                  v-model="password.old"
                  :placeholder="
                    t('change-password-modal-old-password-placeholder')
                  "
                />
              </div>

              <div class="mb-3">
                <label for="newPassword" class="form-label">
                  {{ t("change-password-modal-new-password") }}
                </label>
                <input
                  type="password"
                  id="newPassword"
                  class="form-control"
                  v-model="password.new"
                  :placeholder="
                    t('change-password-modal-new-password-placeholder')
                  "
                />
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">
                  {{ t("change-password-modal-confirm-password") }}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  class="form-control"
                  v-model="password.confirm"
                  :placeholder="
                    t('change-password-modal-confirm-password-placeholder')
                  "
                />
              </div>
            </div>

            <div class="modal-footer d-flex justify-content-between">
              <button type="submit" class="btn btn-success" :disabled="loading">
                <span v-if="loading">
                  <i class="fas fa-spinner fa-spin"></i>
                  {{ t("modals.updating") }}
                </span>
                <span v-else>{{ t("buttons.confirm") }}</span>
              </button>

              <!-- زر الإغلاق -->
              <button
                type="button"
                class="btn btn-danger"
                @click="closeChangePassword"
              >
                {{ t("buttons.close") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNotificationStore } from "@/stores/notificationStore";
import { useUserStore } from "@/stores/UserStore";
import Cookies from "js-cookie";
import { useI18n } from "vue-i18n";

export default {
  name: "ChangePasswordModalSinglePage",
  setup() {
    const { t } = useI18n();
    const notificationStore = useNotificationStore();
    const userStore = useUserStore();

    const password = ref({ old: "", new: "", confirm: "" });
    const loading = ref(false);

    const openChangePassword = () => {
      const modal = document.getElementById("changePasswordModal");
      const modalInstance = new Modal(modal);
      modalInstance.show();
    };

    const closeChangePassword = () => {
      const modal = document.getElementById("changePasswordModal");
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        password.value = { old: "", new: "", confirm: "" };
      } else {
      }
    };

    const submitForm = async () => {
      loading.value = true;
      if (
        !password.value.old ||
        !password.value.new ||
        !password.value.confirm
      ) {
        notificationStore.error("Please fill in all fields");
        loading.value = false;
        return;
      }

      if (password.value.new !== password.value.confirm) {
        notificationStore.error("Passwords do not match");
        loading.value = false;
        return;
      }

      if (password.value.new === password.value.old) {
        notificationStore.error(
          "New password cannot be the same as the old password"
        );
        loading.value = false;
        return;
      }

      const userId = Cookies.get("user_id");

      try {
        const result = await userStore.changePassword(
          userId,
          password.value.old,
          password.value.new,
          password.value.confirm
        );

        if (result.success) {
          notificationStore.success(result.message);
          password.value = { old: "", new: "", confirm: "" };
          closeChangePassword();
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        notificationStore.error(error.message);
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
