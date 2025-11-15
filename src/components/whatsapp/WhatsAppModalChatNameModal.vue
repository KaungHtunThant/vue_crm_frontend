<!-- src/components/modals/LabelModal.vue -->
<template>
  <div
    ref="labelModal"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
    id="labelModal"
    aria-labelledby="labelModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="row pt-2 px-3">
          <div class="col-6">
            <h5 class="modal-title text-start">Label Chat</h5>
          </div>
          <div class="col-6 text-end">
            <button
              type="button"
              class="btn-close border-0 bg-transparent"
              @click="hideModal"
            ></button>
          </div>
        </div>
        <div class="modal-body">
          <input
            v-model="localLabelName"
            type="text"
            class="form-control"
            style="outline: none"
            :placeholder="chatName || ''"
          />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary border-0"
            @click="hideModal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-success border-0"
            @click="saveLabel"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";

export default {
  name: "WhatsAppModalChatNameModal",
  props: {
    chatName: {
      type: String,
      default: "",
      required: true,
    },
  },
  data() {
    return {
      localLabelName: "",
      modalInstance: null,
    };
  },
  methods: {
    showModal() {
      this.localLabelName = this.chatName;
      this.modalInstance.show();
    },
    hideModal() {
      this.modalInstance.hide();
    },
    saveLabel() {
      const newName = this.localLabelName.trim();
      if (newName) {
        this.$emit("save-label", newName);
        this.hideModal();
      }
    },
  },
  mounted() {
    this.modalInstance = new Modal(this.$refs.labelModal);
  },
  beforeUnmount() {
    if (this.modalInstance) {
      this.modalInstance.dispose();
    }
  },
};
</script>
