import {
  bulkDeleteDeals,
  createDeal,
  fetchAdditionalDealsByStageId,
  showDeal,
  updateDeal,
} from "@/plugins/services/authService";
import { defineStore } from "pinia";

export const useDealStore = defineStore("deal", {
  state: () => ({
    deals: [],
    current_deal: {},
  }),
  getters: {
    getAllDeals: (state) => {
      return state.deals;
    },
    getDealById: (state) => (deal_id) => {
      return state.deals.find((deal) => deal.id === deal_id);
    },
    getDealsByStageIds: (state) => (stage_ids) => {
      return state.deals.filter((deal) => stage_ids.includes(deal.stage_id));
    },
    getDealsByUserId: (state) => (user_id) => {
      return state.deals.filter((deal) => deal.user_id === user_id);
    },
    getCurrentDeal: (state) => {
      return state.current_deal;
    },
  },
  actions: {
    async addDeal(deal_data) {
      // Optimistically add the deal to the local state
      const tempId = Date.now();
      const optimisticDeal = { ...deal_data, id: tempId };
      this.deals.push(optimisticDeal);

      try {
        const response = await createDeal(deal_data);
        if (response.status !== 201 && response.status !== 200) {
          throw new Error(response.data.message);
        }
        // Replace the optimistic deal with the real one from the server
        const index = this.deals.findIndex((deal) => deal.id === tempId);
        if (index !== -1) {
          this.deals[index] = response.data.data;
        }
      } catch (error) {
        // Rollback if creation fails
        this.deals = this.deals.filter((deal) => deal.id !== tempId);
        throw error;
      }
    },
    async updateDeal(deal_id, updated_data) {
      // Optimistically update the deal in the local state
      const indexes = this.deals
        .map((deal, idx) => (deal.id === deal_id ? idx : -1))
        .filter((idx) => idx !== -1);
      let previousDeals = [];
      if (indexes.length > 0) {
        previousDeals = indexes.map((idx) => ({ ...this.deals[idx] }));
        indexes.forEach((idx) => {
          this.deals[idx] = {
            ...this.deals[idx],
            ...updated_data,
          };
        });
      }
      try {
        const response = await updateDeal(deal_id, updated_data);
        if (response.status !== 200) {
          throw new Error(response.data.message);
        }
      } catch (error) {
        // Rollback if update fails
        if (indexes.length > 0 && previousDeals.length === indexes.length) {
          indexes.forEach((idx, i) => {
            this.deals[idx] = previousDeals[i];
          });
        }
        throw error;
      }
    },
    async deleteDeal(deal_ids) {
      // Optimistically remove the deals from local state
      const previousDeals = [...this.deals];
      this.deals = this.deals.filter((deal) => !deal_ids.includes(deal.id));
      try {
        const response = await bulkDeleteDeals(deal_ids);
        if (response.status !== 200) {
          throw new Error(response.data.message);
        }
      } catch (error) {
        // Rollback if deletion fails
        this.deals = previousDeals;
        throw error;
      }
    },
    async fetchDealsByStageId(stage_id, filters = {}) {
      const response = await fetchAdditionalDealsByStageId(
        stage_id,
        10,
        this.deals.length,
        filters
      );
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      this.deals = [...this.deals, ...response.data.data];
    },
    async changeCurrentDeal(deal_id) {
      if (this.getCurrentDeal?.id === deal_id) {
        return this.getCurrentDeal; // No change needed
      }
      const response = await showDeal(deal_id);
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      this.current_deal = response.data.data;
      return this.current_deal;
    },
  },
});
