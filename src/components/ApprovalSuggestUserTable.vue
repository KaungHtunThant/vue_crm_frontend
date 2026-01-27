<template>
  <div class="tableCrmList me-2">
    <div class="container-fluid mt-3 bg-white rounded-3 p-3 pb-0">
      <div class="controls mb-3">
        <div class="row">
          <div class="col-12 col-m-6 col-lg-6 m-auto">
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
        responsive="true"
        scrollable
        scrollHeight="calc(90vh - 110px)"
      >
        <!-- <Column
          :selectionMode="
            permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)
              ? 'multiple'
              : 'single'
          "
          headerStyle="width: 3rem;"
          v-if="permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)"
        ></Column> -->
        <Column :header="'#'">
          <template #body="slotProps">
            {{ slotProps.index + 1 + (currentPage - 1) * rowsPerPage }}
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
        >
          <template #body="slotProps">
            {{ new Date(slotProps.data.created_at).toLocaleString() }}
          </template>
        </Column>
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
                :src="logo"
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
import { usePermissionStore, PERMISSIONS } from "@/stores/PermissionStore";
import CrmKanbanHeader from "@/components/headers/CrmDealKanbanTopHeader.vue";
import CountryFlagAvatar from "@/components/whatsapp/WhatsAppModalSidebarLeftCountryFlagAvatar.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ShowData from "@/components/modals/CrmListViewShowDataModal.vue";
import Cookies from "js-cookie";
import { useI18n } from "vue-i18n";
import { useNotificationStore } from "@/stores/notificationStore";
import { showDeal } from "@/plugins/services/dealService";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import Swal from "sweetalert2";
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { useApprovalStore } from "@/stores/ApprovalStore";
import { useSourceStore } from "@/stores/SourceStore";
import { useUserStore } from "@/stores/UserStore";

export default {
  name: "ApprovalSuggestUserTable",
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
    const notificationStore = useNotificationStore();
    const approvalStore = useApprovalStore();
    const userStore = useUserStore();
    const approvals = computed(() => approvalStore.getApprovals);
    const searchInput = ref("");
    const rowsPerPage = ref(10);
    const currentPage = ref(1);
    const totalRows = computed(() =>
      approvalStore.getTotalWithType("suggest_user_approval")
    );
    // Table state
    const loading = ref(false);
    const selectedStatuses = ref([]);
    const sourceStore = useSourceStore();
    const sources = computed(() => sourceStore.sources);
    const users = computed(() => userStore.getAllUsers);
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
        notificationStore.error(error.message);
      } finally {
        loading.value = false;
      }
    };

    // Handle page change event
    const onPageChange = (event) => {
      currentPage.value = event.page + 1;
      rowsPerPage.value = event.rows;
      fetchData();
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
        // Error handled silently
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

    const openWhatsappModal = (conversation) => {
      selected_conversation.value = conversation;
    };

    const handleApprove = async (id, approval) => {
      const message = approval
        ? "approvals-confirmation-title-approve"
        : "approvals-confirmation-title-reject";
      const result = await Swal.fire({
        title: t(message),
        text: t("approvals-confirmation-description"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("success.deleteConfirm"),
        cancelButtonText: t("error.deleteCancel"),
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const response = await approvalStore.updateApproval(id, approval);
        if (response.success) {
          fetchData();
          notificationStore.success(response.message, { timeout: 3000 });
        } else {
          notificationStore.error(response.message, { timeout: 3000 });
        }
      }
    };

    onMounted(async () => {
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

    const logo = require("@/assets/" + process.env.VUE_APP_LOGO_NAME);

    return {
      logo,
      permissionStore,
      t,
      loading,
      totalRows,
      currentPage,
      rowsPerPage,
      selectedStatuses,
      sources,
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
      openWhatsappModal,
      handleApprove,
      PERMISSIONS,
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
