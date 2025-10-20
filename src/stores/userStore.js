import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getUser,
  updateUser,
  deleteUser,
} from "@/plugins/services/authService";

export const useUserStore = defineStore("userStore", () => {
  const rows = ref([]);
  const totalRows = ref(0);
  const currentPage = ref(0);
  const rowsPerPage = ref(10);
  const loading = ref(false);
  const search = ref("");
  const filters = ref({});

  const mapApiUserToRow = (user) => ({
    ...user,
    status: user.status === "active",
  });

  const fetchUsers = async (params = {}) => {
    try {
      loading.value = true;

      const page = params.page ?? currentPage.value;
      const perPage = params.per_page ?? rowsPerPage.value;

      currentPage.value = page;
      rowsPerPage.value = perPage;

      const requestParams = {
        page: page + 1,
        per_page: perPage,
        ...(search.value ? { search: search.value } : {}),
        ...filters.value,
      };

      const response = await getUser(requestParams);
      const data = response.data;

      rows.value = data.data.map(mapApiUserToRow);
      totalRows.value = data.meta?.total ?? data.data.length;
    } catch (error) {
      rows.value = [];
      totalRows.value = 0;
    } finally {
      loading.value = false;
    }
  };

  const applyFilters = async (nextFilters = {}) => {
    filters.value = { ...nextFilters };
    currentPage.value = 0;
    await fetchUsers({ page: 0 });
  };

  const resetFilters = async () => {
    filters.value = {};
    search.value = "";
    currentPage.value = 0;
    await fetchUsers({ page: 0 });
  };

  const updateUserLocal = (updatedUser) => {
    const index = rows.value.findIndex((u) => u.id === updatedUser.id);
    const normalized = mapApiUserToRow(updatedUser);
    if (index !== -1) {
      rows.value.splice(index, 1, normalized);
    } else {
      rows.value.unshift(normalized);
      totalRows.value += 1;
    }
  };

  const toggleStatus = async (user) => {
    const newStatus = user.status ? "active" : "inactive";
    const response = await updateUser(user.id, { status: newStatus });
    const index = rows.value.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      rows.value[index] = {
        ...rows.value[index],
        status: newStatus === "active",
      };
    }
    return {
      success: response.status === 200,
      message: response.data?.message || "",
    };
  };

  const removeUser = async (id) => {
    const response = await deleteUser(id);
    if (response.status === 200) {
      rows.value = rows.value.filter((u) => u.id !== id);
      totalRows.value = Math.max(0, totalRows.value - 1);
      return { success: true, message: response.data?.message || "" };
    }
    return { success: false, message: response.data?.message || "" };
  };

  return {
    rows,
    totalRows,
    currentPage,
    rowsPerPage,
    loading,
    search,
    filters,
    fetchUsers,
    applyFilters,
    resetFilters,
    updateUserLocal,
    toggleStatus,
    removeUser,
  };
});
