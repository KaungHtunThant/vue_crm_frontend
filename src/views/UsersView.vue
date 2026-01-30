<template>
  <div class="mt-3 pe-2">
    <div class="row">
      <div class="col-8 col-md-8 col-lg-8">
        <div
          class="mb-3 position-relative inputSearch d-flex align-items-center"
        >
          <input
            type="search"
            class="form-control w-50 ps-5 rounded-end-0"
            style="padding: 7px 0"
            :placeholder="t('users-placeholder-search')"
            v-model="store.search"
            @keyup.enter="handleSearch"
          />

          <i
            class="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3"
          ></i>
          <button
            :title="t('users-modal-filter-heading')"
            type="button"
            class="btn btn-primary me-2 rounded-start-0"
            @click="openFilterModal"
          >
            <i class="fas fa-filter"></i>
          </button>
        </div>
      </div>

      <div class="col-4 col-md-4 col-lg-4 mb-3">
        <div class="text-end">
          <button
            type="button"
            class="btn btn-primary"
            @click="openModal(false)"
          >
            {{ t("users-button-add-user") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <data-table
      :value="store.rows"
      :paginator="true"
      :rows="store.rowsPerPage"
      :rowsPerPageOptions="[10, 25, 50]"
      :total-records="store.totalRows"
      :lazy="true"
      @page="onPageChange"
      :loading="store.loading"
      scrollable
      scrollHeight="calc(90vh - 120px)"
    >
      <Column :header="'#'">
        <template #body="slotProps">
          {{ slotProps.index + 1 + store.currentPage * store.rowsPerPage }}
        </template>
      </Column>

      <Column :header="t('users-table-header-fullname')">
        <template #body="slotProps">
          <div class="d-flex">
            <img
              :src="
                slotProps.data.image_url ||
                require('@/assets/default-avatar-profile.webp')
              "
              alt="User Image"
              class="rounded-circle me-2"
              style="width: 45px; height: 45px"
            />
            <div>
              <div class="fs-6">{{ slotProps.data.name }}</div>
              <div class="text-muted">
                {{ formatRoleName(slotProps.data.role) }}
              </div>
            </div>
          </div>
        </template>
      </Column>

      <Column :header="t('users-table-header-email')">
        <template #body="slotProps">
          <span class="fs-6">{{ slotProps.data.email }}</span>
        </template>
      </Column>

      <Column :header="t('users-table-header-rating')" style="width: 15rem">
        <template #body="slotProps">
          <div class="d-flex justify-content-center">
            <rating-selector
              :rating="slotProps.data.rating"
              :user_id="slotProps.data.id"
              @rating-changed="handleRatingChange"
            />
          </div>
        </template>
      </Column>
      <Column
        :header="t('users-table-header-commission-package')"
        :style="{ width: '120px', textAlign: 'start' }"
      >
        <template #body="slotProps">
          <div class="d-flex justify-content-center">
            <package-selector
              :package_id="slotProps.data.commission_package?.package_id"
              :user_id="slotProps.data.id"
              @package-changed="handlePackageChange"
            />
          </div>
        </template>
      </Column>

      <Column :header="t('users-table-header-status')">
        <template #body="slotProps">
          <user-view-status-account
            v-model="slotProps.data.status"
            @update:modelValue="onToggleStatus(slotProps.data)"
          />
        </template>
      </Column>

      <Column :header="t('users-table-header-actions')">
        <template #body="slotProps">
          <user-view-action-buttons
            :item="slotProps.data"
            @edit="editItem"
            @remove="confirmRemoveUser"
            @showLoginDetails="handleShowLoginDetails"
          />
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
    </data-table>

    <user-view-add-edit-user-modal
      ref="adminModalRef"
      @user-updated="updateUserList"
    />
    <user-view-filter-modal
      ref="filterModalRef"
      @apply-filters="applyFilters"
      @reset-filters="resetFilters"
    />
    <userlog-details ref="userLogModalRef" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from "vue";
import UserViewAddEditUserModal from "@/components/modals/UserViewAddEditUserModal.vue";
import UserViewActionButtons from "@/components/usersElements/UserViewActionButtons.vue";
import UserViewStatusAccount from "@/components/usersElements/UserViewStatusAccount.vue";
import UserlogDetails from "@/components/usersElements/UserlogDetails.vue";
import UserViewFilterModal from "@/components/modals/UserViewFilterModal.vue";
import { useNotificationStore } from "@/stores/notificationStore";

import Swal from "sweetalert2";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useUserStore } from "@/stores/UserStore";
import { useI18n } from "vue-i18n";
import RatingSelector from "@/views/UserViewRatingSelector.vue";
import PackageSelector from "@/views/UserCommissionPackageselector.vue";

export default {
  name: "UsersView",
  components: {
    DataTable,
    Column,
    UserViewAddEditUserModal,
    UserViewActionButtons,
    UserViewStatusAccount,
    UserViewFilterModal,
    RatingSelector,
    PackageSelector,
    UserlogDetails,
  },

  setup() {
    const { t } = useI18n();
    const notificationStore = useNotificationStore();
    const store = useUserStore();
    const logo = require("@/assets/" + process.env.VUE_APP_LOGO_NAME);
    const userLogModalRef = ref(null);

    // apply Filters
    const applyFilters = async (filters) => {
      const mapped = {
        ...(filters.role && { role: filters.role }),
        ...(filters.status && { status: filters.status }),
        ...(filters.createdAt && { created_at: filters.createdAt }),
      };
      try {
        await store.applyFilters(mapped);
        notificationStore.success("Filters applied successfully");
      } catch (e) {
        notificationStore.error(e.message);
      }
    };

    const updateUserList = (updatedUser) => {
      store.updateUserLocal(updatedUser);
    };

    const onToggleStatus = async (row) => {
      const result = await store.toggleStatus(row);
      if (result.success) {
        notificationStore.success(result.message || t("success.updateUser"), {
          timeout: 3000,
        });
      } else {
        notificationStore.error(result.message || t("error.updateFailed"), {
          timeout: 3000,
        });
      }
    };

    const openModal = (editMode = true) => {
      if (adminModalRef.value) {
        adminModalRef.value.openModal(editMode);
      }
    };

    const filterModalRef = ref(null);
    const openFilterModal = () => {
      if (filterModalRef.value) {
        filterModalRef.value.openFilterModal();
      }
    };

    const adminModalRef = ref(null);
    const editItem = () => {
      if (adminModalRef.value) {
        adminModalRef.value.openModal(true);
      }
    };

    // Remove User
    const confirmRemoveUser = async (id) => {
      try {
        const result = await Swal.fire({
          title: t("users-alert-delete-title"),
          text: t("users-alert-delete-description"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: t("success.deleteConfirm"),
          cancelButtonText: t("error.deleteCancel"),
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          const res = await store.removeUser(id);
          if (res.success)
            notificationStore.success(
              res.message || t("success.deleteSuccess")
            );
          else notificationStore.error(res.message || t("error.deleteFailed"));
        }
      } catch (error) {
        notificationStore.error(error.message, {
          timeout: 3000,
        });
      }
    };

    const handleShowLoginDetails = (user) => {
      if (userLogModalRef.value) {
        userLogModalRef.value.openModal(user);
      } else {
        notificationStore.error("Unable to open login details modal");
      }
    };

    // reset Filter
    const resetFilters = async () => {
      try {
        await store.resetFilters();
      } catch (error) {
        notificationStore.error(error.message);
      }
    };

    // pagination
    const onPageChange = async (event) => {
      await store.handlePageChange(event);
    };

    const handleSearch = async () => {
      await store.handleSearch();
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

    const handleRatingChange = async (rating, user_id) => {
      const result = await store.updateRating(user_id, rating);
      if (result.success) {
        notificationStore.success(result.message || t("success.updateUser"), {
          timeout: 3000,
        });
      } else {
        notificationStore.error(result.message || t("error.updateFailed"), {
          timeout: 3000,
        });
      }
    };

    const formatRoleName = (name) => {
      return name
        ? name.trim().charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ")
        : "";
    };

    const handlePackageChange = async (package_id, user_id) => {
      const result = await store.updatePackage(user_id, package_id);
      if (result.success) {
        notificationStore.success(result.message || t("success.updateUser"), {
          timeout: 3000,
        });
      } else {
        notificationStore.error(result.message || t("error.updateFailed"), {
          timeout: 3000,
        });
      }
    };

    watch(
      () => store.search,
      async (newValue) => {
        if (!newValue) {
          await store.handleSearch();
        }
      }
    );

    onMounted(async () => {
      await store.fetchUsers({ page: 0, per_page: 10 });
      window.addEventListener("contextmenu", handleRightClick);
    });

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    return {
      handleRatingChange,
      handlePackageChange,
      store,
      adminModalRef,
      filterModalRef,
      userLogModalRef,
      updateUserList,
      onToggleStatus,
      editItem,
      confirmRemoveUser,
      openModal,
      openFilterModal,
      applyFilters,
      resetFilters,
      onPageChange,
      handleSearch,
      t,
      formatRoleName,
      logo,
      handleShowLoginDetails,
    };
  },
};
</script>

<style scoped>
.inputSearch input:focus {
  box-shadow: none;
  border: none;
}
.userEmail {
  font-size: 14px;
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
</style>
