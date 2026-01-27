<template>
  <div class="modal fade" id="packageModal" tabindex="-1">
    <div
      class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{
              mode === "add"
                ? $t("commission-modal-title-bar-add")
                : $t("commission-modal-title-bar-edit")
            }}
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="save">
            <!-- Package Name -->
            <div class="row mb-4">
              <div class="col-md-6">
                <label class="form-label fw-bold"
                  >{{ $t("commission-modal-package-title") }}
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="packageData.package_name"
                  :placeholder="$t('commission-modal-package-placeholder')"
                  required
                />
              </div>
            </div>

            <!-- Salary Levels -->
            <div class="mb-3">
              <h6 class="fw-bold">
                {{ $t("commission-modal-commission-levels") }}
              </h6>
              <p class="text-muted small">
                {{ $t("commission-modal-commission-levels-description") }}
              </p>
            </div>

            <div
              v-for="(row, index) in salaryRows"
              :key="index"
              class="row g-3 mb-3 align-items-center"
            >
              <!-- Level Name -->
              <div class="col-md-2 d-none">
                <input
                  type="text"
                  class="form-control"
                  :placeholder="`Level ${index + 1}`"
                  v-model="row.level_name"
                />
              </div>

              <!-- Basic Salary -->
              <div class="col-md-3">
                <input
                  type="number"
                  class="form-control"
                  :class="{
                    'is-invalid': validationErrors[index]?.basic_salary,
                  }"
                  :placeholder="$t('commission-modal-basicpay-placeholder')"
                  v-model.number="row.basic_salary"
                  @input="onBasicSalaryChange(index)"
                  required
                />
                <div
                  v-if="validationErrors[index]?.basic_salary"
                  class="invalid-feedback"
                >
                  {{ validationErrors[index].basic_salary }}
                </div>
              </div>

              <!-- Commission Percent -->
              <div class="col-md-2">
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  max="100"
                  step="0.01"
                  :placeholder="$t('commission-modal-commission-placeholder')"
                  v-model.number="row.commission_percent"
                  required
                />
              </div>

              <!-- Minimum Amount -->
              <div class="col-md-3">
                <input
                  type="number"
                  class="form-control"
                  :class="{
                    'is-invalid': validationErrors[index]?.minimum_amount,
                  }"
                  :placeholder="
                    $t('commission-modal-minimumamount-placeholder')
                  "
                  v-model.number="row.minimum_amount"
                  @input="onMinimumAmountChange(index)"
                  required
                />
                <div
                  v-if="validationErrors[index]?.minimum_amount"
                  class="invalid-feedback"
                >
                  {{ validationErrors[index].minimum_amount }}
                </div>
              </div>

              <!-- Maximum Amount -->
              <div class="col-md-3">
                <input
                  type="number"
                  class="form-control"
                  :class="{
                    'is-invalid': validationErrors[index]?.maximum_amount,
                  }"
                  :placeholder="
                    $t('commission-modal-maximumamount-placeholder')
                  "
                  v-model.number="row.maximum_amount"
                  @input="onMaximumAmountChange(index)"
                  required
                />
                <div
                  v-if="validationErrors[index]?.maximum_amount"
                  class="invalid-feedback"
                >
                  {{ validationErrors[index].maximum_amount }}
                </div>
              </div>

              <!-- Remove Button -->
              <div class="col-md-1">
                <label class="form-label small d-block">&nbsp;</label>
                <button
                  v-if="salaryRows.length > 1"
                  type="button"
                  class="btn btn-sm btn-danger"
                  @click="removeRow(index)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <!-- Add More Button -->
            <div class="mt-2 mb-3">
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="addRow"
              >
                <i class="fas fa-plus me-2"></i>
                {{ $t("commission-modal-addmore-button") }}
                {{ salaryRows.length }}
              </button>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">
            {{ $t("commission-modal-close-button") }}
          </button>
          <button
            class="btn btn-success"
            @click="save"
            :disabled="!isValid || isSaving"
          >
            <span
              v-if="isSaving"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{
              mode === "add"
                ? $t("commission-modal-add-button")
                : $t("commission-modal-update-button")
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import { useNotificationStore } from "@/stores/notificationStore";
import {
  createCommissionPackage,
  updateCommissionPackage,
} from "@/plugins/services/salaryService";
import { useI18n } from "vue-i18n";

export default {
  name: "CommissionPackageModal",
  emits: ["save", "close"],

  setup(_, { emit }) {
    const { t } = useI18n();
    const notificationStore = useNotificationStore();
    const modal = ref(null);
    const mode = ref("add");
    const isSaving = ref(false);

    const packageData = ref({
      id: null,
      package_name: "",
    });

    const salaryRows = ref([
      {
        level_name: "",
        basic_salary: null,
        commission_percent: null,
        minimum_amount: null,
        maximum_amount: null,
      },
    ]);

    const validationErrors = ref({});

    const isValid = computed(() => {
      if (!packageData.value.package_name) return false;

      const hasEmptyFields = salaryRows.value.some(
        (row) =>
          row.basic_salary === null ||
          row.commission_percent === null ||
          row.minimum_amount === null ||
          row.maximum_amount === null
      );

      if (hasEmptyFields) return false;

      const hasErrors = Object.keys(validationErrors.value).some(
        (key) => Object.keys(validationErrors.value[key]).length > 0
      );

      return !hasErrors;
    });

    const validateRow = (index) => {
      const currentRow = salaryRows.value[index];
      const prevRow = index > 0 ? salaryRows.value[index - 1] : null;

      if (!validationErrors.value[index]) {
        validationErrors.value[index] = {};
      }
      validationErrors.value[index] = {};

      if (
        currentRow.basic_salary === null ||
        currentRow.commission_percent === null ||
        currentRow.minimum_amount === null ||
        currentRow.maximum_amount === null
      ) {
        validationErrors.value = { ...validationErrors.value };
        return;
      }

      if (prevRow && prevRow.basic_salary !== null) {
        if (Number(currentRow.basic_salary) <= Number(prevRow.basic_salary)) {
          validationErrors.value[
            index
          ].basic_salary = `Must be higher than ${prevRow.basic_salary}`;
        }
      }

      if (prevRow && prevRow.maximum_amount !== null) {
        if (
          Number(currentRow.minimum_amount) <= Number(prevRow.maximum_amount)
        ) {
          validationErrors.value[
            index
          ].minimum_amount = `Must be higher than previous max (${prevRow.maximum_amount})`;
        }
      }

      if (
        Number(currentRow.maximum_amount) <= Number(currentRow.minimum_amount)
      ) {
        validationErrors.value[
          index
        ].maximum_amount = `Must be higher than min (${currentRow.minimum_amount})`;
      }

      validationErrors.value = { ...validationErrors.value };
    };

    const onBasicSalaryChange = (index) => {
      validateRow(index);
      if (index < salaryRows.value.length - 1) {
        validateRow(index + 1);
      }
    };

    const onMinimumAmountChange = (index) => {
      validateRow(index);
    };

    const onMaximumAmountChange = (index) => {
      validateRow(index);
      if (index < salaryRows.value.length - 1) {
        validateRow(index + 1);
      }
    };

    const addRow = () => {
      salaryRows.value.push({
        level_name: "",
        basic_salary: null,
        commission_percent: null,
        minimum_amount: null,
        maximum_amount: null,
      });
    };

    const removeRow = (index) => {
      if (salaryRows.value.length > 1) {
        salaryRows.value.splice(index, 1);
        // Revalidate all rows after removal
        salaryRows.value.forEach((_, i) => validateRow(i));
      }
    };

    const open = async (packageItem = null) => {
      if (packageItem && packageItem.id) {
        mode.value = "edit";
        packageData.value = {
          id: packageItem.id,
          package_name: packageItem.package_name,
        };

        if (packageItem.levels && packageItem.levels.length > 0) {
          salaryRows.value = packageItem.levels.map((level) => ({
            level_name: level.level_name || "",
            basic_salary: level.basic_salary,
            commission_percent: level.commission_percent,
            minimum_amount: level.minimum_amount,
            maximum_amount: level.maximum_amount,
          }));
        }
      } else {
        mode.value = "add";
        packageData.value = {
          id: null,
          package_name: "",
        };
        salaryRows.value = [
          {
            level_name: "",
            basic_salary: null,
            commission_percent: null,
            minimum_amount: null,
            maximum_amount: null,
          },
        ];
      }

      validationErrors.value = {};

      if (!modal.value) {
        const element = document.getElementById("packageModal");
        modal.value = new Modal(element);
      }
      modal.value.show();
    };

    const closeModal = () => {
      modal.value?.hide();
      emit("close");
    };

    const save = async () => {
      salaryRows.value.forEach((_, index) => validateRow(index));

      if (!isValid.value) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Please fix all errors before saving",
        });
        return;
      }

      isSaving.value = true;

      try {
        const data = {
          package_name: packageData.value.package_name,
          levels: salaryRows.value,
        };

        if (mode.value === "edit" && packageData.value.id) {
          await updateCommissionPackage(packageData.value.id, data);
        } else {
          await createCommissionPackage(data);
        }

        emit("save", packageData.value);
        closeModal();
      } catch (error) {
        notificationStore.error(
          error.response?.data?.message || "Failed to save package"
        );
      } finally {
        isSaving.value = false;
      }
    };

    return {
      modal,
      mode,
      packageData,
      salaryRows,
      validationErrors,
      isValid,
      isSaving,
      open,
      closeModal,
      save,
      addRow,
      removeRow,
      onBasicSalaryChange,
      onMinimumAmountChange,
      onMaximumAmountChange,
      t,
    };
  },
};
</script>

<style scoped>
.form-label.small {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}
</style>
