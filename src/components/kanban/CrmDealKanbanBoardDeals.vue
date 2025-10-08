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
        <template v-for="stage in displayStages" :key="stage.id">
          <div
            v-if="hiddenStages[stage.id]"
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
              @click.stop="hiddenStages[stage.id] = false"
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
              :title="stage.description"
              :style="
                permissionStore.hasPermission('edit-stage')
                  ? { minWidth: '301px', width: '301px' }
                  : { minWidth: '307px', width: '307px' }
              "
              :class="{
                'child-stage': stage.parent_id,
                'first-child': stage.parent_id && isFirstChildStage(stage),
                'last-child': stage.parent_id && isLastChildStage(stage),
              }"
            >
              <div
                class="stageName p-0 d-flex justify-content-between align-items-center"
                :style="{ borderBottom: '2px solid ' + stage.color_code }"
              >
                <!-- <button
                  v-if="permissionStore.hasPermission('edit-stage')"
                  class="btnPlusStage border-0 bg-transparent text-white position-absolute d-none"
                  style="right: -2%; top: -3%"
                > -->
                <!-- <span class="bg-primary px-2 py-2 fs-5">+</span> -->
                <!-- <i
                    class="fa-solid fa-filter bg-primary px-2 pe-3"
                    style="
                      font-size: 14px;
                      width: 35px;
                      height: 50px;
                      padding-top: 10px;
                    "
                  ></i>
                </button> -->
                <button
                  v-if="!expandedStages[stage.id] && !stage.parent_id"
                  class="btn btn-sm h-100 rounded-0"
                  style="background-color: #cecfce"
                  @click.stop="hiddenStages[stage.id] = true"
                >
                  <i
                    class="fa-solid fa-minus text-dark"
                    style="font-size: 12px"
                  ></i>
                </button>
                <button
                  v-if="!expandedStages[stage.id] && stage.parent_id"
                  class="btn btn-sm h-100 rounded-0"
                  style="background-color: #cecfce"
                  @click.stop="hiddenStages[stage.id] = true"
                >
                  <i
                    class="fa-regular fa-square-caret-left"
                    style="font-size: 12px"
                  ></i>
                </button>
                <button
                  v-if="expandedStages[stage.id] && stage.has_children"
                  class="btn btn-sm h-100 rounded-0"
                  style="background-color: #cecfce"
                  @click="toggleExpandStage(stage)"
                >
                  <span v-if="expandedStages[stage.id]"
                    ><i class="fa-solid fa-compress text-white"></i
                  ></span>
                  <span v-else
                    ><i class="fa-solid fa-expand text-white"></i
                  ></span>
                </button>
                <div class="">
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
                    {{ stage.deal_count ?? 0 }}
                  </span>
                </div>
                <div
                  class="d-flex justify-content-end align-items-center gap-1"
                >
                  <button
                    v-if="!stage.parent_id && stage.has_children"
                    class="btn btn-sm h-100 rounded-0 p-0"
                    style=""
                    @click="toggleExpandStage(stage)"
                  >
                    <span v-if="expandedStages[stage.id]"
                      ><i
                        class="fa-solid fa-compress d-none fs-6"
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
                    style=""
                    @click="openFilterStage(stage)"
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
              <button
                v-if="stage.is_pullable"
                class="btn btn-secondary mt-2 mx-2 text-center"
                style="width: calc(100% - 1rem)"
                @click="handleOldDealRequest(stage.id)"
              >
                {{ t("kanban-board-stage-olddeal-title") }}
              </button>
              <draggable
                v-if="!expandedStages[stage.id]"
                :list="getStageDeals(stage.id)"
                :group="{ name: 'deals' }"
                item-key="id"
                class="deal-list mt-3"
                :style="
                  permissionStore.hasPermission('edit-stage')
                    ? { minWidth: '303px', width: '303px' }
                    : { minWidth: '309px', width: '309px' }
                "
                @start="drag = true"
                @change="handleDragChange($event, stage.id)"
                @scroll="handleDealContainerScroll($event, stage.id)"
              >
                <template #item="{ element: deal }">
                  <ticket-card
                    :deal="deal"
                    :stage-id="deal.stage_id"
                    :all-stages="allStages"
                    @open-deal-data-card="openDealDataCard(deal.id, stage.id)"
                    @toggle-highlight="handleHighlight(deal.id)"
                    :show-calendar-drag="showCalendarDrag"
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
                  @click="toggleExpandStage(stage)"
                >
                  {{ t("kanban-stage-merge-button") }}
                </button>
              </div>
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
      <button
        v-show="!allDealsCount"
        class="btn text-white position-absolute top-50 start-50 translate-middle bg-primary p-2 z-3 btn-request"
        @click="handleRequestDeal"
      >
        {{ t("kanban-btn-request-deal") }}
      </button>
    </div>
  </div>
  <!-- :key="selectedDeal?.id" -->
  <deal-data-card
    :key="selectedDeal?.id"
    :deal="selectedDeal"
    :logs="logs"
    :comments="comments"
    :tasks="tasks"
    :stages="allStages"
    :currentStageId="selectedStageId"
    @open-whatsapp-modal="openWhatsappModal"
    @stage-change="changeDealStage"
    @suggest-user="handleDealSuggestion"
    @update-deal="updateDeal"
    @task-added="handleTaskViewTaskAdd"
    @task-updated="handleTaskViewTaskUpdate"
    @task-finish="handleTaskViewTaskFinish"
  />
  <!-- selectedDeal -->
  <div v-if="permissionStore.hasPermission('edit-stage')">
    <!-- <update-stage :stage="selectedStage" @update-stage="handleStageUpdate" /> -->
    <filter-stage-modal
      :stage="selectedStage"
      @filter-deals="handleFilterDeals"
    />
  </div>
</template>

<script>
import {
  ref,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  computed,
  nextTick,
  watch,
} from "vue";
import draggable from "vuedraggable";
import TicketCard from "@/components/kanban/CrmDealKanbanBoardDealsTicketCard.vue";
import { Modal } from "bootstrap";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import {
  updateDealStage,
  showDeal,
  fetchAdditionalDealsByStageId,
  addViewCount,
  getStagesChildren,
  getAvailableStages,
  createApproval,
  toggleHighlight,
  pullDealsFromOldSystem,
} from "@/plugins/services/authService";
import { useI18n } from "vue-i18n";
import Cookies from "js-cookie";
import DealDataCard from "@/components/modals/CrmDealKanbanDealDataModal.vue";
// import UpdateStage from "@/components/modals/CrmDealKanbanBoardDealsUpdateStageModal.vue";
import FilterStageModal from "@/components/modals/CrmDealKanbanBoardDealsFilterStageModal.vue";
import moveCardSound from "@/assets/move-card.wav";
import { closeWebSocket, initializeWebSocket } from "@/plugins/websocket";
import { usePermissionStore, PERMISSIONS } from "@/stores/PermissionStore";
import { useKanbanStore } from "@/stores/KanbanStore";
export default {
  name: "CrmDealKanbanBoardDeals",
  components: {
    draggable,
    TicketCard,
    DealDataCard,
    // UpdateStage,
    FilterStageModal,
  },
  props: {
    stages: {
      type: Array,
      required: true,
    },
    defaultColor: {
      type: String,
      default: "#333",
    },
    viewType: {
      type: String,
      default: "deal",
    },
    searchVal: {
      type: String,
      default: "",
    },
    filters: {
      type: Object,
      default: () => ({}),
    },
    showCalendarDrag: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const isIdle = ref(false);
    const route = useRoute();
    const dealsContainer = ref(null);
    let scrollInterval = null;
    const drag = ref(false);
    const showLeft = ref(false);
    const showRight = ref(true);
    const selectedStage = ref(null);
    const logs = ref([]);
    const comments = ref([]);
    const isTasksView = computed(() => route.path === "/crm-tasks");
    const tasks = ref([]);
    const toast = useToast();
    const { t } = useI18n();
    const selectedDeal = ref(null);
    const reachedBottom = ref(false);
    const moveSound = new Audio(moveCardSound);
    const permissionStore = usePermissionStore();
    const kanbanStore = useKanbanStore();
    let idleTimer = null;
    const idleTimeLimit = 5 * 60 * 1000;
    const hiddenStages = ref({});
    const expandedStages = ref({});
    const displayStages = ref([]);
    const filteredDeals = ref({});
    const allStages = ref(null);
    const selectedStageId = ref(null);

    watch(
      () => props.stages,
      (newStages) => {
        displayStages.value = newStages.filter(
          (stage) => stage.parent_id === null || stage.parent_id === undefined
        );
      },
      { immediate: true }
    );

    const allDealsCount = computed(() => {
      return displayStages.value.reduce((count, stage) => {
        return count + (stage.deal_count || 0);
      }, 0);
    });

    const fetchChildStages = async (parentId) => {
      try {
        const formattedFilters = formatFilters();
        const response = await getStagesChildren(
          parentId,
          10,
          0,
          formattedFilters
        );

        if (response.data && response.data.data) {
          const childStages = response.data.data;
          return childStages;
        } else {
          console.error(response.message);
          throw new Error(response.message);
        }
      } catch (error) {
        console.error(error.message, parentId, error);
        throw error;
      }
    };
    const formatFilters = () => {
      const formattedFilters = {};

      if (props.filters.source_id) {
        formattedFilters["filters[source_id]"] = props.filters.source_id;
      }
      if (props.filters.stage_id) {
        formattedFilters["filters[stage_id]"] = props.filters.stage_id;
      }
      if (props.filters.user_id) {
        formattedFilters["filters[user_id]"] = props.filters.user_id;
      }
      if (props.filters.created_at_start) {
        formattedFilters["filters[created_date_start]"] =
          props.filters.created_at_start;
      }
      if (props.filters.created_at_end) {
        formattedFilters["filters[created_date_end]"] =
          props.filters.created_at_end;
      }
      if (props.filters.updated_at_start) {
        formattedFilters["filters[updated_date_start]"] =
          props.filters.updated_at_start;
      }
      if (props.filters.updated_at_end) {
        formattedFilters["filters[updated_date_end]"] =
          props.filters.updated_at_end;
      }
      if (Array.isArray(props.filters.status)) {
        if (props.filters.status.includes("unassigned")) {
          formattedFilters["filters[unassigned]"] = 1;
        }
        if (props.filters.status.includes("no_comments")) {
          formattedFilters["filters[uncommented]"] = 1;
        }
        if (props.filters.status.includes("no_task")) {
          formattedFilters["filters[no_tasks]"] = 1;
        }
        if (props.filters.status.includes("overdue")) {
          formattedFilters["filters[overdue]"] = 1;
        }
        if (props.filters.status.includes("new")) {
          formattedFilters["filters[new]"] = 1;
        }
        if (props.filters.status.includes("admin_comments")) {
          formattedFilters["filters[admin_comments]"] = 1;
        }
      }
      if (props.filters.sort_by) {
        formattedFilters["sort_by"] = props.filters.sort_by;
      }
      if (props.filters.sort_order) {
        formattedFilters["sort_order"] = props.filters.sort_order;
      }

      if (props.searchVal) {
        if (typeof props.searchVal === "object" && props.searchVal !== null) {
          formattedFilters.search = props.searchVal.search;
        } else if (props.searchVal) {
          formattedFilters.search = props.searchVal;
        }
      }

      return formattedFilters;
    };

    const toggleExpandStage = async (parentStage) => {
      const isExpanded = expandedStages.value[parentStage.id];

      if (isExpanded) {
        expandedStages.value[parentStage.id] = false;
        displayStages.value = displayStages.value.filter(
          (stage) => stage.parent_id !== parentStage.id
        );
        const stageIndex = displayStages.value.findIndex(
          (s) => s.id === parentStage.id
        );
        try {
          const formattedFilters = formatFilters();
          console.log("filters applied ", formatFilters);
          const parentStageDeals = await fetchAdditionalDealsByStageId(
            parentStage.id,
            10,
            0,
            formattedFilters
          );
          if (parentStageDeals?.data?.data) {
            displayStages.value[stageIndex].deals = parentStageDeals.data.data;
          }
        } catch (error) {
          console.error("Error fetching parent stage deals:", error);
          toast.error("Failed to load parent stage deals");
        }
      } else {
        expandedStages.value[parentStage.id] = true;
        try {
          const childStages = await fetchChildStages(parentStage.id);

          const parentIndex = displayStages.value.findIndex(
            (stage) => stage.id === parentStage.id
          );
          if (parentIndex !== -1) {
            const newDisplayStages = [...displayStages.value];
            newDisplayStages.splice(parentIndex + 1, 0, ...childStages);
            displayStages.value = newDisplayStages;
          }
        } catch (error) {
          expandedStages.value[parentStage.id] = false;
          toast.error(error.message);
        }
      }
    };

    const handleDragChange = async (event, newStageId) => {
      if (event.added) {
        const deal = event.added.element;
        const oldStageId = deal.stage_id;
        const originalStageId = deal.stage_id;

        // DON'T update the stage_id yet - wait for API success
        // const newStageInDisplay = displayStages.value.find(
        //   (stage) => stage.id === newStageId
        // );
        // if (newStageInDisplay) {
        //   const dealInNewStage = newStageInDisplay.deals.find(
        //     (d) => d.id === deal.id
        //   );
        //   if (dealInNewStage) {
        //     dealInNewStage.stage_id = newStageId; // Remove this - do it after API success
        //   }
        // }

        try {
          const request = await updateDealStage(deal.id, newStageId);
          if (request.status !== 200) {
            console.error("Error updating deal stage:", request.data.message);
            toast.error(request.data.message);
            const newStageInDisplay = displayStages.value.find(
              (s) => s.id === newStageId
            );
            const dealIndexInNewStage = newStageInDisplay
              ? newStageInDisplay.deals.findIndex((d) => d.id === deal.id)
              : -1;

            if (newStageInDisplay && dealIndexInNewStage !== -1) {
              const [revertedDeal] = newStageInDisplay.deals.splice(
                dealIndexInNewStage,
                1
              );
              const oldStageInDisplay = displayStages.value.find(
                (s) => s.id === oldStageId
              );
              if (oldStageInDisplay) {
                oldStageInDisplay.deals.unshift(revertedDeal);
                revertedDeal.stage_id = originalStageId;
              } else {
                const oldParentStageInDisplay = displayStages.value.find(
                  (s) => s.parent_id === oldStageId
                );
                if (oldParentStageInDisplay) {
                  oldParentStageInDisplay.deals.unshift(revertedDeal);
                  revertedDeal.stage_id = originalStageId;
                }
              }
            }
            return;
          }
          const newStageInDisplay = displayStages.value.find(
            (stage) => stage.id === newStageId
          );
          if (newStageInDisplay) {
            const dealInNewStage = newStageInDisplay.deals.find(
              (d) => d.id === deal.id
            );
            if (dealInNewStage) {
              dealInNewStage.stage_id = newStageId;
            }
          }
          const oldStageInDisplay = displayStages.value.find(
            (s) => s.id === oldStageId
          );
          const newStageInDisplayForCount = displayStages.value.find(
            (s) => s.id === newStageId
          );

          if (oldStageInDisplay)
            oldStageInDisplay.deal_count = Math.max(
              0,
              oldStageInDisplay.deal_count - 1
            );
          if (newStageInDisplayForCount)
            newStageInDisplayForCount.deal_count =
              (newStageInDisplayForCount.deal_count || 0) + 1;

          playSound();
        } catch (error) {
          const newStageInDisplayToRevert = displayStages.value.find(
            (s) => s.id === newStageId
          );
          const dealIndexInNewStage = newStageInDisplayToRevert
            ? newStageInDisplayToRevert.deals.findIndex((d) => d.id === deal.id)
            : -1;

          if (newStageInDisplayToRevert && dealIndexInNewStage !== -1) {
            const [revertedDeal] = newStageInDisplayToRevert.deals.splice(
              dealIndexInNewStage,
              1
            );
            const oldStageInDisplay = displayStages.value.find(
              (s) => s.id === oldStageId
            );
            if (oldStageInDisplay) {
              oldStageInDisplay.deals.unshift(revertedDeal);
              revertedDeal.stage_id = originalStageId;
            } else {
              const oldParentStageInDisplay = displayStages.value.find(
                (s) => s.parent_id === oldStageId
              );
              if (oldParentStageInDisplay) {
                oldParentStageInDisplay.deals.unshift(revertedDeal);
                revertedDeal.stage_id = originalStageId;
              }
            }
          }
          toast.error(error.message);
        }
      }
    };

    const playSound = () => {
      moveSound.currentTime = 0;
      moveSound
        .play()
        .catch((error) => console.error("Failed to play sound:", error));
    };

    const openDealDataCard = async (dealId, currentStageId = null) => {
      try {
        if (!allStages.value) {
          const response = await getAvailableStages();
          if (response.data && response.data.data) {
            allStages.value = response.data.data;
          } else {
            allStages.value = [];
          }
        }
        addViewCount(dealId);
        const dealData = await showDeal(dealId);
        if (dealData.data) {
          const deal = dealData.data.data;
          selectedStageId.value = deal.stage_id;
          const checkStageLoaded = () => {
            if (isTasksView.value) {
              return displayStages.value.find(
                (stage) => stage.id === currentStageId
              );
            } else {
              return displayStages.value.some(
                (stage) => stage.id === deal.stage_id
              );
            }
          };
          const waitForStage = () => {
            return new Promise((resolve) => {
              if (checkStageLoaded()) {
                resolve();
              } else {
                console.warn(
                  `Deal's stage (ID: ${deal.stage_id}) not currently displayed.`
                );
                resolve();
              }
            });
          };

          await waitForStage();

          selectedDeal.value = deal;
          await nextTick();
          const modalEl = document.getElementById("dealDataCard");
          const modal = new Modal(modalEl);
          modal.show();
          modalEl.addEventListener(
            "hidden.bs.modal",
            () => {
              const backdrop = document.querySelector(".modal-backdrop");
              if (backdrop) {
                backdrop.remove();
                document.body.classList.remove("modal-open");
                document.body.style.paddingRight = null;
              }
            },
            { once: true }
          );
        } else {
          console.error("No matching deal found for ID:", dealId);
        }
      } catch (error) {
        console.error("Error fetching deal data:", error);
        toast.error("something went wrong");
      }
    };

    const openFilterStage = (stage) => {
      selectedStage.value = stage;
      const modal = new Modal(document.getElementById("filterStage"));
      modal.show();
    };
    const getStageHeaderClass = (stageId) => {
      return `stage-color-${stageId}`;
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

        scrollInterval = requestAnimationFrame(animate);
      };

      scrollInterval = requestAnimationFrame(animate);
    };

    // let firstLoad = true;
    const updateArrowVisibility = () => {
      if (!dealsContainer.value) return;

      const { scrollLeft, scrollWidth, clientWidth } = dealsContainer.value;

      showLeft.value = scrollLeft > 0;
      showRight.value = scrollLeft + clientWidth < scrollWidth - 1;
    };

    // Add watcher for displayStages
    watch(
      () => displayStages.value,
      () => {
        nextTick(() => {
          updateArrowVisibility();
        });
      },
      { deep: true }
    );

    const stopScrolling = () => {
      if (scrollInterval) {
        cancelAnimationFrame(scrollInterval);
        scrollInterval = null;
      }
    };
    const handleStageUpdate = (updatedStage) => {
      const displayStageIndex = displayStages.value.findIndex(
        (stage) => stage.id === updatedStage.id
      );
      if (displayStageIndex !== -1) {
        displayStages.value[displayStageIndex] = {
          ...displayStages.value[displayStageIndex],
          ...updatedStage,
        };
      }
    };

    const handleDealEvent = (event) => {
      const action = event.action;
      if (action === "create") {
        dealCreateEvent(event.data, event.message);
      } else if (action === "update") {
        dealUpdateEvent(event.data, event.message);
      } else if (action === "delete") {
        dealDeleteEvent(event.data, event.message);
      }
    };

    const handleWhatsappEvent = (event) => {
      const action = event.action;
      if (action === "create") {
        handleWhatsappMessageCreateEvent(event.data);
      } else if (action == "update") {
        handleWhatsappMessageUpdateEvent(event.data);
      }
    };

    const dealCreateEvent = (data, message) => {
      const stageIndex = displayStages.value.findIndex(
        (stage) => stage.id == data.stage_id
      );

      if (stageIndex !== -1 && !expandedStages.value[data.stage_id]) {
        const newDeal = {
          id: data.id,
          name: data.name,
          s: data.description,
          stage_id: data.stage_id,
          responsible_user: data.responsible_user,
          created_at: data.created_at,
          updated_at: data.updated_at,
          phone: data.phone,
          source_id: data.source_id,
          view_count: data.view_count,
          unread_count: data.unread_count,
        };
        displayStages.value[stageIndex].deals.unshift(newDeal);
        displayStages.value[stageIndex].deal_count =
          (displayStages.value[stageIndex].deal_count || 0) + 1;
        toast.success(message);
      }
    };

    const dealUpdateEvent = (data, message) => {
      const id = data.id;
      const updatedData = data.updated_data;
      const oldStageId = data.stage_id;
      const newStageId = updatedData?.stage_id;

      const oldStageIndexInDisplay = displayStages.value.findIndex(
        (stage) => stage.id == oldStageId
      );
      const dealIndexInOldStage =
        oldStageIndexInDisplay !== -1
          ? displayStages.value[oldStageIndexInDisplay].deals.findIndex(
              (deal) => deal.id == id
            )
          : -1;

      if (oldStageId != newStageId) {
        if (
          oldStageIndexInDisplay !== -1 &&
          dealIndexInOldStage !== -1 &&
          !expandedStages.value[oldStageId]
        ) {
          displayStages.value[oldStageIndexInDisplay].deals.splice(
            dealIndexInOldStage,
            1
          );
          displayStages.value[oldStageIndexInDisplay].deal_count = Math.max(
            0,
            displayStages.value[oldStageIndexInDisplay].deal_count - 1
          );
        } else if (
          oldStageIndexInDisplay !== -1 &&
          expandedStages.value[oldStageId]
        ) {
          displayStages.value[oldStageIndexInDisplay].deal_count = Math.max(
            0,
            displayStages.value[oldStageIndexInDisplay].deal_count - 1
          );
        }

        const newStageIndexInDisplay = displayStages.value.findIndex(
          (stage) => stage.id == newStageId
        );

        if (
          newStageIndexInDisplay !== -1 &&
          !expandedStages.value[newStageId]
        ) {
          const updatedDeal = { ...data, ...updatedData, stage_id: newStageId };
          displayStages.value[newStageIndexInDisplay].deals.unshift(
            updatedDeal
          );
          displayStages.value[newStageIndexInDisplay].deal_count =
            (displayStages.value[newStageIndexInDisplay].deal_count || 0) + 1;
        } else if (
          newStageIndexInDisplay !== -1 &&
          expandedStages.value[newStageId]
        ) {
          displayStages.value[newStageIndexInDisplay].deal_count =
            (displayStages.value[newStageIndexInDisplay].deal_count || 0) + 1;
        }
      } else {
        if (
          oldStageIndexInDisplay !== -1 &&
          dealIndexInOldStage !== -1 &&
          !expandedStages.value[oldStageId]
        ) {
          Object.assign(
            displayStages.value[oldStageIndexInDisplay].deals[
              dealIndexInOldStage
            ],
            updatedData
          );
        }
      }
      toast.success(message);
    };

    const dealDeleteEvent = (deal, message) => {
      const stageIndex = displayStages.value.findIndex(
        (stage) => stage.id == deal.stage_id
      );

      if (stageIndex !== -1 && !expandedStages.value[deal.stage_id]) {
        const dealIndex = displayStages.value[stageIndex].deals.findIndex(
          (d) => d.id == deal.id
        );
        if (dealIndex != -1) {
          displayStages.value[stageIndex].deals.splice(dealIndex, 1);
          displayStages.value[stageIndex].deal_count = Math.max(
            0,
            displayStages.value[stageIndex].deal_count - 1
          );
          toast.success(message);
        }
      } else if (stageIndex !== -1 && expandedStages.value[deal.stage_id]) {
        displayStages.value[stageIndex].deal_count = Math.max(
          0,
          displayStages.value[stageIndex].deal_count - 1
        );
      }
    };

    const handleTaskEvent = (event) => {
      const { action, data } = event;
      if (action === "create") {
        tasks.value.push(data);
      } else if (action === "update") {
        const index = tasks.value.findIndex((t) => t.id === data.id);
        if (index !== -1) {
          tasks.value[index] = { ...tasks.value[index], ...data };
        } else {
          tasks.value.push(data);
        }
      } else if (action === "delete") {
        tasks.value = tasks.value.filter((t) => t.id !== data.id);
      }
    };

    const handleCommentEvent = (event) => {
      const { action, data } = event;

      if (action === "create") {
        comments.value.push(data);
      } else if (action === "update") {
        const index = comments.value.findIndex((c) => c.id === data.id);
        if (index !== -1) {
          comments.value[index] = { ...comments.value[index], ...data };
        } else {
          comments.value.push(data);
        }
      } else if (action === "delete") {
        comments.value = comments.value.filter((c) => c.id !== data.id);
      }
    };

    const handleLogEvent = (event) => {
      const { action, data } = event;

      if (action === "create") {
        logs.value.push(data);
      } else if (action === "update") {
        const logIndex = logs.value.findIndex((log) => log.id === data.id);
        if (logIndex !== -1) {
          logs.value[logIndex] = { ...logs.value[logIndex], ...data };
        } else {
          logs.value.push(data);
        }
      } else if (action === "delete") {
        logs.value = logs.value.filter((log) => log.id !== data.id);
      }
    };

    const handleWhatsappMessageCreateEvent = (data) => {
      console.log("handleWhatsappMessageCreateEvent", data);
      if (data.status == "sent") {
        IncreaseUnreadCount(data.deal_id);
      }
      emit("receive-whatsapp-message", data);
    };

    const handleWhatsappMessageUpdateEvent = (data) => {
      emit("update-whatsapp-message", data);
    };

    const openWhatsappModal = (conversation, id) => {
      console.log("openWhatsappModal in kanban comp", conversation);
      emit("open-whatsapp-modal", conversation);
      DecreaseUnreadCount(id);
    };
    const getContrastColor = (hexColor) => {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 170 ? "#000000" : "#FFFFFF";
    };

    const handleDealContainerScroll = async (event, id) => {
      if (reachedBottom.value) return;
      const scrollTop = event.target.scrollTop;
      const scrollHeight = event.target.scrollHeight;
      const clientHeight = event.target.clientHeight;
      const stageIndex = displayStages.value.findIndex((s) => s.id === id);
      if (
        displayStages.value[stageIndex].deals.length ===
        displayStages.value[stageIndex].deal_count
      )
        return;
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        reachedBottom.value = true;
        try {
          const formattedFilters = formatFilters();
          const additional_deals = await fetchAdditionalDealsByStageId(
            id,
            10,
            displayStages.value[stageIndex].deals.length,
            formattedFilters
          );

          if (
            additional_deals &&
            additional_deals.data &&
            additional_deals.data.data &&
            Array.isArray(additional_deals.data.data)
          ) {
            if (stageIndex !== -1) {
              displayStages.value[stageIndex].deals.push(
                ...additional_deals.data.data
              );
            }
          }
        } finally {
          reachedBottom.value = false;
        }
      }
    };

    const IncreaseUnreadCount = (dealId) => {
      console.log("IncreaseUnreadCount", dealId);
      for (const stage of displayStages.value) {
        if (stage.deals) {
          const deal = stage.deals.find((d) => d.id === dealId);
          if (deal) {
            deal.unread_count = (deal.unread_count || 0) + 1;
            return;
          }
        }
      }
    };

    const DecreaseUnreadCount = (dealId) => {
      for (const stage of displayStages.value) {
        if (stage.deals) {
          const deal = stage.deals.find((d) => d.id === dealId);
          if (deal) {
            deal.unread_count = 0;
            return;
          }
        }
      }
    };

    const changeDealStage = async (
      dealId,
      newStageId,
      oldStageId,
      kanban = 1,
      is_trash = false
    ) => {
      try {
        const stages = displayStages;
        if (props.viewType == "task" && is_trash) {
          const response = await updateDealStage(dealId, newStageId);
          if (response.status !== 200) {
            console.error("Error updating deal stage:", response.data.message);
            toast.error(response.data.message);
            return;
          }
          for (const stage of stages.value) {
            if (stage.deals) {
              stage.deals = stage.deals.filter((d) => d.id != dealId);
            }
          }
          displayStages.value = stages.value;
          toast.success(response.data.message);
        } else {
          const newStage = ref(
            stages.value.find((stage) => stage.id == newStageId)
          );
          const oldStage = ref(
            stages.value.find((stage) => stage.id == oldStageId)
          );
          console.log("newStage", newStage.value);
          const deal =
            newStage?.value?.deals.find((d) => d.id == dealId) ??
            oldStage?.value?.deals.find((d) => d.id == dealId);
          console.log("deal", deal);
          const response = await updateDealStage(dealId, newStageId);
          console.log("response", response.status);
          if (response.status !== 200) {
            console.error("Error updating deal stage:", response.data.message);
            toast.error(response.data.message);
            return;
          } else {
            deal.stage_id = newStageId;
            if (oldStage.value) oldStage.value.deal_count -= 1;
            if (newStage.value) newStage.value.deal_count += 1;
            if (!kanban) {
              oldStage.value.deals.splice(
                oldStage.value.deals.findIndex((d) => d.id == dealId),
                1
              );
              if (newStage.value) newStage.value.deals.unshift(deal);
            }
            toast.success(response.data.message);
            playSound();
          }
        }
      } catch (error) {
        console.error("Error updating deal stage:", error);

        const oldStage = props.stages.find((s) => s.id === oldStageId);
        if (oldStage) {
          const currentStage = props.stages.find((s) => s.id === newStageId);
          if (currentStage) {
            const dealIndex = currentStage.deals.findIndex(
              (d) => d.id === dealId
            );
            if (dealIndex !== -1) {
              const [removedDeal] = currentStage.deals.splice(dealIndex, 1);
              oldStage.deals.push(removedDeal);
            }
          }
        }
        const oldStageInDisplayForRevertCount = displayStages.value.find(
          (s) => s.id === oldStageId
        );
        const newStageAfterRevertInDisplay = displayStages.value.find(
          (s) => s.id === newStageId
        );

        if (oldStageInDisplayForRevertCount)
          oldStageInDisplayForRevertCount.deal_count =
            (oldStageInDisplayForRevertCount.deal_count || 0) + 1;
        if (newStageAfterRevertInDisplay)
          newStageAfterRevertInDisplay.deal_count = Math.max(
            0,
            newStageAfterRevertInDisplay.deal_count - 1
          );

        toast.error(error.message);
      }
    };
    const refreshPage = () => {
      window.location.reload();
    };
    const startIdleTimer = () => {
      clearIdleTimer();
      idleTimer = setTimeout(setIdle, idleTimeLimit);
    };

    const clearIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
    };

    const setupUserActivityListeners = () => {
      ["mousemove", "keydown", "mousedown", "touchstart"].forEach((event) => {
        window.addEventListener(event, resetIdleTimer);
      });
    };

    const removeUserActivityListeners = () => {
      ["mousemove", "keydown", "mousedown", "touchstart"].forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };

    const resetIdleTimer = () => {
      if (isIdle.value) {
        isIdle.value = false;
        reconnectWebSocket();
      }
      startIdleTimer();
    };

    const setIdle = () => {
      isIdle.value = true;
      disconnectWebSocket();
    };

    const disconnectWebSocket = () => {
      window.Echo.disconnect();
      console.log("WebSocket disconnected due to inactivity");
    };

    const reconnectWebSocket = () => {
      window.Echo.connect();
      const userRole = Cookies.get("user_role");
      const user_id = Cookies.get("user_id");
      let userChannel;

      if (userRole === "super-admin") {
        userChannel = userRole;
      } else {
        userChannel = `${userRole}-${user_id}`;
      }

      if (window.Echo && userChannel) {
        window.Echo.channel(userChannel).listen(
          ".DealEvent",
          ".TaskEvent",
          ".CommentEvent",
          ".LogEvent",
          ".WhatsappEvent"
        );
      }

      console.log("WebSocket reconnected on user activity");
      kanbanStore.setHasNewChanges(true);
    };

    const isFirstChildStage = (stage) => {
      if (!stage.parent_id) return false;
      const parentStage = displayStages.value.find(
        (s) => s.id === stage.parent_id
      );
      if (!parentStage) return false;

      const childStages = displayStages.value.filter(
        (s) => s.parent_id === stage.parent_id
      );
      return childStages[0]?.id === stage.id;
    };

    const isLastChildStage = (stage) => {
      if (!stage.parent_id) return false;
      const parentStage = displayStages.value.find(
        (s) => s.id === stage.parent_id
      );
      if (!parentStage) return false;

      const childStages = displayStages.value.filter(
        (s) => s.parent_id === stage.parent_id
      );
      return childStages[childStages.length - 1]?.id === stage.id;
    };

    const handleFilterDeals = async ({ stageId, selectedTags }) => {
      try {
        if (!selectedTags || selectedTags.length === 0) {
          filteredDeals.value[stageId] = null;
          return;
        }

        const stage = displayStages.value.find((s) => s.id === stageId);
        if (stage) {
          const filtered = stage.deals.filter((deal) => {
            return (
              deal.tags &&
              deal.tags.some((tag) => selectedTags.includes(tag.id))
            );
          });
          filteredDeals.value[stageId] = filtered;
        }
      } catch (error) {
        console.error("Error filtering deals:", error);
        toast.error(t("error.filterFailed"));
      }
    };

    const getStageDeals = computed(() => (stageId) => {
      const stage = displayStages.value.find((s) => s.id === stageId);
      if (!stage) return [];

      return filteredDeals.value[stageId] || stage.deals;
    });

    const handleRequestDeal = async () => {
      try {
        const response = await createApproval(props.searchVal);
        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };

    onMounted(async () => {
      if (dealsContainer.value) {
        dealsContainer.value.addEventListener("scroll", updateArrowVisibility);
        document.addEventListener("mouseup", stopScrolling);
        document.addEventListener("mouseleave", stopScrolling);

        // Force update arrows visibility after a short delay
        setTimeout(() => {
          updateArrowVisibility();
        }, 500);

        // Add resize observer
        const resizeObserver = new ResizeObserver(() => {
          updateArrowVisibility();
        });

        resizeObserver.observe(dealsContainer.value);

        onUnmounted(() => {
          resizeObserver.disconnect();
        });
      }

      startIdleTimer();
      setupUserActivityListeners();

      try {
        await initializeWebSocket();
        const userRole = Cookies.get("user_role");
        const user_id = Cookies.get("user_id");
        let userChannel =
          userRole === "super-admin" ? userRole : `${userRole}-${user_id}`;

        if (window.Echo && userChannel) {
          window.Echo.channel(userChannel)
            .listen(".DealEvent", (event) => {
              console.log("DealEvent received:", event);
              handleDealEvent(event);
            })
            .listen(".TaskEvent", (event) => {
              console.log("TaskEvent received:", event);
              handleTaskEvent(event);
            })
            .listen(".CommentEvent", (event) => {
              console.log("CommentEvent received:", event);
              handleCommentEvent(event);
            })
            .listen(".LogEvent", (event) => {
              console.log("LogEvent received:", event);
              handleLogEvent(event);
            })
            .listen(".WhatsappEvent", (event) => {
              console.log("WhatsappEvent received:", event);
              handleWhatsappEvent(event);
            });
        }
      } catch (error) {
        console.error("Error mounting component:", error);
      }

      props.stages.forEach((stage) => {
        hiddenStages.value[stage.id] = false;
        expandedStages.value[stage.id] = false;
      });

      const response = await getAvailableStages();
      if (response.data && response.data.data) {
        allStages.value = response.data.data;
      } else {
        allStages.value = [];
      }
    });

    onUnmounted(() => {
      if (dealsContainer.value) {
        dealsContainer.value.removeEventListener(
          "scroll",
          updateArrowVisibility
        );
      }
      document.removeEventListener("mouseup", stopScrolling);
      document.removeEventListener("mouseleave", stopScrolling);

      const user_id = 1;
      const userRole = "sales";

      let userChannel =
        userRole === "super-admin" ? userRole : `${userRole}-${user_id}`;

      // Leave the WebSocket channel
      window.Echo.leave(userChannel);

      // Close the WebSocket connection
      closeWebSocket();
    });

    onBeforeUnmount(() => {
      clearIdleTimer();
      removeUserActivityListeners();
    });

    const handleDealSuggestion = (deal_id) => {
      const stage = displayStages.value.find((s) =>
        s.deals.some((d) => d.id === deal_id)
      );
      stage.deals = stage.deals.filter((d) => d.id != deal_id);
    };

    const updateDeal = (data) => {
      console.log("updateDeal in kanban comp", data);
      dealUpdateEvent(data, "Deal updated successfully");
    };
    const handleHighlight = async (deal_id) => {
      for (const stage of displayStages.value) {
        const stageIndex = displayStages.value.findIndex(
          (s) => s.id === stage.id
        );
        const index = stage.deals.findIndex((deal) => deal.id === deal_id);
        if (index !== -1) {
          displayStages.value[stageIndex].deals[index].highlighted =
            !displayStages.value[stageIndex].deals[index].highlighted;
          break;
        }
      }
      const response = await toggleHighlight(deal_id);
      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    };
    // making a request to pull deals from old system
    const handleOldDealRequest = async (stage_id) => {
      try {
        const response = await pullDealsFromOldSystem();
        if (response.status === 200) {
          const deals = response.data.data;
          const stageIndex = displayStages.value.findIndex(
            (s) => s.id === stage_id
          );
          if (stageIndex !== -1) {
            displayStages.value[stageIndex].deals.unshift(...deals);
            displayStages.value[stageIndex].deal_count += deals.length;
          }
        } else {
          toast.error(response.data.message);
        }
        toast.success(response.data.message);
      } catch (error) {
        console.error("Error pulling deals from old system:", error.message);
        toast.error(error.message);
      }
    };

    const getTaskStageId = (due_date) => {
      let stage_id = null;
      const duedate = due_date ? new Date(due_date) : null;
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);

      if (!duedate) {
        console.log("Idle");
        stage_id = props.stages.find((s) => s.name_key === "Idle")?.id;
      } else {
        const duedateStr = duedate.toISOString().slice(0, 10);

        if (duedateStr < todayStr) {
          console.log("Overdue");
          stage_id = props.stages.find((s) => s.name_key === "Overdue")?.id;
        } else if (duedateStr === todayStr) {
          console.log("Due Today");
          stage_id = props.stages.find((s) => s.name_key === "Due Today")?.id;
        } else {
          // Calculate date ranges for tomorrow, this week, next week
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().slice(0, 10);

          const nextWeek = new Date(today);
          // Set nextWeek to the start of next week (Monday)
          const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
          const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7;
          nextWeek.setDate(today.getDate() + daysUntilNextMonday);
          const nextWeekStr = nextWeek.toISOString().slice(0, 10);

          const twoWeeks = new Date(today);
          const daysUntilSecondMonday = daysUntilNextMonday + 7;
          twoWeeks.setDate(today.getDate() + daysUntilSecondMonday);
          const twoWeeksStr = twoWeeks.toISOString().slice(0, 10);

          if (duedateStr === tomorrowStr) {
            console.log("Due Tomorrow");
            stage_id = props.stages.find(
              (s) => s.name_key === "Due This Week"
            )?.id;
          } else if (duedateStr > todayStr && duedateStr < nextWeekStr) {
            console.log("Due This Week");
            stage_id = props.stages.find(
              (s) => s.name_key === "Due This Week"
            )?.id;
          } else if (duedateStr >= nextWeekStr && duedateStr < twoWeeksStr) {
            console.log("Due Next Week");
            stage_id = props.stages.find(
              (s) => s.name_key === "Due Next Week"
            )?.id;
          } else if (duedateStr >= twoWeeksStr) {
            console.log("Due Later");
            stage_id = props.stages.find((s) => s.name_key === "Due Later")?.id;
          } else {
            console.error("No matching stage found for due date");
          }
        }
      }
      return stage_id;
    };

    const handleTaskViewTaskAdd = (data) => {
      const deal_id = selectedDeal.value.id;
      const stageId = getTaskStageId(data.duedate);
      const stage = ref(displayStages.value.find((s) => s.id === stageId));
      if (stage.value) {
        const deal = displayStages.value
          .flatMap((s) => s.deals)
          .find((d) => d.id === deal_id);
        if (selectedDeal.value.tasks.length < 2) {
          for (const stage of displayStages.value) {
            const index = stage.deals.findIndex((deal) => deal.id === deal_id);
            if (index !== -1) {
              stage.deals.splice(index, 1)[0];
            }
          }
        }

        if (deal) {
          stage.value.deals.push(deal);
          stage.value.deal_count = (stage.value.deal_count || 0) + 1;
          toast.success("Task added successfully");
        }
      }
    };

    const handleTaskViewTaskUpdate = (data) => {
      console.log("handleTaskViewTaskUpdate in kanban comp", data);
      const deal_id = selectedDeal.value.id;
      const stageId = getTaskStageId(data.new_duedate);
      console.log("new stage ID for updated task:", stageId);
      const stage = ref(displayStages.value.find((s) => s.id === stageId));
      const oldStageId = getTaskStageId(data.old_duedate);
      const old_stage = ref(
        displayStages.value.find((s) => s.id === oldStageId)
      );
      console.log("old stage ID for updated task:", oldStageId);
      if (stage.value && old_stage.value) {
        const deal = displayStages.value
          .flatMap((s) => s.deals)
          .find((d) => d.id === deal_id);
        if (deal) {
          const index = old_stage.value.deals.findIndex(
            (d) => d.id === deal_id
          );
          if (index !== -1) {
            old_stage.value.deals.splice(index, 1);
            old_stage.value.deal_count -= 1;
            stage.value.deals.unshift(deal);
            stage.value.deal_count += 1;
            toast.success("Task updated successfully");
          }
        }
      }
    };

    const handleTaskViewTaskFinish = (duedate) => {
      const oldStageId = getTaskStageId(duedate);
      const old_stage = ref(
        displayStages.value.find((s) => s.id === oldStageId)
      );
      if (old_stage.value) {
        const index = old_stage.value.deals.findIndex(
          (d) => d.id === selectedDeal.value.id
        );
        old_stage.value.deal_count -= 1;
        old_stage.value.deals.splice(index, 1);
      }
    };

    return {
      handleHighlight,
      handleDealSuggestion,
      t,
      displayStages,
      drag,
      getStageHeaderClass,
      dealsContainer,
      scrollDeals,
      stopScrolling,
      showLeft,
      showRight,
      openDealDataCard,
      openFilterStage,
      isTasksView,
      selectedStage,
      handleStageUpdate,
      logs,
      comments,
      tasks,
      handleDragChange,
      selectedDeal,
      openWhatsappModal,
      getContrastColor,
      handleDealContainerScroll,
      reachedBottom,
      changeDealStage,
      permissionStore,
      PERMISSIONS,
      isIdle,
      hiddenStages,
      expandedStages,
      toggleExpandStage,
      refreshPage,
      startIdleTimer,
      clearIdleTimer,
      setupUserActivityListeners,
      removeUserActivityListeners,
      resetIdleTimer,
      setIdle,
      disconnectWebSocket,
      reconnectWebSocket,
      isFirstChildStage,
      isLastChildStage,
      handleFilterDeals,
      getStageDeals,
      allStages,
      selectedStageId,
      allDealsCount,
      handleRequestDeal,
      updateDeal,
      handleOldDealRequest,
      handleTaskViewTaskAdd,
      handleTaskViewTaskUpdate,
      handleTaskViewTaskFinish,
    };
  },
};
</script>

<style scoped>
.kanban-wrapper {
  width: 100%;
  height: calc(100vh - 115px);
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
.btn-request {
  cursor: pointer;
  transition: all 0.5s;
  pointer-events: auto;
  width: fit-content;
}
</style>
