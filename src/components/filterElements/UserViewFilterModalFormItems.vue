<template>
  <div class="mb-3">
    <label for="role" class="form-label">{{
      t("users-modal-filter-label-role")
    }}</label>
    <select class="form-control" id="role" v-model="localRole">
      <option value="" disabled selected>
        {{ t("users-modal-filter-placeholder-role") }}
      </option>
      <option v-for="role in roles" :key="role.id" :value="role.name">
        {{ role.name }}
      </option>
    </select>
  </div>
  <div class="row">
    <div class="col-6">
      <div class="mb-3">
        <label for="createdAt" class="form-label">{{
          t("users-modal-filter-label-created-at")
        }}</label>
        <input
          type="date"
          lang="en"
          class="form-control"
          id="createdAt"
          v-model="localCreatedAt"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="mb-3">
        <label for="rowsPerPage" class="form-label">{{
          t("modals.rowsPerPage")
        }}</label>
        <select
          class="form-control"
          id="rowsPerPage"
          v-model="localRowsPerPage"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  </div>
  <div class="mb-3">
    <label class="form-label">{{ t("users-modal-filter-label-status") }}</label>
    <div
      class="radioStatus d-flex justify-content-start align-items-center gap-3"
    >
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          id="status-active"
          value="active"
          v-model="localStatus"
        />
        <label class="form-check-label" for="status-active">{{
          t("users-modal-filter-status-active")
        }}</label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          id="status-inactive"
          value="inactive"
          v-model="localStatus"
        />
        <label class="form-check-label" for="status-inactive">{{
          t("users-modal-filter-status-inactive")
        }}</label>
      </div>
    </div>
  </div>
  <div v-if="errorMessage" class="alert alert-danger">
    {{ errorMessage }}
  </div>
  <div v-if="successMessage" class="alert alert-success">
    {{ successMessage }}
  </div>
</template>

<script>
import { getRoles } from "@/plugins/services/authService";
import { useI18n } from "vue-i18n";
export default {
  name: "UserViewFilterModalFormItems",
  props: ["role", "status", "createdAt", "perPage"],
  emits: ["update:role", "update:status", "update:createdAt", "update:perPage"],
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      roles: [],
      localRole: this.role,
      localStatus: this.status,
      localCreatedAt: this.createdAt,
      localRowsPerPage: this.perPage,
      errorMessage: "",
      successMessage: "",
    };
  },
  watch: {
    localRole(newVal) {
      this.$emit("update:role", newVal);
    },
    localStatus(newVal) {
      this.$emit("update:status", newVal);
    },
    localCreatedAt(newVal) {
      this.$emit("update:createdAt", newVal);
    },
    localRowsPerPage(newVal) {
      this.$emit("update:perPage", newVal);
    },
  },
  mounted() {
    this.fetchRoles();
  },
  methods: {
    async fetchRoles() {
      try {
        const response = await getRoles();
        this.roles = response.data.data;
      } catch (error) {
        this.errorMessage = "Error in Upload Roles ";
      }
    },
  },
};
</script>
