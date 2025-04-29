<template>
  <div
    class="modal fade"
    id="trashDealModal"
    tabindex="-1"
    aria-labelledby="trashDealModalLabel"
    aria-hidden="true"
    v-on:="{'hidden.bs.modal': resetModal}"
    ref="trashDealModalRef"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content pt-3" style="background-color: red">
        <div class="modal-body text-center text-white">
          <div class="modal1" v-if="!showModal2">
            <i
              class="fa-solid fa-triangle-exclamation pb-4"
              style="font-size: 60px"
            ></i>
            <h4>Are you sure you want to give up on this deal?</h4>
            <span style="font-size: 14px"
              >Warning! You will not be able to recover it later by your
              own</span
            >
          </div>
          <div class="modal2" v-else>
            <i
              class="fa-solid fa-triangle-exclamation pb-4"
              style="font-size: 60px"
            ></i>
            <h4>
              Please provide an explanation for why you are discarding this
              ticket
            </h4>
            <textarea
              class="form-control"
              placeholder="Write a comment"
              rows="4"
              v-model="commentText"
              :class="{ 'is-invalid': commentError }"
              required
            ></textarea>
            <div
              v-if="commentError"
              class="invalid-feedback d-block text-start"
            >
              Please provide a comment before discarding the ticket.
            </div>
            <h4 class="mt-5">
              Please choose one of the stages below to discard the deal.
            </h4>
            <div class="btn-group mt-2">
              <button class="btn bg-white" @click="discardTicket(12)">
                Medicines
              </button>
              <button class="btn bg-white" @click="discardTicket(14)">
                No Response
              </button>
              <button class="btn bg-white" @click="discardTicket(16)">
                Trash
              </button>
              <button class="btn bg-white" @click="discardTicket(13)">
                Stopped Responding
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer border-top-0 mt-5">
          <button
            type="button"
            class="btn bg-white py-2 px-4"
            style="color: red; font-size: 14px"
            @click="closeTrashDealModal"
          >
            Cancel
          </button>
          <button
            v-if="!showModal2"
            type="button"
            class="btn bg-white py-2 px-4"
            style="color: red; font-size: 14px"
            @click="showModal2 = true"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { createComment, updateDealStage } from "@/plugins/services/authService";

export default {
  name: "TrashDeal",
  props: {
    deal: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showModal2: false,
      commentText: "",
      commentError: false,
      isSubmitting: false,
      toast: null,
    };
  },
  created() {
    this.toast = useToast();
  },
  computed: {
    user() {
      return this.$store?.state?.user || { id: null };
    },
  },
  emits: ["stage-change"],
  methods: {
    resetModal() {
      this.showModal2 = false;
      this.commentText = "";
      this.commentError = false;
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
    },
    discardTicket(stageId) {
      if (!this.commentText.trim()) {
        this.commentError = true;
        return;
      }

      this.commentError = false;
      this.isSubmitting = true;

      if (!this.deal || !this.deal.id) {
        console.error("Deal ID is undefined");
        this.toast.error("Error: Deal information is missing");
        this.isSubmitting = false;
        return;
      }

      this.addCommentAndChangeStage(stageId);
    },

    async addCommentAndChangeStage(stageId) {
      try {
        const formData = {
          text_body: this.commentText.trim(),
          deal_id: this.deal.id,
        };
        console.log(formData);
        const response = await createComment(formData);
        if (response) {
          await this.changeStage(stageId);
          console.log("success.commentAdded");
        } else {
          console.log("error.addingComment");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        console.log("error.addingComment");
      }
    },

    async changeStage(stageId) {
      try {
        if (!this.deal || !this.deal.id) {
          console.error("Deal ID is undefined");
          this.toast.error("Error: Deal information is missing");
          return false;
        }

        const response = await updateDealStage(this.deal.id, stageId);

        if (response.data) {
          const stageIndex =
            this.$store?.state?.stages?.findIndex((s) => s.id === stageId) || 0;
          this.$emit(
            "stage-change",
            this.deal.id,
            stageIndex,
            this.deal.stage_id
          );
          return true;
        } else {
          this.toast.error("Error changing stage");
          return false;
        }
      } catch (error) {
        console.error("Error changing stage:", error);
        this.toast.error("Error changing stage");
        return false;
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
textarea {
  width: 100% !important;
}
.invalid-feedback {
  color: yellow !important;
}
</style>
