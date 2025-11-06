<template>
  <div class="mt-4 me-2 bg-white p-4 rounded-3 allSetting">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4>{{ t("commission-packages-title") || "Commission Packages" }}</h4>
      <button @click="openAddModal" class="btn btn-primary">
        <i class="fas fa-plus me-2"></i>Add Package
      </button>
    </div>

    <EasyDataTable
      v-if="packages && packages.length > 0"
      :headers="headers"
      :items="packages"
      :key="tableKey"
      :rows-per-page="10"
      table-class-name="packages-table"
    >
      <template #item-serial="item">
        <div class="text-muted fs-6 my-2">{{ item.serial }}</div>
      </template>

      <template #item-name="item">
        <div class="fs-6 fw-bold">{{ item.name }}</div>
      </template>

      <template #item-levels_count="item">
        <div class="fs-6">{{ item.levels_count }} Levels</div>
      </template>

      <template #item-created_at="item">
        <div class="fs-6">{{ item.created_at }}</div>
      </template>

      <template #item-actions="item">
        <div class="d-flex gap-2 my-1">
          <button class="btn btn-sm btn-primary" @click="editPackage(item)">
            <i class="fas fa-edit"></i>
          </button>
          <button
            class="btn btn-sm btn-danger"
            @click="deletethePackage(item.id)"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <div v-else class="text-center text-muted mt-5">
      <i class="fas fa-box-open fa-3x mb-3"></i>
      <p>No commission packages found. Click "Add Package" to create one.</p>
    </div>

    <!-- Add/Edit Package Modal -->
    <paying-level-modal ref="packageModal" @save="handleSavePackage" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2";
import { useNotificationStore } from "@/stores/notificationStore";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import PayingLevelModal from "@/components/modals/PayingLevelModal.vue";
import { deletePackage, payingLevels } from "@/plugins/services/salaryService";

export default {
  name: "CommissionsPackagesView",
  components: {
    EasyDataTable,
    PayingLevelModal,
  },
  setup() {
    const { t } = useI18n();
    const notificationStore = useNotificationStore();
    const packages = ref([]);
    const packageModal = ref(null);
    const tableKey = ref(0);

    const headers = [
      { text: "#", value: "serial" },
      { text: "Package Name", value: "name" },
      { text: "Levels", value: "levels_count" },
      { text: "Created Date", value: "created_at" },
      { text: "Actions", value: "actions" },
    ];

    const fetchPackages = async () => {
      try {
        const res = await payingLevels();

        if (res?.data?.data && Array.isArray(res.data.data)) {
          packages.value = res.data.data.map((item, index) => ({
            serial: index + 1,
            id: item?.id ?? 0,
            name: item?.name ?? "Unnamed Package",
            package_name: item?.name ?? "Unnamed Package",
            levels_count: item?.commissions?.length ?? 0,
            created_at: item?.created_at ?? "-",
            commissions: item?.commissions ?? [],
            levels: item?.commissions ?? [],
          }));
          tableKey.value++;
        } else {
          packages.value = [];
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
        notificationStore.error("Failed to load packages");
        packages.value = [];
      }
    };

    const openAddModal = () => {
      if (packageModal.value) {
        packageModal.value.open();
      }
    };

    const editPackage = (item) => {
      if (packageModal.value) {
        const fullItem = packages.value.find((p) => p.id === item.id);
        if (fullItem) {
          packageModal.value.open(fullItem);
        }
      }
    };

    const handleSavePackage = async () => {
      try {
        await fetchPackages();
        notificationStore.success("Package saved successfully");
      } catch (error) {
        console.error("Error saving package:", error);
        notificationStore.error("Failed to save package");
      }
    };

    const deletethePackage = async (id) => {
      try {
        const result = await Swal.fire({
          title: "Delete Package?",
          text: "This will delete all commission levels in this package!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          await deletePackage(id);
          await fetchPackages();
          Swal.fire({
            title: "Deleted!",
            text: "Package deleted successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error deleting package:", error);
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to delete package",
          icon: "error",
        });
      }
    };

    onMounted(async () => {
      await fetchPackages();
    });

    return {
      t,
      headers,
      packages,
      packageModal,
      tableKey,
      openAddModal,
      editPackage,
      deletethePackage,
      handleSavePackage,
    };
  },
};
</script>

<style scoped>
.packages-table {
  --easy-table-header-background-color: #f8f9fa;
}
</style>
