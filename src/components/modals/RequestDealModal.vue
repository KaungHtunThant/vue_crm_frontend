<template>
  <div
    class="modal fade"
    id="requestDealModal"
    tabindex="-1"
    aria-labelledby="requestDealModalLabel"
    aria-hidden="true"
    v-on:="{'hidden.bs.modal': resetModal}"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content pt-3">
        <div class="modal-body text-center">
          <div>
            <i
              class="fa-solid fa-triangle-exclamation pb-4"
              style="font-size: 60px"
            ></i>
            <h3>{{ $t("kanban-modal-request-heading") }}</h3>
            <span class="fs-5">{{ $t(search_type_value) }}</span>
          </div>
        </div>
        <div class="modal-footer border-top-0 mt-5">
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeRequestDealModal"
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
import { createApproval } from "@/plugins/services/approvalService";
import { Modal } from "bootstrap";
import { computed } from "vue";
// import { useToast } from "vue-toastification";
// import { showSuccess, showError } from "@/plugins/services/toastService";
import { useNotificationStore } from "@/stores/notificationStore";

export default {
  name: "RequestDealModal",
  props: {
    search_val: {
      type: String,
      required: false,
    },
    search_type: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const search_type_value = computed(() => {
      switch (props.search_type) {
        case "new_deal":
          return "kanban-modal-request-sub-heading-new-deal";
        case "reassign":
          return "kanban-modal-request-sub-heading-reassign";
        case "idle_assign":
          return "kanban-modal-request-sub-heading-idle-assign";
        default:
          return "kanban-modal-request-sub-heading-default";
      }
    });
    // const toast = useToast();
    const getContrastColor = (color) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 125 ? "#000000" : "#FFFFFF";
    };
    const notificationStore = useNotificationStore();
    return { getContrastColor, search_type_value, notificationStore };
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
    async handleRequestDeal() {
      try {
        const response = await createApproval(this.search_val);
        if (response.status === 200 || response.status === 201) {
          this.notificationStore.success(response.data.message);
        } else {
          this.notificationStore.error(response.data.message);
        }
        this.closeRequestDealModal();
      } catch (error) {
        this.notificationStore.error(error.message);
      }
    },
  },
};
</script>
