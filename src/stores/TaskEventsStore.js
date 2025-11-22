import { defineStore } from "pinia";
import { getTaskEvents } from "@/plugins/services/taskeventsService";

export const useTaskEventsStore = defineStore("taskevents", {
  state: () => ({
    taskevents: [],
  }),
  getters: {
    getTaskEvents: (state) => {
      return state.taskevents;
    },
  },
  actions: {
    async fetchTaskEvents() {
      const result = await getTaskEvents();
      this.taskevents = result.data.data;
    },
  },
});
