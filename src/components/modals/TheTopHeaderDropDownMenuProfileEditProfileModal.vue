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
import { useUserStore } from "@/stores/UserStore";
export default {
  name: "EditProfileModal",

  setup() {
    const { t } = useI18n();
    const notificationStore = useNotificationStore();
    const userStore = useUserStore();
    return { t, notificationStore, userStore };
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
    closeEditProfile() {
      try {
        const modal = document.getElementById("EditProfileModal");
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
        this.userData = this.userStore.getCurrentUser;
        console.log("Fetched user data:", this.userData);
        this.localNameEn = this.userData.name_en || "";
        this.localNameAr = this.userData.name_ar || "";
        this.localImage =
          this.userData.image_url && this.userData.image_url.trim() !== ""
            ? this.userData.image_url
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
        const id = this.userData.id;
        this.loading = true;
        const response = await this.userStore.updateUser(id, {
          name_en: this.userData.name_en,
          name_ar: this.userData.name_ar,
          email: this.userData.email,
          image: this.image_bin,
        });
        if (response.success === false) {
          throw new Error(response.message || "Failed to update profile");
        }
        this.notificationStore.success(response.message, {
          timeout: 3000,
          id: "edit-profile-success",
          singleton: true,
        });
        this.closeEditProfile();
      } catch (error) {
        console.error("Error updating user profile:", error);
        this.notificationStore.error(
          error.message || this.t("errors.updateFailed")
        );
      } finally {
        this.loading = false;
      }
    },
    openEditProfile() {
      const modal = document.getElementById("EditProfileModal");
      const modalInstance = new Modal(modal);
      modalInstance.show();
    },
  },
  async mounted() {
    this.userStore = useUserStore();
    if (!this.userStore.getCurrentUser) {
      this.userData = await this.userStore.fetchCurrentUser();
    }
    console.log("Fetched user data:", this.userStore.getCurrentUser);
  },
};
</script>
