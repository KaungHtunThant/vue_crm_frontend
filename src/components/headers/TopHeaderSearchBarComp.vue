<template>
  <div class="position-relative w-100" v-show="show_comp">
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
      class="btn-header text-light px-2 rounded-5 position-absolute top-50 start-100 translate-middle ms-neg-8 justify-content-center"
      ><i class="fa fa-clock me-1"></i>{{ currentTime }}</span
    >
    <button
      class="btn btn-link position-absolute ms-neg-4 top-50 start-100 translate-middle px-0"
      @click="openFilterModal"
    >
      <i class="fa-solid fa-filter text-secondary text-hover-dark"></i>
    </button>
  </div>
</template>
<script>
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDealStore } from "@/stores/DealStore";
import { Modal } from "bootstrap";
import { useRoute } from "vue-router";
export default {
  name: "SearchbarComp",
  setup(props, { emit }) {
    const dealStore = useDealStore();
    const storeSearchVal = computed(() => dealStore.search_val);
    const { t } = useI18n();
    const searchVal = ref("");
    const MAX_LEN = 53;
    const placeholderTexts = [
      t("top-header-search-placeholder-1"),
      t("top-header-search-placeholder-2"),
      t("top-header-search-placeholder-3"),
      t("top-header-search-placeholder-4"),
    ];
    const available_paths = [
      "/crm-kanban",
      "/crm-after-sales",
      "/emr-kanban",
      "/crm-tasks",
      "/crmlist",
    ];
    // Inside setup function:
    const route = useRoute();
    const current_path = computed(() => route.path);
    const currentPlaceHolder = ref("");
    function* typewriter(text) {
      for (let char of text) yield char;
    }
    const getVisibleText = (text) => {
      if (text.length <= MAX_LEN) return text;
      return "..." + text.slice(text.length - (MAX_LEN - 3));
    };
    const loopPlaceholders = () => {
      let index = 0;
      const nextPlaceholder = () => {
        const gen = typewriter(t(placeholderTexts[index]));
        currentPlaceHolder.value = "";
        const step = () => {
          const { value, done } = gen.next();
          if (!done) {
            currentPlaceHolder.value = getVisibleText(
              currentPlaceHolder.value + value
            );
            setTimeout(step, 30);
          } else {
            index = (index + 1) % placeholderTexts.length;
            setTimeout(nextPlaceholder, 5000);
          }
        };
        step();
      };
      nextPlaceholder();
    };
    const currentTime = ref("");
    const updateTime = () => {
      const now = new Date();
      currentTime.value = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const msToNextMinute =
        (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
      setTimeout(() => {
        updateTime();
      }, msToNextMinute);
    };
    const handleSearch = () => {
      if (searchVal.value !== storeSearchVal.value) {
        dealStore.setSearchVal(searchVal.value);
        const search = searchVal.value.trim();
        emit("search-deals", search);
      }
    };
    const show_comp = computed(() => {
      console.log("current path:", current_path.value);
      return available_paths.includes(current_path.value);
    });
    watch(searchVal, (newVal) => {
      if ((newVal === "" || newVal === null) && newVal !== storeSearchVal.value)
        dealStore.setSearchVal("");
    });
    const openFilterModal = () => {
      const modal = new Modal(document.getElementById("filterModal"));
      modal.show();
    };
    onMounted(() => {
      loopPlaceholders();
      updateTime();
    });
    return {
      show_comp,
      openFilterModal,
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
