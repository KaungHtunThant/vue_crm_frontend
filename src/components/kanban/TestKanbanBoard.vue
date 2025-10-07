<template>
  <div class="position-relative">
    <div class="kanban-wrapper overflow-y-hidden mt-3" ref="dealsContainer">
      <div class="kanban-board d-flex">
        <test-kanban-stage
          v-for="stage in stages"
          :key="stage.id"
          :stage="stage"
        />
      </div>
    </div>
    <div class="w-100 position-absolute top-50 end-0">
      <scroll-button
        :direction="1"
        v-show="showRight"
        @mouseenter="scrollDeals(1)"
        @mouseleave="stopScrolling"
      />
      <scroll-button
        :direction="0"
        v-show="showLeft"
        @mouseenter="scrollDeals(-1)"
        @mouseleave="stopScrolling"
      />
    </div>
  </div>
</template>
<script>
import { useStageStore } from "@/stores/StageStore";
import { useDealStore } from "@/stores/DealStore";
import { usePermissionStore } from "@/stores/PermissionStore";
import { useToast } from "vue-toastification";
import moveCardSound from "@/assets/move-card.wav";
import { ref, computed, onMounted, onUnmounted } from "vue";
import TestKanbanStage from "@/components/kanban/TestKanbanStage.vue";
import ScrollButton from "@/components/kanban/TestScrollButton.vue";

export default {
  name: "TestKanbanBoard",
  components: {
    TestKanbanStage,
    ScrollButton,
  },
  setup() {
    const moveSound = new Audio(moveCardSound);
    const stage_store = useStageStore();
    const stages = computed(() => stage_store.getAllStages);
    const stagesWithHidden = computed(() => stage_store.getAllStagesWithHidden);
    const deal_store = useDealStore();
    const permissionStore = usePermissionStore();
    const toast = useToast();
    const resizeObserver = new ResizeObserver(() => updateArrowVisibility());
    const dealsContainer = ref(null);
    const showLeft = ref(false);
    const showRight = ref(true);
    const scrollInterval = ref(null);
    const updateArrowVisibility = () => {
      if (!dealsContainer.value) return;
      const { scrollLeft, scrollWidth, clientWidth } = dealsContainer.value;
      showLeft.value = scrollLeft > 0;
      showRight.value = scrollLeft + clientWidth < scrollWidth - 1;
    };
    const scrollDeals = (direction) => {
      if (!dealsContainer.value) return;
      stopScrolling();
      let lastTimestamp = null;
      const speed = 1.2;
      const animate = (timestamp) => {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const elapsed = timestamp - lastTimestamp;

        dealsContainer.value.scrollLeft += direction * speed * elapsed;
        lastTimestamp = timestamp;

        scrollInterval.value = requestAnimationFrame(animate);
      };

      scrollInterval.value = requestAnimationFrame(animate);
    };
    const stopScrolling = () => {
      if (scrollInterval.value) {
        cancelAnimationFrame(scrollInterval.value);
        scrollInterval.value = null;
      }
    };
    onMounted(() => {
      if (dealsContainer.value) {
        dealsContainer.value.addEventListener("scroll", updateArrowVisibility);
        document.addEventListener("mouseup", stopScrolling);
        document.addEventListener("mouseleave", stopScrolling);
        setTimeout(() => {
          updateArrowVisibility();
        }, 500);
        resizeObserver.observe(dealsContainer.value);
      }
      stage_store
        .fetchStages()
        .then(() => {
          stagesWithHidden.value.forEach((element) => {
            deal_store.fetchDealsByStageId(element.id).catch((error) => {
              toast.error(error.message || "Failed to fetch deals for stage");
            });
          });
        })
        .catch((error) => {
          toast.error(error.message || "Failed to fetch stages");
        });
    });
    onUnmounted(() => {
      resizeObserver.disconnect();
      if (dealsContainer.value) {
        dealsContainer.value.removeEventListener(
          "scroll",
          updateArrowVisibility
        );
      }
      document.removeEventListener("mouseup", stopScrolling);
      document.removeEventListener("mouseleave", stopScrolling);
    });

    return {
      moveSound,
      stages,
      deal_store,
      stage_store,
      permissionStore,
      toast,
      showLeft,
      showRight,
      dealsContainer,
      scrollDeals,
      stopScrolling,
    };
  },
};
</script>
<style scoped>
.kanban-wrapper {
  width: 100%;
  height: calc(100vh - 127px);
  overflow-x: auto;
}
.kanban-board {
  display: flex;
  flex-direction: row;
  min-width: 350px;
  width: 350px;
  height: 100%;
}
/* Scrollbar Styling */
.kanban-wrapper::-webkit-scrollbar,
.deal-list::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.kanban-wrapper::-webkit-scrollbar-track,
.deal-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.kanban-wrapper::-webkit-scrollbar-thumb,
.deal-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
.kanban-wrapper::-webkit-scrollbar-thumb:hover,
.deal-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.fs-merge-icon {
  font-size: 5rem;
}
@media (min-width: 1000px) and (max-width: 1200px) {
  .kanban-wrapper {
    height: calc(100vh - 130px);
  }
}
</style>
