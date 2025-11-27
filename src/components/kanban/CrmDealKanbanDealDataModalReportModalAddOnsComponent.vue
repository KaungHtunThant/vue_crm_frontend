<template>
  <div class="question bg-light ps-2 py-2 mb-2 rounded-3">
    <label class="form-label">
      <i class="fa-solid fa-hand-holding-medical"></i>
      {{ $t("kanban-modal-edit-label-addon") }}
    </label>
    <div class="row m-0 g-2">
      <div
        class="col-12 col-lg-6 px-0 pe-2"
        v-for="(service, index) in local_data?.additional_services || []"
        :key="index"
      >
        <div class="row m-0 gx-0">
          <div class="col-7 pe-2">
            <select class="form-select py-2 bg-input-edit" v-model="service.id">
              <option value="" disabled>
                {{ $t("kanban-modal-edit-placeholder-addon") }}
              </option>
              <option
                v-for="pkg in additional_packages"
                :key="pkg.id"
                :value="pkg.id"
              >
                {{ pkg.name }}
              </option>
            </select>
          </div>
          <div class="col-4 pe-2">
            <input
              type="number"
              v-model="service.days"
              :placeholder="
                $t('kanban-model-edit-addon-input-placeholder-days')
              "
              class="form-control py-2 bg-input-edit"
              min="1"
            />
          </div>
          <div class="col-1 pe-2">
            <button
              type="button"
              class="btn btn-primary h-100"
              @click="removeAdditionalService(index)"
            >
              x
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-2">
      {{ $t("kanban-modal-edit-label-noaddon") }}
    </div>
    <div class="w-100 d-flex mt-2 justify-content-start gap-2">
      <button
        type="button"
        class="btn btn-primary fs-5 px-3"
        @click="addNewAdditionalService"
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
          :class="[
            'bg-input',
            isEditMode ? 'bg-input-edit' : 'bg-input',
            'p-2',
            'rounded-right-2',
            'form-control',
          ]"
          v-model="local_data.add_on_total_cost"
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
import { computed, onMounted, ref, watch } from "vue";
export default {
  name: "AddOnsComponent",
  setup() {
    const deal_store = useDealStore();
    const package_store = usePackageStore();
    const notification_store = useNotificationStore();
    const data = computed(() => deal_store.getCurrentDeal);
    const local_data = ref({});
    const additional_packages = computed(() =>
      package_store.getPackagesWithCategory("add-ons")
    );
    const addNewAdditionalService = () => {
      local_data.value.additional_services.push({
        id: "",
      });
    };

    const removeAdditionalService = (index) => {
      try {
        local_data.value.additional_services.splice(index, 1);
      } catch (error) {
        console.error("Error removing additional service:", error);
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
        console.log("Local data changed:", newVal);
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
      console.log("Initial data:", data.value);
      local_data.value = data.value;
    });
    return {
      local_data,
      additional_packages,
      addNewAdditionalService,
      removeAdditionalService,
    };
  },
};
</script>
