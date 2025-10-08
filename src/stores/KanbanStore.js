import { defineStore } from "pinia";

export const useKanbanStore = defineStore("kanban", {
  state: () => ({
    hasNewChanges: false,
  }),
  actions: {
    setHasNewChanges(value) {
      this.hasNewChanges = value;
    },
  },
});
