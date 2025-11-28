<template>
  <div class="question bg-light ps-2 py-2 mb-2 rounded-3">
    <label class="form-label">
      <i class="fa-solid fa-cubes"></i>
      {{ $t("kanban-modal-edit-label-kanban-packages") }}
    </label>
    <div
      v-for="(pkg, index) in local_data?.kanban_packages || []"
      :key="index"
      class="packages mb-2 px-2"
    >
      <div class="row p-0">
        <div class="col-8 p-1 px-1">
          <select class="form-select py-2 bg-input-edit" v-model="pkg.id">
            <option value="" disabled>
              {{ $t("kanban-modal-edit-placeholder-packages-name") }}
            </option>
            <option
              v-for="pkg in treatment_packages"
              :key="pkg.id"
              :value="pkg.id"
            >
              {{ pkg.name }}
            </option>
          </select>
        </div>
        <div class="col-3 p-1 px-1">
          <div class="input-group">
            <span class="input-group-text">Qty</span>
            <input
              type="number"
              lang="en"
              class="bg-input bg-input-edit p-2 rounded-right-2 form-control"
              v-model="pkg.quantity"
              :placeholder="
                $t('kanban-modal-edit-placeholder-packages-quantity')
              "
              min="1"
            />
          </div>
        </div>
        <div class="col-1 py-1">
          <button
            type="button"
            class="btn btn-primary"
            @click="removeKanbanPackage(index)"
          >
            x
          </button>
        </div>
      </div>
    </div>
    <div class="w-100 d-flex mt-2 justify-content-between gap-2">
      <button
        type="button"
        class="btn btn-primary fs-5 px-3"
        @click="addNewKanbanPackage"
      >
        +
      </button>
      <div class="input-group">
        <span class="input-group-text">
          {{ $t("kanban-modal-edit-label-total-cost") }}
          {{ currency }}
        </span>
        <input
          type="number"
          lang="en"
          class="bg-input bg-input-edit p-2 rounded-right-2 form-control"
          v-model="local_data.kanban_total_cost"
          :placeholder="`${$t(
            'kanban-modal-edit-placeholder-total-cost'
          )} ${currency}`"
          min="0"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { useDealStore } from "@/stores/DealStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { usePackageStore } from "@/stores/PackageStore";
import { computed, watch, ref, onMounted } from "vue";
export default {
  name: "SalesPackagesComponent",
  setup() {
    const deal_store = useDealStore();
    const package_store = usePackageStore();
    const notification_store = useNotificationStore();
    const data = computed(() => deal_store.getCurrentDeal);
    const local_data = ref({});
    const treatment_packages = computed(() =>
      package_store.getPackagesWithCategory("treatments")
    );
    const addNewKanbanPackage = () => {
      local_data.value.kanban_packages.push({
        id: null,
        quantity: null,
      });
    };
    const removeKanbanPackage = (index) => {
      try {
        local_data.value.kanban_packages.splice(index, 1);
      } catch (error) {
        notification_store.error(error.message, {
          timeout: 3000,
        });
      }
    };
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
      if (package_store.getCategories.length === 0) {
        package_store.fetchCategories();
      }
      if (package_store.getAllPackages.length === 0) {
        package_store.fetchPackages();
      }
      local_data.value = data.value;
    });
    return {
      treatment_packages,
      local_data,
      addNewKanbanPackage,
      removeKanbanPackage,
    };
  },
};
</script>
