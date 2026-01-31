<template>
  <div
    class="modal fade Second-modal"
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
            @click="hideModal"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitAddBalance">
            <div class="mb-3">
              <label for="paymentType" class="form-label">
                {{ t("kanban-modal-add-balance-label-payment-type") }}
                <span class="text-danger">*</span>
              </label>
              <select
                id="paymentType"
                class="form-select"
                v-model="selectedPaymentType"
                required
              >
                <option
                  v-for="type in PaymentTypes"
                  :key="type.id"
                  :value="type.id"
                >
                  {{ type.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label" for="referenceNumber">
                {{ t("kanban-modal-add-balance-reference-number") }}
              </label>
              <input
                type="text"
                class="form-control"
                id="referenceNumber"
                v-model="referenceNumber"
              />
            </div>
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
                @click="hideModal"
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
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Modal } from "bootstrap";
import { updateHospitalPackage } from "@/plugins/services/paymentService";
import { useNotificationStore } from "@/stores/notificationStore";
import { usePaymentTypesStore } from "@/stores/PaymentsStore";
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
    const selectedPaymentType = ref(null);
    const referenceNumber = ref("");
    const payment_distribution = ref(null);
    const balance_added = ref(null);
    const total_packages_updated = ref(null);
    const paymentTypesStore = usePaymentTypesStore();
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
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.style.zIndex = "";
      }
    };
    const submitAddBalance = async () => {
      const pkg = props.package_id;
      console.log("package Id:", pkg);
      const dealId = props.deal_id;
      if (!pkg) return;
      try {
        const response = await updateHospitalPackage({
          package_id: pkg,
          deal_id: dealId,
          amount: balanceAmount.value,
          paid_on: new Date().toISOString().slice(0, 19).replace("T", " "),
          payment_type_id: selectedPaymentType.value,
          reference_number: referenceNumber.value,
        });
        if (response.status === 200) {
          const responseData = response.data;
          const distributionCount =
            responseData.payment_distribution?.length || 0;
          const balanceAdded = responseData.balance_added || 0;
          let message = responseData.message;
          if (distributionCount > 1) {
            message += ` (${distributionCount} packages updated)`;
          }
          if (balanceAdded > 0) {
            message += ` | Balance added: ${balanceAdded}`;
          }
          notificationStore.success(message, {
            timeout: 5000,
          });
          emit("package-paid", {
            payment_distribution: responseData.payment_distribution || [],
            balance_added: responseData.balance_added || 0,
            total_packages_updated: responseData.total_packages_updated || 0,
          });
          const modalElement = document.getElementById("payPackageModal");
          const bsModal =
            Modal.getInstance(modalElement) || payPackageModal.value;

          if (bsModal) {
            bsModal.hide();
            hideModal();
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
    const PaymentTypes = computed(() => paymentTypesStore.paymentTypes);
    onMounted(async () => {
      paymentTypesStore.fetchPaymentTypes().catch((error) => {
        console.error("Error fetching payment types:", error);
      });
    });

    return {
      t,
      balanceAmount,
      showModal,
      submitAddBalance,
      hideModal,
      referenceNumber,
      selectedPaymentType,
      PaymentTypes,
      payment_distribution,
      balance_added,
      total_packages_updated,
    };
  },
};
</script>
