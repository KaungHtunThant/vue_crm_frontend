<template>
  <div
    class="modal fade"
    id="dealDataCard"
    tabindex="-1"
    aria-labelledby="dealDataCardLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div
          class="modal-header py-0 d-flex justify-content-between align-items-center"
        >
          <div class="d-flex align-items-center gap-4">
            <h5 class="modal-title" id="dealDataCardLabel">
              {{ t("kanban-modal-edit-heading") }}
              <button
                type="button"
                @click="toggleEditMode"
                class="border-0 p-0 bg-transparent"
                v-if="!isEditMode"
              >
                <i class="fa-solid fa-pencil"></i>
              </button>
            </h5>
          </div>
          <div class="rating">
            <RatingStars v-model="customerData.rating" />
          </div>
          <div class="source">
            <i class="fa-solid fa-circle-exclamation me-1"></i>
            <span
              >{{ t("kanban-modal-edit-source-heading") }}:
              {{ sourceName }}</span
            >
          </div>
          <div class="d-flex justify-content-end align-items-center gap-2">
            <button class="btn border-none text-primary" @click="startCall">
              <i class="fa-solid fa-phone-volume fs-5"></i>
              {{ t("kanban-modal-edit-call-heading") }}
            </button>
            <button
              class="btn border-none text-primary"
              @click="openWhatsappModal(customerData.id)"
            >
              <i class="fab fa-whatsapp border-none text-primary fs-5"></i>
              {{ t("kanban-modal-edit-whatsapp") }}
            </button>
            <button class="btn border-none text-primary" @click="sendEmail">
              <i class="fas fa-envelope fs-5"></i>
              {{ t("kanban-modal-edit-sendemail") }}
            </button>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div class="modal-body">
          <!-- Stages -->
          <div class="stages-container mb-4" @dblclick="handleDoubleClick">
            <div class="d-flex stages-wrapper">
              <button
                v-for="stage in stages"
                :key="stage.id"
                class="btn stage-btn border-0"
                :class="getStageClasses(stage.id).classes"
                @mouseover="handleStageHover(stage.id)"
                @mouseleave="handleStageLeave"
                @click="changeStage(stage.id)"
                :title="stage.name"
                :style="{
                  backgroundColor: getStageClasses(stage.id).backgroundColor,
                  color: getStageClasses(stage.id).textColor || 'white',
                }"
              >
                {{ truncateText(stage.name) }}
              </button>
            </div>
          </div>

          <!-- Customer Details Form -->
          <div class="row">
            <div class="col-12 col-md-6 border-end">
              <!-- Full Name -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-a"></i>
                    {{ t("kanban-modal-edit-label-fullname")
                    }}<span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-10">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control bg-light text-secondary py-2"
                      v-model="customerData.name"
                      :placeholder="t('kanban-modal-edit-placeholder-fullname')"
                      :readonly="!isEditMode"
                    />
                    <button
                      class="btn btn-primary px-3 fs-5"
                      @click="toggleNickName"
                    >
                      {{ showNickName ? "-" : "+" }}
                    </button>
                  </div>
                </div>
              </div>
              <!-- Nick Name -->
              <div
                class="row mb-3"
                @dblclick="handleDoubleClick"
                v-if="showNickName"
              >
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-a"></i>
                    {{ t("kanban-modal-edit-label-nickname")
                    }}<span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    class="form-control bg-light text-secondary py-2"
                    v-model="customerData.nickName"
                    :placeholder="t('kanban-modal-edit-placeholder-nickname')"
                    :readonly="!isEditMode"
                  />
                </div>
              </div>

              <!-- Phone -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-phone-volume"></i>
                    {{ t("kanban-modal-edit-label-phone")
                    }}<span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-10">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control bg-light text-secondary py-2"
                      v-model="customerData.phone"
                      :placeholder="t('kanban-modal-edit-placeholder-phone')"
                      :readonly="!isEditMode"
                    />
                    <button
                      class="btn btn-primary px-3 fs-5"
                      @click="togglePhone2"
                    >
                      {{ showPhone2 ? "-" : "+" }}
                    </button>
                  </div>
                </div>
              </div>
              <!-- phone2 -->
              <div
                class="row mb-3"
                @dblclick="handleDoubleClick"
                v-if="showPhone2"
              >
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-phone-volume"></i>
                    {{ t("kanban-modal-edit-label-phone")
                    }}<span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    class="form-control bg-light text-secondary py-2"
                    v-model="customerData.phone2"
                    :placeholder="t('kanban-modal-edit-placeholder-phone')"
                    :readonly="!isEditMode"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-envelope"></i>
                    {{ t("kanban-modal-edit-label-email")
                    }}<span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    class="form-control bg-light text-secondary py-2"
                    v-model="customerData.email"
                    :placeholder="t('kanban-modal-edit-placeholder-email')"
                    :readonly="!isEditMode"
                  />
                </div>
              </div>
              <!-- Notes -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-note-sticky"></i>
                    {{ t("kanban-modal-edit-label-notes") }}</label
                  >
                </div>
                <div class="col-10">
                  <textarea
                    class="form-control bg-light"
                    rows="4"
                    v-model="customerData.note"
                    :readonly="!isEditMode"
                  ></textarea>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-2">
                  <label for=""
                    ><i class="fa-solid fa-circle-question"></i>
                    {{ t("kanban-modal-edit-label-questions") }}</label
                  >
                </div>
                <div class="col-10">
                  <button
                    class="btn btn-primary w-100"
                    @click="openQuestionsModal"
                  >
                    {{ t("kanban-modal-edit-button-reports") }}
                  </button>
                </div>
              </div>

              <div
                class="row mb-3"
                @dblclick="handleDoubleClick"
                v-if="permissionStore.hasPermission('add-assigned-to-deal')"
              >
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-users"></i>
                    {{ t("kanban-modal-edit-label-assignedto") }}</label
                  >
                </div>
                <div class="col-10">
                  <select
                    class="form-select bg-light text-secondary py-2"
                    v-model="customerData.representative"
                    :readonly="!isEditMode"
                  >
                    <option value="" disabled>
                      {{ t("kanban-modal-edit-placeholder-representative") }}
                    </option>
                  </select>
                </div>
              </div>
              <!-- Deal Status -->
              <div class="row mb-3">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-cubes"></i>
                    {{ t("dealStatus") }}</label
                  >
                </div>
                <div class="col-10">
                  <span class="fw-bolder" style="font-size: 14px">{{
                    currentStage.name
                  }}</span>
                </div>
              </div>
              <div class="row">
                <div class="col-6 pt-2">
                  <h5
                    v-if="permissionStore.hasPermission(PERMISSIONS.EDIT_STAGE)"
                  >
                    {{ t("kanban-modal-edit-history-heading") }}
                  </h5>
                </div>
                <div
                  class="col-6 d-flex justify-content-end align-items-center gap-2"
                  v-if="isEditMode"
                >
                  <button class="btn btn-primary px-4 py-2" @click="confirm">
                    {{ t("kanban-modal-edit-button-submit") }}
                  </button>
                  <button
                    class="btn btn-secondary px-4 py-2"
                    @click="closeEditMode"
                  >
                    {{ t("kanban-modal-edit-button-cancel") }}
                  </button>
                </div>
              </div>
              <div
                class="history ps-2 mt-2"
                v-if="
                  permissionStore.hasPermission(
                    PERMISSIONS.ADD_ASSIGNED_TO_DEAL
                  )
                "
              >
                <div
                  v-for="log in local_logs"
                  :key="log.id"
                  class="row bg-light pt-2 text-secondary border border-top"
                >
                  <div class="col-3">
                    <p>{{ new Date(log.created_at).toLocaleString() }}</p>
                  </div>
                  <div class="col-9">
                    <p>
                      {{
                        log.description.length > 200
                          ? log.description.substring(0, 200) + "..."
                          : log.description
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- right section Comments And Tasks -->
            <div class="col-12 col-md-6 px-4">
              <!-- Comments Section -->
              <div class="row">
                <div class="col-12 px-0">
                  <div class="input-group">
                    <span
                      class="btn btn-light text-primary me-1"
                      style="background-color: #eee"
                    >
                      {{ t("kanban-modal-edit-comment-heading") }}
                    </span>
                    <input
                      type="text"
                      class="form-control bg-light text-secondary py-2 me-1"
                      v-model="customerData.comment"
                      :placeholder="t('kanban-modal-edit-comment-placeholder')"
                      @keyup.enter="handleAddComment"
                    />
                    <button
                      class="btn btn-primary py-1 px-4"
                      type="submit"
                      @click="handleAddComment"
                    >
                      {{ t("kanban-modal-edit-comment-button-submit") }}
                    </button>
                  </div>
                </div>
                <div class="col-12 mt-2 bg-light showComments py-2 rounded-3">
                  <div
                    v-for="comment in customerData.comments.slice().reverse()"
                    :key="comment.id"
                    class="row mt-2"
                  >
                    <div class="col-3">
                      <img
                        src="@/assets/default-user-image.jpg"
                        alt="Seals Image"
                        width="45"
                        height="45"
                      />
                      <span class="ms-2">{{ comment.username }}</span>
                    </div>
                    <div class="col-9">
                      <div
                        :class="[
                          'rounded-3 p-2',
                          comment.isAdmin
                            ? 'adminComment'
                            : 'bg-primary text-white',
                        ]"
                        style="width: fit-content"
                      >
                        <span>{{ comment.text_body }}</span
                        ><br />
                        <span>{{ formatDate(comment.created_at) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- task Section -->
              <div class="row mt-4">
                <div class="col-12 p-0">
                  <div class="input-group">
                    <span
                      class="btn btn-light text-primary me-1 px-4"
                      style="background-color: #eee"
                    >
                      {{ t("kanban-modal-edit-tasks-heading") }}
                    </span>
                    <input
                      type="text"
                      class="form-control bg-light text-secondary py-2 me-1"
                      v-model="customerData.task"
                      :placeholder="t('kanban-modal-edit-tasks-placeholder')"
                      @keyup.enter="handleAddTask"
                    />
                    <input
                      type="date"
                      class="form-control bg-light text-secondary py-2 me-1"
                      v-model="customerData.date"
                      :placeholder="t('modals.selectDate')"
                      @keyup.enter="handleAddTask"
                    />
                    <button
                      class="btn btn-primary py-1 px-4"
                      type="submit"
                      @click="handleAddTask"
                    >
                      {{ t("kanban-modal-edit-tasks-button-add") }}
                    </button>
                  </div>
                </div>
                <div class="col-12 mt-2 bg-light p-3 showTasks rounded-3">
                  <div
                    class="row bg-light-subtle border-top border-bottom py-1"
                  >
                    <div class="col-5">
                      {{ t("kanban-modal-edit-tasks-table-description") }}
                    </div>
                    <div class="col-5">
                      {{ t("kanban-modal-edit-tasks-table-due-date") }}
                    </div>
                    <div class="col-2">
                      {{ t("kanban-modal-edit-tasks-table-status") }}
                    </div>
                  </div>
                  <!-- data Tasks -->
                  <div
                    v-for="task in activeTasks"
                    :key="task.id"
                    class="row text-secondary mt-2 align-items-center border-light-subtle pb-2 border-bottom"
                    :class="{ 'delete-animation': task.toDelete }"
                  >
                    <div class="col-5">
                      {{ task.description }}
                    </div>
                    <div class="col-5">
                      <input
                        type="date"
                        class="form-control bg-secondary-subtle text-secondary py-2 me-1"
                        v-model="task.duedate"
                        :placeholder="t('modals.selectDate')"
                      />
                    </div>
                    <div class="col-2">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        v-model="task.status"
                        @change="() => handleTaskCompletion(task.id)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          class="btn trashCustm position-fixed bg-danger py-2 px-3 rounded-3"
          @click="openTrashDealModal"
        >
          <i class="fa-solid fa-trash text-white"></i>
        </button>
      </div>
    </div>
  </div>
  <ViewReport ref="questionsModalRef" />
  <TrashDeal
    ref="trashDealModalRef"
    :dealId="deal?.id"
    @stage-updated="handleStageUpdate"
  />
</template>

<script>
import { ref, reactive, computed, onMounted, nextTick, watch } from "vue";
import RatingStars from "@/components/CreateDealElements/RatingStars.vue";
import ViewReport from "@/components/kanban/ViewReport.vue";
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import TrashDeal from "@/components/modals/TrashDeal.vue";
import {
  fetchConversationByDealId,
  getSources,
  getStages,
  createComment,
  createTask,
  updateTask,
  updateDealStage,
  updateDeal,
  createConversation,
  getLogsByDealId,
} from "@/plugins/services/authService";
import { PERMISSIONS, usePermissionStore } from "@/stores/permissionStore";
export default {
  name: "DealDataCard",
  components: { RatingStars, ViewReport, TrashDeal },
  props: {
    deal: {
      type: Object,
      required: true,
    },
    comments: {
      type: Array,
      required: true,
    },
    tasks: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const permissionStore = usePermissionStore();
    const selected_conversation = ref(null);
    const { t } = useI18n();
    const toast = useToast();
    const sources = ref([]);
    const stages = ref([]);
    const currentStageId = ref(props.deal?.stage_id || "");
    const isEditMode = ref(false);
    const hoveredStage = ref(null);
    const stageColors = reactive({});
    const local_logs = ref([]);
    const customerData = reactive({
      id: props.deal?.id,
      name: props.deal?.contact.name || "Custome Name",
      nickname: props.deal?.contact.nickname || "Custome Name",
      phone: props.deal?.contact.phones[0].phone || "+964770028133",
      phone2: props.deal?.contact.phones[1]?.phone || "",
      email: props.deal?.contact.email || "",
      note: props.deal?.note || "",
      rating: props.deal?.rating || 0,
      source_id: props.deal?.source_id || "",
      stage_id: props.deal?.stage_id || "",
      tasks: props.deal?.tasks || [],
      comments:
        props.deal?.comments.map((comment) => ({
          id: comment.id,
          text_body: comment.text_body || "No text",
          created_at: comment.created_at || "No date",
          username: comment.user.name || "No user",
          isAdmin:
            comment.user && comment.user.role === "super-admin" ? true : false,
        })) || [],
    });
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    };
    const formatDate = (dateString) => {
      return dateString ? dateString.split("T")[0] : "No date";
    };
    const fetchSources = async () => {
      try {
        const response = await getSources();
        sources.value = response.data.data;
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };
    const sourceName = computed(() => {
      const source = sources.value.find((s) => s.id === props.deal?.source_id);
      return source ? source.name : "null";
    });
    const fetchStages = async () => {
      try {
        const response = await getStages();
        stages.value = response.data.data;
      } catch (error) {
        console.error("Error fetching stages:", error);
      }
    };
    const currentStage = computed(() => {
      return (
        stages.value.find((s) => s.id === currentStageId.value) || {
          id: "",
          name: "",
          color_code: "#333",
        }
      );
    });
    const stageColor = computed(() => {
      return currentStage.value.color_code;
    });
    const newComment = ref("");
    const newTask = ref("");
    const taskDate = ref("");
    const rating = ref(0);
    const showNickName = ref(false);
    const toggleNickName = () => {
      showNickName.value = !showNickName.value;
    };
    const showPhone2 = ref(false);
    const togglePhone2 = () => {
      showPhone2.value = !showPhone2.value;
    };
    const openTrashDealModal = () => {
      if (!props.deal?.id) {
        toast.error(t("error.dealNotFound"), {
          timeout: 3000,
        });
        return;
      }
      try {
        const openModals = document.querySelectorAll(".modal.show");
        openModals.forEach((modal) => {
          const modalInstance = Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
        });
        const trashDealModal = new Modal(
          document.getElementById("trashDealModal")
        );
        trashDealModal.show();
        const modalBackdrop = document.createElement("div");
        modalBackdrop.className = "modal-backdrop fade show";
        document.body.appendChild(modalBackdrop);
      } catch (error) {
        console.error("Error opening trash modal:", error);
        toast.error(t("error.openTrashModal"), {
          timeout: 3000,
        });
      }
    };
    const handleStageHover = (stageId) => {
      hoveredStage.value = stageId;
    };

    const handleStageLeave = () => {
      hoveredStage.value = null;
    };

    const changeStage = async (stageId) => {
      try {
        currentStageId.value = stageId;
        const stageIndex = stages.value.findIndex((s) => s.id === stageId);
        const stageName = stages.value[stageIndex].name;

        stages.value.forEach((stage, index) => {
          if (index <= stageIndex) {
            stageColors[stage.id] = stages.value[stageIndex].color_code;
          } else {
            stageColors[stage.id] = "";
          }
        });

        const response = await updateDealStage(props.deal.id, stageId);
        if (response.data) {
          emit("stage-change", props.deal.id, stageId, props.deal.stage_id, 0);
          toast.success(`${t("success.stageChanged")} ${stageName}`, {
            timeout: 3000,
          });
        } else {
          toast.error(t("error.changingStage"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error changing stage:", error);
        toast.error(t("error.changingStage"), {
          timeout: 3000,
        });
      }
    };

    const getStageClasses = (stageId) => {
      const stageIndex = stages.value.findIndex((s) => s.id === stageId);
      const hoveredIndex = hoveredStage.value
        ? stages.value.findIndex((s) => s.id === hoveredStage.value)
        : -1;
      const currentIndex = stages.value.findIndex(
        (s) => s.id === currentStageId.value
      );

      const classes = { "": true };
      let backgroundColor = "";

      if (hoveredStage.value) {
        if (stageIndex <= hoveredIndex) {
          backgroundColor = stages.value[hoveredIndex].color_code;
        } else {
          classes["btn-secondary"] = true;
        }
      } else {
        if (stageIndex <= currentIndex) {
          backgroundColor = stages.value[currentIndex].color_code;
        } else {
          classes["btn-secondary"] = true;
        }
      }
      const textColor = getContrastColor(backgroundColor);
      return { classes, backgroundColor, textColor };
    };
    const getContrastColor = (hexColor) => {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 170 ? "#000000" : "#FFFFFF";
    };
    const startCall = () => {
      toast.info(t("success.startCall"), {
        timeout: 3000,
      });
    };

    const startWhatsapp = () => {
      const modal = new Modal(document.getElementById("whatsappModal"));
      modal.show();
    };

    const sendEmail = () => {
      toast.info(t("success.sendEmail"), {
        timeout: 3000,
      });
    };
    const confirm = async () => {
      try {
        const phones = [customerData.phone];
        if (customerData.phone2) {
          phones.push(customerData.phone2);
        }

        const formData = {
          name: customerData.name,
          nickname: customerData.nickname || "",
          phones: phones,
          email: customerData.email || "",
          note: customerData.note || "",
          rating: customerData.rating || 0,
          // source_id: customerData.source_id,
          // stage_id: customerData.stage_id,
          // tasks: customerData.tasks,
          // comments: customerData.comments,
        };

        const response = await updateDeal(props.deal.id, formData);
        if (response.data) {
          toast.success(t("success.saveChanges"), {
            timeout: 3000,
          });
          isEditMode.value = false;
        } else {
          toast.error(t("error.saveChanges"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error saving changes:", error);
        toast.error(t("error.saveChanges"), {
          timeout: 3000,
        });
      }
    };
    const closeEditMode = () => {
      isEditMode.value = false;
    };
    const updateRating = (newRating) => {
      try {
        rating.value = newRating;
        toast.success(t("success.updateRating"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error updating rating:", error);
        toast.error(t("error.updateRating"), {
          timeout: 3000,
        });
      }
    };

    const truncateText = (text) => {
      if (text.length > 20) {
        return text.substring(0, 20) + "...";
      }
      return text;
    };

    const packages = ref([]);

    const addNewPackage = () => {
      try {
        packages.value.push({
          serviceSelect: "",
          serviceInput: "",
        });
        toast.success(t("success.addPackage"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error adding package:", error);
        toast.error(t("error.addPackage"), {
          timeout: 3000,
        });
      }
    };

    const removePackage = (index) => {
      try {
        packages.value.splice(index, 1);
        toast.success(t("success.removePackage"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error removing package:", error);
        toast.error(t("error.removePackage"), {
          timeout: 3000,
        });
      }
    };

    const handleTaskCompletion = async (taskId) => {
      try {
        const task = customerData.tasks.find((t) => t.id === taskId);
        const formData = {
          status: "completed",
          duedate: task.duedate,
        };
        const response = await updateTask(task.id, formData);
        if (response.data) {
          task.status = "completed";
          toast.success(t("success.taskCompleted"), {
            timeout: 3000,
          });
        } else {
          toast.error(t("error.completingTask"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error completing task:", error);
        toast.error(t("error.completingTask"), {
          timeout: 3000,
        });
      }
    };
    const openQuestionsModal = () => {
      try {
        const modal = new Modal(document.getElementById("questionsModal"));
        modal.show();
        toast.info(t("success.openQuestionsModal"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error opening questions modal:", error);
        toast.error(t("error.openQuestionsModal"), {
          timeout: 3000,
        });
      }
    };

    const toggleEditMode = () => {
      isEditMode.value = !isEditMode.value;
      if (isEditMode.value) {
        // toast.info(t("success.editMode"), {
        //   timeout: 3000,
        // });
      }
    };

    const handleDoubleClick = () => {
      isEditMode.value = true;
    };
    const openWhatsappModal = async (id) => {
      console.log("deal data modal emit start");
      try {
        let conversation = await fetchConversationByDealId(id);
        if (!conversation.data?.data) {
          conversation = await createConversation(id);
        }
        console.log("conversation", conversation);

        selected_conversation.value = conversation.data.data;
        console.log("selected_conversation.value", selected_conversation.value);
        await nextTick();

        const modalElement = document.getElementById("whatsappModal");
        if (modalElement) {
          const modal = new Modal(modalElement);
          modal.show();
        } else {
          console.warn("Modal element not found in DOM.");
        }
        // emit("open-whatsapp-modal", selected_conversation.value);
        emit(
          "open-whatsapp-modal",
          {
            ...selected_conversation.value,
            img:
              selected_conversation.value.img ||
              require("@/assets/whatsappImage/default-userImage.jpg"),
            phone:
              selected_conversation.value.phone?.phone ||
              selected_conversation.value.phone,
          },
          id
        );
      } catch (error) {
        console.error("Error opening WhatsApp modal:", error);
        toast.error(t("error.openWhatsappModal"), {
          timeout: 3000,
        });
      }
    };
    const handleAddComment = async () => {
      try {
        const formData = {
          text_body: customerData.comment,
          deal_id: props.deal?.id,
        };
        console.log(formData);
        const response = await createComment(formData);
        if (response.data) {
          customerData.comments.push({
            id: response.data.id,
            text_body: customerData.comment,
            created_at: new Date().toISOString(),
            username: response.data.data.user?.name || "No user",
            isAdmin: response.data.data.user?.role === "super-admin",
          });

          toast.success(t("success.commentAdded"));
          customerData.comment = "";
        } else {
          toast.error(t("error.addingComment"));
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        toast.error(t("error.addingComment"));
      }
    };
    const handleAddTask = async () => {
      try {
        const formData = {
          description: customerData.task,
          duedate: customerData.date,
          deal_id: props.deal?.id,
        };
        console.log(formData);
        const response = await createTask(formData);
        if (response.data) {
          customerData.tasks.unshift({
            id: response.data.id,
            description: customerData.task,
            duedate: customerData.date,
            status: "active",
          });
          toast.success(t("success.taskAdded"));
          customerData.task = "";
          customerData.date = "";
        } else {
          toast.error(t("error.addingTask"));
        }
      } catch (error) {
        console.error("Error adding task:", error);
        toast.error(t("error.addingTask"));
      }
    };
    const activeTasks = computed(() => {
      return customerData.tasks.filter((task) => task.status === "active");
    });
    const handleStageUpdate = (data) => {
      if (!props.deal?.id) {
        toast.error(t("error.dealNotFound"), {
          timeout: 3000,
        });
        return;
      }
      emit("stage-change", data.dealId, data.newStage, props.deal.stage_id, 0);
    };
    const fetchLogs = async () => {
      try {
        const response = await getLogsByDealId(props.deal?.id);
        if (response.data) {
          local_logs.value = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
    watch(
      () => props.deal,
      (newDeal) => {
        if (newDeal) {
          fetchLogs(newDeal.id);
        }
      },
      { immediate: true }
    );
    onMounted(() => {
      fetchSources();
      fetchStages();
    });
    return {
      stages,
      currentStage,
      customerData,
      newComment,
      newTask,
      taskDate,
      selected_conversation,
      changeStage,
      startCall,
      startWhatsapp,
      sendEmail,
      confirm,
      rating,
      updateRating,
      truncateText,
      toggleNickName,
      showNickName,
      togglePhone2,
      showPhone2,
      packages,
      addNewPackage,
      removePackage,
      handleTaskCompletion,
      handleStageHover,
      handleStageLeave,
      getStageClasses,
      openQuestionsModal,
      toggleEditMode,
      handleDoubleClick,
      isEditMode,
      openWhatsappModal,
      t,
      sourceName,
      stageColor,
      handleAddComment,
      handleAddTask,
      activeTasks,
      formatDate,
      closeEditMode,
      formatDateForInput,
      openTrashDealModal,
      handleStageUpdate,
      permissionStore,
      PERMISSIONS,
      getContrastColor,
      local_logs,
      fetchLogs,
    };
  },
};
</script>

<style scoped>
input {
  border: none;
  font-size: 16px;
}
input:focus {
  border: none !important;
  box-shadow: none;
}
select {
  border: none;
  font-size: 16px;
}
select:focus {
  border: none;
  box-shadow: none;
}
textarea {
  border: none;
  font-size: 16px;
}
textarea:focus {
  border: none;
  box-shadow: none;
}
.stages-container {
  padding: 0.5rem;
}

.stages-wrapper {
  display: flex;
  gap: 2px;
  align-items: center;
  height: 35px;
}

.stage-btn {
  font-size: 0.8rem;
  padding: 0.5rem 0.8rem;
  white-space: nowrap;
  transition: all 0.3s ease;
  position: relative;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  z-index: 1;
  text-align: start;
  clip-path: polygon(
    0 0,
    calc(100% - 15px) 0,
    100% 50%,
    calc(100% - 15px) 100%,
    0 100%
  );
}

.stage-btn:hover {
  width: 350px;
  min-width: 120px;
  z-index: 2;
}

.stage-btn.selected {
  font-weight: bold;
}

.stages-container::-webkit-scrollbar {
  height: 4px;
}

.stages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.stages-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.stages-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.history {
  height: 220px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
  scrollbar-width: thin;
  scrollbar-color: #888 transparent;
}

.history::-webkit-scrollbar {
  width: 4px;
}

.history::-webkit-scrollbar-track {
  background: transparent;
}

.history::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.history::-webkit-scrollbar-button {
  display: none;
}
.showComments {
  height: 302px;
  max-height: 302px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
}
.showTasks {
  height: 302px;
  max-height: 302px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
}
label {
  font-size: 13px;
  font-weight: 500;
}

.modal-dialog {
  scrollbar-width: thin;
  scrollbar-color: #888 transparent;
}

.modal-dialog::-webkit-scrollbar,
.modal-body::-webkit-scrollbar,
.modal-content::-webkit-scrollbar {
  width: 4px;
}

.modal-dialog::-webkit-scrollbar-track,
.modal-body::-webkit-scrollbar-track,
.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-dialog::-webkit-scrollbar-thumb,
.modal-body::-webkit-scrollbar-thumb,
.modal-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.modal-dialog::-webkit-scrollbar-button,
.modal-body::-webkit-scrollbar-button,
.modal-content::-webkit-scrollbar-button {
  display: none;
}

.showComments,
.showTasks {
  scrollbar-width: thin;
  scrollbar-color: #888 transparent;
}

.showComments::-webkit-scrollbar,
.showTasks::-webkit-scrollbar {
  width: 4px;
}

.showComments::-webkit-scrollbar-track,
.showTasks::-webkit-scrollbar-track {
  background: transparent;
}

.showComments::-webkit-scrollbar-thumb,
.showTasks::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.showComments::-webkit-scrollbar-button,
.showTasks::-webkit-scrollbar-button {
  display: none;
}

.custom-checkbox {
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: #0d6efd;
}

.custom-checkbox:checked {
  animation: fadeOut 0.5s forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.delete-animation {
  background-color: red;
  transition: background-color 0.5s ease;
}

@keyframes fadeOut {
  from {
    opacity: 1;
    background-color: #ff000040;
  }
  to {
    opacity: 0;
    background-color: #ff000040;
  }
}
.trashCustm {
  right: 2%;
  bottom: 3%;
  z-index: 9999;
}
.adminComment {
  background: linear-gradient(45deg, #e5c086, #f1d65e, #e5c086, #f1d65e);
  color: #000;
  width: fit-content;
  background-size: 400% 400%;
  animation: adminComment 4s ease infinite;
}
@keyframes adminComment {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.text-gold {
  color: #ffd700;
}

.text-lightgray {
  color: #d3d3d3;
}
</style>
