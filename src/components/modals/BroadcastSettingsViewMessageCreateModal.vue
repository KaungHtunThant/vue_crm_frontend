<template>
  <div
    id="broadcastMessageCreateModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="broadcastMessageCreateModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="broadcastMessageCreateModalLabel"></h5>
          Create Broadcast Message
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="messageContent" class="form-label">Message</label>
              <textarea
                class="form-control"
                id="messageContent"
                rows="3"
                placeholder="Enter message"
                v-model="description"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="submit">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BroadcastSettingsViewMessageCreateModal",
  data() {
    return {
      description: "",
    };
  },
  methods: {
    submit() {
      this.$emit("submit", this.description);
    },
    closeModal() {
      console.log("close modal");
      this.$emit("close-modal");
    },
  },
};
</script>
