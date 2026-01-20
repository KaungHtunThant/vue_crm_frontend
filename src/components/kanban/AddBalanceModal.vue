<template>
  <div
    class="modal fade"
    id="addBalanceModal"
    aria-labelledby="addBalanceModalLabel"
    ref="addBalanceModalRef"
    aria-hidden="true"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
    >
      <div class="modal-content ps-3">
        <div class="modal-header border-bottom-0">
          <h6 class="modal-title fw-semibold" id="addBalanceModalLabel">
            {{ t("kanban-modal-add-balance-heading") }}
          </h6>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitBalance">
            <div class="mb-3">
              <label for="balanceAmount" class="form-label">
                {{ t("kanban-modal-add-balance-label-amount") }}
                <span class="text-danger">*</span>
              </label>
              <input
                type="number"
                class="form-control"
                id="balanceAmount"
                v-model="balanceAmount"
                min="0"
                required
              />
            </div>
            <div class="d-flex justify-content-end gap-2 mt-4 mb-2">
              <button
                type="submit"
                class="btn btn-success text-white"
                :disabled="isSubmitting"
              >
                <span
                  v-if="isSubmitting"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                {{
                  isSubmitting
                    ? t("kanban-modal-add-balance-button-submitting")
                    : t("kanban-modal-add-balance-button-submit")
                }}
              </button>
              <button
                type="button"
                class="btn btn-danger text-white"
                data-bs-dismiss="modal"
                :disabled="isSubmitting"
              >
                {{ t("kanban-modal-add-balance-button-cancel") }}
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
import { useI18n } from "vue-i18n";
import { addbalance } from "@/plugins/services/salaryService";
import { useNotificationStore } from "@/stores/notificationStore";
import { Modal } from "bootstrap";
export default {
  name: "AddBalance",
  props: {
    deal_id: {
      type: Number,
      required: true,
    },
  },
  emits: ["balance-added"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const balanceAmount = ref(0);
    const notificationStore = useNotificationStore();
    const addBalanceModalRef = ref(null);
    const isSubmitting = ref(false);
    const submitBalance = async () => {
      if (!balanceAmount.value || balanceAmount.value <= 0) {
        notificationStore.error(
          t("kanban-modal-add-balance-error-invalid-amount"),
          {
            timeout: 3000,
          }
        );
        return;
      }
      isSubmitting.value = true;
      try {
        const response = await addbalance({
          deal_id: props.deal_id,
          amount: balanceAmount.value,
        });
        if (response.status === 200) {
          notificationStore.success(response.data.message, {
            timeout: 3000,
          });
          emit("balance-added", response.data);
          const modal = Modal.getInstance(addBalanceModalRef.value);
          if (modal) {
            modal.hide();
          }
          setTimeout(() => {
            balanceAmount.value = 0;
          }, 300);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          t("kanban-modal-add-balance-error-general");

        notificationStore.error(errorMessage, {
          timeout: 5000,
        });
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      t,
      balanceAmount,
      submitBalance,
      isSubmitting,
      addBalanceModalRef,
    };
  },
};
</script>
