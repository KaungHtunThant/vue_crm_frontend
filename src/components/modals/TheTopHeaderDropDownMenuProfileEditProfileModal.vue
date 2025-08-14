<template>
  <div
    class="modal fade"
    id="EditProfileModal"
    tabindex="-1"
    aria-labelledby="EditProfileModalLabel"
    aria-hidden="true"
    ref="EditProfileModal"
  >
    <div class="modal-dialog">
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
            @click="handleCancel"
          ></button>
        </div>
        <div class="modal-body">
          <profile-form
            ref="profileForm"
            :userData="userData"
            @profile-updated="handleProfileUpdated"
          />
        </div>
        <ProfileButtons
          :loading="loading"
          @cancel-image="handleCancel"
          @updateimage="handleUpdateImage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import profileForm from "@/components/editProfileElements/TheTopHeaderDropDownMenuProfileEditProfileModalFormItems.vue";
import ProfileButtons from "@/components/editProfileElements/TheTopHeaderDropDownMenuProfileEditProfileModalButtonsItems.vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { getUserById } from "@/plugins/services/authService";
import Cookies from "js-cookie";

export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModal",
  components: {
    ProfileButtons,
    profileForm,
  },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    return { toast, t };
  },
  data() {
    return {
      modalInstance: null,
      loading: false,
      userData: {},
    };
  },
  methods: {
    openEditProfile() {
      try {
        const modal = this.$refs.EditProfileModal;
        this.modalInstance = new Modal(modal);
        this.modalInstance.show();
      } catch (error) {
        console.error("Error opening modal:", error);
        this.toast.error(this.t("error.closeModal"), {
          timeout: 3000,
          id: "edit-profile-error",
          singleton: true,
        });
      }
    },
    closeEditProfile() {
      try {
        const modal = this.$refs.EditProfileModal;
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          document
            .querySelectorAll(".modal-backdrop")
            .forEach((b) => b.remove());
          document.body.classList.remove("modal-open");
        }
      } catch (error) {
        this.toast.error(this.t("error.closeModal"), {
          timeout: 3000,
          id: "edit-profile-close-error",
          singleton: true,
        });
      }
    },
    async submitForm() {
      console.log("🚀 submitForm called in Modal");
      try {
        this.loading = true;

        // Check if profileForm ref exists
        if (!this.$refs.profileForm) {
          console.error("❌ Profile form reference not found");
          throw new Error("Profile form reference not found");
        }

        console.log("✅ Profile form ref found");
        console.log("📄 Selected file:", this.$refs.profileForm.selectedFile);

        // Check if there's a selected file for image update
        if (this.$refs.profileForm.selectedFile) {
          console.log("🖼️ Updating profile image...");
          await this.$refs.profileForm.updateProfileImage();
          this.toast.success(
            this.t("profile.imageUpdatedSuccess") ||
              "Profile image updated successfully!",
            {
              timeout: 3000,
              id: "edit-profile-success",
              singleton: true,
            }
          );
        } else {
          // If no image selected, show message
          console.log("⚠️ No image selected");
          this.toast.info(
            this.t("profile.noImageSelected") || "No image selected to update",
            {
              timeout: 3000,
              id: "edit-profile-info",
              singleton: true,
            }
          );
        }

        // Refresh user data after successful update
        await this.fetchUserData();

        // Close the modal after successful update (only if image was updated)
        if (this.$refs.profileForm.selectedFile) {
          this.closeEditProfile();
        }
      } catch (error) {
        console.error("❌ Error in submitForm:", error);
        this.toast.error(error.message || this.t("errors.updateFailed"), {
          timeout: 3000,
          id: "edit-profile-submit-error",
          singleton: true,
        });
      } finally {
        this.loading = false;
      }
    },
    async fetchUserData() {
      try {
        const response = await getUserById(Cookies.get("user_id"));
        if (response.status !== 200) {
          throw new Error(response.data.message);
        }
        this.userData = response.data.data;
        console.log("User Data:", this.userData);
      } catch (error) {
        this.toast.error(error.message, {
          timeout: 3000,
          id: "fetch-user-data-error",
          singleton: true,
        });
      }
    },
    handleUpdateImage() {
      console.log("🔥 handleUpdateImage called in Modal component!");
      console.log("🔥 About to call submitForm");
      //this.$refs.profileForm.updateProfileImage();
      this.submitForm();
    },
    handleCancel() {
      console.log("🔄 handleCancel called");
      // Call cancel method on profile form if it exists
      if (this.$refs.profileForm && this.$refs.profileForm.cancelUpdate) {
        this.$refs.profileForm.cancelUpdate();
      }
      this.closeEditProfile();
    },
    handleProfileUpdated(updatedData) {
      // Handle when profile is updated
      this.userData = { ...this.userData, ...updatedData };
      console.log("Profile updated:", updatedData);
    },
  },
  mounted() {
    console.log("🎯 Modal component mounted");
    this.fetchUserData();
  },
  created() {
    console.log("🎯 Modal component created");
  },
};
</script>
