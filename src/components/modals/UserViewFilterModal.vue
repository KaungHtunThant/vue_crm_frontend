<template>
  <div
    class="modal fade"
    id="filterModal"
    tabindex="-1"
    aria-labelledby="filterModalLabel"
    aria-hidden="true"
    ref="filterModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="filterModalLabel">
            {{ t("users-modal-filter-heading") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeFilterModal"
          ></button>
        </div>
        <form @submit.prevent="submitFilters">
          <div class="modal-body">
            <filter-form
              v-model:role="role"
              v-model:status="status"
              v-model:createdAt="createdAt"
              v-model:perPage="perPage"
            />
          </div>
          <filter-buttons
            :loading="loading"
            @close="closeFilterModal"
            @reset-filters="resetFilters"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import FilterForm from "@/components/filterElements/UserViewFilterModalFormItems.vue";
import FilterButtons from "@/components/filterElements/UserViewFilterModalButtonsItems.vue";
import { getRoles } from "@/plugins/services/userService";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

export default {
  name: "UserViewFilterModal",
  components: { FilterForm, FilterButtons },
  setup() {
    const toast = useToast();
    const { t } = useI18n();
    return { toast, t };
  },
  data() {
    return {
      status: "",
      role: "",
      createdAt: "",
      perPage: "10",
      loading: false,
      modalInstance: null,
    };
  },
  mounted() {
    this.modalInstance = new Modal(this.$refs.filterModal);
  },
  methods: {
    openFilterModal() {
      this.fetchRoles();
      this.modalInstance.show();
    },
    applyFilters(filters) {
      this.loading = true;
      try {
        this.$emit("apply-filters", filters);
        this.toast.success(this.$t("success.applyFilters"), {
          timeout: 3000,
        });
        setTimeout(() => {
          this.loading = false;
          this.closeFilterModal();
        }, 1000);
      } catch (error) {
        this.toast.error(this.$t("error.applyFilters"), {
          timeout: 3000,
        });
        this.loading = false;
      }
    },
    closeFilterModal() {
      const modal = this.$refs.filterModal;
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    },
    submitFilters() {
      this.loading = true;
      try {
        this.$emit("apply-filters", {
          role: this.role,
          status: this.status,
          createdAt: this.createdAt,
          perPage: this.perPage,
        });
        this.toast.success(this.$t("success.applyFilters"), {
          timeout: 3000,
        });
        setTimeout(() => {
          this.loading = false;
          this.closeFilterModal();
        }, 1000);
      } catch (error) {
        this.toast.error(this.$t("error.applyFilters"), {
          timeout: 3000,
        });
        this.loading = false;
      }
    },
    resetFilters() {
      try {
        this.role = "";
        this.status = "";
        this.createdAt = "";
        this.perPage = "10";

        this.$emit("reset-filters");
        this.toast.success(this.$t("success.resetFilters"), {
          timeout: 3000,
        });
        this.closeFilterModal();
      } catch (error) {
        this.toast.error(this.$t("error.resetFilters"), {
          timeout: 3000,
        });
      }
    },
    async fetchRoles() {
      try {
        const response = await getRoles();
        this.roles = response.data.data;
      } catch (error) {
        this.toast.error(this.$t("error.fetchRoles"), {
          timeout: 3000,
        });
        console.error("Error fetching roles:", error);
      }
    },
  },
};
</script>
