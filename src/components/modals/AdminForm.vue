<template>
  <div
    class="modal fade"
    id="adminModal"
    tabindex="-1"
    aria-labelledby="adminModalLabel"
    aria-hidden="true"
    ref="adminModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="adminModalLabel">
            {{
              isEditMode
                ? t("users-modal-edit-heading")
                : t("users-modal-add-heading")
            }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <div class="mb-3">
              <label for="username" class="form-label">
                {{ t("users-modal-add-label-fullname") }}
              </label>
              <input
                type="text"
                class="form-control"
                id="username"
                :placeholder="t('users-modal-add-placeholder-fullname')"
                v-model="formData.username"
                required
              />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">
                {{ t("users-modal-add-label-email") }}
              </label>
              <input
                type="email"
                class="form-control"
                id="email"
                :placeholder="t('users-modal-add-placeholder-email')"
                v-model="formData.email"
                required
              />
            </div>
            <div class="mb-3">
              <label for="phoneNumber" class="form-label">
                {{ t("users-modal-add-label-phone") }}
              </label>
              <input
                type="text"
                class="form-control"
                id="phoneNumber"
                :placeholder="t('users-modal-add-placeholder-phone')"
                v-model="formData.phoneNumber"
              />
            </div>

            <div v-if="!isEditMode" class="mb-3">
              <label for="password" class="form-label">
                {{ t("users-modal-add-label-password") }}
              </label>
              <input
                type="password"
                class="form-control"
                id="password"
                :placeholder="t('users-modal-add-placeholder-password')"
                v-model="formData.password"
                required
              />
            </div>
            <div v-if="!isEditMode" class="mb-3">
              <label for="password_confirmation" class="form-label">{{
                t("users-modal-add-label-passwordconfirm")
              }}</label>
              <input
                type="password"
                class="form-control"
                id="password_confirmation"
                v-model="formData.password_confirmation"
                required
              />
            </div>

            <div class="mb-3">
              <label for="role" class="form-label">
                {{ t("users-modal-add-label-role") }}
              </label>
              <select class="form-control" id="role" v-model="formData.role">
                <option v-if="!isEditMode" value="" disabled selected>
                  {{ t("users-modal-add-label-role") }}
                </option>
                <option v-for="role in roles" :key="role.id" :value="role.name">
                  {{ role.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="reportTo" class="form-label">
                {{ t("users-modal-add-label-reportto") }}
              </label>
              <Multiselect
                v-model="formData.reportTo"
                :options="filteredUsers"
                label="name"
                track-by="id"
                :placeholder="t('users-modal-add-placeholder-reportto')"
                :searchable="true"
              />
            </div>
            <div class="mb-3">
              <label for="color" class="form-label">
                {{ t("users-modal-add-label-color") }}
              </label>
              <input
                type="color"
                class="form-control"
                id="color"
                v-model="formData.color"
              />
            </div>
            <div class="mb-3">
              <label for="image" class="form-label">
                {{ t("users-modal-add-label-image") }}
              </label>
              <input
                type="file"
                class="form-control"
                id="image"
                :placeholder="t('users-modal-add-placeholder-image')"
                @change="handleImageUpload"
                accept="image/*"
              />
            </div>

            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="alert alert-success">
              {{ successMessage }}
            </div>
          </div>
          <div
            class="modal-footer btns d-flex justify-content-between align-items-center p-2"
          >
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{
                loading
                  ? isEditMode
                    ? t("users-modal-edit-button-submit")
                    : t("users-modal-edit-button-submit")
                  : isEditMode
                  ? t("users-modal-edit-button-submit")
                  : t("users-modal-add-button-submit")
              }}
            </button>
            <button type="button" class="btn btn-secondary" @click="closeModal">
              {{ t("users-modal-add-button-cancel") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import {
  createUser,
  updateUser,
  getUser,
  getRoles,
} from "@/plugins/services/authService";

export default {
  name: "AdminModal",
  components: { Multiselect },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    return { t, toast };
  },
  data() {
    return {
      isEditMode: false,
      formData: {
        id: null,
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        reportTo: null,
        phoneNumber: "",
        image: null,
        color: null,
      },
      users: [],
      roles: [],
      loading: false,
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await getUser();
        this.users = response.data.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async fetchRoles() {
      try {
        const response = await getRoles();
        this.roles = response.data.data;
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.formData.image = file ? file : null;
    },

    openModal(user = null) {
      this.fetchUsers();
      this.fetchRoles();

      if (user) {
        this.isEditMode = true;
        this.formData = {
          id: user.id,
          username: user.name,
          email: user.email,
          role: user.role?.id || user.role,
          reportTo: user.report_to_id,
          phoneNumber: user.phones[0]?.phone,
          image: null,
          color: user.color_code,
        };
      } else {
        this.isEditMode = false;
        this.formData = {
          id: null,
          username: "",
          email: "",
          password: "",
          password_confirmation: "",
          role: "",
          reportTo: "",
          phoneNumber: "",
          image: null,
          color: null,
        };
      }

      const modal = new Modal(document.getElementById("adminModal"));
      modal.show();
    },

    async submitForm() {
      try {
        this.loading = true;

        const formData = new FormData();
        formData.append("name", this.formData.username);
        formData.append("email", this.formData.email);
        formData.append("role", this.formData.role);
        formData.append(
          "parent_id",
          this.formData.reportTo?.id || this.formData.reportTo || ""
        );
        formData.append("phone", this.formData.phoneNumber);
        formData.append("color_code", this.formData.color);
        if (!this.isEditMode) {
          formData.append("password", this.formData.password);
          formData.append(
            "password_confirmation",
            this.formData.password_confirmation
          );
        }
        if (this.formData.image) {
          formData.append("image", this.formData.image);
        }

        let response;
        if (this.isEditMode) {
          console.log("fomrData", formData);
          response = await updateUser(this.formData.id, formData);
          this.toast.success(this.t("success.updateUser"), {
            timeout: 3000,
          });
        } else {
          response = await createUser(formData);
          this.toast.success(this.t("success.createUser"), {
            timeout: 3000,
          });
        }

        if (response.data) {
          const user = response.data.data || response.data;
          localStorage.setItem(`user_${user.id}_color`, this.formData.color);
          this.$emit("user-updated", user);
          setTimeout(() => {
            this.clearForm();
            this.closeModal();
          }, 1000);
        }
      } catch (error) {
        this.toast.error(
          error.response?.data?.message || this.t("error.saveFailed"),
          {
            timeout: 3000,
          }
        );
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },

    clearForm() {
      this.formData = {
        id: null,
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        reportTo: "",
        phoneNumber: "",
        image: null,
        color: "#292929",
      };
    },

    closeModal() {
      const modal = document.getElementById("adminModal");
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    },

    isParentRole(parentRole, childRole) {
      const childRoleData = this.roles.find((role) => role.name === childRole);
      return childRoleData && childRoleData.parent_role === parentRole;
    },
  },
  computed: {
    filteredUsers() {
      if (!this.formData.role) return [];

      const selectedRole = this.roles.find(
        (role) => role.name === this.formData.role
      );
      if (!selectedRole || !selectedRole.parent_role) return [];

      return this.users.filter(
        (user) => user.role === selectedRole.parent_role
      );
    },
  },
};
</script>
