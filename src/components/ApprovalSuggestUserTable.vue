<template>
  <div class="tableCrmList me-2">
    <div class="container-fluid mt-3 bg-white rounded-3 p-3 pb-0">
      <div class="controls mb-3">
        <div class="row">
          <div class="col-12 col-m-6 col-lg-6">
            <div class="input-group position-relative h-100">
              <input
                type="search"
                class="form-control"
                :placeholder="t('crmlist-placeholder-search')"
                v-model="searchInput"
                @search="fetchData"
                style="padding: 0.5rem 0.5rem"
              />
              <button
                :title="t('buttons.search')"
                type="button"
                class="btn btn-header input-group-text"
                @click="fetchData"
              >
                <i class="fas fa-magnifying-glass text-white"></i>
              </button>
            </div>
          </div>
          <div
            class="col-auto"
            v-if="
              permissionStore.hasPermission(PERMISSIONS.DEALS_KANBAN) &&
              user_role == 'sales'
            "
          >
            <crm-kanban-header
              :selected_conversation="selected_conversation"
              :disableFilter="true"
            />
          </div>
        </div>
      </div>

      <DataTable
        :value="approvals"
        :paginator="true"
        :rows="rowsPerPage"
        :rowsPerPageOptions="[10, 25, 50]"
        :total-records="totalRows"
        :lazy="true"
        :loading="loading"
        @page="onPageChange"
        v-model:selection="selectedRows"
        :selectionMode="
          permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)
            ? 'multiple'
            : null
        "
        responsive="true"
        scrollable
        scrollHeight="calc(90vh - 110px)"
      >
        <Column
          :selectionMode="
            permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)
              ? 'multiple'
              : 'single'
          "
          headerStyle="width: 3rem;"
          v-if="permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)"
        ></Column>
        <Column :header="'#'">
          <template #body="slotProps">
            {{ slotProps.index + 1 + currentPage * rowsPerPage }}
          </template>
        </Column>
        <Column
          field="requested_by"
          :header="t('approvals-table-header-requesteduser')"
        ></Column>
        <Column
          field="suggested_user"
          :header="t('approvals-table-header-suggesteduser')"
        ></Column>
        <Column
          field="current_stage"
          :header="t('approvals-table-header-currentstage')"
        ></Column>
        <Column field="phone" :header="t('approvals-table-header-phone')">
          <template #body="slotProps">
            <div class="d-flex align-items-center gap-1">
              <country-flag-avatar
                :phone="slotProps.data.phone"
                style="width: 25px; height: 20px !important"
              />
              <span>{{ slotProps.data.phone }}</span>
            </div>
          </template></Column
        >
        <Column
          field="created_at"
          :header="t('approvals-table-header-createdat')"
          v-if="permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)"
        ></Column>
        <Column
          class="d-lg-table-cell"
          field="status_changed_at"
          :header="t('approvals-table-header-updatedat')"
        ></Column>
        <Column :header="t('approvals-table-header-action')">
          <template #body="slotProps">
            <div class="d-flex gap-2">
              <button
                v-show="
                  slotProps.data.status === 1 || slotProps.data.status === null
                "
                class="btn btn-sm btn-success"
                @click="handleApprove(slotProps.data.id, 1)"
                :disabled="slotProps.data.status === 1"
              >
                <i class="fas fa-check"></i>
              </button>
              <button
                v-show="
                  slotProps.data.status === 0 || slotProps.data.status === null
                "
                class="btn btn-sm btn-danger"
                @click="handleApprove(slotProps.data.id, 0)"
                :disabled="slotProps.data.status === 0"
              >
                <i class="fas fa-xmark"></i>
              </button>
            </div>
          </template>
        </Column>
        <template #loading>
          <div class="text-center loading-container">
            <div class="position-relative d-inline-block">
              <img
                src="@/assets/new-nokta-logo.png"
                class="loading-logo"
                style="width: 50px; height: 50px"
              />
            </div>
            <div class="mt-2 text-primary">{{ t("tables-loading") }}</div>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
  <!-- @add-deal="addNewDeal" -->
  <show-data :formData="dealData" ref="showDataModal" />
</template>
<script>
import { usePermissionStore, PERMISSIONS } from "@/stores/permissionStore";
import CrmKanbanHeader from "@/components/headers/CrmDealKanbanTopHeader.vue";
import CountryFlagAvatar from "@/components/whatsapp/WhatsAppModalSidebarLeftCountryFlagAvatar.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ShowData from "@/components/modals/CrmListViewShowDataModal.vue";
import Cookies from "js-cookie";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import {
  updateApproval,
  showDeal,
  getAvailableStages,
  getSources,
  getAllUsers,
  updateDealStage,
} from "@/plugins/services/authService";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import Swal from "sweetalert2";
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { useApprovalStore } from "@/stores/approvalStore";

export default {
  name: "ApprovalNewDealCreationTable",
  components: {
    DataTable,
    Column,
    CrmKanbanHeader,
    CountryFlagAvatar,
    ShowData,
  },
  setup() {
    const permissionStore = usePermissionStore();
    const { t } = useI18n();
    const toast = useToast();
    const approvalStore = useApprovalStore();
    const approvals = computed(() =>
      approvalStore.getApprovals("suggest_user_approval")
    );
    const searchInput = ref("");
    const rowsPerPage = computed(() => approvalStore.getPerPage);
    const currentPage = computed(() => approvalStore.getCurrentPage);
    const totalRows = computed(() => approvalStore.getTotal);
    // Table state
    const rows = ref([]);
    const loading = ref(false);
    const selectedRows = ref([]);
    const selectedStatuses = ref([]);
    const sources = ref([]);
    const stages = ref([]);
    const users = ref([]);
    const dealData = ref(null);
    const showDataModal = ref(null);
    const selectedDeal = ref(null);
    const logs = ref([]);
    const comments = ref([]);
    const tasks = ref([]);
    const user_role = Cookies.get("user_role");
    const selected_conversation = ref(null);
    // Fetch data from the server
    const fetchData = async () => {
      try {
        loading.value = true;
        approvalStore.fetchApprovals(
          searchInput.value,
          currentPage.value,
          rowsPerPage.value,
          "suggest_user_approval"
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(t("error.fetchFailed"));
      } finally {
        loading.value = false;
      }
    };

    // Handle page change event
    const onPageChange = (event) => {
      currentPage.value = event.page;
      rowsPerPage.value = event.rows;
    };

    const handleShowDealModal = async (dealId) => {
      try {
        const response = await showDeal(dealId);
        const deal = response.data.data;
        selectedDeal.value = deal;

        await nextTick();
        setTimeout(() => {
          const modalEl = document.getElementById("dealDataCard");
          const modal = new Modal(modalEl);
          modal.show();
          modalEl.addEventListener(
            "hidden.bs.modal",
            () => {
              const backdrop = document.querySelector(".modal-backdrop");
              if (backdrop) {
                backdrop.remove();
                document.body.classList.remove("modal-open");
                document.body.style.paddingRight = null;
              }
            },
            { once: true }
          );
        }, 300);
      } catch (error) {
        console.error("Error fetching deal data:", error);
      }
    };

    const handleRightClick = (event) => {
      event.preventDefault();
      const modalElements = document.querySelectorAll(".modal");
      modalElements.forEach((modal) => {
        if (modal.classList.contains("show")) {
          const closeButton = modal.querySelector('[data-bs-dismiss="modal"]');
          if (closeButton) {
            closeButton.click();
          }
        }
      });
    };

    const fetchStagesAndSources = async () => {
      try {
        if (stages.value.length === 0 || sources.value.length === 0) {
          console.log("Fetching stages and sources...");
          const [stageRes, sourceRes] = await Promise.all([
            getAvailableStages(),
            getSources(),
          ]);

          stages.value = stageRes.data.data.map((stage) => ({
            value: stage.id,
            name: stage.name,
          }));

          sources.value = sourceRes.data.data.map((source) => ({
            value: source.id,
            name: source.name,
          }));

          console.log("Fetched stages and sources:", {
            stages: stages.value,
            sources: sources.value,
          });
        }
      } catch (error) {
        console.error("Error fetching stages and sources:", error);
        toast.error(t("error.fetchFailed"));
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.status === 200) {
          users.value = response.data.data.map((user) => ({
            id: user.id,
            name: user.name,
            role: user.role,
          }));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const openWhatsappModal = (conversation) => {
      selected_conversation.value = conversation;
    };

    const changeDealStage = async (dealId, newStageId) => {
      try {
        const response = await updateDealStage(dealId, newStageId);
        if (response.status === 200) {
          toast.success(response.data.message, { timeout: 3000 });
          fetchData();
        } else {
          toast.error(t("error.stageChangeFailed"), { timeout: 3000 });
        }
      } catch (error) {
        console.error("Error changing deal stage:", error);
        toast.error(t("error.stageChangeFailed"), { timeout: 3000 });
      }
    };

    const handleApprove = async (id, approval) => {
      const result = await Swal.fire({
        title: t("approval-confirmation-title"),
        text: t("approval-confirmation-description"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("success.deleteConfirm"),
        cancelButtonText: t("error.deleteCancel"),
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const response = await updateApproval(id, approval);
        if (response.status === 204 || response.status === 200) {
          fetchData();
          toast.success(response.data.message, { timeout: 3000 });
        } else {
          throw new Error(response.data.message || t("error-default"));
        }
      }
    };

    onMounted(async () => {
      await fetchData();
      fetchUsers();
      const modalElements = document.querySelectorAll(".modal");
      modalElements.forEach((element) => {
        new Modal(element, {
          backdrop: true,
          keyboard: true,
          focus: true,
        });
      });
      window.addEventListener("contextmenu", handleRightClick);
    });

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    return {
      permissionStore,
      t,
      toast,
      rows,
      loading,
      totalRows,
      currentPage,
      rowsPerPage,
      selectedRows,
      selectedStatuses,
      sources,
      stages,
      users,
      dealData,
      showDataModal,
      selectedDeal,
      logs,
      comments,
      tasks,
      user_role,
      selected_conversation,
      fetchData,
      onPageChange,
      handleShowDealModal,
      handleRightClick,
      fetchStagesAndSources,
      fetchUsers,
      openWhatsappModal,
      changeDealStage,
      handleApprove,
      getAvailableStages,
      getSources,
      getAllUsers,
      updateDealStage,
      updateApproval,
      PERMISSIONS,
      approvalStore,
      approvals,
      searchInput,
    };
  },
};
</script>
<style scoped>
input:focus {
  box-shadow: none;
  border: 1px solid #333;
}
.btn-header {
  background-color: rgba(128, 128, 128, 0.8) !important;
}
.loading-logo {
  animation: pulse-and-spin 2s infinite linear;
  z-index: 2;
}
@keyframes pulse-and-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
:deep(.p-datatable) {
  font-size: 14px;
}
:deep(.p-datatable th),
:deep(.p-datatable td) {
  padding: 8px;
}
:deep(.p-datatable thead th) {
  font-weight: bold;
  text-align: center;
}
:deep(.p-datatable tbody td) {
  text-align: left;
}
:deep(.note-column) {
  max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 850px) {
  :deep(.note-column) {
    max-width: 200px;
  }
}
.clear-icon {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%) translateX(50%);
  color: #6c757d;
  cursor: pointer;
  z-index: 2;
  transition: color 0.2s;
  font-size: 12px !important;
  z-index: 1000;
  transition: all 0.2s ease-in-out;
}
.clear-icon:hover {
  color: #fff;
  background: red;
}
</style>
