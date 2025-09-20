import { defineStore } from "pinia";
import { ref } from "vue";
import { getLogsByDealId, getUser } from "@/plugins/services/authService";

export const useLogStore = defineStore("logStore", () => {
  const logs = ref([]);
  const users = ref([]);

  const fetchLogs = async (dealId) => {
    try {
      const response = await getLogsByDealId(dealId);
      if (response.data) {
        logs.value = response.data.data;
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUser();
      users.value = response.data.data;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getUserName = (id) => {
    if (id === null || id === undefined) return "System";
    const user = users.value.find((u) => u.id === id);
    return user ? user.name : `User#${id}`;
  };

  const getUserColor = (id) => {
    const user = users.value.find((u) => u.id === id);
    return user ? user.color_code : "#000";
  };

  return {
    logs,
    users,
    fetchLogs,
    fetchUsers,
    getUserName,
    getUserColor,
  };
});
