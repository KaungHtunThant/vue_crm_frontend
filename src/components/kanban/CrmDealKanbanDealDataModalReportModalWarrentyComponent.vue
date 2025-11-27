<template>
  <div class="question bg-light ps-2 py-2 mb-2 rounded-3">
    <label class="form-label">
      <i class="fa-solid fa-shield"></i>
      {{ t("kanban-modal-edit-label-warranty") }}
    </label>
    <select
      class="form-select bg-input-edit"
      v-model="local_data.warranty"
      name="warranty"
    >
      <option :value="null" disabled>
        {{ t("kanban-modal-edit-placeholder-personal-companion") }}
      </option>
      <option v-for="(value, key) in warrenty_list" :key="key" :value="key">
        {{ value }}
      </option>
    </select>
  </div>
</template>
<script>
import { useDealStore } from "@/stores/DealStore";
import { onMounted, ref, watch } from "vue";
import { computed } from "vue";
import { warranties } from "@/enums/warranties";
import { useI18n } from "vue-i18n";
export default {
  name: "WarrentyComponent",
  setup() {
    const { t, locale } = useI18n();
    const deal_store = useDealStore();
    const data = deal_store.getCurrentDeal;
    const local_data = ref({});
    const warrenty_list = computed(() => {
      return Object.fromEntries(
        Object.entries(warranties).map(([key, value]) => [
          key,
          locale.value === "ar" ? value.ar : value.en,
        ])
      );
    });
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
    });
    return { warrenty_list, local_data, t };
  },
};
</script>
