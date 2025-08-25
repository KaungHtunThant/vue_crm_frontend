<template>
  <div class="mt-4 pe-3 bg-white rounded-3 p-3 pb-0 me-2">
    <!-- Search and Filter Section -->
    <div class="row">
      <div class="col-8 col-md-7 col-lg-4">
        <div class="mb-3 position-relative inputSearch d-flex">
          <input
            type="text"
            class="form-control ps-5 pe-4 rounded-end-0"
            :placeholder="t('contacts-placeholder-search')"
            v-model="search"
            @keyup.enter="handleSearch"
          />
          <i class="fas fa-search search-icon"></i>
          <i
            v-if="search"
            class="fas fa-times clear-icon"
            @click="resetSearch"
            title="Clear Search"
          >
            CLR
          </i>
          <button
            title="Filter"
            type="button"
            class="btn btn-primary rounded-start-0"
            @click="openFilterModal"
          >
            <i class="fas fa-filter"></i>
          </button>
        </div>
      </div>
      <div class="col-4 col-md-5 col-lg-8 mb-3">
        <div class="text-end">
          <button type="button" class="btn btn-primary" @click="openModal">
            <span>{{ t("contacts-button-add") }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Updated Table Component -->
    <DataTable
      :value="rows"
      :paginator="true"
      :rows="rowsPerPage"
      :rowsPerPageOptions="[10, 25, 50]"
      :total-records="totalRows"
      :lazy="true"
      :onLazyLoad="loadCarsLazy"
      :loading="loading"
      @page="onPageChange"
      scrollable
      scrollHeight="calc(90vh - 120px)"
    >
      <Column :header="'#'">
        <template #body="slotProps">
          {{ slotProps.index + 1 + currentPage * rowsPerPage }}
        </template>
      </Column>
      <Column
        field="name"
        :header="t('contacts-table-header-fullname')"
      ></Column>
      <!-- <Column
        field="nickname"
        :header="t('contacts-table-header-nickname')"
      ></Column> -->
      <Column field="email" :header="t('contacts-table-header-email')">
        <template #body="{ data }">
          {{ data.email || "no-email" }}
        </template></Column
      >
      <!-- <Column
        field="address"
        :header="t('contacts-table-header-address')"
      ></Column> -->
      <Column field="country" :header="t('contacts-table-header-country')">
        <template #body="{ data }">
          {{ data.country || "null" }}
        </template></Column
      >

      <Column :header="t('contacts-table-header-phone')">
        <template #body="slotProps">
          {{
            slotProps.data.phones?.[0]?.phone &&
            slotProps.data.phones?.[0]?.phone.length > 0
              ? slotProps.data.phones?.[0]?.phone
              : "N/A"
          }}
        </template>
      </Column>
      <Column :header="t('contacts-table-header-actions')">
        <template #body="slotProps">
          <div class="d-flex gap-2">
            <button
              class="btn btn-sm btn-primary"
              @click="editItem(slotProps.data)"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="removeContact(slotProps.data.id)"
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

    <!-- Modals -->
    <contacts-view-create-modal
      ref="contactCreateModalRef"
      :rows="rows"
      @contact-updated="updateContactList"
    />
    <contacts-view-filter-modal
      ref="filterModalRef"
      @apply-filters="applyFilters"
      @reset-filters="resetFilters"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
// import Vue3EasyDataTable from "vue3-easy-data-table";
// import "vue3-easy-data-table/dist/style.css";
import {
  getContacts,
  deleteContact,
  showContact,
} from "@/plugins/services/authService";
import ContactsViewCreateModal from "@/components/ContactModals/ContactsViewCreateModal.vue";
import ContactsViewFilterModal from "@/components/ContactModals/ContactsViewFilterModal.vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
// import Column from "primevue/column";
// import { useLoadingStore } from "@/plugins/loadingStore";

export default {
  name: "ContactsView",

  components: {
    // Vue3EasyDataTable,
    ContactsViewCreateModal,
    ContactsViewFilterModal,
    DataTable,
    Column,
  },

  setup() {
    const { t } = useI18n();
    const toast = useToast();

    // Table state
    const tableData = ref([]);
    const loading = ref(false);
    const totalRows = ref(0);
    const currentPage = ref(0);
    const rowsPerPage = ref(10);
    const perPage = ref(10);
    const sortBy = ref("id");
    const sortType = ref("desc");
    const rows = ref([]);

    // const columns = [
    //   {
    //     title: "#",
    //     data: "id",
    //   },
    //   {
    //     title: t("contacts-table-header-fullname"),
    //     data: "name",
    //   },
    //   {
    //     title: t("contacts-table-header-nickname"),
    //     data: "nickname",
    //   },
    //   {
    //     title: t("contacts-table-header-email"),
    //     data: "email",
    //   },
    //   {
    //     title: t("contacts-table-header-address"),
    //     data: "address",
    //   },
    //   {
    //     title: t("contacts-table-header-country"),
    //     data: "country",
    //   },
    //   {
    //     title: t("contacts-table-header-phone"),
    //     data: "phones",
    //     body: (rowData) =>
    //       Array.isArray(rowData.phones) && rowData.phones.length
    //         ? rowData.phones[0].phone
    //         : "N/A",
    //   },
    // ];

    // Handle page change event
    const onPageChange = (event) => {
      currentPage.value = event.page;
      rowsPerPage.value = event.rows;
      fetchData(currentPage.value, rowsPerPage.value);
    };
    // const loadingStore = useLoadingStore();
    const search = ref("");
    const contactCreateModalRef = ref(null);
    const filterModalRef = ref(null);

    const filteredItems = computed(() => {
      if (!tableData.value || !Array.isArray(tableData.value)) return [];

      return tableData.value.filter((item) => {
        if (!item) return false;
        const searchLower = (search.value || "").toLowerCase();
        return (
          (item.name || "").toLowerCase().includes(searchLower) ||
          (item.email || "").toLowerCase().includes(searchLower) ||
          (item.nickname || "").toLowerCase().includes(searchLower)
        );
      });
    });

    // Fetch data from the server
    const fetchData = async (page, perPage) => {
      try {
        loading.value = true;
        const response = await getContacts({
          page: page + 1,
          per_page: perPage,
        });
        const data = response.data;
        rows.value = data.data;
        totalRows.value = data.meta.total;
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(t("error.fetchFailed"));
        rows.value = [];
        totalRows.value = 0;
      } finally {
        loading.value = false;
      }
    };

    const handleOptionsUpdate = async (options) => {
      if (options.sortBy) {
        sortBy.value = options.sortBy;
        sortType.value = options.sortType;
        await fetchData();
      }
    };

    const updateContactList = async (updatedContact) => {
      if (updatedContact) {
        const index = rows.value.findIndex(
          (item) => item.id === updatedContact.id
        );

        if (index !== -1) {
          rows.value.splice(index, 1, updatedContact);
        } else {
          toast.error("There item not found");
        }
      }
    };

    // Modal Functions
    const openModal = () => {
      if (contactCreateModalRef.value) {
        contactCreateModalRef.value.openModal();
      }
    };
    // open filter modal
    const openFilterModal = () => {
      if (filterModalRef.value) {
        filterModalRef.value.openFilterModal();
      }
    };

    // open edit modal
    const editItem = async (item) => {
      try {
        // loading.value = true;
        const response = await showContact(item.id);
        const contactDetails = response.data.data;

        if (contactCreateModalRef.value) {
          contactCreateModalRef.value.openModal({
            id: contactDetails.id,
            name: contactDetails.name,
            nickname: contactDetails.nickname,
            email: contactDetails.email,
            address: contactDetails.address,
            country: contactDetails.country,
            phone1: contactDetails.phones?.[0] || "",
            phone2: contactDetails.phones?.[1] || "",
          });
        }
      } catch (error) {
        console.error("Error fetching contact details:", error);
        toast.error(t("error.fetchContactDetails"));
      }
    };

    const removeContact = async (id) => {
      try {
        const result = await Swal.fire({
          title: t("contacts-alert-delete-title"),
          text: t("contacts-alert-delete-description"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: t("contacts-alert-delete-confirm"),
          cancelButtonText: t("contacts-alert-delete-cancel"),
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          await deleteContact(id);
          rows.value = rows.value.filter((item) => item.id !== id);
          totalRows.value -= 1;
          toast.success(t("success.deleteSuccess"));
        }
      } catch (error) {
        toast.error(t("error.deleteFailed"));
      }
    };

    const refreshTable = async () => {
      loading.value = true;
      await fetchData(currentPage.value, rowsPerPage.value);
      loading.value = false;
    };

    const applyFilters = async (filters) => {
      try {
        loading.value = true;

        if (filters.created_at_from && filters.created_at_to) {
          if (
            new Date(filters.created_at_from) > new Date(filters.created_at_to)
          ) {
            toast.error(t("error.invalidDateRange"));
            return;
          }
        }

        const filterParams = {
          page: currentPage.value + 1,
          per_page: rowsPerPage.value,
          ...filters,
        };

        if (search.value.trim()) {
          filterParams.search = search.value.trim();
        }

        const response = await getContacts(filterParams);
        const data = response.data;

        if (data && data.data) {
          rows.value = data.data;
          totalRows.value = data.meta.total;
          currentPage.value = 0;
          toast.success(t("success.filterSuccess"));
        } else {
          rows.value = [];
          totalRows.value = 0;
          toast.info(t("info.noFilterResults"));
        }
      } catch (error) {
        console.error("Filter application failed:", error);
        toast.error(t("error.filterFailed"));
        rows.value = [];
        totalRows.value = 0;
      } finally {
        loading.value = false;
      }
    };

    const resetFilters = async () => {
      try {
        loading.value = true;
        search.value = "";
        currentPage.value = 0;

        await fetchData(0, rowsPerPage.value);

        toast.success(t("success.filterReset"));
      } catch (error) {
        console.error("Reset filters failed:", error);
        toast.error(t("error.filterFailed"));
      } finally {
        loading.value = false;
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

    onMounted(() => {
      fetchData(currentPage.value, rowsPerPage.value);
      window.addEventListener("contextmenu", handleRightClick);
    });

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    watch(
      tableData,
      (newValue) => {
        console.log("Items changed:", newValue);
      },
      { immediate: true, deep: true }
    );

    watch(
      filteredItems,
      (newFilteredItems) => {
        console.log("Filtered items:", {
          length: newFilteredItems?.length,
          items: newFilteredItems,
        });
      },
      { deep: true, immediate: true }
    );

    const handleSearch = async () => {
      try {
        loading.value = true;
        const searchParams = {
          page: currentPage.value + 1,
          per_page: rowsPerPage.value,
        };

        if (search.value.trim()) {
          searchParams.search = search.value.trim();
        }

        const response = await getContacts(searchParams);
        const data = response.data;

        if (data && data.data) {
          rows.value = data.data;
          totalRows.value = data.meta.total;
          currentPage.value = 0;
        } else {
          rows.value = [];
          totalRows.value = 0;
          toast.info(t("info.noSearchResults"));
        }
      } catch (error) {
        console.error("Error searching data:", error);
        toast.error(t("error.searchFailed"));
        rows.value = [];
        totalRows.value = 0;
      } finally {
        loading.value = false;
      }
    };

    const resetSearch = async () => {
      search.value = "";
      await fetchData(currentPage.value, rowsPerPage.value);
    };

    return {
      // headers,
      tableData,
      loading,
      search,
      filteredItems,
      contactCreateModalRef,
      filterModalRef,
      openModal,
      openFilterModal,
      editItem,
      removeContact,
      updateContactList,
      applyFilters,
      resetFilters,
      t,
      totalRows,
      currentPage,
      perPage,
      sortBy,
      sortType,
      refreshTable,
      handleOptionsUpdate,
      fetchData,
      rows,
      rowsPerPage,
      // columns,
      onPageChange,
      handleSearch,
      resetSearch,
    };
  },
};
</script>

<style scoped>
.inputSearch {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 2;
}

.clear-icon {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  cursor: pointer;
  z-index: 2;
  transition: color 0.2s;
  font-size: 12px !important;
}

.clear-icon:hover {
  color: #dc3545;
}

.form-control {
  padding-right: 35px !important;
}

.form-control:focus {
  box-shadow: none;
  border: 1px solid #333;
}

.fs-6 {
  font-size: 14px !important;
}
:deep(.custom-table) {
  border-radius: 10px;
  overflow: hidden;
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
</style>
