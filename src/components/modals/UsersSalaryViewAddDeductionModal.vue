<template>
  <div class="modal fade" id="deductionModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center">
            {{ mode === "add" ? "Add Deduction" : "Edit Deduction" }}
          </h5>

          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col-6">
              <div class="mb-3">
                <select
                  class="form-control"
                  v-model="deduction.reason"
                  required
                >
                  <option disabled value="">
                    {{ $t("users-salary-modal-add-placeholder-reason") }}
                  </option>
                  <option value="Absence">Absence</option>
                  <option value="Late">Late</option>
                  <option value="Early">Early</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div class="col-6">
              <div class="mb-3">
                <input
                  type="number"
                  class="form-control"
                  v-model="deduction.amount"
                  required
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-danger text-white" @click="closeModal">
            {{ $t("settings-role-modal-add-button-cancel") }}
          </button>

          <button
            class="btn btn-success text-white"
            @click="save"
            :disabled="!deduction.reason || deduction.amount <= 0"
          >
            {{ mode === "add" ? "Save" : "Update" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";
import { useI18n } from "vue-i18n";

export default {
  name: "UsersSalaryViewAddDeductionModal",
  emits: ["save", "close"],

  setup(_, { emit }) {
    const { t } = useI18n();

    const modal = ref(null);
    const deduction = ref({ id: null, reason: "", amount: 0 });
    const mode = ref("add");

    onMounted(() => {
      const element = document.getElementById("deductionModal");
      modal.value = new Modal(element);
    });

    const open = (item = null) => {
      if (item) {
        mode.value = "edit";
        deduction.value = { ...item };
      } else {
        mode.value = "add";
        deduction.value = { id: null, reason: "", amount: 0 };
      }

      modal.value?.show();
    };

    const closeModal = () => {
      modal.value?.hide();
      emit("close");
    };

    const save = () => {
      emit("save", { ...deduction.value });
      closeModal();
    };

    return {
      deduction,
      mode,
      open,
      save,
      closeModal,
      t,
    };
  },
};
</script>
