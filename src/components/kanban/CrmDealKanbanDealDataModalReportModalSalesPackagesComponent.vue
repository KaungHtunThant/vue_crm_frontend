<template>
  <div></div>
</template>
<script>
import { useDealStore } from "@/stores/DealStore";
import { usePackageStore } from "@/stores/PackageStore";
import { computed, watch, ref, onMounted } from "vue";
export default {
  name: "SalesPackagesComponent",
  setup() {
    const deal_store = useDealStore();
    const data = computed(() => deal_store.getCurrentDeal);
    const local_data = ref({});
    const package_store = usePackageStore();
    const treatment_packages = computed(() =>
      package_store.getPackagesWithCategory("treatments")
    );
    watch(
      () => data.value,
      (newVal) => {
        if (newVal?.id != local_data.value?.id) {
          console.log("Data changed:", newVal);
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
      }
    );
    onMounted(() => {
      if (package_store.getCategories.length === 0) {
        package_store.fetchCategories();
      }
      if (package_store.getAllPackages.length === 0) {
        package_store.fetchPackages();
      }
      console.log("Initial data:", data.value);
      local_data.value = data.value;
    });
    return {
      treatment_packages,
      local_data,
    };
  },
};
</script>
