<template>
  <div class="position-relative w-100">
    <button
      class="btn btn-link position-absolute ms-4 top-50 start-0 translate-middle"
      @click="handleSearch"
    >
      <i
        class="fa-solid fa-magnifying-glass text-secondary text-hover-dark"
      ></i>
    </button>
    <input
      type="search"
      class="form-control rounded-5 ps-5 w-100 pe-15"
      :placeholder="currentPlaceHolder"
      v-model="searchVal"
      @search="handleSearch"
    />
    <span
      class="btn-header text-light px-2 rounded-5 position-absolute top-50 start-100 translate-middle ms-neg-8"
      >{{ currentTime }}</span
    >
    <button
      class="btn btn-link position-absolute ms-neg-4 top-50 start-100 translate-middle px-0"
    >
      <i class="fa-solid fa-filter text-secondary text-hover-dark"></i>
    </button>
  </div>
</template>
<script>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDealStore } from "@/stores/DealStore";

export default {
  name: "SearchbarComp",
  setup() {
    const dealStore = useDealStore();
    const storeSearchVal = computed(() => dealStore.search_val);
    const { t } = useI18n();
    const searchVal = ref("");
    const placeholderTexts = [
      t("top-header-search-placeholder-1"),
      t("top-header-search-placeholder-2"),
      t("top-header-search-placeholder-3"),
      t("top-header-search-placeholder-4"),
    ];
    const currentPlaceHolder = ref("");
    let typingInterval = null;
    let timeInterval = null;
    const loopPlaceholders = () => {
      let index = 0;
      setInterval(() => {
        clearInterval(typingInterval);
        index = (index + 1) % placeholderTexts.length;
        const placeholder = t(placeholderTexts[index]);
        let i = 0;
        currentPlaceHolder.value = "";
        typingInterval = setInterval(() => {
          if (i < placeholder.length) {
            if (currentPlaceHolder.value.length >= 53) {
              currentPlaceHolder.value = currentPlaceHolder.value.slice(4);
              currentPlaceHolder.value = "..." + currentPlaceHolder.value;
            }
            currentPlaceHolder.value += placeholder.charAt(i);
            i++;
          } else {
            clearInterval(typingInterval);
          }
        }, 50);
      }, 5000);
    };
    const currentTime = ref("");
    const updateTime = () => {
      timeInterval = setInterval(() => {
        const now = new Date();
        currentTime.value = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      }, 1000);
    };
    const handleSearch = () => {
      if (searchVal.value !== storeSearchVal.value)
        dealStore.setSearchVal(searchVal.value);
    };
    watch(searchVal, (newVal) => {
      if ((newVal === "" || newVal === null) && newVal !== storeSearchVal.value)
        dealStore.setSearchVal("");
    });
    onMounted(() => {
      loopPlaceholders();
      updateTime();
    });
    onUnmounted(() => {
      clearInterval(typingInterval);
      clearInterval(timeInterval);
    });
    return {
      handleSearch,
      searchVal,
      currentPlaceHolder,
      currentTime,
    };
  },
};
</script>
<style scoped>
.btn-header {
  background-color: rgba(125, 125, 125, 0.6);
  transition: 0.3s ease-in-out;
}
.ps-5 {
  padding-left: 2.5rem !important;
}
.ms-neg-4 {
  margin-left: -1.5rem !important;
}
.ms-neg-8 {
  margin-left: -7.3rem !important;
}
.pe-15 {
  padding-right: 11rem !important;
}
.text-hover-dark:hover {
  color: var(--bs-dark) !important;
  transition: 0.2s ease-in-out;
}
.btn-header:hover {
  background-color: rgba(150, 150, 150, 1);
  transition: 0.3s ease-in-out;
}
</style>
