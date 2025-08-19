<template>
  <div class="modal fade" id="filterModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t("filter.title") }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Date From</label>
            <input
              type="date"
              lang="en"
              class="form-control"
              v-model="filterData.created_at_from"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Date To</label>
            <input
              type="date"
              lang="en"
              class="form-control"
              v-model="filterData.created_at_to"
            />
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <div class="">
            <button
              type="button"
              class="btn btn-success text-white me-2"
              @click="applyFilters"
            >
              Apply Filters
            </button>
            <button type="button" class="btn btn-warning" @click="resetFilters">
              Reset
            </button>
          </div>
          <button
            type="button"
            class="btn btn-danger text-white"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

export default {
  name: "ContactsViewFilterModal",
  emits: ["apply-filters", "reset-filters"],

  setup(props, { emit }) {
    const toast = useToast();
    const modalInstance = ref(null);
    const { t } = useI18n();

    const filterData = ref({
      created_at_from: "",
      created_at_to: "",
    });

    const applyFilters = () => {
      try {
        if (
          !filterData.value.created_at_from ||
          !filterData.value.created_at_to
        ) {
          toast.error(t("error.selectDateRange"));
          return;
        }

        const filters = {
          created_at_from: filterData.value.created_at_from,
          created_at_to: filterData.value.created_at_to,
        };
        console.log("Applying filters:", filters);
        emit("apply-filters", filters);
        modalInstance.value.hide();
      } catch (error) {
        toast.error(t("error.applyFilters"));
      }
    };

    const resetFilters = () => {
      try {
        filterData.value = {
          created_at_from: "",
          created_at_to: "",
        };
        emit("reset-filters");
        modalInstance.value.hide();
        toast.success(t("success.filtersCleared"));
      } catch (error) {
        console.error("Error resetting filters:", error);
        toast.error(t("error.resetFilters"));
      }
    };

    onMounted(() => {
      modalInstance.value = new Modal(document.getElementById("filterModal"));
    });

    return {
      filterData,
      openFilterModal: () => modalInstance.value.show(),
      applyFilters,
      resetFilters,
      t,
    };
  },
};
</script>

<style scoped></style>
