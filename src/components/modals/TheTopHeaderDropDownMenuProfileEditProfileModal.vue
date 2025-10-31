<template>
  <div
    class="modal fade"
    id="EditProfileModal"
    tabindex="-1"
    aria-labelledby="EditProfileModalLabel"
    aria-hidden="true"
    ref="EditProfileModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="EditProfileModalLabel">
            {{ t("header-user-menu-item-profile-modal-title") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeEditProfile"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <form @submit.prevent="submitForm" ref="EditProfileForm">
          <div class="modal-body">
            <div class="text-center mb-3">
              <img
                :src="localImage"
                class="img-fluid rounded"
                width="100"
                height="100"
                style="object-fit: cover"
                alt="Profile Image"
              />
            </div>

            <input
              type="file"
              class="form-control mb-3"
              accept="image/*"
              @change="updateImage"
            />

            <div class="mb-3">
              <label class="form-label">
                {{ t("header-user-menu-item-profile-modal-label-name-en") }}
              </label>
              <input type="text" class="form-control" v-model="localNameEn" />
            </div>

            <div class="mb-3">
              <label class="form-label">
                {{ t("header-user-menu-item-profile-modal-label-name-ar") }}
              </label>
              <input type="text" class="form-control" v-model="localNameAr" />
            </div>
          </div>

          <div class="modal-footer d-flex justify-content-between">
            <button type="submit" class="btn btn-success" :disabled="loading">
              <span v-if="loading">
                <i class="fas fa-spinner fa-spin"></i> {{ t("modals.editing") }}
              </span>
              <span v-else>
                {{ t("header-user-menu-item-profile-modal-button-confirm") }}
              </span>
            </button>
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
              @click="closeEditProfile"
            >
              {{ t("buttons.close") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNotificationStore } from "@/stores/notificationStore";
import { useI18n } from "vue-i18n";
import { getUserById, updateUser } from "@/plugins/services/userService";
import Cookies from "js-cookie";

export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModal",

  setup() {
    const { t } = useI18n();
    const notificationStore = useNotificationStore();
    return { t, notificationStore };
  },

  data() {
    return {
      modalInstance: null,
      loading: false,
      localNameEn: "",
      localNameAr: "",
      localImage: require("@/assets/default-avatar-profile.webp"),
      imageFile: null,
      userData: null,
    };
  },

  methods: {
    openEditProfile() {
      try {
        this.fetchUserData();
        const modal = this.$refs.EditProfileModal;
        this.modalInstance = new Modal(modal);
        this.modalInstance.show();
      } catch (error) {
        console.error("Error opening modal:", error);
        this.notificationStore.error(this.t("error.closeModal"), {
          timeout: 3000,
        });
      }
    },

    closeEditProfile() {
      try {
        const modal = this.$refs.EditProfileModal;
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
        document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
        document.body.classList.remove("modal-open");
      } catch (error) {
        this.notificationStore.error(this.t("error.closeModal"), {
          timeout: 3000,
        });
      }
    },

    async fetchUserData() {
      try {
        const response = await getUserById(Cookies.get("user_id"));
        if (response.status !== 200) throw new Error(response.data.message);

        this.userData = response.data.data;
        this.localNameEn = this.userData.name_en || "";
        this.localNameAr = this.userData.name_ar || "";
        this.localImage =
          this.userData.image && this.userData.image.trim() !== ""
            ? this.userData.image
            : require("@/assets/default-avatar-profile.webp");
      } catch (error) {
        this.notificationStore.error(error.message, { timeout: 3000 });
      }
    },

    updateImage(event) {
      const file = event.target.files[0];
      if (file?.type?.startsWith("image/")) {
        this.imageFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.localImage = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.notificationStore.error(this.t("errors.invalidImageFormat"), {
          timeout: 3000,
        });
      }
    },

    async submitForm() {
      try {
        this.loading = true;

        const userId = Cookies.get("user_id");
        const formData = new FormData();
        formData.append("name_en", this.localNameEn || "");
        formData.append("name_ar", this.localNameAr || "");
        if (this.imageFile) {
          formData.append("image", this.imageFile);
        }

        const response = await updateUser(userId, formData);
        if (response.status !== 200) throw new Error(response.data.message);

        this.notificationStore.success(
          this.t("header-user-menu-item-profile-modal-success")
        );

        if (this.modalInstance) {
          this.modalInstance.hide();
          document
            .querySelectorAll(".modal-backdrop")
            .forEach((el) => el.remove());
          document.body.classList.remove("modal-open");
        }
      } catch (error) {
        console.error("Error updating user profile:", error);
        this.notificationStore.error(
          error.message || this.t("errors.updateFailed")
        );
      } finally {
        this.loading = false;
      }
    },
  },

  mounted() {
    this.fetchUserData();
  },
};
</script>
