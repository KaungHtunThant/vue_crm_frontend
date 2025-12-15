<template>
  <transition name="slide">
    <div v-show="isOpen" class="right-drawer">
      <slot></slot>
    </div>
  </transition>
</template>
<script>
import { useSettingStore } from "@/stores/SettingStore";
import { useDealStore } from "@/stores/DealStore";
import { computed, onMounted } from "vue";

export default {
  name: "RightDrawerComp",
  setup() {
    const settingStore = useSettingStore();
    const dealStore = useDealStore();
    const isOpen = computed(() => settingStore.getIsEmrCalendarDrawerOpen);
    const deal_modal_open = computed(() => dealStore.getDealModalStatus);
    onMounted(() => {
      window.addEventListener("contextmenu", () => {
        if (isOpen.value && !deal_modal_open.value) {
          console.log("Closing Right Drawer from context menu", {
            isOpen: isOpen.value,
            deal_modal_open: deal_modal_open.value,
          });
          settingStore.toggleEmrCalendarDrawer();
        }
      });
    });
    return { isOpen };
  },
};
</script>
<style scoped>
.right-drawer {
  position: fixed;
  bottom: 0;
  right: 0;
  height: calc(100vh - 107px);
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  z-index: 1040;
  border-top-left-radius: 20px;
}
/* Transition for sliding */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%); /* start off-screen */
}

@media screen {
  .right-drawer {
    width: 50%;
  }
}
@media (max-width: 768px) {
  .right-drawer {
    width: 100%;
  }
}
</style>
