import {
  createStage,
  deleteStage,
  getAllStages,
  updateStage,
} from "@/plugins/services/authService";
import { defineStore } from "pinia";

export const useStageStore = defineStore("stage", {
  state: () => ({
    stages: [],
  }),
  getters: {
    getAllStages: (state) => {
      return state.stages;
    },
    getAllParentStages: (state) => {
      return state.stages.filter(
        (stage) => stage.parent_id === null && stage.has_children
      );
    },
    getAllChildStages: (state) => {
      return state.stages.filter((stage) => stage.parent_id !== null);
    },
    getNonParentStages: (state) => {
      return state.stages.filter((stage) => !stage.has_children);
    },
    getTrashStages: (state) => {
      return state.stages.filter((stage) => stage.is_trash);
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
    async addStage(stage_data) {
      // Optimistically add the stage to the local state
      const tempId = Date.now();
      const optimisticStage = { ...stage_data, id: tempId };
      this.stages.push(optimisticStage);

      try {
        const response = await createStage(stage_data);
        if (response.status !== 201 && response.status !== 200) {
          throw new Error(response.data.message);
        }
        // Replace the optimistic stage with the real one from the server
        const index = this.stages.findIndex((stage) => stage.id === tempId);
        if (index !== -1) {
          this.stages[index] = { ...response.data.data };
        }
      } catch (error) {
        // Rollback optimistic update if API call fails
        this.stages = this.stages.filter((stage) => stage.id !== tempId);
        throw error;
      }
    },
    async updateStage(stage_id, updated_data) {
      // Optimistically update the stage in local state
      const index = this.stages.findIndex((stage) => stage.id === stage_id);
      if (index === -1) throw new Error("Stage not found");
      const originalStage = { ...this.stages[index] };
      this.stages[index] = { ...this.stages[index], ...updated_data };

      try {
        const response = await updateStage(stage_id, updated_data);
        if (response.status !== 200) {
          throw new Error("Failed to update stage");
        }
        // Optionally update with server response if needed
        this.stages[index] = { ...response.data.data };
      } catch (error) {
        // Rollback optimistic update if API call fails
        this.stages[index] = originalStage;
        throw error;
      }
    },
    async deleteStage(stage_id) {
      // Optimistically remove the stage from local state
      const originalStages = [...this.stages];
      this.stages = this.stages.filter((stage) => stage.id !== stage_id);

      try {
        const response = await deleteStage(stage_id);
        if (response.status !== 200) {
          throw new Error("Failed to delete stage");
        }
      } catch (error) {
        // Rollback optimistic update if API call fails
        this.stages = originalStages;
        throw error;
      }
    },
    async fetchStages() {
      // Optimistically clear stages before fetching
      const originalStages = [...this.stages];
      this.stages = [];

      try {
        const response = await getAllStages();
        if (response.status !== 200) {
          throw new Error("Failed to fetch stages");
        }
        this.stages = response.data.data;
      } catch (error) {
        // Rollback optimistic update if API call fails
        this.stages = originalStages;
        throw error;
      }
    },
  },
});
