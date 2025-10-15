import { defineStore } from "pinia";
import expressApi from "@/plugins/expressApi";

export const useWhatsAppStore = defineStore("whatsapp", {
  state: () => ({
    isConnected: false,
    connectedUser: null,
    isLoading: false,
    statusMessage: "",
    statusType: "",
  }),

  actions: {
    async checkConnectionStatus(userId) {
      this.isLoading = true;
      try {
        const response = await expressApi.get(`/client-status/${userId}`);
        this.isConnected = response.data.isConnected;
        this.connectedUser = response.data.user;
        this.Status = response.data.status;
        return response.data;
      } catch (error) {
        console.error("Failed to check connection status:", error);
        this.isConnected = false;
        this.connectedUser = null;
      } finally {
        this.isLoading = false;
      }
    },

    async loginWhatsApp(userId) {
      this.isLoading = true;
      this.statusMessage = "Connecting to WhatsApp...";
      this.statusType = "info";

      try {
        const response = await expressApi.post("/start-client", { userId });
        return response.data;
      } catch (error) {
        this.statusMessage = "Failed to connect";
        this.statusType = "error";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async logoutWhatsApp(userId) {
      this.isLoading = true;
      this.statusMessage = "Logging out WhatsApp...";
      this.statusType = "info";

      try {
        const response = await expressApi.post("/stop-client", { userId });
        this.isConnected = false;
        this.connectedUser = null;
        this.statusMessage = "Successfully logged out";
        this.statusType = "success";
        return response.data;
      } catch (error) {
        this.statusMessage = "Logout failed";
        this.statusType = "error";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    setConnectionStatus(status, user = null) {
      this.isConnected = status;
      this.connectedUser = user;
    },
  },
});
