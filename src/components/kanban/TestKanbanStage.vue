<template>
  <minimized-stage
    v-if="local_stage.minimized && !local_stage.parent_id"
    :stage="local_stage"
  />
  <div v-else class="kanban-stage">
    <div
      class="stage-header position-relative"
      :title="local_stage.name"
      :style="
        permissionStore.hasPermission('edit-stage')
          ? { minWidth: '301px', width: '301px' }
          : { minWidth: '307px', width: '307px' }
      "
      :class="{
        'child-stage': local_stage.parent_id,
      }"
    >
      <div
        class="stageName p-0 d-flex justify-content-between align-items-center"
        :style="{ borderBottom: '2px solid ' + local_stage.color_code }"
      >
        <button
          v-if="local_stage.parent_id"
          class="btn btn-sm h-100 rounded-0"
          style="background-color: #f4f4f4"
          @click="stage_store.toggleHiddenByParentId(local_stage.parent_id)"
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
          @click="stage_store.toggleMinimizedById(local_stage.id)"
        >
          <i class="fa-solid fa-minus text-white" style="font-size: 12px"></i>
        </button>
        <div>
          <span>
            <i
              :class="`me-1 fa fa-soild fa-${local_stage.icon}`"
              :style="{ color: local_stage.color_code }"
            ></i>
          </span>
          <span
            style="font-size: 14px"
            :style="{ color: local_stage.color_code }"
            >{{
              local_stage.name.length > 20
                ? local_stage.name.slice(0, 20) + "…"
                : local_stage.name
            }}</span
          >
          <span
            class="badge ms-1 text-white"
            style="font-size: 12px"
            :style="{
              backgroundColor: local_stage.color_code,
            }"
          >
            {{ local_stage.deals_count ?? 0 }}
          </span>
        </div>
        <div class="d-flex justify-content-end align-items-center gap-1">
          <button
            v-if="local_stage.children_ids.length > 0"
            class="btn btn-sm h-100 rounded-0 p-0"
            style=""
            @click="stage_store.toggleHiddenByParentId(local_stage.id)"
          >
            <span v-if="local_stage.merge_view"
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
            v-if="local_stage.filterable_tags"
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
        v-if="!local_stage.merge_view"
        :list="deals"
        :group="{ name: 'deals' }"
        item-key="id"
        class="deal-list mt-3"
        :style="
          permissionStore.hasPermission('edit-stage')
            ? { minWidth: '303px', width: '303px' }
            : { minWidth: '309px', width: '309px' }
        "
        @start="drag = true"
        @scroll="handleDealContainerScroll(local_stage.id, $event)"
      >
        <template #item="{ element: deal }">
          <ticket-card
            :deal="deal"
            @open-deal-data-card="openDealDataCard(deal.id, local_stage.id)"
          />
        </template>
      </draggable>
      <div
        v-else
        class="deal-list w-100 mt-3 d-flex flex-column align-items-center justify-content-center"
        style="background-color: #ffffff40"
      >
        <div class="mb-2" style="font-size: 55px">
          <i class="fa-solid fa-compress text-white"></i>
        </div>
        <p class="mb-3 text-white">
          {{ t("kanban-stage-merge-title") }}
        </p>
        <button
          class="btn btn-primary"
          @click="stage_store.toggleHiddenByParentId(local_stage.id)"
        >
          {{ t("kanban-stage-merge-button") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { useStageStore } from "@/stores/StageStore";
import { useDealStore } from "@/stores/DealStore";
import draggable from "vuedraggable";
import TicketCard from "@/components/kanban/CrmDealKanbanBoardDealsTicketCard.vue";
import { ref } from "vue";
import { usePermissionStore } from "@/stores/PermissionStore";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import MinimizedStage from "@/components/kanban/TestKanbanMinimizedStage.vue";
import { computed } from "vue";
export default {
  name: "TestKanbanStage",
  components: {
    draggable,
    TicketCard,
    MinimizedStage,
  },
  props: {
    stage: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const stage_store = useStageStore();
    const deal_store = useDealStore();
    const local_stage = ref(props.stage);
    const permissionStore = usePermissionStore();
    const toast = useToast();
    const { t } = useI18n();
    const reachedBottom = ref(false);
    const deals = computed(() => {
      if (local_stage.value.is_dynamic) {
        return deal_store.getDynamicDealsByStage(local_stage);
      } else {
        return deal_store.getDealsByStageIds([
          local_stage.value.id,
          ...local_stage.value.children_ids,
        ]);
      }
    });
    const handleDealContainerScroll = async (id, event) => {
      if (reachedBottom.value) return;
      const scrollTop = event.target.scrollTop;
      const scrollHeight = event.target.scrollHeight;
      const clientHeight = event.target.clientHeight;
      const stage = stage_store.getStageById(id);
      if (
        deal_store.getCountByStageIds([id, ...stage.children_ids]) >=
        stage.deals_count
      )
        return;
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        reachedBottom.value = true;
        deal_store
          .fetchDealsByStageId(
            id,
            10,
            deal_store.getCountByStageIds([id, ...stage.children_ids]),
            []
          )
          .then(() => {
            reachedBottom.value = false;
          })
          .catch((error) => {
            console.error("Error fetching deals:", error);
            toast.error(t("error-fetching-deals"));
            reachedBottom.value = false;
          });
      }
    };
    return {
      stage_store,
      deal_store,
      local_stage,
      permissionStore,
      deals,
      toast,
      t,
      handleDealContainerScroll,
    };
  },
};
</script>
<style scoped>
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
.kanban-stage .linePulse {
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
</style>
