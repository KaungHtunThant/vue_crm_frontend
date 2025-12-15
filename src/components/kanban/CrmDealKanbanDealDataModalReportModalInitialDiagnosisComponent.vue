<template>
  <div class="question bg-light ps-2 py-2 mb-2 rounded-3">
    <label class="form-label">
      <i class="fa-solid fa-notes-medical"></i>
      {{ $t("kanban-modal-edit-label-initialdiagnosis")
      }}<span class="text-danger">*</span>
    </label>
    <div class="row m-0 g-0">
      <div
        class="col-12 col-lg-6 p-0"
        v-for="(problem, index) in local_data?.diagnoses || []"
        :key="index"
      >
        <div class="row p-0 g-0 pe-2">
          <div class="col-7 pe-2 pb-2">
            <select
              class="form-select py-2 me-2"
              :class="isEditMode ? 'bg-input-edit' : 'bg-input'"
              v-model="problem.id"
              :disabled="packagesRules"
            >
              <option value="" disabled>
                {{ $t("kanban-modal-edit-placeholder-initialdiagnosis") }}
              </option>
              <option
                v-for="pkg in diagnoses_packages"
                :key="pkg.id"
                :value="pkg.id"
              >
                {{ pkg.name }}
              </option>
            </select>
          </div>
          <div class="col-4 pe-2 pb-2">
            <select
              class="form-select py-2 me-2 bg-input-edit"
              v-model="problem.severity"
              :disabled="packagesRules"
            >
              <option value="" disabled>
                {{ $t("kanban-modal-edit-placeholder-severity") }}
              </option>
              <option value="mild">
                {{ $t("kanban-modal-edit-severity-low") }}
              </option>
              <option value="moderate">
                {{ $t("kanban-modal-edit-severity-medium") }}
              </option>
              <option value="severe">
                {{ $t("kanban-modal-edit-severity-high") }}
              </option>
            </select>
          </div>
          <div class="col-1 pb-2">
            <button
              class="btn btn-primary me-2 h-100"
              @click="removePatientProblem(index)"
              type="button"
              :hidden="packagesRules"
            >
              x
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="w-100 d-flex mt-2 justify-content-start gap-2">
      <button
        type="button"
        class="btn btn-primary fs-5 px-3"
        @click="addNewPatientProblem"
        :hidden="packagesRules"
      >
        +
      </button>
    </div>
  </div>
</template>
<script>
import { usePackageStore } from "@/stores/PackageStore";
import { useDealStore } from "@/stores/DealStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { computed } from "vue";
import { onMounted, ref, watch } from "vue";
import { PERMISSIONS, usePermissionStore } from "@/stores/PermissionStore";
import { useStageStore } from "@/stores/StageStore";
import Cookies from "js-cookie";
export default {
  name: "InitialDiagnosisComponent",
  setup() {
    const deal_store = useDealStore();
    const notification_store = useNotificationStore();
    const package_store = usePackageStore();
    const data = computed(() => deal_store.getCurrentDeal);
    const local_data = ref({});
    const permissionStore = usePermissionStore();
    const ConfirmedStageId = ref(null);
    const stage_store = useStageStore();
    const diagnoses_packages = computed(() =>
      package_store.getPackagesWithCategory("initial-diagnostics")
    );
    const addNewPatientProblem = () => {
      local_data.value.diagnoses.push({
        id: null,
        severity: null,
      });
    };
    const packagesRules = computed(() => {
      const $userRole = Cookies.get("user_role");
      if ($userRole === "super-admin" || $userRole === "crm-admin") {
        return false;
      }
      return (
        !permissionStore.hasPermission(PERMISSIONS.EDIT_SALES_PACKAGE) ||
        ConfirmedStageId.value === local_data.value.stage_id
      );
    });
    const removePatientProblem = (index) => {
      try {
        local_data.value.diagnoses.splice(index, 1);
      } catch (error) {
        console.error("Error removing patient problem:", error);
        notification_store.error(error.message, {
          timeout: 3000,
        });
      }
    };

    onMounted(async () => {
      if (package_store.getCategories.length === 0) {
        package_store.fetchCategories();
      }
      if (package_store.getAllPackages.length === 0) {
        package_store.fetchPackages();
      }
      local_data.value = {
        ...data.value,
        diagnoses: data.value?.diagnoses || [],
      };
      try {
        const confirmedStage = await stage_store.fetchConfirmedStage();
        ConfirmedStageId.value = confirmedStage.id;
      } catch (error) {
        console.error("Failed to fetch confirmed stage:", error);
        notification_store.error("Failed to load stage information", {
          timeout: 3000,
        });
      }
    });
    watch(
      () => data.value,
      (newVal) => {
        if (newVal?.id != local_data.value?.id) {
          local_data.value = {
            ...newVal,
            diagnoses: newVal?.diagnoses || [],
          };
        }
      }
    );
    watch(
      () => local_data.value,
      (newVal) => {
        if (newVal?.id) {
          deal_store.setCurrentDeal(newVal);
        }
      },
      { deep: true }
    );
    return {
      local_data,
      diagnoses_packages,
      addNewPatientProblem,
      removePatientProblem,
      permissionStore,
      PERMISSIONS,
      packagesRules,
      ConfirmedStageId,
    };
  },
};
</script>
