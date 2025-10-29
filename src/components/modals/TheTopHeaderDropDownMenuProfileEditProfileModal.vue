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
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeEditProfile"
          ></button>
        </div>
        <form @submit.prevent="submitForm" ref="EditProfileForm">
          <div class="modal-body">
            <!-- <profile-form :userData="userData" /> -->
            <div class="mb-3">
              <div class="my-2 text-center">
                <img
                  :src="
                    userData.image ||
                    require('@/assets/default-avatar-profile.webp')
                  "
                  class="img-fluid rounded"
                  width="100"
                  alt="Profile Image"
                />
              </div>
              <input
                type="file"
                class="form-control"
                id="profileImage"
                name="image"
                @change="updateImage"
              />
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">{{
                t("header-user-menu-item-profile-modal-label-name")
              }}</label>
              <input
                type="text"
                class="form-control"
                placeholder="Name in English"
                name="name_en"
                v-model="userData.name_en"
              />
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">{{
                t("header-user-menu-item-profile-modal-label-name")
              }}</label>
              <input
                type="text"
                class="form-control"
                placeholder="Name in Arabic"
                name="name_ar"
                v-model="userData.name_ar"
              />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">{{
                t("header-user-menu-item-profile-modal-label-email")
              }}</label>
              <input
                type="email"
                class="form-control"
                placeholder="Email"
                name="email"
                v-model="userData.email"
                readonly
              />
            </div>
          </div>
          <profile-buttons :loading="loading" @close="closeEditProfile" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import ProfileButtons from "@/components/editProfileElements/TheTopHeaderDropDownMenuProfileEditProfileModalButtonsItems.vue";
import { useNotificationStore } from "@/stores/notificationStore";

import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/UserStore";
export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModal",
  components: { ProfileButtons },
  setup() {
    const { t } = useI18n();
    const notificationStore = useNotificationStore();
    // const toast = useToast();
    return { t, notificationStore };
  },
  data() {
    return {
      modalInstance: null,
      loading: false,
      userStore: null,
      userData: {
        name_en: "",
        name_ar: "",
        email: "",
        image: null,
      },
      image_bin: null,
    };
  },
  methods: {
    closeEditProfile() {
      try {
        const modal = document.getElementById("EditProfileModal");
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          document.querySelector(".modal-backdrop")?.remove();
          document.body.classList.remove("modal-open");
        } else {
          console.log("No modal instance found for EditProfileModal", modal);
        }
      } catch (error) {
        this.notificationStore.error(this.t("error.closeModal"), {
          timeout: 3000,
          id: "edit-profile-close-error",
          singleton: true,
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
        this.notificationStore.error(error.message, {
          timeout: 3000,
          id: "edit-profile-submit-error",
          singleton: true,
        });
      } finally {
        this.loading = false;
      }
    },
    updateImage(event) {
      const file = event.target.files[0];
      if (file?.type?.startsWith("image/")) {
        this.image_bin = file;
        console.log("Selected image file:", this.image_bin);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.userData.image = e.target.result;
          this.$forceUpdate();
        };
        reader.readAsDataURL(file);
      }
    },
  },
  async mounted() {
    this.userStore = useUserStore();
    this.userData = await this.userStore.fetchCurrentUser();
    console.log("User Data in Edit Profile Modal:", this.userData);
  },
};
</script>
