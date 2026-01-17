<template>
  <div class="question bg-light ps-2 py-2 mb-2 rounded-3">
    <label class="form-label">
      <i class="fa-solid fa-map-location"></i>
      {{ $t("kanban-modal-edit-label-locations") }}
    </label>
    <select
      class="form-select bg-input-edit"
      v-model="local_data.hospital_id"
      name="hospital_id"
    >
      <option :value="null" disabled>
        {{ $t("kanban-modal-edit-placeholder-hospitals") }}
      </option>
      <option
        v-for="hospital in hospitals"
        :key="hospital.id"
        :value="hospital.id"
      >
        {{ hospital.name }}
      </option>
    </select>
  </div>
</template>
<script>
import { useDealStore } from "@/stores/DealStore";
import { useHospitalStore } from "@/stores/HospitalStore";
import { onMounted, ref, watch } from "vue";
import { computed } from "vue";
export default {
  name: "WarrentyComponent",
  setup() {
    const deal_store = useDealStore();
    const hospital_store = useHospitalStore();
    const data = computed(() => deal_store.getCurrentDeal);
    const local_data = ref({});
    const hospitals = computed(() => hospital_store.getAll || []);
    watch(
      () => data.value,
      (newVal) => {
        if (newVal?.id != local_data.value?.id) {
          if (!newVal) {
            local_data.value = {};
          } else {
            local_data.value = newVal;
          }
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
    onMounted(() => {
      local_data.value = data.value;
      if (hospitals.value.length === 0) {
        hospital_store.fetchAll();
      }
    });
    return { hospitals, local_data };
  },
};
</script>
