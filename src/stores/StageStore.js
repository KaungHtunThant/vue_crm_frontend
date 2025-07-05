import { defineStore } from "pinia";

export const useStageStore = defineStore("stage", {
  state: () => ({
    stages: [],
    trash_stages: [],
  }),
  getters: {
    getAllStages: (state) => {
      return state.stages;
    },
    getTrashStages: (state) => {
      return state.trash_stages;
    },
    getStageDetailsById(stage_id) {
      return this.stages.find((stage) => stage.id === stage_id);
    },
    getParentStageByChildId(stage_id) {
      const child_stage = this.stages.find((stage) => stage.id === stage_id);
      if (!child_stage) throw new Error("Stage not found");
      return this.stages.find((stage) => stage.id === child_stage.id);
    },
    getChildStagesByParentId(parent_id) {
      return this.stages.filter((stage) => stage.parent_id === parent_id);
    },
  },
  actions: {
    addStage(stage_data) {
      this.kanban_stages.push(stage_data);
    },
    updateStage(stage_id, updated_data) {
      const index = this.kanban_stages.findIndex(
        (stage) => stage.id === stage_id
      );
      if (index !== -1) {
        this.kanban_stages[index] = {
          ...this.kanban_stages[index],
          ...updated_data,
        };
      }
    },
    deleteStage(stage_id) {
      this.kanban_stages = this.kanban_stages.filter(
        (stage) => stage.id !== stage_id
      );
    },
  },
});
