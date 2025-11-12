<template>
  <div
    class="modal fade"
    id="userLogModal"
    tabindex="-1"
    aria-labelledby="userLogModalLabel"
    aria-hidden="true"
    ref="userLogModal"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content shadow-lg border-0">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="userLogModalLabel">
            {{ t("users-modal-user-log-heading") }}
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeUserLogModal"
          ></button>
        </div>

        <div class="modal-body">
          <div
            class="table-responsive table-wrapper"
            v-if="logs.length"
            style="max-height: 70vh; overflow-y: auto"
          >
            <table class="table table-striped align-middle">
              <thead class="table-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Type</th>
                  <th scope="col">IP Address</th>
                  <th scope="col">User Agent</th>
                  <th scope="col">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(log, index) in logs" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ log.type }}</td>
                  <td>{{ log.ip_address }}</td>
                  <td>{{ log.user_agent }}</td>
                  <td>{{ log.time }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="text-center text-muted py-5">
            <i class="bi bi-info-circle fs-4 d-block mb-2"></i>
            No logs found for this user.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useI18n } from "vue-i18n";
import { useNotificationStore } from "@/stores/notificationStore";

export default {
  name: "UserViewUserLogModal",
  props: {
    user_id: {
      type: [Number, String],
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();
    const notificationStore = useNotificationStore();
    return { t, notificationStore };
  },
  data() {
    return {
      modalInstance: null,
      logs: [],
    };
  },
  mounted() {
    this.modalInstance = new Modal(this.$refs.userLogModal);
  },
  methods: {
    openUserLogModal() {
      this.modalInstance.show();
      this.fetchUserLogs();
    },
    async fetchUserLogs() {
      try {
        this.logs = [
          {
            type: "Login",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:15:22",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Logout",
            ip_address: "192.168.1.10",
            user_agent: "Chrome (Windows 11)",
            time: "2025-11-12 10:45:11",
          },
          {
            type: "Login",
            ip_address: "172.16.5.23",
            user_agent: "Safari (MacOS)",
            time: "2025-11-11 22:05:03",
          },
        ];
        this.notificationStore.success("Logs loaded successfully!", {
          timeout: 1500,
        });
      } catch (error) {
        this.notificationStore.error("Failed to load logs!", { timeout: 2500 });
      }
    },
    // async fetchUserLogs() {
    //   if (!this.user_id) return;
    //   try {
    //     this.logs = await getLogsByUserId(this.user_id);
    //     this.notificationStore.success("Logs loaded successfully!", {
    //       timeout: 1500,
    //     });
    //   } catch (error) {
    //     this.notificationStore.error("Failed to load logs!", { timeout: 2500 });
    //   }
    // },
  },
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
.table-wrapper thead th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 10;
}
</style>
