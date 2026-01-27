<template>
  <div class="modal fade" id="deductionModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center">
            {{
              mode === "add"
                ? $t("users-deduction-modal-add-title")
                : $t("users-deduction-modal-update-title")
            }}
          </h5>

          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col-6">
              <div class="mb-3">
                <select
                  class="form-control"
                  v-model="deduction.deduction_type_id"
                  required
                >
                  <option value="" disabled>
                    {{ $t("users-deduction-modal-deduction-types") }}
                  </option>
                  <option
                    v-for="type in deductionTypes"
                    :key="type.id"
                    :value="type.id"
                  >
                    {{ type.name }}
                  </option>
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
            :disabled="!deduction.deduction_type_id || deduction.amount <= 0"
          >
            {{
              mode === "add"
                ? $t("deduction-modal-add-button")
                : $t("deduction-modal-update-button")
            }}
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
import { deductiontypes } from "@/plugins/services/salaryService";
import Cookies from "js-cookie";
export default {
  name: "UsersSalaryViewAddDeductionModal",
  emits: ["save", "close"],

  setup(_, { emit }) {
    const { t } = useI18n();
    const modal = ref(null);
    const deduction = ref({ id: null, amount: 0 });
    const mode = ref("add");
    const deductionTypes = ref([]);
    const createdBy = Cookies.get("user_id");

    onMounted(() => {
      const element = document.getElementById("deductionModal");
      modal.value = new Modal(element);
      getDeductionTypes();
    });

    const open = (userId, item) => {
      if (item && item.id) {
        mode.value = "edit";
        deduction.value = {
          id: item.id,
          emp_id: item.emp_id || userId,
          deduction_type_id: item.deduction_type_id,
          amount: parseFloat(item.amount) || 0,
          created_by: item.created_by || createdBy,
        };
      } else {
        mode.value = "add";
        deduction.value = {
          id: null,
          emp_id: userId,
          deduction_type_id: null,
          amount: 0,
          created_by: createdBy,
        };
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

    const getDeductionTypes = async () => {
      try {
        const response = await deductiontypes();
        deductionTypes.value = response.data.data || [];
      } catch (error) {}
    };

    return {
      deduction,
      mode,
      open,
      save,
      closeModal,
      t,
      getDeductionTypes,
      deductionTypes,
    };
  },
};
</script>
