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
import { useBroadcastStore } from "@/stores/BroadcastStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { computed, watch, ref } from "vue";
export default {
  name: "BroadcastSettingsViewMessageCreateModal",
  setup(props, { emit }) {
    const description = ref(null);
    const notificationStore = useNotificationStore();
    const broadcastStore = useBroadcastStore();
    const current_broadcast = computed(
      () => broadcastStore.getCurrentBroadcast
    );
    const closeModal = () => {
      emit("close-modal");
    };
    const submit = () => {
      if (current_broadcast.value) {
        broadcastStore.editBroadcast({
          ...current_broadcast.value,
          description: description.value,
        });
      } else {
        broadcastStore.addBroadcast({
          description: description.value,
        });
      }
      emit("refresh");
      notificationStore.success("Broadcast message saved successfully");
      closeModal();
    };
    watch(
      () => current_broadcast.value,
      (newVal) => {
        if (newVal) {
          description.value = newVal.description;
        } else {
          description.value = null;
        }
      },
      { immediate: true }
    );
    return { description, current_broadcast, submit, closeModal };
  },
};
</script>
