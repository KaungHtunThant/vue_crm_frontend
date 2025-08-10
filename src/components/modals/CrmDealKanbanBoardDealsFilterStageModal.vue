<template>
  <div
    class="modal fade"
    id="filterStage"
    tabindex="-1"
    aria-labelledby="filterStageLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="filterStageLabel">Filter Stage Modal</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row ps-2">
              <div
                v-for="cb in checkboxes"
                :key="cb.value"
                class="form-check mb-2 col-6"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="cb.value"
                  v-model="selectedCheckboxes"
                  :value="cb.value"
                />
                <label
                  class="form-check-label px-2 py-1 rounded fs-7"
                  :for="cb.value"
                  :style="{
                    backgroundColor: cb.color_code,
                    color: getContrastColor(cb.color_code),
                  }"
                >
                  <i :class="`fa-solid fa-${cb.icon} me-1`"> </i>{{ cb.label }}
                </label>
              </div>
            </div>
          </form>
        </div>
        <div
          class="modal-footer d-flex justify-content-between align-items-center"
        >
          <button type="button" class="btn btn-primary" @click="filterStage">
            Apply Filter
          </button>
          <button
            type="button"
            class="btn btn-secondary me-2"
            @click="resetFilter"
          >
            Reset
          </button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { Modal } from "bootstrap";

export default {
  name: "CrmDealKanbanBoardDealsFilterStageModal",
  props: {
    stage: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const toast = useToast();
    const { t } = useI18n();
    const getContrastColor = (hexColor) => {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 170 ? "#000000" : "#FFFFFF";
    };
    return { toast, t, getContrastColor };
  },
  methods: {
    filterStage() {
      this.$emit("filter-deals", {
        stageId: this.stage.id,
        selectedTags: this.selectedCheckboxes,
      });
      const modalEl = document.getElementById("filterStage");
      const modal = Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    },
    resetFilter() {
      this.selectedCheckboxes = [];
      this.$emit("filter-deals", {
        stageId: this.stage.id,
        selectedTags: [],
      });
      const modalEl = document.getElementById("filterStage");
      const modal = Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    },
  },
  computed: {
    checkboxes() {
      if (!this.stage || !this.stage.filterable_tags) return [];
      return this.stage.filterable_tags.map((tag) => ({
        value: tag.id,
        label: tag.name,
        icon: tag.icon,
        color_code: tag.color_code,
      }));
    },
  },
  data() {
    return {
      selectedCheckboxes: [],
    };
  },
};
</script>
<style scoped>
.fs-7 {
  font-size: 0.875rem;
}
</style>
