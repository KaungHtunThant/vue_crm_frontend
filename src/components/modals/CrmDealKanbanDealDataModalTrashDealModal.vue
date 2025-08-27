<template>
  <div
    class="modal fade"
    id="trashDealModal"
    tabindex="-1"
    aria-labelledby="trashDealModalLabel"
    aria-hidden="true"
    style="z-index: 10000"
    v-on:="{'hidden.bs.modal': resetModal}"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content pt-3">
        <div class="modal-body text-center text-dark">
          <div class="modal1" v-if="!showModal2">
            <i
              class="fa-solid fa-triangle-exclamation pb-4 text-danger"
              style="font-size: 60px"
            ></i>
            <h4>{{ $t("kanban-trash-heading") }}</h4>
            <span style="font-size: 14px">{{
              $t("kanban-trash-sub-heading")
            }}</span>
          </div>
          <div class="modal2" v-else>
            <i
              class="fa-solid fa-triangle-exclamation pb-4 text-danger"
              style="font-size: 60px"
            ></i>
            <h4>
              {{ $t("kanban-trash-modal2-heading") }}
            </h4>
            <textarea
              class="form-control"
              :placeholder="$t('kanban-trash-comments-placeholder')"
              rows="4"
              v-model="comment"
            ></textarea>
            <h4 class="mt-5">
              {{ $t("kanban-trash-modal2-choosebutton-heading") }}
            </h4>
            <div class="">
              <button
                v-for="tag in trash_stages"
                :key="tag.id"
                class="btn btn-danger rounded-0 mt-2"
                @click="selected_stage_id = tag.id"
                :style="{
                  backgroundColor:
                    selected_stage_id === tag.id ? tag.color_code : 'white',
                  color:
                    selected_stage_id === tag.id
                      ? getContrastColor(tag.color_code)
                      : 'black',
                }"
              >
                <i
                  :class="`fa-solid fa-${tag.icon}`"
                  :style="{
                    color:
                      selected_stage_id === tag.id
                        ? getContrastColor(tag.color_code)
                        : 'black',
                  }"
                ></i>
                {{ tag.name }}
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer border-top-0 mt-5">
          <button
            type="button"
            class="btn bg-danger text-white py-2 px-4"
            style="font-size: 14px"
            @click="closeTrashDealModal"
          >
            {{ $t("kanban-trash-cancel-button") }}
          </button>
          <button
            v-if="!showModal2"
            type="button"
            class="btn bg-success text-white py-2 px-4"
            style="font-size: 14px"
            @click="showModal2 = true"
          >
            {{ $t("kanban-trash-next-button") }}
          </button>
          <button
            v-else
            type="button"
            class="btn bg-success text-white py-2 px-4"
            style="font-size: 14px"
            @click="handleTrashDeal"
            :disabled="!selected_stage_id || !comment"
          >
            {{ $t("kanban-trash-confin-button") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { createComment, getTrashStages } from "@/plugins/services/authService";

export default {
  name: "CrmDealKanbanDealDataModalTrashDealModal",
  props: {
    dealId: {
      type: [String, Number],
      required: true,
    },
  },
  setup() {
    const toast = useToast();
    const getContrastColor = (color) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 125 ? "#000000" : "#FFFFFF";
    };
    return { toast, getContrastColor };
  },
  data() {
    return {
      showModal2: false,
      comment: "",
      selected_stage_id: null,
      trash_stages: [],
    };
  },
  mounted() {
    this.getStages();
    const modal = document.getElementById("trashDealModal");
    modal.addEventListener("hidden.bs.modal", () => {
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
      this.resetModal();
    });
  },
  methods: {
    resetModal() {
      this.showModal2 = false;
      this.comment = "";
      this.selected_stage_id = null;
    },
    closeTrashDealModal() {
      const trashDealModal = Modal.getInstance(
        document.getElementById("trashDealModal")
      );
      if (trashDealModal) {
        trashDealModal.hide();
      }
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
      this.resetModal();
    },
    async handleTrashDeal() {
      try {
        if (!this.selected_stage_id || !this.comment) {
          this.toast.error(this.t("error.requiredFields"), {
            timeout: 3000,
          });
          return;
        }
        const selected_stage_id = this.selected_stage_id;

        const commentResponse = await createComment({
          text_body: this.comment,
          deal_id: this.dealId,
        });
        if (commentResponse.data) {
          this.$emit("deal-trashed", this.dealId, selected_stage_id, true);
        } else {
          this.toast.error(commentResponse.data.message, {
            timeout: 3000,
          });
        }
        this.closeTrashDealModal();
      } catch (error) {
        console.error("Error updating deal:", error);
        this.toast.error(error.message, {
          timeout: 3000,
        });
      }
    },

    async getStages() {
      try {
        const response = await getTrashStages();
        if (response.status === 200) {
          this.trash_stages = response.data?.data;
          if (this.trash_stages.length < 1) {
            this.toast.info(response.data.message, {
              timeout: 3000,
            });
          }
        } else {
          this.toast.error(response.data.message, {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error fetching trash stages:", error);
        this.toast.error(error.message, {
          timeout: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.modal2 button {
  color: red;
  font-size: 14px;
  padding: 10px 20px;
}
.modal2 button:hover {
  background-color: #eee !important;
}
.modal2 button.active {
  background-color: #ddd !important;
  font-weight: bold;
}
textarea {
  width: 100% !important;
}
@media (min-width: 800px) {
  .modal-dialog {
    width: 85% !important;
    max-width: 85% !important;
  }
}
</style>
