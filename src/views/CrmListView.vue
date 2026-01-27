<template>
  <div class="tableCrmList me-2">
    <div class="crm-container mt-3 bg-white rounded-3 me-2 p-3 pb-0 w-100">
      <div class="controls mb-2">
        <div class="row">
          <div
            class="col-sm-6 col-m-4 col-lg-4 col-xl-3"
            v-if="
              permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)
            "
          >
            <div class="input-group">
              <select
                v-model="selectedAction"
                class="text-secondary form-control"
              >
                []
                <option value="" disabled>
                  {{ t("crmlist-placeholder-action") }}
                </option>
                <option
                  v-for="action in actions"
                  :key="action.value"
                  :value="action.value"
                >
                  {{ action.label }}
                </option>
              </select>
              <button
                class="btn-actions btn btn-primary input-group-text"
                @click="executeAction"
                :disabled="!selectedAction || !selectedRows.length"
              >
                <span>{{ t("crmlist-button-actionsubmit") }}</span> ({{
                  selectedRows.length
                }})
              </button>
            </div>
          </div>
          <div class="col">
            <div class="input-group position-relative h-100">
              <input
                type="search"
                class="form-control"
                :placeholder="t('crmlist-placeholder-search')"
                v-model="searchInput"
                @search="fetchData"
                style="padding: 0.5rem 0.5rem"
              />
              <!-- <i
                v-if="searchInput"
                class="fas fa-times clear-icon p-2 rounded-2"
                @click="clearSearch"
                title="Clear Search"
              >
                CLR
              </i> -->
              <button
                :title="t('buttons.filter')"
                type="button"
                class="btn btn-header input-group-text"
                @click="openFilterModal"
              >
                <i class="fas fa-filter text-white"></i>
              </button>
              <button
                v-if="isFilterActive"
                type="button"
                class="btn btn-warning input-group-text px-1"
                @click="resetFilter"
                style="font-size: 14px"
              >
                {{ t("crmlist-modal-filter-button-reset") }}
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
              currentPage="crm-list"
            />
          </div>
          <div
            class="col-auto mt-2 mt-lg-0 text-center d-flex align-items-center justify-content-end gap-2"
          >
            <button
              class="btn btn-primary rounded-2 fs-7"
              v-if="
                permissionStore.hasPermission(
                  PERMISSIONS.DISTRIBUTE_INACTIVE_DEALS
                )
              "
              @click="distributeInactiveDeals"
            >
              <i class="fa-solid fa-dice me-2"></i>
              <span>{{ t("crmlist-button-distribute-inactive-deals") }}</span>
            </button>
            <button
              class="btn btn-header rounded-2 d-flex align-items-center"
              @click="$router.back()"
              v-if="
                permissionStore.hasPermission(PERMISSIONS.DEALS_KANBAN) &&
                user_role == 'sales'
              "
            >
              <i class="fa-solid fa-arrow-right me-2 text-white pt-1"></i>
              <span class="text-white">{{ t("crmlist-button-back") }}</span>
            </button>
            <button
              class="btn btn-primary rounded-2 fs-7"
              v-if="permissionStore.hasPermission(PERMISSIONS.CREATE_DEAL)"
              @click="openDealModal"
            >
              <i class="fa-solid fa-circle-plus me-2"></i>
              <span>{{ t("kanban-button-add-deal") }}</span>
            </button>
            <button
              class="btn btn-primary rounded-2 fs-7"
              v-if="permissionStore.hasPermission(PERMISSIONS.CREATE_DEAL)"
              @click="openImportModal"
            >
              <i class="fa-solid fa-upload me-2"></i>
              <span>{{ t("crmlist-button-import") }}</span>
            </button>
          </div>
        </div>
      </div>

      <DataTable
        :value="rows"
        :paginator="true"
        :rows="rowsPerPage"
        :rowsPerPageOptions="[10, 25, 50, 100, 250]"
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
        scrollHeight="calc(90vh - 135px)"
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
          field="name"
          :header="t('crmlist-table-header-fullname')"
        ></Column>
        <Column field="phone" :header="t('crmlist-table-header-phone')">
          <template #body="slotProps">
            <div class="d-flex align-items-center gap-1">
              <country-flag-avatar
                :phone="slotProps.data.phone"
                style="width: 25px; height: 20px !important"
              />
              <span>
                <!-- {{ slotProps.data.phone }} -->
                {{ slotProps.data.phone ?? "************" }}
              </span>
            </div>
          </template></Column
        >
        <Column
          field="note"
          :header="t('crmlist-table-header-notes')"
          class="note-column"
        ></Column>
        <Column
          field="responsible"
          :header="t('crmlist-table-header-responsible')"
          v-if="permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)"
        ></Column>
        <Column
          class="d-lg-table-cell"
          field="created_at"
          :header="t('crmlist-table-header-createdat')"
        ></Column>
        <Column
          field="updated_at"
          :header="t('crmlist-table-header-updatedat')"
        ></Column>
        <Column
          field="source"
          :header="t('crmlist-table-header-source')"
          v-if="permissionStore.hasPermission(PERMISSIONS.ADD_ASSIGNED_TO_DEAL)"
        ></Column>
        <Column
          field="stage"
          :header="t('crmlist-table-header-stage')"
        ></Column>
        <Column :header="t('crmlist-table-header-action')">
          <template #body="slotProps">
            <div class="d-flex gap-2">
              <button
                class="btn btn-sm btn-primary"
                @click="handleShowDealModal(slotProps.data.id)"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button
                v-if="permissionStore.hasPermission(PERMISSIONS.DELETE_DEAL)"
                class="btn btn-sm btn-danger"
                @click="deleteItem(slotProps.data.id)"
              >
                <i class="fas fa-trash"></i>
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

      <!-- Page Information Display -->
      <div
        class="d-flex justify-content-between align-items-center mt-3 pb-1 text-muted small"
      >
        <div class="d-flex align-items-center gap-3">
          <span>
            <i class="fas fa-info-circle me-1"></i>
            {{ t("tables-total-rows") }}: <strong>{{ totalRows }}</strong>
          </span>
          <span>
            <i class="fas fa-file-alt me-1"></i>
            {{ t("tables-total-pages") }}: <strong>{{ totalPages }}</strong>
          </span>
          <span>
            <i class="fas fa-list me-1"></i>
            {{ t("tables-current-page") }}:
            <strong>{{ currentPage + 1 }}</strong>
          </span>
        </div>
        <div class="text-end">
          <span class="badge bg-primary">
            {{ t("tables-rows-per-page") }}: {{ rowsPerPage }}
          </span>
        </div>
      </div>

      <crm-list-view-actions-deal-modal
        :selected-rows="selectedRows"
        @update-stage="(value) => handleBulkUpdate('stage_id', value)"
        @update-user="(value) => handleBulkUpdate('user_id', value)"
        @update-source="(value) => handleBulkUpdate('source_id', value)"
        @update-multi="(value) => handleBulkUpdate('multi', value)"
      />
    </div>
  </div>
  <!-- filter modal -->
  <crm-list-view-filter-modal
    v-model:filters="filters"
    @apply-filters="applyFilters"
    @reset-filter="resetFilter"
    :selectedStatuses="selectedStatuses"
    :stages="stages"
    :sources="sources"
    :users="users"
  />
  <!-- @add-deal="addNewDeal" -->
  <crm-list-create-deal-modal @add-deal="addNewDeal" ref="dealModal" />
  <import-modal @import-complete="fetchData" />
  <deal-data-card
    :key="selectedDeal?.id"
    :deal="selectedDeal"
    :logs="logs"
    :comments="comments"
    :tasks="tasks"
    :stages="stages"
    :users="users"
    :current-stage-id="selectedDeal?.stage_id"
    @open-whatsapp-modal="openWhatsappModal"
    @stage-change="changeDealStage"
  />
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useNotificationStore } from "@/stores/notificationStore";
import { useI18n } from "vue-i18n";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {
  getDeals,
  showDeal,
  deleteDeals,
  bulkUpdateDeals,
  bulkDeleteDeals,
  updateDealStage,
  mergeDeals,
} from "@/plugins/services/dealService";
import { getAllUsers } from "@/plugins/services/userService";
import { getAvailableStages } from "@/plugins/services/stageService";

import CrmListViewActionsDealModal from "@/components/modals/CrmListViewActionsDealModal.vue";
import CrmListViewFilterModal from "@/components/modals/CrmListViewFilterModal.vue";
import CrmListCreateDealModal from "@/components/modals/CrmListViewCreateDealModal.vue";
import ImportModal from "@/components/modals/CrmListViewImportModal.vue";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import Swal from "sweetalert2";
import { PERMISSIONS, usePermissionStore } from "@/stores/PermissionStore";
import DealDataCard from "@/components/modals/CrmDealKanbanDealDataModal.vue";
import Cookies from "js-cookie";
import CrmKanbanHeader from "@/components/headers/CrmDealKanbanTopHeader.vue";
import CountryFlagAvatar from "@/components/whatsapp/WhatsAppModalSidebarLeftCountryFlagAvatar.vue";
import { useSourceStore } from "@/stores/SourceStore";
import { useDealStore } from "@/stores/DealStore";
const { t } = useI18n();
const permissionStore = usePermissionStore();
const notificationStore = useNotificationStore();
const dealStore = useDealStore();
// Table state
const rows = ref([]);
const loading = ref(false);
const totalRows = ref(0);
const currentPage = ref(0);
const rowsPerPage = ref(50);
const searchInput = ref("");
const selectedRows = ref([]);
const selectedAction = ref("");
const selectedStatuses = ref([]);
const sourceStore = useSourceStore();
const sources = computed(() => sourceStore.sources);
const stages = ref([]);
const users = ref([]);

const filters = ref({
  source: "",
  stage: "",
  user_id: null,
  package: "",
  country: "",
  updated_date_start: null,
  updated_date_end: null,
  source_id: null,
  excluded_user_id: null,
  stage_id: null,
  created_date_start: null,
  created_date_end: null,
  status: [],
  sort_by: "created_at",
  sort_order: "desc",
});

const selectedDeal = ref(null);
const logs = ref([]);
const comments = ref([]);
const tasks = ref([]);
const user_role = ref();
const selected_conversation = ref(null);

const isFilterActive = computed(() => {
  return Object.entries(filters.value).some(([key, val]) => {
    if (key === "sort_by" || key === "sort_order") return false;
    if (Array.isArray(val)) return val.length > 0;
    return val !== null && val !== "";
  });
});

const totalPages = computed(() => {
  return Math.ceil(totalRows.value / rowsPerPage.value);
});
// Actions operations
const actions = ref([
  { value: "merge", label: t("crmlist-action-merge") },
  { value: "multi", label: t("crmlist-action-update") },
  { value: "delete", label: t("crmlist-action-delete") },
]);

const executeAction = () => {
  if (!selectedAction.value || selectedRows.value.length === 0) {
    alert("Please select an action and at least one item.");
    return;
  }

  let modalElement;
  let modal;

  switch (selectedAction.value) {
    case "multi":
      modalElement = document.getElementById("multiActionModal");
      if (modalElement) {
        modal = new Modal(modalElement, {
          backdrop: true,
          keyboard: true,
          focus: true,
        });
        modal.show();
      }
      break;
    case "delete":
      bulkDeleteItems();
      break;
    case "merge":
      bulkMergeItems();
      break;
  }
};

const bulkMergeItems = async () => {
  try {
    const ids = selectedRows.value.map((row) => row.id);
    if (ids.length === 0) {
      throw new Error("No deals selected.");
    }
    const result = await Swal.fire({
      title: t("crmlist-modal-deal-merge-title"),
      text: t("crmlist-modal-deal-merge-description"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("crmlist-modal-deal-merge-button-confirm"),
      cancelButtonText: t("crmlist-modal-deal-merge-button-cancel"),
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      const response = await mergeDeals(ids);
      if (response.status === 200) {
        selectedRows.value = [];
        selectedAction.value = "";
        fetchData();
        notificationStore.success(response.data.message, { timeout: 3000 });
      } else {
        throw new Error(response.data.message);
      }
    }
  } catch (error) {
    notificationStore.error(error.message, {
      timeout: 3000,
    });
  }
};

// Fetch data from the server
const fetchData = async () => {
  try {
    loading.value = true;

    if (stages.value.length === 0) {
      await fetchStages();
    }

    const apiFilters = {
      search: searchInput.value,
      page: currentPage.value + 1,
      per_page: rowsPerPage.value,
      sort_by: filters.value.sort_by,
      sort_type: filters.value.sort_order,
      filters: { ...filters.value },
    };

    if (permissionStore.hasPermission(PERMISSIONS.DEALS_LIST_KANBAN)) {
      const userId = Cookies.get("user_id");
      apiFilters.filters.user_id = userId;
    }

    const formattedFilters = {};

    if (apiFilters.filters.source_id) {
      formattedFilters["filters[source_id]"] = apiFilters.filters.source_id;
    }

    if (apiFilters.filters.stage_id) {
      formattedFilters["filters[stage_id]"] = apiFilters.filters.stage_id;
    }

    if (apiFilters.filters.user_id) {
      formattedFilters["filters[user_id]"] = apiFilters.filters.user_id;
    }

    if (apiFilters.filters.country) {
      formattedFilters["filters[country]"] = apiFilters.filters.country;
    }

    if (apiFilters.filters.origin_id) {
      formattedFilters["filters[origin_id]"] = apiFilters.filters.origin_id;
    }

    if (apiFilters.filters.import_label_id) {
      formattedFilters["filters[import_label_id]"] =
        apiFilters.filters.import_label_id;
    }

    if (apiFilters.filters.recontact_count) {
      formattedFilters["filters[recontact_count]"] =
        apiFilters.filters.recontact_count;
    }

    if (apiFilters.filters.created_date_start) {
      formattedFilters["filters[created_date_start]"] =
        apiFilters.filters.created_date_start;
    }
    if (apiFilters.filters.created_date_end) {
      formattedFilters["filters[created_date_end]"] =
        apiFilters.filters.created_date_end;
    }

    if (Array.isArray(apiFilters.filters.status)) {
      if (apiFilters.filters.status.includes("unassigned")) {
        formattedFilters["filters[unassigned]"] = 1;
      }
      if (apiFilters.filters.status.includes("no_comments")) {
        formattedFilters["filters[uncommented]"] = 1;
      }
      if (apiFilters.filters.status.includes("no_task")) {
        formattedFilters["filters[no_tasks]"] = 1;
      }
      if (apiFilters.filters.status.includes("overdue")) {
        formattedFilters["filters[overdue]"] = 1;
      }
      if (apiFilters.filters.status.includes("new")) {
        formattedFilters["filters[new]"] = 1;
      }
      if (apiFilters.filters.status.includes("admin_comments")) {
        formattedFilters["filters[admin_comments]"] = 1;
      }
      if (apiFilters.filters.status.includes("recontact_only")) {
        formattedFilters["filters[recontact_only]"] = 1;
      }
    }

    const dealsRes = await getDeals({
      ...apiFilters,
      filters: formattedFilters,
    });
    if (!dealsRes?.data?.data) {
      notificationStore.info(dealsRes.data.message || t("noDealsFound"));
      rows.value = [];
      totalRows.value = 0;
      return;
    }
    rows.value = dealsRes.data.data.map((deal) => {
      const matchedSource = sources.value.find(
        (source) => source.id === deal.source_id
      );

      return {
        id: deal.id,
        name: deal.name || t("not-set"),
        phone: deal.phone,
        note: deal.note || t("not-set"),
        created_at: deal.created_at
          ? (() => {
              const date = new Date(deal.created_at);
              const mm = String(date.getMonth() + 1).padStart(2, "0");
              const dd = String(date.getDate()).padStart(2, "0");
              const yyyy = date.getFullYear();
              return `${mm}/${dd}/${yyyy}`;
            })()
          : "",
        updated_at: new Date(deal.updated_at).toLocaleString(),
        stage: deal.stage_name || t("not-set"),
        responsible: deal.responsible_user?.name || t("not-set"),
        source: matchedSource ? matchedSource.name : t("not-set"),
      };
    });

    totalRows.value = dealsRes.data.meta.total;
  } catch (error) {
    notificationStore.error(error.message, { timeout: 3000 });
    rows.value = [];
    totalRows.value = 0;
  } finally {
    loading.value = false;
  }
};

// Handle page change event
const onPageChange = (event) => {
  currentPage.value = event.page;
  rowsPerPage.value = event.rows;
  applyFilters(filters.value);
};

const deleteItem = async (id) => {
  try {
    const result = await Swal.fire({
      title: t("error.deleteTitle"),
      text: t("crmlist-modal-deal-delete-description"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("success.deleteConfirm"),
      cancelButtonText: t("error.deleteCancel"),
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const response = await deleteDeals([id]);
      if (response.status === 204 || response.status === 200) {
        fetchData();
        notificationStore.success(response.data.message, { timeout: 3000 });
      } else {
        throw new Error(response.data.message || t("error-default"));
      }
    }
  } catch (error) {
    notificationStore.error(error.message, { timeout: 3000 });
  }
};

const handleShowDealModal = async (dealId) => {
  try {
    const response = await showDeal(dealId);
    selectedDeal.value = response.data.data;
    setTimeout(() => {
      const modalEl = document.getElementById("dealDataCard");
      const existingInstance = Modal.getInstance(modalEl);
      if (existingInstance) {
        existingInstance.dispose();
      }
      const modal = new Modal(modalEl, {
        backdrop: "static",
        focus: false,
      });
      modal.show();
    }, 300);
  } catch (error) {
    notificationStore.error(error.message);
  }
};

const applyFilters = async (newFilters) => {
  filters.value = { ...newFilters };
  try {
    loading.value = true;
    filters.value = { ...newFilters };
    // Build filters object in the correct format
    const apiFilters = {
      search: searchInput.value,
      page: currentPage.value + 1,
      per_page: rowsPerPage.value,
      sort_by: filters.value.sort_by,
      sort_type: filters.value.sort_order,
      filters: { ...filters.value },
    };

    const formattedFilters = {};

    if (apiFilters.filters.source_id) {
      formattedFilters["filters[source_id]"] = apiFilters.filters.source_id;
    }

    if (apiFilters.filters.stage_id) {
      formattedFilters["filters[stage_id]"] = apiFilters.filters.stage_id;
    }

    if (apiFilters.filters.user_id) {
      formattedFilters["filters[user_id]"] = apiFilters.filters.user_id;
    }
    if (apiFilters.filters.excluded_user_id) {
      formattedFilters["filters[excluded_user_id]"] =
        apiFilters.filters.excluded_user_id;
    }

    if (apiFilters.filters.created_date_start) {
      formattedFilters["filters[created_date_start]"] = new Date(
        apiFilters.filters.created_date_start
      )
        .toISOString()
        .slice(0, 10);
    }
    if (apiFilters.filters.created_date_end) {
      formattedFilters["filters[created_date_end]"] = new Date(
        apiFilters.filters.created_date_end
      )
        .toISOString()
        .slice(0, 10);
    }
    if (apiFilters.filters.updated_date_start) {
      formattedFilters["filters[updated_date_start]"] = new Date(
        apiFilters.filters.updated_date_start
      )
        .toISOString()
        .slice(0, 10);
    }
    if (apiFilters.filters.updated_date_end) {
      formattedFilters["filters[updated_date_end]"] = new Date(
        apiFilters.filters.updated_date_end
      )
        .toISOString()
        .slice(0, 10);
    }
    if (apiFilters.filters.nationality) {
      formattedFilters["filters[nationality]"] = apiFilters.filters.nationality;
    }
    if (apiFilters.filters.country_code) {
      formattedFilters["filters[country_code]"] =
        apiFilters.filters.country_code;
    }
    if (apiFilters.filters.origin_id) {
      formattedFilters["filters[origin_id]"] = apiFilters.filters.origin_id;
    }
    if (apiFilters.filters.import_label_id) {
      formattedFilters["filters[import_label_id]"] =
        apiFilters.filters.import_label_id;
    }
    if (apiFilters.filters.recontact_count) {
      formattedFilters["filters[recontact_count]"] =
        apiFilters.filters.recontact_count;
    }

    if (Array.isArray(apiFilters.filters.status)) {
      if (apiFilters.filters.status.includes("unassigned")) {
        formattedFilters["filters[unassigned]"] = 1;
      }
      if (apiFilters.filters.status.includes("no_comments")) {
        formattedFilters["filters[uncommented]"] = 1;
      }
      if (apiFilters.filters.status.includes("no_task")) {
        formattedFilters["filters[no_tasks]"] = 1;
      }
      if (apiFilters.filters.status.includes("overdue")) {
        formattedFilters["filters[overdue]"] = 1;
      }
      if (apiFilters.filters.status.includes("new")) {
        formattedFilters["filters[new]"] = 1;
      }
      if (apiFilters.filters.status.includes("admin_comments")) {
        formattedFilters["filters[admin_comments]"] = 1;
      }
      if (apiFilters.filters.status.includes("recontact_only")) {
        formattedFilters["filters[recontact_only]"] = 1;
      }
    }

    const response = await getDeals({
      ...apiFilters,
      filters: formattedFilters,
    });

    if (!response?.data?.data) {
      notificationStore.info(t("noDealsFound"));
      rows.value = [];
      totalRows.value = 0;
      return;
    }

    rows.value = response.data.data.map((deal) => {
      const matchedSource = sources.value.find(
        (source) => source.id === deal.source_id
      );

      return {
        id: deal.id,
        name: deal.name || t("not-set"),
        phone: deal.phone,
        note: deal.note || t("not-set"),
        created_at: deal.created_at
          ? (() => {
              const date = new Date(deal.created_at);
              const mm = String(date.getMonth() + 1).padStart(2, "0");
              const dd = String(date.getDate()).padStart(2, "0");
              const yyyy = date.getFullYear();
              return `${mm}/${dd}/${yyyy}`;
            })()
          : "",
        updated_at: new Date(deal.updated_at).toLocaleString(),
        stage: deal.stage_name || t("not-set"),
        responsible: deal.responsible_user?.name || t("not-set"),
        source: matchedSource ? matchedSource.name : t("not-set"),
      };
    });

    totalRows.value = response.data.meta.total;
    notificationStore.success(response.data.message, { timeout: 3000 });
  } catch (error) {
    notificationStore.error(error.message, { timeout: 3000 });
    rows.value = [];
    totalRows.value = 0;
  } finally {
    loading.value = false;
  }
};

// create New Deal Modal
const openDealModal = () => {
  const modalElement = document.getElementById("dealModal");
  const modal = new Modal(modalElement);
  modal.show();
  modalElement.addEventListener(
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
};

const resetFilter = () => {
  filters.value = {
    source: null,
    stage: null,
    supervisor: null,
    representative: null,
    package: null,
    updated_date_start: null,
    updated_date_end: null,
    source_id: null,
    stage_id: null,
    created_date_start: null,
    created_date_end: null,
    nationality: null,
    country_code: null,
    recontact_count: null,
    status: [],
    sort_by: "created_at",
    sort_order: "desc",
  };
  selectedStatuses.value = [];
  searchInput.value = "";
  fetchData();
};

const openFilterModal = () => {
  const modalElement = document.getElementById("filterModal");
  const modal = new Modal(modalElement);
  modal.show();
};

const openImportModal = () => {
  const modalElement = document.getElementById("importModal");
  const modal = new Modal(modalElement);
  modal.show();
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

const fetchStages = async () => {
  try {
    if (stages.value.length === 0) {
      const stageRes = await getAvailableStages(
        user_role.value == "after-sales" ? "after-sales" : "deals"
      );

      stages.value = stageRes.data.data;
    }
  } catch (error) {
    notificationStore.error(error.message, { timeout: 3000 });
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
    notificationStore.error(error.message, { timeout: 3000 });
  }
};

const handleBulkUpdate = async (key, value) => {
  try {
    const selectedIds = selectedRows.value.map((row) => row.id);

    if (selectedIds.length === 0) {
      throw new Error("No deals selected.");
    }
    const response = await bulkUpdateDeals(selectedIds, String(key), value);

    if (response.status === 200) {
      await fetchData();
      selectedRows.value = [];
      selectedAction.value = "";

      let modalElement;
      let modal;

      switch (key) {
        case "stage_id":
          modalElement = document.getElementById("changeStageModal");
          break;
        case "user_id":
          modalElement = document.getElementById("assignUser");
          break;
        case "source_id":
          modalElement = document.getElementById("changeSourceModal");
          break;
        case "multi":
          modalElement = document.getElementById("multiActionModal");
          break;
      }

      if (modalElement) {
        modal = Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }

      notificationStore.success(response.data.message, { timeout: 3000 });
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    notificationStore.error(error.message, {
      timeout: 3000,
    });
  }
};

const bulkDeleteItems = async () => {
  try {
    const ids = selectedRows.value.map((row) => row.id);

    if (ids.length === 0) {
      throw new Error("No deals selected.");
    }

    const result = await Swal.fire({
      title: t("error.deleteTitle"),
      text: t("crmlist-modal-deal-delete-description"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("success.deleteConfirm"),
      cancelButtonText: t("error.deleteCancel"),
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const response = await bulkDeleteDeals(ids);

      if (response.status === 200) {
        selectedRows.value = [];
        selectedAction.value = "";
        fetchData();
        notificationStore.success(response.data.message, {
          timeout: 3000,
        });
      } else {
        throw new Error(response.data.message);
      }
    }
  } catch (error) {
    notificationStore.error(error.message, { timeout: 3000 });
  }
};

const addNewDeal = (newDeal) => {
  try {
    const matchedStage = stages.value.find(
      (stage) => stage.value === newDeal.stage_id
    );
    const matchedSource = sources.value.find(
      (source) => source.value === newDeal.source_id
    );
    const formattedDeal = {
      id: newDeal.id,
      name: newDeal.name,
      phone: newDeal.phone,
      email: newDeal.email,
      note: newDeal.note,
      created_at: new Date().toISOString().split("T")[0],
      source: matchedSource ? matchedSource.name : t("not-set"),
      stage: matchedStage ? matchedStage.name : t("not-set"),
      responsible: newDeal.responsible_user?.name || t("not-set"),
      rating: newDeal.rating,
    };

    rows.value = [...rows.value, formattedDeal];
    const modal = Modal.getInstance(document.getElementById("dealModal"));
    if (modal) {
      modal.hide();
    }
  } catch (error) {
    notificationStore.error(error.message, { timeout: 3000 });
  }
};

const openWhatsappModal = (conversation) => {
  selected_conversation.value = conversation;
};

const changeDealStage = async (dealId, newStageId) => {
  try {
    const response = await updateDealStage(dealId, newStageId);
    if (response.status === 200) {
      notificationStore.success(response.data.message, { timeout: 3000 });
      fetchData();
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    notificationStore.error(error.message, { timeout: 3000 });
  }
};

const distributeInactiveDeals = async () => {
  try {
    const response = await dealStore.distributeInactiveDeals();
    if (response.success) {
      notificationStore.success(response.message, { timeout: 3000 });
      fetchData();
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    notificationStore.error(error.message, { timeout: 3000 });
  }
};

onMounted(async () => {
  user_role.value = Cookies.get("user_role");
  await fetchData();
  fetchUsers();
  sourceStore.fetchSources();
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
</script>

<style scoped>
input:focus {
  box-shadow: none;
  border: 1px solid #333;
}
.btn-actions {
  font-size: 14px;
}
select {
  border: 2px solid #eee;
}
select:focus {
  box-shadow: none;
  border: 2px solid #eee;
  font-size: 14px;
}

:deep(.custom-table) {
  --easy-table-row-height: 45px;
  --easy-table-header-height: 30px;
  --easy-table-body-row-font-size: 15px;
  --easy-table-header-font-size: 13px;
}

/* Better padding for action buttons */
:deep(.custom-table .btns) {
  padding: 5px 0;
  font-size: 12px;
}

:deep(.custom-table tbody tr) {
  cursor: pointer;
  user-select: none;
}

:deep(.custom-table tbody tr:hover) {
  background-color: rgba(0, 0, 0, 0.05);
}

:deep(.custom-table td) {
  pointer-events: auto;
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
:deep(.sorted-asc),
:deep(.sorted-desc) {
  background-color: rgba(0, 0, 0, 0.05);
}

:deep(.sortable):hover {
  background-color: rgba(0, 0, 0, 0.02);
  cursor: pointer;
}

:deep(.pagination-container) {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.page-info) {
  font-size: 0.9rem;
  color: #666;
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
  .fs-7 {
    font-size: 14px;
  }
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
.btn-header {
  background-color: #555555 !important;
}
</style>
