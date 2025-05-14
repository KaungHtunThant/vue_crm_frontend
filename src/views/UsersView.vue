<template>
  <div class="mt-2 pe-2">
    <div class="row">
      <div class="col-8 col-md-8 col-lg-8">
        <div class="mb-3 position-relative inputSearch d-flex">
          <input
            type="text"
            class="form-control w-50 ps-5 rounded-end-0"
            :placeholder="t('users-placeholder-search')"
            v-model="search"
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
          <button type="button" class="btn btn-primary" @click="openModal">
            {{ t("users-button-add-user") }}
          </button>
        </div>
      </div>
    </div>

    <!-- الجدول -->
    <!--  -->

    <EasyDataTable
      :headers="headers"
      :items="filteredItems"
      :loading="tableLoading"
      :rows-per-page="selectedPerPage"
      table-class-name="custom-table"
    >
      <template #item-profile="item">
        <div class="d-flex align-items-center py-1">
          <img
            :src="userImage || require('@/assets/default-user-image.jpg')"
            alt="User Image"
            class="rounded-circle me-3"
            style="width: 45px; height: 45px"
          />
          <div>
            <div class="fs-6">{{ item.name }}</div>
            <div class="text-muted">{{ item.role }}</div>
          </div>
        </div>
      </template>

      <template #item-emailVerified="item">
        <div class="userEmail">
          <p class="pt-3">{{ item.email }}</p>
        </div>
      </template>

      <template #item-status="item">
        <FormSwitch
          v-model="item.status"
          @update:modelValue="toggleStatus(item)"
        />
      </template>

      <template #item-actions="item">
        <ButtonsUser :item="item" @edit="editItem" @remove="removeUser" />
      </template>
      <!-- Loading -->
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
    </EasyDataTable>

    <AdminModal ref="adminModalRef" @user-updated="updateUserList" />
    <FilterForm
      ref="filterModalRef"
      @apply-filters="applyFilters"
      @reset-filters="resetFilters"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import AdminModal from "@/components/modals/AdminForm.vue";
import ButtonsUser from "@/components/usersElements/ButtonsUser.vue";
import FormSwitch from "@/components/usersElements/FormSwitch.vue";
import FilterForm from "@/components/modals/FilterForm.vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
// import { useLoadingStore } from "@/plugins/loadingStore";
// import Cookies from "js-cookie"

import {
  getUser,
  deleteUser,
  updateUser,
} from "@/plugins/services/authService";
import { useI18n } from "vue-i18n";
export default {
  name: "UsersView",
  components: {
    EasyDataTable,
    AdminModal,
    ButtonsUser,
    FormSwitch,
    FilterForm,
  },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const headers = [
      { text: t("users-table-header-fullname"), value: "profile" },
      { text: t("users-table-header-email"), value: "emailVerified" },
      { text: t("users-table-header-status"), value: "status" },
      { text: t("users-table-header-actions"), value: "actions" },
    ];
    // const loadingStore = useLoadingStore();
    const items = ref([]);
    const search = ref("");
    const selectedRole = ref("");
    const selectedStatus = ref("");
    const selectedCreatedAt = ref("");
    const selectedPerPage = ref("10");
    const tableLoading = ref(false);
    const isFiltered = computed(() => {
      return (
        selectedRole.value || selectedStatus.value || selectedCreatedAt.value
      );
    });
    const filteredItems = computed(() => {
      return items.value.filter((item) => {
        return (
          item.name.toLowerCase().includes(search.value.toLowerCase()) &&
          (selectedRole.value ? item.role === selectedRole.value : true) &&
          (selectedStatus.value
            ? item.status === selectedStatus.value
            : true) &&
          (selectedCreatedAt.value
            ? item.createdAt === selectedCreatedAt.value
            : true)
        );
      });
    });
    // apply Filters
    const applyFilters = async (filters) => {
      const query = {
        ...(filters.role && { role: filters.role }),
        ...(filters.status && { status: filters.status }),
        ...(filters.createdAt && { createdAt: filters.createdAt }),
        perPage: filters.perPage || "10",
      };

      try {
        // tableLoading.value = true;
        const response = await getUser(query);
        items.value = response.data.data;
      } catch (error) {
        console.error(t("error.filterFailed"), error);
      } finally {
        // tableLoading.value = false;
      }
    };
    const fetchUsers = async () => {
      try {
        tableLoading.value = true;
        const response = await getUser();
        items.value = response.data.data.map((user) => ({
          ...user,
          status: user.status === "active",
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        tableLoading.value = false;
      }
    };

    const updateUserList = (updatedUser) => {
      const index = items.value.findIndex((u) => u.id === updatedUser.id);
      if (index !== -1) {
        items.value[index] = updatedUser;
      } else {
        items.value.push(updatedUser);
      }
    };

    const toggleStatus = async (event) => {
      try {
        console.log("event target:", event);
        const newStatus = event.status ? "active" : "inactive";
        const response = await updateUser(event.id, { status: newStatus });
        if (response.status !== 200) {
          throw new Error(response.data.message);
        }
        event.status = newStatus;
        toast.success(response.data.message, {
          timeout: 3000,
        });
      } catch (error) {
        toast.error(error.message, {
          timeout: 3000,
        });
      }
    };
    const openModal = () => {
      if (adminModalRef.value) {
        adminModalRef.value.openModal();
      }
    };
    const filterModalRef = ref(null);
    const openFilterModal = () => {
      if (filterModalRef.value) {
        filterModalRef.value.openFilterModal();
      }
    };

    const adminModalRef = ref(null);
    const editItem = (item) => {
      if (adminModalRef.value) {
        adminModalRef.value.openModal(item);
      }
    };

    // Remove User
    const removeUser = async (id) => {
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
          const response = await deleteUser(id);
          if (response.status === 200) {
            items.value = items.value.filter((user) => user.id !== id);
            toast.success(response.data.message, {
              timeout: 3000,
            });
          } else {
            toast.error(response.data.message, {
              timeout: 3000,
            });
          }
        }
      } catch (error) {
        toast.error(t("error.deleteFailed"), {
          timeout: 3000,
        });
        console.error("Delete User Is Failed:", error);
      }
    };

    // reset Filter
    const resetFilters = async () => {
      selectedRole.value = "";
      selectedStatus.value = "";
      selectedCreatedAt.value = "";
      selectedPerPage.value = "10";

      try {
        // tableLoading.value = true;
        const response = await getUser();
        items.value = response.data.data;
      } catch (error) {
        console.error(t("error.filterFailed"), error);
      } finally {
        // tableLoading.value = false;
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

    onMounted(async () => {
      // loadingStore.startLoading();
      await fetchUsers();
      // loadingStore.stopLoading();
      window.addEventListener("contextmenu", handleRightClick);
    });
    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    return {
      headers,
      items,
      search,
      filteredItems,
      adminModalRef,
      filterModalRef,
      isFiltered,
      tableLoading,
      updateUserList,
      toggleStatus,
      editItem,
      removeUser,
      openModal,
      openFilterModal,
      applyFilters,
      resetFilters,
      t,
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
:deep(.custom-table) {
  display: flex;
  flex-direction: column;
  height: 80vh !important;
  border-radius: 10px;
  overflow: hidden;
  border: none !important;
}
:deep(.custom-table thead) {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 2;
}

:deep(.custom-table tbody) {
  overflow-y: auto;
  flex: 1 1 auto;
  display: block;
}

:deep(.custom-table tbody tr) {
  display: table;
  width: 100%;
  table-layout: fixed;
}

:deep(.custom-table thead tr) {
  display: table;
  width: 100%;
  table-layout: fixed;
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
