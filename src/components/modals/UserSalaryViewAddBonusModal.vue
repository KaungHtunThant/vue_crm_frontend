<template>
  <div class="modal fade" id="bonusModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center">
            {{
              mode === "add"
                ? $t("users-bonus-modal-add-title")
                : $t("users-bonus-modal-update-title")
            }}
          </h5>

          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12">
              <div class="mb-3">
                <label for="amount" class="form-label">
                  {{ t("users-bonus-add-modal-notes-label") }}
                </label>
                <input type="text" class="form-control" v-model="bonus.notes" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="mb-3">
              <label for="amount" class="form-label">
                {{ t("users-bonus-add-modal-amount-label") }}
              </label>
              <input
                type="number"
                class="form-control"
                v-model="bonus.amount"
                required
                min="1"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger text-white" @click="closeModal">
            {{ $t("settings-role-modal-add-button-cancel") }}
          </button>

          <button
            class="btn btn-success text-white"
            @click="saveBonus"
            :disabled="bonus.amount <= 0"
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
import Cookies from "js-cookie";
export default {
  name: "UsersSalaryViewAddBonusModal",
  emits: ["saveBonus", "close"],

  setup(_, { emit }) {
    const { t } = useI18n();
    const modal = ref(null);
    const bonus = ref({ id: null, amount: 0 });
    const mode = ref("add");
    const createdBy = Cookies.get("user_id");

    onMounted(() => {
      const element = document.getElementById("bonusModal");
      modal.value = new Modal(element);
    });

    const open = (userId, item) => {
      if (item && item.id) {
        mode.value = "edit";
        bonus.value = {
          id: item.id,
          emp_id: item.emp_id || userId,
          notes: item.notes || "",
          amount: parseFloat(item.amount) || 0,
          created_by: item.created_by || createdBy,
        };
      } else {
        mode.value = "add";
        bonus.value = {
          id: null,
          emp_id: userId,
          notes: "",
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

    const saveBonus = () => {
      emit("saveBonus", { ...bonus.value });
      closeModal();
    };

    return {
      bonus,
      mode,
      open,
      saveBonus,
      closeModal,
      t,
    };
  },
};
</script>
