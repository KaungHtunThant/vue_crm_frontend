<template>
  <div
    class="modal fade"
    id="requestDealModal"
    tabindex="-1"
    aria-labelledby="requestDealModalLabel"
    aria-hidden="true"
    v-on:="{'hidden.bs.modal': resetModal}"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content pt-3">
        <div class="modal-body text-center">
          <div>
            <i
              class="fa-solid fa-triangle-exclamation pb-4"
              style="font-size: 60px"
            ></i>
            <h4>{{ $t("kanban-modal-request-heading") }}</h4>
            <span style="font-size: 14px">{{
              $t("kanban-modal-request-sub-heading-new-deal")
            }}</span>
          </div>
        </div>
        <div class="modal-footer border-top-0 mt-5">
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeTrashDealModal"
          >
            {{ $t("kanban-modal-request-cancel-button") }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="handleRequestDeal"
          >
            {{ $t("kanban-modal-request-confirm-button") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";

export default {
  name: "RequestDealModal",
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
    const modal = document.getElementById("requestDealModal");
    modal.addEventListener("hidden.bs.modal", () => {
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
      this.resetModal();
    });
  },
  methods: {
    closeRequestDealModal() {
      const requestDealModal = Modal.getInstance(
        document.getElementById("requestDealModal")
      );
      if (requestDealModal) {
        requestDealModal.hide();
      }
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
    },
  },
};
</script>
