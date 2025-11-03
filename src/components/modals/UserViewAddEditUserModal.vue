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
                  <label for="name_en" class="form-label">
                    {{ t("users-modal-add-label-fullname-en") }}
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="name_en"
                    :placeholder="t('users-modal-add-placeholder-fullname-en')"
                    v-model="form.name_en"
                    required
                  />
                </div>
                <div class="col-6">
                  <label for="name_ar" class="form-label">
                    {{ t("users-modal-add-label-fullname-ar") }}
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="name_ar"
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
                  <label for="phone" class="form-label">
                    {{ t("users-modal-add-label-phone") }}
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="phone"
                    :placeholder="t('users-modal-add-placeholder-phone')"
                    v-model="form.phone"
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
                  <multiselect
                    id="role"
                    v-model="form.role"
                    :options="roles"
                    label="name"
                    track-by="slug"
                    :placeholder="t('users-modal-add-placeholder-role')"
                    :searchable="true"
                    :allow-empty="false"
                  />
                </div>
                <div class="col-6">
                  <label for="origin" class="form-label">
                    {{ t("users-modal-add-label-origin") }}
                  </label>
                  <multiselect
                    id="origin"
                    v-model="form.origin"
                    :options="origins"
                    label="name"
                    track-by="id"
                    :placeholder="t('users-modal-add-placeholder-origin')"
                    :searchable="true"
                  />
                </div>
              </div>
            </div>
            <div class="mb-3">
              <div class="row">
                <div class="col-6">
                  <label for="parent" class="form-label">
                    {{ t("users-modal-add-label-reportto") }}
                  </label>
                  <Multiselect
                    id="parent"
                    v-model="form.parent"
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
            <div class="mb-3">
              <hr class="m-4" />
              <div class="row">
                <div class="col" v-show="isEditMode">
                  <label for="old_password" class="form-label">
                    {{ t("users-modal-add-label-oldpassword") }}
                  </label>
                  <input
                    type="password"
                    class="form-control"
                    id="old_password"
                    :placeholder="t('users-modal-add-placeholder-oldpassword')"
                    v-model="form.old_password"
                    :required="!isEmpty(form.password)"
                  />
                </div>
                <div class="col">
                  <label for="password" class="form-label">
                    {{ t("users-modal-add-label-password") }}
                  </label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    :placeholder="t('users-modal-add-placeholder-password')"
                    v-model="form.password"
                  />
                </div>
                <div class="col">
                  <label for="password_confirmation" class="form-label">{{
                    t("users-modal-add-label-passwordconfirm")
                  }}</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password_confirmation"
                    :placeholder="
                      t('users-modal-add-placeholder-passwordconfirm')
                    "
                    v-model="form.password_confirmation"
                    :required="!isEmpty(form.password)"
                  />
                </div>
              </div>
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
    const filteredUsers = computed(() =>
      userStore.getUsersWithRole(
        roleStore.getRoleByName(form.value.role)?.parent_role
      )
    );
    const { t } = useI18n();
    const form = ref({
      id: null,
      name_en: null,
      name_ar: null,
      email: null,
      password: null,
      password_confirmation: null,
      role: null,
      parent: null,
      phone: null,
      image: null,
      color: null,
      origin: null,
    });
    const isEditMode = ref(true);
    const loading = ref(false);

    const submitForm = async () => {
      try {
        loading.value = true;
        let response = "";
        if (isEditMode.value) {
          response = await userStore.updateUser(form.value.id, {
            ...form.value,
            parent: null,
            origin: null,
            role: form.value.role ? form.value.role["slug"] : null,
            origin_id: form.value.origin ? form.value.origin["id"] : null,
            parent_id: form.value.parent ? form.value.parent["id"] : null,
            password: !isEmpty(form.value.password)
              ? form.value.password
              : null,
            old_password: !isEmpty(form.value.password)
              ? form.value.old_password
              : null,
            password_confirmation: !isEmpty(form.value.password)
              ? form.value.password_confirmation
              : null,
          });
        } else {
          response = await userStore.createUser({
            ...form.value,
            parent_id: form.value.parent ? form.value.parent["id"] : null,
          });
        }
        if (!response.success) {
          throw new Error(response.message);
        }
        notificationStore.success(response.message);
      } catch (error) {
        notificationStore.error(error.message, {
          timeout: 3000,
        });
        console.error("Error:", error);
      } finally {
        loading.value = false;
      }
    };

    const openModal = (edit = true) => {
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
        name_en: null,
        name_ar: null,
        email: null,
        password: null,
        password_confirmation: null,
        role: null,
        parent: null,
        phone: null,
        image: null,
        color: "#292929",
        origin: null,
      };
    };

    const closeModal = () => {
      clearForm();
      const modal = document.getElementById("adminModal");
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    };

    const isEmpty = (str) => {
      return !str || str.trim() === "";
    };

    onMounted(() => {
      if (!originStore.getAllOrigins?.length) {
        originStore.fetchAllOrigins();
      }
      if (!roleStore.getAllRoles?.length) {
        roleStore.fetchRoles();
      }
      if (!userStore.getAllUsers?.length) {
        userStore.fetchAllUsers();
      }
    });

    watch(user, (newUser) => {
      if (newUser) {
        form.value = {
          id: newUser.id,
          name_en: newUser.name_en || null,
          name_ar: newUser.name_ar || null,
          email: newUser.email || null,
          password: null,
          password_confirmation: null,
          role:
            newUser.role || null ? roleStore.getRoleByName(newUser.role) : null,
          parent: newUser.parent_id
            ? userStore.getUserById(newUser.parent_id)
            : null,
          phone: newUser.phones[0]?.phone,
          image: null,
          color: newUser.color_code || "#000000",
          origin: newUser.origin_id
            ? originStore.getOriginById(newUser.origin_id)
            : null,
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
      filteredUsers,
      isEditMode,
      roles,
      loading,
      isEmpty,
    };
  },
};
</script>
