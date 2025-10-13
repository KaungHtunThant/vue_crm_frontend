<template>
  <!-- Change Stage Modal -->
  <div class="modal fade" id="changeStageModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
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
            class="btn btn-danger text-white"
            data-bs-dismiss="modal"
          >
            {{ t("buttons.cancel") }}
          </button>
          <button
            type="button"
            class="btn btn-success text-white"
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
    <div class="modal-dialog modal-dialog-centered">
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
            class="btn btn-danger text-white"
            data-bs-dismiss="modal"
          >
            {{ t("buttons.cancel") }}
          </button>
          <button
            type="button"
            class="btn btn-success text-white"
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
    <div class="modal-dialog modal-dialog-centered">
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
            class="btn btn-danger text-white"
            data-bs-dismiss="modal"
          >
            {{ t("users-modal-add-button-cancel") }}
          </button>
          <button
            type="button"
            class="btn btn-success text-white"
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
    <div class="modal-dialog modal-dialog-centered">
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
            <option value="" disabled selected>
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
            <option value="" disabled selected>
              {{ t("crmlist-modal-import-placeholder-representative") }}
            </option>
            <option
              v-for="option in sortedUserOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.name }}
            </option>
          </select>
          <select v-model="newSource" class="form-select">
            <option value="" disabled selected>
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
            class="btn btn-danger text-white"
            data-bs-dismiss="modal"
          >
            {{ t("users-modal-add-button-cancel") }}
          </button>
          <button
            type="button"
            class="btn btn-success text-white"
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
import { ref, defineProps, defineEmits, onMounted, computed } from "vue";
import { Modal } from "bootstrap";
import {
  getAvailableStages,
  getAllUsers,
} from "@/plugins/services/authService";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { useSourceStore } from "@/stores/SourceStore";
import Cookies from "js-cookie";
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
const user_role = ref("");
const isLoading = ref(false);
const newStage = ref("");
const newUser = ref("");
const newSource = ref("");
const stageOptions = ref([]);
const sourceStore = useSourceStore();
const sourceOptions = computed(() =>
  sourceStore.getAllSources.map((source) => ({
    value: source.id,
    label: source.name,
  }))
);
const userOptions = ref([]);

const sortedUserOptions = computed(() => {
  return [...userOptions.value].sort((a, b) =>
    a.name.localeCompare(b.name, "en")
  );
});

// Options for dropdowns
const fetchStages = async () => {
  try {
    console.log("User role:", user_role.value);
    const response = await getAvailableStages(
      user_role.value == "after-sales" ? "after-sales" : "deals"
    );
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
  user_role.value = Cookies.get("user_role");
  await fetchStages();
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
