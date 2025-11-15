<template>
  <div
    id="broadcastMessageUpdateModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="broadcastMessageUpdateModalLabel"
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
                v-model="local_item.description"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger text-white"
            @click="closeModal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-success text-white"
            @click="submit"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BroadcastSettingsViewMessageUpdateModal",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      local_item: {
        id: null,
        description: null,
      },
    };
  },
  methods: {
    submit() {
      this.$emit("update", this.local_item.description);
    },
    closeModal() {
      this.$emit("close-modal", "broadcastMessageUpdateModal");
    },
  },
  watch: {
    item: {
      immediate: true,
      handler(newVal) {
        this.local_item = newVal;
      },
    },
  },
};
</script>
