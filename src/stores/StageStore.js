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
      return state.stages.filter((stage) => !stage.hidden);
    },
    getParentStages: (state) => {
      return state.stages.filter(
        (stage) => stage.parent_id === null && stage.children_ids.length > 0
      );
    },
    getChildStages: (state) => {
      return state.stages.filter((stage) => stage.parent_id !== null);
    },
    getNonParentStages: (state) => {
      return state.stages.filter((stage) => !stage.children_ids.length > 0);
    },
    getNonChildStages: (state) => {
      return state.stages.filter((stage) => stage.parent_id === null);
    },
    getTrashStages: (state) => {
      return state.stages.filter((stage) => stage.is_trash);
    },
    getAllStagesWithHidden: (state) => {
      return state.stages;
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
      const response = await getAllStages();
      if (response.status !== 200) {
        throw new Error("Failed to fetch stages");
      }
      this.stages = response.data.data.map((stage) => ({
        ...stage,
        hidden: stage.parent_id !== null,
        merge_view: false,
        minimized: false,
      }));
    },
    _getChildrenTotalDealsCount(stage_id) {
      const children = this.stages.filter(
        (child) => child.parent_id === stage_id
      );
      if (children.length === 0) return 0;
      let deals_count = 0;
      children.forEach((childStage) => {
        deals_count += childStage.deals_count;
        if (childStage.children_ids.length > 0) {
          deals_count += this._getChildrenTotalDealsCount(childStage);
        }
      });
      return deals_count;
    },
    getChildrenStageIdsByParentId(parent_id) {
      return this.stages
        .filter((stage) => stage.parent_id === parent_id)
        .map((stage) => stage.id);
    },
    toggleHiddenByParentId(parent_id) {
      this.stages.forEach((stage) => {
        if (stage.parent_id === parent_id) {
          stage.hidden = !stage.hidden;
        }
      });
      const parentStage = this.stages.find((stage) => stage.id === parent_id);
      if (parentStage) {
        parentStage.merge_view = !parentStage.merge_view;
      }
    },
    toggleMinimizedById(stage_id) {
      const stage = this.stages.find((stage) => stage.id === stage_id);
      if (stage) {
        stage.minimized = !stage.minimized;
      }
    },
    getStageById(stage_id) {
      return this.stages.find((stage) => stage.id === stage_id);
    },
  },
});
