import {
  getBroadcasts,
  createBroadcast,
  updateBroadcast,
  updateBroadcastPosition,
  deleteBroadcast,
} from "@/plugins/services/broadcastService";
import { defineStore } from "pinia";

export const useBroadcastStore = defineStore("broadcast", {
  state: () => ({
    broadcasts: [],
    current_broadcast: null,
  }),
  getters: {
    getBroadcasts: (state) => state.broadcasts,
    getCurrentBroadcast: (state) => state.current_broadcast,
  },
  actions: {
    setCurrentBroadcast(broadcast) {
      this.current_broadcast = broadcast;
    },
    async fetchBroadcasts() {
      const response = await getBroadcasts();
      if (response.status === 200) {
        this.broadcasts = response.data;
      }
    },
    async addBroadcast(broadcast) {
      const response = await createBroadcast(broadcast.description);
      if (response.status === 200 || response.status === 201) {
        this.broadcasts.push(broadcast);
      }
    },
    async editBroadcast(broadcast) {
      const response = await updateBroadcast(
        broadcast.id,
        broadcast.description,
        broadcast.status,
        broadcast.important
      );
      if (response.status === 200) {
        const index = this.broadcasts.findIndex((b) => b.id === broadcast.id);
        if (index !== -1) {
          this.broadcasts.splice(index, 1, broadcast);
        }
      }
    },
    async changeBroadcastPosition(id, direction) {
      const response = await updateBroadcastPosition(id, direction);
      if (response.status === 200) {
        await this.fetchBroadcasts();
      }
    },
    async removeBroadcast(id) {
      const response = await deleteBroadcast(id);
      if (response.status === 200) {
        this.broadcasts = this.broadcasts.filter(
          (broadcast) => broadcast.id !== id
        );
      }
    },
  },
});
