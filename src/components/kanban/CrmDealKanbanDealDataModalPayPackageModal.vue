<template>
  <div
    class="modal fade"
    id="payPackageModal"
    tabindex="-1"
    aria-labelledby="addBalanceModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="payPackageModalLabel">
            {{ t("kanban-modal-add-balance-heading") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitAddBalance">
            <div class="mb-3">
              <label for="balanceAmount" class="form-label">{{
                t("kanban-modal-add-balance-label-amount")
              }}</label>
              <input
                type="number"
                class="form-control"
                id="balanceAmount"
                v-model.number="balanceAmount"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div class="d-flex justify-content-end gap-2 mt-4 mb-2">
              <button type="submit" class="btn btn-primary">
                {{ t("kanban-modal-add-balance-button-submit") }}
              </button>
              <button
                type="button"
                class="btn btn-danger text-white"
                data-bs-dismiss="modal"
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
import { Modal } from "bootstrap";
import { updateHospitalPackage } from "@/plugins/services/dealService";
import { useNotificationStore } from "@/stores/notificationStore";
export default {
  name: "PayPackageModal",
  props: {
    package_id: {
      type: Number,
      required: true,
    },
    deal_id: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const balanceAmount = ref(0);
    const payPackageModal = ref(null);
    const notificationStore = useNotificationStore();
    const showModal = () => {
      if (!payPackageModal.value) {
        payPackageModal.value = new Modal(
          document.getElementById("payPackageModal")
        );
      }
      payPackageModal.value.show();
    };
    const hideModal = () => {
      if (payPackageModal.value) {
        payPackageModal.value.hide();
      }
    };
    const submitAddBalance = async () => {
      const pkg = props.package_id;
      const dealId = props.deal_id;
      console.log("Submitting balance for package ID:", pkg);
      console.log("dealId:", dealId);
      if (!pkg) return;
      try {
        const response = await updateHospitalPackage({
          package_id: pkg,
          deal_id: dealId,
          amount: balanceAmount.value,
          paid_on: new Date().toISOString().slice(0, 19).replace("T", " "),
        });
        if (response.status === 200) {
          notificationStore.success(response.data.message, {
            timeout: 3000,
          });
          emit("package-paid", response.data);
          const modalElement = document.getElementById("payPackageModal");
          const bsModal =
            Modal.getInstance(modalElement) || payPackageModal.value;

          if (bsModal) {
            bsModal.hide();
          }

          modalElement.addEventListener(
            "hidden.bs.modal",
            () => {
              balanceAmount.value = 0;
            },
            { once: true }
          );
        } else {
          notificationStore.error(response.data.message, {
            timeout: 3000,
          });
        }
      } catch (error) {
        notificationStore.error(
          error.response?.data?.message || "An error occurred.",
          {
            timeout: 3000,
          }
        );
      }
    };

    return {
      t,
      balanceAmount,
      showModal,
      submitAddBalance,
      hideModal,
    };
  },
};
</script>
