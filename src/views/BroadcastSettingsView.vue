<template>
  <div class="mt-4 pe-3 bg-white rounded-3 p-3 me-2">
    <button class="btn btn-primary mb-3" @click="OpenCreateModal">Add</button>
    <EasyDataTable
      :headers="headers"
      :items="items"
      :rows-per-page="10"
      table-class-name="custom-table"
    >
      <!-- Id Column -->
      <template #item-id="item">
        <div class="text-muted fs-6">{{ item.id }}</div>
      </template>
      <!-- Role Name Column -->
      <template #item-description="item">
        <div class="fs-6">
          {{
            item.description.length > 50
              ? item.description.substring(0, 40) + "..."
              : item.description
          }}
        </div>
      </template>

      <!--  Create At Column -->
      <template #item-created_at="item">
        <div class="">
          <div class="fs-6">
            {{ new Date(item.created_at).toLocaleDateString() }}
          </div>
        </div>
      </template>

      <!-- Important -->
      <template #item-important="item">
        <div class="d-flex gap-2 my-1 form-check form-switch">
          <input
            class="form-check-input shadow-none custom-switch"
            type="checkbox"
            :checked="item.important"
            @change="updateImportant(item.id)"
          />
        </div>
      </template>

      <!-- Status -->
      <template #item-status="item">
        <div class="d-flex gap-2 my-1 form-check form-switch">
          <input
            class="form-check-input shadow-none custom-switch"
            type="checkbox"
            :checked="item.status"
            @change="changeStatus(item.id)"
          />
        </div>
      </template>

      <!-- Positions Column -->
      <template #item-positions="item">
        <div class="d-flex gap-2 my-1">
          <button
            :class="`btn btn-sm btn-${item.is_first ? 'secondary' : 'success'}`"
            @click="updatePosition(item.id, -1)"
            :disabled="item.is_first"
          >
            <i class="fas fa-arrow-up"></i>
          </button>
          <button
            :class="`btn btn-sm btn-${item.is_last ? 'secondary' : 'warning'}`"
            @click="updatePosition(item.id, 1)"
            :disabled="item.is_last"
          >
            <i class="fas fa-arrow-down"></i>
          </button>
        </div>
      </template>

      <!-- Actions Column -->
      <template #item-actions="item">
        <div class="d-flex gap-2 my-1">
          <button class="btn btn-sm btn-primary">
            <i class="fas fa-edit"></i>
          </button>
          <button
            class="btn btn-sm btn-danger"
            :disabled="item.name === 'Admin'"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </template>
      <!-- Loading -->
      <template #loading>
        <div class="text-center loading-container">
          <div class="position-relative d-inline-block">
            <img
              src="@/assets/new-nokta-logo.png"
              class="loading-logo"
              style="width: 50px; height: 50px"
            />
          </div>
          <div class="mt-2 text-primary">{{ $t("tables-loading") }}</div>
        </div>
      </template>
    </EasyDataTable>
  </div>
  <broadcast-message-create-modal
    @submit="submit"
    @close-modal="closeCreateModal"
  />
</template>

<script>
import { onMounted, onUnmounted, ref } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import {
  createBroadcast,
  getBroadcasts,
  updateBroadcast,
  updateBroadcastPosition,
} from "@/plugins/services/authService";
import BroadcastMessageCreateModal from "@/components/modals/BroadcastSettingsViewMessageCreateModal.vue";
import { Modal } from "bootstrap";

export default {
  name: "BroadcastSettingsView",

  components: {
    EasyDataTable,
    BroadcastMessageCreateModal,
  },

  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const items = ref([]);

    const headers = ref([
      { text: `#`, value: "id" },
      { text: t("settings-broadcast-table-description"), value: "description" },
      { text: t("settings-broadcast-table-createdat"), value: "created_at" },
      {
        text: t("settings-broadcast-table-important"),
        value: "important",
      },
      {
        text: t("settings-broadcast-table-status"),
        value: "status",
      },
      {
        text: t("settings-broadcast-table-positions"),
        value: "positions",
        sortable: false,
      },
      {
        text: t("settings-broadcast-table-actions"),
        value: "actions",
        sortable: false,
      },
    ]);

    const fetchBroadcasts = async () => {
      const response = await getBroadcasts();
      if (response.status === 200) {
        items.value = response.data.data.map((item, index) => ({
          ...item,
          is_first: index === 0,
          is_last: index === response.data.data.length - 1,
        }));
        toast.success(response.data.message);
      } else {
        // Handle error response
        toast.error("Failed to fetch broadcasts");
      }
    };

    const updatePosition = async (id, direction) => {
      // Logic to update position
      const response = await updateBroadcastPosition(id, direction);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchBroadcasts();
      } else {
        toast.error("Failed to update position");
      }
    };

    const changeStatus = async (id) => {
      // Logic to change status
      const broadcast = items.value.find((item) => item.id === id);
      if (broadcast) {
        broadcast.status = broadcast.status ? 0 : 1;
        const response = await updateBroadcast(id, null, broadcast.status);
        if (response.status === 200) {
          toast.success(response.data.message);
        } else {
          toast.error("Failed to update status");
        }
      }
    };

    const updateImportant = async (id) => {
      // Logic to update important status
      const broadcast = items.value.find((item) => item.id === id);
      if (broadcast) {
        broadcast.important = broadcast.important ? 0 : 1;
        const response = await updateBroadcast(
          id,
          null,
          null,
          broadcast.important
        );
        if (response.status === 200) {
          toast.success(response.data.message);
        } else {
          toast.error("Failed to update important status");
        }
      }
    };

    const OpenCreateModal = () => {
      const item = document.getElementById("broadcastMessageCreateModal");
      console.log(item);
      if (!item) {
        console.error("Modal element not found");
        return;
      }
      const modal = new Modal(item);
      modal.show();
    };

    const closeCreateModal = () => {
      const item = document.getElementById("broadcastMessageCreateModal");
      if (!item) {
        console.error("Modal element not found");
        return;
      }
      try {
        const modal = Modal.getInstance(item) || new Modal(item);
        modal.hide();
      } catch (error) {
        console.error("Failed to close modal:", error);
      }
    };

    const submit = async (description) => {
      // Logic to submit the form
      const response = await createBroadcast(description);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchBroadcasts();
      } else {
        toast.error("Failed to create broadcast");
      }
      closeCreateModal();
    };

    onMounted(() => {
      fetchBroadcasts();
    });

    onUnmounted(() => {
      // Clean up if necessary
    });

    return {
      t,
      items,
      fetchBroadcasts,
      headers,
      updatePosition,
      changeStatus,
      updateImportant,
      OpenCreateModal,
      closeCreateModal,
      submit,
    };
  },
};
</script>

<style scoped>
.custom-table {
  border-radius: 10px;
  overflow: hidden;
}

.loading-logo {
  animation: pulse-and-spin 2s infinite linear;
  z-index: 2;
}

@keyframes pulse-and-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
