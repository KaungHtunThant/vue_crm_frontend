<template>
  <div
    class="modal fade"
    id="filterWhatsappModal"
    tabindex="-1"
    aria-labelledby="filterWhatsappModalLabel"
    aria-hidden="true"
    ref="filterWhatsappModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="filterWhatsappModalLabel">Filter</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12 mb-3">
              <rating-stars v-model="selectedRating" />
            </div>
            <div class="col-12 mb-3">
              <h6>Filter by</h6>
              <select
                class="form-select"
                aria-label="Default select example"
                v-model="selectedStage"
              >
                <option value="" disabled>Select Stage</option>
                <option
                  v-for="stage in stages"
                  :key="stage.id"
                  :value="stage.id"
                >
                  {{ stage.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-start gap-3 p-0 pt-1">
            <button class="btn btn-primary" @click="applyFilter">Filter</button>
            <button class="btn btn-secondary" @click="resetFilter">
              Reset
            </button>
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RatingStars from "@/components/CreateDealElements/CrmDealKanbanDealDataModalRatingStars.vue";
import { getStagesTasks } from "@/plugins/services/stageService";
// import bootstrap from "bootstrap";
export default {
  name: "WhatsAppModalSidebarLeftFilterConvModal",
  components: {
    RatingStars,
  },
  data() {
    return {
      stages: [],
      selectedStage: "",
      selectedRating: 0,
    };
  },
  mounted() {
    this.getStagesTasks();
  },
  methods: {
    async getStagesTasks() {
      try {
        const response = await getStagesTasks();
        this.stages = response.data.data;
      } catch (error) {
        // Error handled silently
      }
    },
    resetFilter() {
      this.selectedStage = "";
      this.selectedRating = 0;
    },
    // applyFilter() {
    //   this.$emit("filter-by-stage", this.selectedStage);
    //   const modal = document.getElementById("filterWhatsappModal");
    //   const bootstrapModal = bootstrap.Modal.getInstance(modal);
    //   bootstrapModal.hide();
    // },
  },
};
</script>
<style scoped></style>
