<template>
  <select
    v-model="local_package_id"
    @change="onChangePackage"
    class="form-select"
  >
    <option value="" disabled>
      {{ t("users-table-Package-placeholder") }}
    </option>
    <option
      v-for="commission in packages"
      :key="commission.id"
      :value="commission.id"
    >
      {{ commission.name }}
    </option>
  </select>
</template>
<script>
import { onMounted, ref, watch } from "vue";
import { useCommissionPackageStore } from "@/stores/CommissionPackageStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
export default {
  name: "PackageSelector",
  emits: ["package-changed"],
  props: {
    user_id: {
      type: Number,
      required: false,
    },
    package_id: {
      type: Number,
      required: false,
      default: null,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const local_package_id = ref(props.package_id || "");
    const commissionPackageStore = useCommissionPackageStore();

    const onChangePackage = () => {
      emit("package-changed", local_package_id.value, props.user_id);
    };

    watch(
      () => props.package_id,
      (newVal) => {
        if (newVal !== local_package_id.value) {
          local_package_id.value = newVal || "";
        }
      }
    );

    const packages = computed(() => {
      return commissionPackageStore.getPackages;
    });

    onMounted(() => {
      if (packages.value.length === 0) {
        commissionPackageStore.fetchPackages();
      }
    });

    return {
      local_package_id,
      packages,
      t,
      onChangePackage,
    };
  },
};
</script>
