<template>
  <div
    class="modal fade"
    id="userLogModal"
    tabindex="-1"
    aria-labelledby="userLogModalLabel"
    aria-hidden="true"
    ref="userLogModal"
  >
    <div
      class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="userLogModalLabel">
            {{ t("users-log-modal-heading") }} - {{ userName }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div v-else-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>

          <div v-else-if="logs.length === 0" class="alert alert-info">
            {{ t("users-log-modal-no-data") }}
          </div>

          <div v-else class="table-responsive">
            <DataTable
              :value="logs"
              :paginator="false"
              :rows="10"
              :rowsPerPageOptions="[5, 10, 20, 50]"
              class="p-datatable-sm modal-datatable"
              stripedRows
              responsiveLayout="scroll"
            >
              <Column field="index" :header="'#'" style="min-width: 80px">
                <template #body="slotProps">
                  {{ slotProps.index + 1 }}
                </template>
              </Column>

              <Column
                field="type"
                :header="t('users-log-modal-column-type')"
                style="min-width: 100px"
              >
                <template #body="slotProps">
                  <span
                    :class="{
                      'badge bg-success': slotProps.data.event === 'login',
                      'badge bg-danger': slotProps.data.event === 'logout',
                    }"
                  >
                    {{ slotProps.data.event }}
                  </span>
                </template>
              </Column>

              <Column
                field="ip_address"
                :header="t('users-log-modal-column-ip')"
                style="min-width: 150px"
              >
                <template #body="slotProps">
                  {{ slotProps.data.ip_address || "N/A" }}
                </template>
              </Column>

              <Column
                field="user_agent"
                :header="t('users-log-modal-column-useragent')"
                style="min-width: 300px"
              >
                <template #body="slotProps">
                  <div
                    class="text-truncate"
                    :title="slotProps.data.user_agent"
                    style="max-width: 300px"
                  >
                    {{ slotProps.data.user_agent || "N/A" }}
                  </div>
                </template>
              </Column>

              <Column
                field="timestamp"
                :header="t('users-log-modal-column-datetime')"
                style="min-width: 180px"
              >
                <template #body="slotProps">
                  {{ formatDateTime(slotProps.data.timestamp) }}
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            {{ t("users-log-modal-button-close") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useI18n } from "vue-i18n";
import { useNotificationStore } from "@/stores/notificationStore";
import { getUserLoginLogs } from "@/plugins/services/userService";

export default {
  name: "UserLogDetails",
  components: {
    DataTable,
    Column,
  },
  setup() {
    const notificationStore = useNotificationStore();
    const { t } = useI18n();
    return { t, notificationStore };
  },
  data() {
    return {
      logs: [],
      userName: "",
      userId: null,
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async openModal(user) {
      this.userId = user.id;
      this.userName = user.name_en || user.name_ar || user.email || "User";
      this.logs = [];
      this.errorMessage = "";

      const modal = new Modal(document.getElementById("userLogModal"));
      modal.show();

      await this.fetchLoginLogs();
    },

    async fetchLoginLogs() {
      try {
        this.loading = true;
        this.errorMessage = "";

        const response = await getUserLoginLogs(this.userId);
        if (response.status === 200) {
          this.logs = response.data.data || [];
        } else {
          this.errorMessage =
            response.data.message || this.t("errors.fetchFailed");
        }
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || this.t("errors.fetchFailed");
        console.error("Error fetching login logs:", error);
      } finally {
        this.loading = false;
      }
    },

    formatDateTime(dateTime) {
      if (!dateTime) return "N/A";

      const date = new Date(dateTime);
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      return date.toLocaleString("en-US", options);
    },

    closeModal() {
      const modal = document.getElementById("userLogModal");
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    },
  },
};
</script>

<style>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge {
  font-size: 0.875rem;
  padding: 0.35em 0.65em;
  text-transform: capitalize;
}

/* Modal z-index fixes */
#userLogModal {
  z-index: 1055 !important;
}

#userLogModal .modal-backdrop {
  z-index: 1054 !important;
}

/* PrimeVue dropdown fixes - CRITICAL */
.p-dropdown-panel {
  z-index: 1060 !important;
}

.p-paginator .p-dropdown-panel {
  z-index: 1060 !important;
}

.p-dropdown-items-wrapper {
  z-index: 1061 !important;
}
</style>
