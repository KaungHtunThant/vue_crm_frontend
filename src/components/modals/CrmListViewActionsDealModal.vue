<template>
  <!-- Change Stage Modal -->
  <div class="modal fade" id="changeStageModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ t("crmlist-action-changestage") }} ({{
              props.selectedRows.length
            }}
            {{ t("crmlist-table-header-stage") }})
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <select v-model="newStage" class="form-select">
            <option value="">
              {{ t("crmlist-modal-filter-placeholder-stage") }}
            </option>
            <option
              v-for="option in stageOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            {{ t("buttons.cancel") }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmChangeStage"
            :disabled="isLoading || !newStage"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{ t("buttons.apply") }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Assign Representative Modal -->
  <div class="modal fade" id="assignUser" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ t("crmlist-action-assignto") }} ({{ selectedRows.length }})
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <select v-model="newUser" class="form-select">
            <option value="">
              {{ t("crmlist-modal-import-placeholder-representative") }}
            </option>
            <option
              v-for="option in userOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.name }}
            </option>
          </select>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            {{ t("buttons.cancel") }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmAssignUser"
            :disabled="isLoading || !newUser"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{ t("buttons.apply") }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Change Source Modal -->
  <div class="modal fade" id="changeSourceModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ t("crmlist-action-changesource") }} ({{ selectedRows.length }})
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <select v-model="newSource" class="form-select">
            <option value="">
              {{ t("crmlist-modal-import-placeholder-source") }}
            </option>
            <option
              v-for="option in sourceOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            {{ t("users-modal-add-button-cancel") }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmChangeSource"
            :disabled="isLoading || !newSource"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{ t("users-modal-add-button-submit") }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Multi Action Modal -->
  <div class="modal fade" id="multiActionModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ t("crmlist-action-update") }} ({{ selectedRows.length }})
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <select v-model="newStage" class="form-select mb-2">
            <option value="">
              {{ t("crmlist-modal-filter-placeholder-stage") }}
            </option>
            <option
              v-for="option in stageOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <select v-model="newUser" class="form-select mb-2">
            <option value="">
              {{ t("crmlist-modal-import-placeholder-representative") }}
            </option>
            <option
              v-for="option in userOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.name }}
            </option>
          </select>
          <select v-model="newSource" class="form-select">
            <option value="">
              {{ t("crmlist-modal-import-placeholder-source") }}
            </option>
            <option
              v-for="option in sourceOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            {{ t("users-modal-add-button-cancel") }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmMultiAction"
            :disabled="isLoading"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{ t("users-modal-add-button-submit") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { Modal } from "bootstrap";
import {
  getAvailableStages,
  getSources,
  getAllUsers,
} from "@/plugins/services/authService";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
const { t } = useI18n();
const props = defineProps({
  selectedRows: {
    type: Array,
    required: true,
  },
});
const toast = useToast();

// Define emits properly
const emits = defineEmits([
  "update-stage",
  "update-supervisor",
  "update-representative",
  "update-source",
]);

// State
const isLoading = ref(false);
const newStage = ref("");
// const newSupervisor = ref("");
const newUser = ref("");
const newSource = ref("");
const stageOptions = ref([]);
const sourceOptions = ref([]);
const userOptions = ref([]);
// Options for dropdowns
const fetchStages = async () => {
  try {
    const response = await getAvailableStages();
    if (response.status === 200) {
      stageOptions.value = response.data.data.map((stage) => ({
        value: stage.id,
        label: stage.name,
      }));
    }
  } catch (error) {
    console.error("Error fetching stages:", error);
  }
};

// const supervisorOptions = [
//   { value: "supervisor1", label: "Supervisor 1" },
//   { value: "supervisor2", label: "Supervisor 2" },
//   { value: "eurasia", label: "Eurasia Admin" },
//   { value: "sup", label: "Sup Sup" },
// ];

// const userOptions = [
//   { value: "rep1", label: "user 1" },
//   { value: "rep2", label: "user 2" },
//   { value: "rep3", label: "user 3" },
// ];

const fetchSources = async () => {
  try {
    const response = await getSources();
    if (response.status === 200) {
      sourceOptions.value = response.data.data.map((source) => ({
        value: source.id,
        label: source.name,
      }));
    }
  } catch (error) {
    console.error("Error fetching sources:", error);
  }
};
const fetchUsers = async () => {
  try {
    const response = await getAllUsers();
    if (response.status === 200) {
      userOptions.value = [
        {
          value: 0,
          name: t("crmlist-action-unassign"),
        },
        ...response.data.data.map((user) => ({
          value: user.id,
          name: user.name,
        })),
      ];
    }
  } catch (error) {
    console.error("Error fetching sources:", error);
  }
};
onMounted(async () => {
  await fetchStages();
  await fetchSources();
  await fetchUsers();
});

// Methods
const closeModal = (modalId) => {
  const modal = Modal.getInstance(document.getElementById(modalId));
  if (modal) {
    modal.hide();
    document.querySelector(".modal-backdrop")?.remove();
    document.body.classList.remove("modal-open");
  }
};

const confirmChangeStage = async () => {
  try {
    isLoading.value = true;
    emits("update-stage", String(newStage.value));
    closeModal("changeStageModal");
    newStage.value = "";
  } catch (error) {
    console.error("Error changing stage:", error);
  } finally {
    isLoading.value = false;
  }
};

// const confirmAssignSupervisor = async () => {
//   try {
//     isLoading.value = true;
//     await emits("update-supervisor", newSupervisor.value);
//     closeModal("assignSupervisorModal");
//     newSupervisor.value = "";
//   } catch (error) {
//     console.error("Error assigning supervisor:", error);
//   } finally {
//     isLoading.value = false;
//   }
// };

const confirmAssignUser = async () => {
  try {
    isLoading.value = true;
    emits("update-user", String(newUser.value));
    closeModal("assignUser");
    newUser.value = "";
  } catch (error) {
    console.error("Error assigning representative:", error);
  } finally {
    isLoading.value = false;
  }
};

const confirmChangeSource = async () => {
  try {
    isLoading.value = true;
    emits("update-source", String(newSource.value));
    closeModal("changeSourceModal");
    newSource.value = "";
  } catch (error) {
    console.error("Error changing source:", error);
  } finally {
    isLoading.value = false;
  }
};

const confirmMultiAction = async () => {
  try {
    isLoading.value = true;
    const formVals = [newStage.value, newUser.value, newSource.value];
    if (!(newStage.value || newUser.value !== null || newSource.value)) {
      throw new Error("Select at least one field.");
    }
    emits("update-multi", formVals);
    closeModal("multiActionModal");
    newStage.value = "";
    newUser.value = "";
    newSource.value = "";
  } catch (error) {
    console.error(error.message);
    toast.error(error.message, {
      timeout: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.modal-body select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.modal-footer {
  border-top: 1px solid #ddd;
  padding: 1rem;
}
</style>
