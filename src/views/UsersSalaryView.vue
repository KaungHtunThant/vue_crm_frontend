<template>
  <div class="mt-4 me-2 bg-white p-4 rounded-3 allSetting">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link text-secondary-emphasis active"
          id="general-tab"
          data-bs-toggle="tab"
          data-bs-target="#general"
          type="button"
          role="tab"
          aria-controls="general"
          aria-selected="true"
        >
          Salary & Commissions
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link text-secondary-emphasis"
          id="deductions-tab"
          data-bs-toggle="tab"
          data-bs-target="#deductions"
          type="button"
          role="tab"
          aria-controls="deductions"
          aria-selected="false"
        >
          Deduction
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
        id="general"
        role="tabpanel"
        aria-labelledby="general-tab"
      >
        <form @submit.prevent="submitSalaryForm">
          <div
            v-for="(row, index) in salaryRows"
            :key="index"
            class="row g-3 mb-3"
          >
            <div class="col-md-3">
              <label class="form-label">Basic Salary</label>
              <input
                type="number"
                class="form-control"
                v-model="row.basic_salary"
                required
              />
            </div>

            <div class="col-md-3">
              <label class="form-label">Commission %</label>
              <input
                type="number"
                class="form-control"
                min="0"
                max="100"
                v-model="row.commission_percent"
                required
              />
            </div>

            <div class="col-md-2">
              <label class="form-label">Min Amount</label>
              <input
                type="number"
                class="form-control"
                v-model="row.minimum_amount"
                required
              />
            </div>

            <div
              class="col-md-1 d-flex align-items-end justify-content-center fw-bold"
            >
              Upto
            </div>

            <div class="col-md-3">
              <label class="form-label">Max Amount</label>
              <input
                type="number"
                class="form-control"
                v-model="row.maximum_amount"
                required
              />
            </div>
          </div>
          <div class="mt-2 mb-3" v-if="!hasData && salaryRows.length < 9">
            <button class="btn btn-primary" type="button" @click="addRow">
              + Add More
            </button>
          </div>

          <div class="text-end mt-4">
            <button type="submit" class="btn btn-success px-4">Submit</button>
          </div>
        </form>
      </div>
      <div
        class="tab-pane fade"
        style="max-height: 80vh"
        id="deductions"
        role="tabpanel"
        aria-labelledby="deductions-tab"
      >
        <div class="text-end mb-3">
          <button @click="openModal" class="btn btn-primary">
            Add Deduction
          </button>
        </div>
        <EasyDataTable
          :headers="headers"
          :items="items"
          :rows-per-page="10"
          table-class-name="deduction-table"
        >
          <template #item-id="item">
            <div class="text-muted fs-6 my-2">{{ item.id }}</div>
          </template>
          <template #item-description="item">
            <div class="fs-6">{{ item.description }}</div>
          </template>

          <template #item-amount_deducted="item">
            <div class="fs-6">{{ item.amount_deducted }}</div>
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
                @click="deleteDeduction(item.id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </template>
        </EasyDataTable>
      </div>
    </div>
  </div>
  <users-salary-view-add-deduction-modal
    ref="deductionModal"
    @save="handleSaveDeduction"
  />
</template>

<script>
import { ref, onMounted } from "vue";
import { getSalary, createSalary } from "@/plugins/services/salaryService";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2";
import { useNotificationStore } from "@/stores/notificationStore";
import UsersSalaryViewAddDeductionModal from "@/components/modals/UsersSalaryViewAddDeductionModal.vue";
export default {
  name: "UsersSalaryView",
  components: {
    EasyDataTable,
    UsersSalaryViewAddDeductionModal,
  },
  setup() {
    const { t } = useI18n();
    const notificationStore = useNotificationStore();
    const salaryRows = ref([]);
    const hasData = ref(false);

    const fetchSalaryData = async () => {
      try {
        salaryRows.value = [
          {
            basic_salary: null,
            commission_percent: null,
            minimum_amount: null,
            maximum_amount: null,
          },
        ];
        hasData.value = false;

        const res = await getSalary();

        if (Array.isArray(res.data) && res.data.length > 0) {
          salaryRows.value = res.data;
          hasData.value = true;
        }
      } catch (e) {
        hasData.value = false;
      }
    };

    const addRow = () => {
      if (salaryRows.value.length < 9) {
        salaryRows.value.push({
          basic_salary: null,
          commission_percent: null,
          minimum_amount: null,
          maximum_amount: null,
        });
        notificationStore.success(t("success.addNewRow"));
      }
    };

    const submitSalaryForm = async () => {
      try {
        salaryRows.value.sort((a, b) => a.basic_salary - b.basic_salary);

        for (let i = 1; i < salaryRows.value.length; i++) {
          const prev = salaryRows.value[i - 1];
          const current = salaryRows.value[i];

          if (current.basic_salary <= prev.basic_salary) {
            return Swal.fire({
              icon: "error",
              title: "Invalid Salary Order",
              text: `Basic Salary in row ${i + 1} must be higher than row ${i}`,
            });
          }

          if (current.minimum_amount <= prev.maximum_amount) {
            return Swal.fire({
              icon: "error",
              title: "Invalid Range",
              text: `Min Amount in row ${
                i + 1
              } must be higher than Max Amount in row ${i}`,
            });
          }
        }

        await createSalary(salaryRows.value);
        await fetchSalaryData();
        notificationStore.success(t("success.added"));
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(fetchSalaryData);
    const headers = [
      { text: "#", value: "id" },
      { text: t("users-salary-table-header-description"), value: "reason" },
      { text: t("users-salary-table-header-amount_deducted"), value: "amount" },
      { text: t("users-salary-table-header-actions"), value: "actions" },
    ];

    const deductionModal = ref(null);
    const items = ref([]);

    const openModal = () => {
      deductionModal.value?.open();
    };
    const closeModal = () => {
      if (deductionModal.value) {
        deductionModal.value.closeModal();
      }
    };
    const editDeduction = (item) => {
      deductionModal.value?.open(item);
    };

    const handleSaveDeduction = (data) => {
      if (data.id) {
        const index = items.value.findIndex((i) => i.id === data.id);
        if (index !== -1) items.value[index] = { ...data };
        notificationStore.success(t("success.updated"), {
          timeout: 3000,
        });
      } else {
        data.id = items.value.length + 1;
        items.value.push(data);
        notificationStore.success(t("success.added"), {
          timeout: 3000,
        });
      }
      closeModal();
    };

    const deleteDeduction = async (id) => {
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
          const index = items.value.findIndex((r) => r.id === id);
          if (index !== -1) {
            items.value.splice(index, 1);
            notificationStore.success(t("success.deleted"), {
              timeout: 3000,
            });
          }
        }
      } catch (error) {
        console.error("Error deleting deduction:", error);
        notificationStore.error(t("error.deleteFailed"), {
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
      deleteDeduction,
      handleSaveDeduction,
      deductionModal,
      salaryRows,
      hasData,
      addRow,
      submitSalaryForm,
    };
  },
};
</script>

<style scoped></style>
