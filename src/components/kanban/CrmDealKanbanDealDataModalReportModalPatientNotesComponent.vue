<template>
  <!-- Notes -->
  <div class="question bg-light ps-2 py-2 mb-2 rounded-3">
    <label class="form-label"
      ><i class="fa-solid fa-note-sticky"></i>
      {{ $t("kanban-modal-edit-label-notes") }}</label
    >
    <textarea
      class="form-control"
      rows="4"
      v-model="local_data.note"
    ></textarea>
  </div>
</template>
<script>
import { ref, computed, onMounted, watch } from "vue";
import { useDealStore } from "@/stores/DealStore";
export default {
  name: "InitialDiagnosisComponent",
  setup() {
    const deal_store = useDealStore();
    const data = computed(() => deal_store.getCurrentDeal);
    const local_data = ref({});

    onMounted(() => {
      local_data.value = data.value;
    });

    watch(
      () => data.value,
      (newVal) => {
        if (newVal?.id != local_data.value?.id) {
          local_data.value = newVal;
        }
      }
    );
    watch(
      () => local_data.value,
      (newVal) => {
        if (newVal?.id) {
          deal_store.setCurrentDeal(newVal);
        }
        if (!newVal) {
          local_data.value = {};
        }
      }
    );
    return {
      local_data,
    };
  },
};
</script>
