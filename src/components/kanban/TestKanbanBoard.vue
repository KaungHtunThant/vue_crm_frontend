<template>
  <div class="position-relative">
    <div class="kanban-wrapper overflow-y-hidden mt-3" ref="dealsContainer">
      <div
        class="kanban-board d-flex"
        :style="
          permissionStore.hasPermission('edit-stage')
            ? { minWidth: '350px', width: '350px' }
            : { minWidth: '350px', width: '350px' }
        "
      >
        <template v-for="stage in stages" :key="stage.id">
          <div
            v-if="stage.minimized && !stage.parent_id"
            class="kanban-stage position-relative"
            style="
              width: 30px;
              min-width: 30px;
              margin-right: 10px;
              display: flex;
              flex-direction: column;
              /* border-right: 2px dashed #eee; */
              height: 100%;
              align-items: flex-start;
              justify-content: flex-start;
            "
          >
            <div class="linePluse"></div>
            <button
              class="btn btn-sm btn-light mt-2 d-flex justify-content-center align-items-center"
              @click="stage_store.toggleMinimizedById(stage.id)"
              style="
                font-size: 14px;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                align-self: flex-start;
              "
            >
              <span>+</span>
            </button>
          </div>
          <div v-else class="kanban-stage">
            <div
              class="stage-header position-relative"
              :title="stage.name"
              :style="
                permissionStore.hasPermission('edit-stage')
                  ? { minWidth: '301px', width: '301px' }
                  : { minWidth: '307px', width: '307px' }
              "
              :class="{
                'child-stage': stage.parent_id,
              }"
            >
              <div
                class="stageName p-0 d-flex justify-content-between align-items-center"
                :style="{ borderBottom: '2px solid ' + stage.color_code }"
              >
                <button
                  v-if="stage.parent_id"
                  class="btn btn-sm h-100 rounded-0"
                  style="background-color: #f4f4f4"
                  @click="stage_store.toggleHiddenByParentId(stage.parent_id)"
                >
                  <i
                    class="fa-regular fa-square-caret-left"
                    style="font-size: 12px"
                  ></i>
                </button>
                <button
                  v-else
                  class="btn btn-sm h-100 rounded-0"
                  style="background-color: #cecfce"
                  @click="stage_store.toggleMinimizedById(stage.id)"
                >
                  <i
                    class="fa-solid fa-minus text-white"
                    style="font-size: 12px"
                  ></i>
                </button>
                <div>
                  <span>
                    <i
                      :class="`me-1 fa fa-soild fa-${stage.icon}`"
                      :style="{ color: stage.color_code }"
                    ></i>
                  </span>
                  <span
                    style="font-size: 14px"
                    :style="{ color: stage.color_code }"
                    >{{
                      stage.name.length > 20
                        ? stage.name.slice(0, 20) + "…"
                        : stage.name
                    }}</span
                  >
                  <span
                    class="badge ms-1 text-white"
                    style="font-size: 12px"
                    :style="{
                      backgroundColor: stage.color_code,
                    }"
                  >
                    {{ stage.deals_count ?? 0 }}
                  </span>
                </div>
                <div
                  class="d-flex justify-content-end align-items-center gap-1"
                >
                  <button
                    v-if="stage.children_ids.length > 0"
                    class="btn btn-sm h-100 rounded-0 p-0"
                    style=""
                    @click="stage_store.toggleHiddenByParentId(stage.id)"
                  >
                    <span v-if="stage.merge_view"
                      ><i
                        class="fa-solid fa-compress fs-6"
                        style="color: #6e6f70; padding: 4px"
                      ></i
                    ></span>
                    <span v-else
                      ><i
                        class="fa-solid fa-expand fs-6"
                        style="color: #6e6f70; padding: 4px"
                      ></i
                    ></span>
                  </button>
                  <button
                    v-if="stage.filterable_tags"
                    class="btn btn-sm h-100 rounded-0 p-0"
                  >
                    <span
                      ><i
                        class="fa-solid fa-sliders fs-6"
                        style="color: #6e6f70; padding: 4px"
                      ></i
                    ></span>
                  </button>
                </div>
              </div>
            </div>
            <div
              class="stage-column"
              :style="
                permissionStore.hasPermission('edit-stage')
                  ? { minWidth: '307px', width: '307px' }
                  : { minWidth: '312px', width: '313px' }
              "
            >
              <div class="line"></div>
              <draggable
                :list="
                  deal_store.getDealsByStageIds([
                    stage.id,
                    ...stage.children_ids,
                  ])
                "
                :group="{ name: 'deals' }"
                item-key="id"
                class="deal-list mt-3"
                :style="
                  permissionStore.hasPermission('edit-stage')
                    ? { minWidth: '303px', width: '303px' }
                    : { minWidth: '309px', width: '309px' }
                "
                @start="drag = true"
              >
                <template #item="{ element: deal }">
                  <ticket-card
                    :deal="deal"
                    @open-deal-data-card="openDealDataCard(deal.id, stage.id)"
                  />
                </template>
              </draggable>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div
      class="arrowsBoar w-100 position-absolute top-50 end-0"
      style="pointer-events: none"
    >
      <div
        v-if="showRight"
        class="rigthArrow text-white position-absolute bg-primary p-2 opacity-25 z-3"
        style="pointer-events: auto; width: fit-content"
        @mouseenter="scrollDeals(1)"
        @mouseleave="stopScrolling"
      >
        <i class="fa-solid fa-chevron-right fs-1 p-3"></i>
      </div>
      <div
        v-if="showLeft"
        class="leftArrow text-white position-absolute bg-primary p-2 opacity-25 z-3"
        style="pointer-events: auto; width: fit-content"
        @mouseenter="scrollDeals(-1)"
        @mouseleave="stopScrolling"
      >
        <i class="fa-solid fa-chevron-left fs-1 p-3"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { useStageStore } from "@/stores/StageStore";
import { useDealStore } from "@/stores/DealStore";
import { usePermissionStore } from "@/stores/PermissionStore";
import { useToast } from "vue-toastification";
import moveCardSound from "@/assets/move-card.wav";
import { computed, onMounted, onUnmounted } from "vue";
import draggable from "vuedraggable";
import TicketCard from "@/components/kanban/CrmDealKanbanBoardDealsTicketCard.vue";

export default {
  name: "TestKanbanBoard",
  components: {
    draggable,
    TicketCard,
  },
  setup() {
    const moveSound = new Audio(moveCardSound);
    const stage_store = useStageStore();
    const stages = computed(() => stage_store.getAllStages);
    const stagesWithHidden = computed(() => stage_store.getAllStagesWithHidden);
    const deal_store = useDealStore();
    const permissionStore = usePermissionStore();
    const toast = useToast();

    onMounted(() => {
      stage_store
        .fetchStages()
        .then(() => {
          console.log("Stages with hidden:", stagesWithHidden.value);
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
      // Cleanup if necessary
    });

    return {
      moveSound,
      stages,
      deal_store,
      stage_store,
      permissionStore,
      toast,
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
  /* min-width: 350px;
  width: 350px; */
  height: 100%;
}

.stages-header {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
}

.stage-header {
  /* min-width: 301px;
  width: 301px; */
  margin-right: 10px;
  text-align: start;
  /* padding-left: 3px; */
  transition: all 0.5s;
  cursor: pointer;
  /* clip-path: polygon(
    0 0,
    calc(100% - 15px) 0,
    100% 50%,
    calc(100% - 15px) 100%,
    0 100%
  ); */
}
.stageName {
  background-color: #f4f4f4;
  border: 2px solid #d2d5d6;
}
.stage-header:hover .btnPlusStage {
  display: block !important;
}

.deals-container {
  display: flex;
  flex: 1;
  height: calc(100% - 37px);
}

.stage-column {
  /* width: 307px;
  min-width: 307px; */
  height: 100%;
  padding: 0.5rem 0rem 0 0;
  /* border-right: 2px dashed #eee; */
  position: relative;
}

.child-stage {
  border-bottom: 2px dashed #fff !important;
  padding: 5px;
  padding-top: 0;
}

.child-stage.first-child {
  border-left: 2px dashed #eee !important;
}

.child-stage.last-child {
  border-right: 2px dashed #eee !important;
}

.stage-column .line {
  position: absolute;
  right: 0px;
  bottom: 0;
  width: 2px;
  height: 97%;
  background-color: transparent;
  border-right: 2px dashed #eee;
}
.kanban-stage .linePluse {
  position: absolute;
  right: 0px;
  bottom: 0;
  width: 2px;
  height: 93%;
  background-color: transparent;
  border-right: 2px dashed #eee;
}
.deal-list {
  /* width: 300px;
  min-width: 300px; */
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 3px 0 0;
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

.rigthArrow,
.leftArrow {
  transform: translateY(-50%);
  cursor: pointer;
  transition: all 0.5s;
}
.rigthArrow:hover,
.leftArrow:hover {
  cursor: pointer;
  opacity: 0.8 !important;
}
.rigthArrow {
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  right: 0%;
  z-index: 9999;
}
.leftArrow {
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  left: 0%;
  z-index: 9999;
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
