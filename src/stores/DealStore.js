import {
  bulkDeleteDeals,
  createDeal,
  fetchAdditionalDealsByStageId,
  showDeal,
  updateDeal,
} from "@/plugins/services/dealService";
import { defineStore } from "pinia";
import { rules } from "@/enums/StageRulesEnum";

export const useDealStore = defineStore("deal", {
  state: () => ({
    deals: [],
    current_deal: {},
    deal_scroll_status: false,
  }),
  getters: {
    getAllDeals: (state) => {
      return state.deals;
    },
    getDealById: (state) => (deal_id) => {
      return state.deals.find((deal) => deal.id === deal_id);
    },
    getDealsByUserId: (state) => (user_id) => {
      return state.deals.filter((deal) => deal.user_id === user_id);
    },
    getCurrentDeal: (state) => {
      return state.current_deal;
    },
    getDealScrollStatus: (state) => {
      return state.deal_scroll_status;
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
      let previousDeals = [];
      const indexes = this.deals
        .map((deal, idx) => (deal.id === deal_id ? idx : -1))
        .filter((idx) => idx !== -1);
      try {
        // Optimistically update the deal in the local state
        if (indexes.length > 0) {
          previousDeals = indexes.map((idx) => ({ ...this.deals[idx] }));
          indexes.forEach((idx) => {
            this.deals[idx] = {
              ...this.deals[idx],
              ...updated_data,
            };
          });
        }
        const response = await updateDeal(deal_id, updated_data);
        if (response.status !== 200) {
          throw new Error(response.data.message);
        }
        return {
          success: true,
          message: response.data.message,
        };
      } catch (error) {
        // Rollback if update fails
        if (indexes.length > 0 && previousDeals.length === indexes.length) {
          indexes.forEach((idx, i) => {
            this.deals[idx] = previousDeals[i];
          });
        }
        return {
          success: false,
          message: error.message,
        };
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
    async fetchDealsByStageId(stage_id, limit = 10, offset = 0, filters = {}) {
      const response = await fetchAdditionalDealsByStageId(
        stage_id,
        limit,
        offset,
        filters
      );
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      const new_deals = response.data.data.filter(
        (deal) => !this.deals.some((d) => d.id === deal.id)
      );
      this.deals = [...this.deals, ...new_deals];
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
    resetCurrentDeal() {
      this.current_deal = null;
    },
    getDealsByStageIds(stage_ids) {
      return this.deals.filter((deal) => stage_ids.includes(deal.stage_id));
    },
    getCountByStageIds(stage_ids) {
      return this.deals.filter((deal) => stage_ids.includes(deal.stage_id))
        .length;
    },
    getCountByDynamicStage(stage) {
      return this.getDynamicDealsByStage(stage).length;
    },
    getDynamicDealsByStage(stage) {
      let deals = [];
      if (stage.rules?.includes(rules.OLD_DEALS_ONLY)) {
        deals = this.deals.filter(
          (deal) => deal.stage_id === stage.parent_id && deal.old_deal
        );
      }
      if (stage.rules?.includes(rules.NEW_DEALS_ONLY)) {
        deals = [
          ...deals,
          ...this.deals.filter(
            (deal) => deal.stage_id === stage.parent_id && !deal.old_deal
          ),
        ];
      }
      return deals;
    },
    toggleDealScrollStatus() {
      this.deal_scroll_status = !this.deal_scroll_status;
    },
    setCurrentDeal(deal) {
      this.current_deal = deal;
    },
  },
});
