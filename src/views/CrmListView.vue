<template>
  <div class="tableCrmList me-2">
    <div class="crm-container mt-3 bg-white rounded-3 me-2 p-3 pb-0 w-100">
      <div class="controls mb-3">
        <div class="row">
          <div
            class="col-sm-6 col-lg"
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
              />
              <i
                v-if="searchInput"
                class="fas fa-times clear-icon p-2 rounded-2"
                @click="clearSearch"
                title="Clear Search"
              >
                CLR
              </i>
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
            <topHeader2
              :selected_conversation="selected_conversation"
              :disableFilter="true"
            />
          </div>
          <div
            class="col-auto mt-2 mt-lg-0 text-center d-flex align-items-center justify-content-end gap-2"
          >
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
              class="btn btn-primary rounded-2 me-2 fs-7"
              v-if="permissionStore.hasPermission(PERMISSIONS.CREATE_DEAL)"
              @click="openDealModal"
            >
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
        scrollHeight="calc(90vh - 120px)"
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
        <Column
          field="phone"
          :header="t('crmlist-table-header-phone')"
        ></Column>
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
                src="@/assets/new-nokta-logo.png"
                class="loading-logo"
                style="width: 50px; height: 50px"
              />
            </div>
            <div class="mt-2 text-primary">{{ t("tables-loading") }}</div>
          </div>
        </template>
      </DataTable>
      <ActionsDeal
        :selected-rows="selectedRows"
        @update-stage="(value) => handleBulkUpdate('stage_id', value)"
        @update-user="(value) => handleBulkUpdate('user_id', value)"
        @update-source="(value) => handleBulkUpdate('source_id', value)"
      />
    </div>
  </div>
  <!-- filter modal -->
  <FilterCrmList
    v-model:filters="filters"
    @apply-filters="applyFilters"
    @reset-filter="resetFilter"
    :selectedStatuses="selectedStatuses"
    :stages="stages"
    :sources="sources"
    :users="users"
  />
  <!-- @add-deal="addNewDeal" -->
  <DealModal @add-deal="addNewDeal" ref="dealModal" />
  <ImportModal @import-complete="fetchData" />
  <ShowData :formData="dealData" ref="showDataModal" />
  <DealDataCard
    :key="selectedDeal?.id"
    :deal="selectedDeal"
    :logs="logs"
    :comments="comments"
    :tasks="tasks"
    @open-whatsapp-modal="openWhatsappModal"
    @stage-change="changeDealStage"
  />
</template>
<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {
  getDeals,
  showDeal,
  deleteDeals,
  getSources,
  getStages,
  bulkUpdateDeals,
  bulkDeleteDeals,
  getAllUsers,
  updateDealStage,
} from "@/plugins/services/authService";
import ActionsDeal from "@/components/modals/ActionsDeal.vue";
import FilterCrmList from "@/components/modals/FilterCrmList.vue";
import DealModal from "@/components/modals/CreateDeal.vue";
import ImportModal from "@/components/modals/ImportModal.vue";
import ShowData from "@/components/modals/ShowData.vue";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import Swal from "sweetalert2";
import { PERMISSIONS, usePermissionStore } from "@/stores/permissionStore";
import DealDataCard from "@/components/modals/DealDataCard.vue";
import Cookies from "js-cookie";
import TopHeader2 from "@/components/headers/TopHeader2.vue";
const { t } = useI18n();
const toast = useToast();
const permissionStore = usePermissionStore();

// Table state
const rows = ref([]);
const loading = ref(false);
const totalRows = ref(0);
const currentPage = ref(0);
const rowsPerPage = ref(10);
const search = ref("");
const searchInput = ref("");
const selectedRows = ref([]);
const selectedAction = ref("");
const selectedStatuses = ref([]);
const sources = ref([]);
const stages = ref([]);
const users = ref([]);
const filters = ref({
  source: "",
  stage: "",
  supervisor: "",
  representative: "",
  package: "",
  updated_at_start: null,
  updated_at_end: null,
  source_id: null,
  stage_id: null,
  created_at_start: null,
  created_at_end: null,
  status: [],
  sort_by: "created_at",
  sort_order: "desc",
});
const dealData = ref(null);
const showDataModal = ref(null);
const selectedDeal = ref(null);
const logs = ref([]);
const comments = ref([]);
const tasks = ref([]);
const user_role = Cookies.get("user_role");
const selected_conversation = ref(null);
const isFilterActive = computed(() => {
  return Object.entries(filters.value).some(([key, val]) => {
    if (key === "sort_by" || key === "sort_order") return false;
    if (Array.isArray(val)) return val.length > 0;
    return val !== null && val !== "";
  });
});
// Actions operations
const actions = ref([
  { value: "changeStage", label: t("crmlist-action-changestage") },
  { value: "assignUser", label: t("crmlist-action-assignto") },
  { value: "changeSource", label: t("crmlist-action-changesource") },
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
    case "changeStage":
      modalElement = document.getElementById("changeStageModal");
      if (modalElement) {
        modal = new Modal(modalElement, {
          backdrop: true,
          keyboard: true,
          focus: true,
        });
        modal.show();
      }
      break;

    case "assignUser":
      modalElement = document.getElementById("assignUser");
      if (modalElement) {
        modal = new Modal(modalElement, {
          backdrop: true,
          keyboard: true,
          focus: true,
        });
        modal.show();
      }
      break;

    case "changeSource":
      modalElement = document.getElementById("changeSourceModal");
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
  }
};
// Fetch data from the server
const fetchData = async () => {
  try {
    loading.value = true;

    if (stages.value.length === 0 || sources.value.length === 0) {
      await fetchStagesAndSources();
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

    if (apiFilters.filters.created_at_start) {
      formattedFilters["filters[created_at_start]"] =
        apiFilters.filters.created_at_start;
    }
    if (apiFilters.filters.created_at_end) {
      formattedFilters["filters[created_at_end]"] =
        apiFilters.filters.created_at_end;
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
      if (apiFilters.filters.status.includes("reclaimed")) {
        formattedFilters["filters[reclaimed]"] = 1;
      }
    }

    const dealsRes = await getDeals({
      ...apiFilters,
      filters: formattedFilters,
    });
    if (!dealsRes?.data?.data) {
      toast.info(dealsRes.data.message || t("noDealsFound"));
      rows.value = [];
      totalRows.value = 0;
      return;
    }
    rows.value = dealsRes.data.data.map((deal) => {
      const matchedStage = stages.value.find(
        (stage) => stage.value === deal.stage_id
      );
      const matchedSource = sources.value.find(
        (source) => source.value === deal.source_id
      );

      return {
        id: deal.id,
        name: deal.name || "Empty",
        phone: deal.phone,
        note: deal.note || "Empty",
        created_at: deal.created_at.split("T")[0],
        stage: matchedStage ? matchedStage.name : "Not set",
        responsible: deal.responsible_user?.name || "Not Assigned",
        source: matchedSource ? matchedSource.name : "Not set",
      };
    });

    totalRows.value = dealsRes.data.meta.total;
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error(error.message, { timeout: 3000 });
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
        toast.success(response.data.message, { timeout: 3000 });
      } else {
        throw new Error(response.data.message || t("error-default"));
      }
    }
  } catch (error) {
    toast.error(error.message, { timeout: 3000 });
    console.error("Delete Error:", error);
  }
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

    if (apiFilters.filters.created_at_start) {
      formattedFilters["filters[created_at_start]"] =
        apiFilters.filters.created_at_start;
    }
    if (apiFilters.filters.created_at_end) {
      formattedFilters["filters[created_at_end]"] =
        apiFilters.filters.created_at_end;
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
      if (apiFilters.filters.status.includes("reclaimed")) {
        formattedFilters["filters[reclaimed]"] = 1;
      }
    }

    const response = await getDeals({
      ...apiFilters,
      filters: formattedFilters,
    });

    if (!response?.data?.data) {
      toast.info(t("noDealsFound"));
      rows.value = [];
      totalRows.value = 0;
      return;
    }

    rows.value = response.data.data.map((deal) => {
      const matchedStage = stages.value.find(
        (stage) => stage.value === deal.stage_id
      );
      const matchedSource = sources.value.find(
        (source) => source.value === deal.source_id
      );

      return {
        id: deal.id,
        name: deal.name || "Empty",
        phone: deal.phone,
        note: deal.note || "Empty",
        created_at: deal.created_at.split("T")[0],
        stage: matchedStage ? matchedStage.name : "Not set",
        responsible: deal.responsible_user?.name || "Not Assigned",
        source: matchedSource ? matchedSource.name : "Not set",
      };
    });

    totalRows.value = response.data.meta.total;
    toast.success(t("success.applyFilters"), { timeout: 3000 });
  } catch (error) {
    console.error("Filter Error:", error);
    toast.error(t("error.applyFilters"), { timeout: 3000 });
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
};

const clearSearch = () => {
  searchInput.value = "";
  search.value = "";
  fetchData();
};

const resetFilter = () => {
  filters.value = {
    source: "",
    stage: "",
    supervisor: "",
    representative: "",
    package: "",
    updated_at_start: null,
    updated_at_end: null,
    source_id: null,
    stage_id: null,
    created_at_start: null,
    created_at_end: null,
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
// const handleDelete = async () => {
//   try {
//     const selectedIds = selectedRows.value.map((row) => row.id);

//     const result = await Swal.fire({
//       title: t("error.deleteTitle"),
//       text: t("error.deleteText"),
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: t("success.deleteConfirm"),
//       cancelButtonText: t("error.deleteCancel"),
//       reverseButtons: true,
//     });

//     if (result.isConfirmed) {
//       const response = await deleteDeals(selectedIds);

//       if (response.data.success) {
//         rows.value = rows.value.filter(
//           (item) => !selectedIds.includes(item.id)
//         );
//         selectedRows.value = [];
//         selectedAction.value = "";

//         toast.success(t("success.deleteSuccess"), {
//           timeout: 3000,
//         });
//       } else {
//         throw new Error(response.data.message || t("error.deleteFailed"));
//       }
//     }
//   } catch (error) {
//     toast.error(error.response?.data?.message || t("error.deleteFailed"), {
//       timeout: 3000,
//     });
//     console.error("Delete Error:", error);
//   }
// };

// const handleRowClick = (item, event) => {
//   if (event?.target?.closest("button")) {
//     return;
//   }

//   const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
//   const isSelected = selectedRows.value.some((row) => row.id === item.id);

//   if (isSelected) {
//     selectedRows.value = selectedRows.value.filter((row) => row.id !== item.id);
//     if (checkbox) {
//       checkbox.checked = false;
//     }
//   } else {
//     selectedRows.value = [...selectedRows.value, item];
//     if (checkbox) {
//       checkbox.checked = true;
//     }
//   }
// };
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
        getStages(),
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

// const loadCarsLazy = async (event) => {
//   try {
//     const response = await getDeals({
//       page: event.page + 1,
//       per_page: event.rows,
//       sort_by: "created_at",
//       sort_order: "desc",
//     });
//     rows.value = response.data.data;
//     totalRows.value = response.data.meta.total;
//   } catch (error) {
//     console.error("Error fetching lazy data:", error);
//     toast.error(t("error.fetchFailed"));
//   }
// };

const handleBulkUpdate = async (key, value) => {
  try {
    const selectedIds = selectedRows.value.map((row) => row.id);

    if (selectedIds.length === 0) {
      toast.error(t("error.noItemsSelected"), { timeout: 3000 });
      return;
    }

    const response = await bulkUpdateDeals(
      selectedIds,
      String(key),
      String(value)
    );

    if (
      response.data.success ||
      response.data.message === "Deals updated successfully"
    ) {
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
      }

      if (modalElement) {
        modal = Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }

      toast.success(t("success.bulkUpdateSuccess"), { timeout: 3000 });
    } else {
      console.error(
        "Error updating stage:",
        response.data.message || "Unknown error"
      );
    }
  } catch (error) {
    toast.error(error.response?.data?.message || t("error.bulkUpdateFailed"), {
      timeout: 3000,
    });
    console.error("Bulk Update Error:", error);
  }
};

const bulkDeleteItems = async () => {
  try {
    const ids = selectedRows.value.map((row) => row.id);

    if (ids.length === 0) {
      toast.error(t("error.noItemsSelected"), { timeout: 3000 });
      return;
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
      console.log("IDs to delete:", ids);
      const response = await bulkDeleteDeals(ids);
      console.log("Delete response:", response);

      if (response.status === 200) {
        selectedRows.value = [];
        selectedAction.value = "";
        fetchData();
        toast.success(t("success.deleteSuccess"), { timeout: 3000 });
      } else {
        throw new Error(response.data.message || t("error.deleteFailed"));
      }
    }
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    toast.error(error.response?.data?.message || t("error.deleteFailed"), {
      timeout: 3000,
    });
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
      source: matchedSource ? matchedSource.name : "Not set",
      stage: matchedStage ? matchedStage.name : "Not set",
      responsible: newDeal.responsible_user?.name || "Not Assigned",
      rating: newDeal.rating,
    };

    rows.value = [...rows.value, formattedDeal];
    const modal = Modal.getInstance(document.getElementById("dealModal"));
    if (modal) {
      modal.hide();
    }
  } catch (error) {
    console.error("Error fetching user data for new deal:", error);
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

onMounted(async () => {
  // await fetchStagesAndSources();
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
</script>

<style scoped>
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance: none;
}

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
  background-color: rgba(128, 128, 128, 0.8) !important;
}
</style>
