<template>
  <div class="mt-4 me-2 bg-white p-4 rounded-3 allSetting">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link text-secondary-emphasis active"
          id="deductions-tab"
          data-bs-toggle="tab"
          data-bs-target="#deductions"
          type="button"
          role="tab"
          aria-controls="deductions"
          aria-selected="true"
        >
          {{ $t("deductions-page-title") }}
        </button>
      </li>
    </ul>
    <div
      class="tab-content mt-3"
      id="myTabContent"
      style="max-height: 80vh; overflow-y: scroll; overflow-x: hidden"
    >
      <div
        class="tab-pane fade show active"
        style="max-height: 80vh"
        id="deductions"
        role="tabpanel"
        aria-labelledby="deductions-tab"
      >
        <div class="text-end mb-3">
          <button @click="openModal(userId.value)" class="btn btn-primary">
            {{ $t("deductions-page-add-button") }}
          </button>
        </div>
        <EasyDataTable
          v-if="deductions && deductions.length > 0"
          :headers="headers"
          :items="deductions"
          :key="deductions.length"
          :rows-per-page="10"
          table-class-name="deduction-table"
        >
          <template #item-id="{ serial }">
            <div class="text-muted fs-6 my-2">{{ serial }}</div>
          </template>

          <template #item-deduction_type="{ deduction_type }">
            <div class="fs-6">{{ deduction_type }}</div>
          </template>

          <template #item-amount="{ amount }">
            <div class="fs-6">{{ amount }}</div>
          </template>

          <template #item-created_at="{ created_at }">
            <div class="fs-6">{{ created_at }}</div>
          </template>

          <template #item-actions="item">
            <div class="d-flex gap-2 my-1">
              <button
                class="btn btn-sm btn-primary"
                @click="editDeduction(item)"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="deleteDeductioncall(item.id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </template>
        </EasyDataTable>
        <div v-else class="text-center text-muted mt-3">
          {{ $t("deduction-page-table-nodeductions") }}
        </div>
      </div>
    </div>
  </div>
  <users-salary-view-add-deduction-modal
    ref="deductionModal"
    @save="handleSaveDeduction"
  />
</template>
<script>
import { ref, onMounted, computed } from "vue";
import {
  saveDeduction,
  getUserDeductions,
  deleteDeduction,
} from "@/plugins/services/salaryService";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2";
import { useNotificationStore } from "@/stores/notificationStore";
import UsersSalaryViewAddDeductionModal from "@/components/modals/UsersSalaryViewAddDeductionModal.vue";
import { useRoute } from "vue-router";
import { Toast } from "bootstrap";

export default {
  name: "UsersSalaryView",
  components: {
    EasyDataTable,
    UsersSalaryViewAddDeductionModal,
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const notificationStore = useNotificationStore();
    const userId = ref(route.params.userId);
    const validationErrors = ref({});
    const deductions = ref([]);

    const hasValidationErrors = computed(() => {
      return Object.keys(validationErrors.value).some(
        (key) => Object.keys(validationErrors.value[key]).length > 0
      );
    });

    const fetchDeductions = async () => {
      try {
        const res = await getUserDeductions(userId.value);
        if (!res || !res.data || !res.data.data) {
          deductions.value = [];
          return;
        }

        const rawData = res.data.data;
        if (!Array.isArray(rawData)) {
          deductions.value = [];
          return;
        }
        deductions.value = rawData
          .filter((item) => item != null)
          .map((item, index) => {
            return {
              serial: index + 1,
              id: item?.id ?? 0,
              deduction_type: item?.deduction_type?.name ?? "—",
              deduction_type_id: item?.deduction_type_id ?? null,
              amount: item?.amount ?? 0,
              created_at: item?.created_at
                ? new Date(item.created_at).toLocaleDateString()
                : "-",
            };
          });
      } catch (error) {
        deductions.value = [];
      }
    };

    onMounted(async () => {
      await fetchDeductions();
    });

    const headers = [
      { text: "#", value: "serial" },
      {
        text: t("users-salary-table-header-description"),
        value: "deduction_type",
      },
      { text: t("users-salary-table-header-amount_deducted"), value: "amount" },
      {
        text: t("users-salary-table-amount-deduction-date"),
        value: "created_at",
      },
      { text: t("users-salary-table-header-actions"), value: "actions" },
    ];

    const deductionModal = ref(null);
    const items = ref([]);

    const openModal = () => {
      deductionModal.value?.open(userId.value);
    };
    const closeModal = () => {
      if (deductionModal.value) {
        deductionModal.value.closeModal();
      }
    };
    const editDeduction = (item) => {
      if (deductionModal.value) {
        const fullItem = deductions.value.find((d) => d.id === item.id);
        if (fullItem) {
          const editData = {
            id: fullItem.id,
            deduction_type_id: fullItem.deduction_type_id,
            amount: parseFloat(fullItem.amount),
            emp_id: userId.value,
          };
          deductionModal.value.open(userId.value, editData);
        }
      }
    };

    const handleSaveDeduction = async (data) => {
      const response = await saveDeduction(data);
      if (!response) {
        Toast.notify("error in saving data");
      } else {
        notificationStore.success("Deduction saved successfully");
        await fetchDeductions();
      }
      closeModal();
    };

    const deleteDeductioncall = async (id) => {
      try {
        const result = await Swal.fire({
          title: t("error.deleteTitle"),
          text: t("error.deleteText"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: t("success.deleteConfirm"),
          cancelButtonText: t("error.deleteCancel"),
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          const response = await deleteDeduction(id);
          if (response.status !== 200) {
            throw new Error(response.data.message);
          }
          const index = deductions.value.findIndex((r) => r.id === id);
          if (index !== -1) {
            deductions.value.splice(index, 1);
            notificationStore.success(response.data.message, {
              timeout: 3000,
            });
          }
        }
      } catch (error) {
        notificationStore.error(error.message, {
          timeout: 3000,
        });
      }
    };

    return {
      headers,
      items,
      t,
      openModal,
      editDeduction,
      deleteDeductioncall,
      handleSaveDeduction,
      deductionModal,
      validationErrors,
      hasValidationErrors,
      userId,
      deductions,
      fetchDeductions,
    };
  },
};
</script>
<style>
.nav-tabs .nav-link.active {
  background-color: #5f5e5e;
  color: rgb(0, 0, 0) !important;
}
</style>
