<template>
  <div
    class="modal fade"
    id="adminModal"
    tabindex="-1"
    aria-labelledby="adminModalLabel"
    aria-hidden="true"
    ref="adminModal"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
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
              <div class="row">
                <div class="col-6">
                  <label for="username" class="form-label">
                    {{ t("users-modal-add-label-fullname-en") }}
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    :placeholder="t('users-modal-add-placeholder-fullname-en')"
                    v-model="form.name_en"
                    required
                  />
                </div>
                <div class="col-6">
                  <label for="username" class="form-label">
                    {{ t("users-modal-add-label-fullname-ar") }}
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    :placeholder="t('users-modal-add-placeholder-fullname-ar')"
                    v-model="form.name_ar"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="mb-3">
              <div class="row">
                <div class="col-6">
                  <label for="email" class="form-label">
                    {{ t("users-modal-add-label-email") }}
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    :placeholder="t('users-modal-add-placeholder-email')"
                    v-model="form.email"
                    required
                  />
                </div>
                <div class="col-6">
                  <label for="phoneNumber" class="form-label">
                    {{ t("users-modal-add-label-phone") }}
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="phoneNumber"
                    :placeholder="t('users-modal-add-placeholder-phone')"
                    v-model="form.phoneNumber"
                  />
                </div>
              </div>
            </div>
            <div v-if="!isEditMode" class="mb-3">
              <div class="row">
                <div class="col-6">
                  <label for="password" class="form-label">
                    {{ t("users-modal-add-label-password") }}
                  </label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    :placeholder="t('users-modal-add-placeholder-password')"
                    v-model="form.password"
                    required
                  />
                </div>
                <div class="col-6">
                  <label for="password_confirmation" class="form-label">{{
                    t("users-modal-add-label-passwordconfirm")
                  }}</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="mb-3">
              <div class="row">
                <div class="col-6">
                  <label for="role" class="form-label">
                    {{ t("users-modal-add-label-role") }}
                  </label>
                  <select class="form-control" id="role" v-model="form.role">
                    <option v-if="!isEditMode" value="" disabled selected>
                      {{ t("users-modal-add-label-role") }}
                    </option>
                    <option
                      v-for="role in roles"
                      :key="role.id"
                      :value="role.name"
                    >
                      {{ role.name }}
                    </option>
                  </select>
                </div>
                <div class="col-6">
                  <label for="origin_id" class="form-label">
                    {{ t("users-modal-add-label-origin") }}
                  </label>
                  <select
                    class="form-control"
                    id="origin_id"
                    v-model="form.origin_id"
                  >
                    <option v-if="!isEditMode" value="" disabled selected>
                      {{ t("users-modal-add-label-origin") }}
                    </option>
                    <option
                      v-for="origin in origins"
                      :key="origin.id"
                      :value="origin.name"
                    >
                      {{ origin.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <div class="row">
                <div class="col-6">
                  <label for="parent_id" class="form-label">
                    {{ t("users-modal-add-label-reportto") }}
                  </label>
                  <Multiselect
                    v-model="form.parent_id"
                    :options="filteredUsers"
                    label="name"
                    track-by="id"
                    :placeholder="t('users-modal-add-placeholder-reportto')"
                    :searchable="true"
                  />
                </div>
                <div class="col-1 d-inline-grid">
                  <label for="color" class="form-label">
                    {{ t("users-modal-add-label-color") }}
                  </label>
                  <input
                    type="color"
                    class="form-control"
                    id="color"
                    v-model="form.color"
                  />
                </div>
                <div class="col d-inline-grid">
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
              </div>
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
            <button
              type="submit"
              class="btn btn-success text-white"
              :disabled="loading"
            >
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
            <button
              type="button"
              class="btn btn-danger text-white"
              @click="closeModal"
            >
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
// import { useToast } from "vue-toastification";
// import { showSuccess, showError } from "@/plugins/services/toastService";
import { useNotificationStore } from "@/stores/notificationStore";

import { useI18n } from "vue-i18n";
import { onMounted, computed, ref, watch } from "vue";
import { useOriginStore } from "@/stores/OriginStore";
import { useUserStore } from "@/stores/UserStore";
import { useRoleStore } from "@/stores/RoleStore";

export default {
  name: "UserViewAddEditUserModal",
  components: { Multiselect },
  setup() {
    const notificationStore = useNotificationStore();
    const userStore = useUserStore();
    const originStore = useOriginStore();
    const roleStore = useRoleStore();
    const user = computed(() => userStore.getSelectedUser);
    const users = computed(() => userStore.getAllUsers);
    const origins = computed(() => originStore.getAllOrigins);
    const roles = computed(() => roleStore.getAllRoles);
    const filteredUsers = computed(() => {
      if (!user.value) return users.value;
      return users.value.filter((u) => isParentRole(user.value.role, u.role));
    });
    const { t } = useI18n();
    const form = ref({
      id: null,
      name_en: "",
      name_ar: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "",
      reportTo: null,
      phoneNumber: "",
      image: null,
      color: null,
    });
    const isEditMode = ref(false);

    const submitForm = () => {
      try {
        this.loading = true;

        const formData = new FormData();
        formData.append("name_en", form.value.username_en);
        formData.append("name_ar", form.value.username_ar);
        formData.append("email", form.value.email);
        formData.append("role", form.value.role);
        formData.append("origin_id", form.value.origin_id);
        formData.append("image", form.value.image ? form.value.image : "");
        formData.append(
          "parent_id",
          form.value.reportTo?.id || form.value.reportTo || ""
        );
        formData.append("color_code", form.value.color);
        if (!this.isEditMode) {
          formData.append("password", form.value.password);
          formData.append(
            "password_confirmation",
            form.value.password_confirmation
          );
        }
        if (form.value.image) {
          formData.append("image", form.value.image);
        }
        if (this.isEditMode) {
          formData.append("phones", [form.value.phoneNumber]);
          this.userStore.updateUser(form.value.id, formData);
        } else {
          formData.append("phone", form.value.phoneNumber);
          this.userStore.createUser(formData);
        }
      } catch (error) {
        this.notificationStore.error(
          error.response?.data?.message || this.t("error.saveFailed"),
          {
            timeout: 3000,
          }
        );
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    };

    const openModal = (edit = false) => {
      isEditMode.value = edit;
      const modal = new Modal(document.getElementById("adminModal"));
      modal.show();
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      form.value.image = file ? file : null;
    };

    const clearForm = () => {
      form.value = {
        id: null,
        username: "",
        name_en: "",
        name_ar: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        reportTo: "",
        phoneNumber: "",
        image: null,
        color: "#292929",
        origin_id: null,
      };
    };

    const closeModal = () => {
      const modal = document.getElementById("adminModal");
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    };

    const isParentRole = (parentRole, childRole) => {
      const childRoleData = roles.value.find((role) => role.name === childRole);
      return childRoleData && childRoleData.parent_role === parentRole;
    };

    onMounted(() => {
      originStore.fetchAllOrigins();
    });

    watch(user, (newUser) => {
      if (newUser) {
        console.log("New user data:", newUser);
        form.value = {
          id: newUser.id,
          name_en: newUser.name_en || "",
          name_ar: newUser.name_ar || "",
          email: newUser.email || "",
          password: "",
          password_confirmation: "",
          role: newUser.role || "",
          reportTo: newUser.parent_id || null,
          phoneNumber: newUser.phones?.[0] || "",
          image: null,
          color: newUser.color_code || "#292929",
          origin_id: newUser.origin_id || null,
        };
      }
    });
    return {
      t,
      notificationStore,
      origins,
      users,
      submitForm,
      openModal,
      user,
      form,
      handleImageUpload,
      clearForm,
      closeModal,
      isParentRole,
      filteredUsers,
    };
  },
  data() {
    return {
      isEditMode: false,
      loading: false,
      successMessage: "",
      errorMessage: "",
    };
  },
};
</script>
