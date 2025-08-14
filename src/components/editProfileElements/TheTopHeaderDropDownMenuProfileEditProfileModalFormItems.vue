<template>
  <div class="mb-3">
    <!-- <label for="profileImage" class="form-label">الصورة الشخصية</label> -->
    <div class="my-2 text-center">
      <img
        :src="localImage"
        class="img-fluid rounded"
        width="100"
        height="100"
        alt="Profile Image"
        style="
          object-fit: cover;
          display: block;
          margin: 0 auto;
          border: 2px solid #ddd;
        "
        @load="onImageLoad"
        @error="onImageError"
      />
    </div>
    <input
      type="file"
      class="form-control"
      id="profileImage"
      @change="updateImage"
      accept="image/*"
    />
    <small class="form-text text-muted">
      {{
        t(
          "profile-image-hint",
          "Supported formats: JPEG, PNG, JPG, GIF. Max size: 2MB"
        )
      }}
    </small>
  </div>
  <div class="mb-3">
    <label for="name" class="form-label">{{
      t("header-user-menu-item-profile-modal-label-name")
    }}</label>
    <input
      type="text"
      class="form-control"
      placeholder="User Name"
      id="name"
      v-model="localName"
      readonly
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
      id="email"
      v-model="localEmail"
      readonly
    />
  </div>

  <div v-if="errorMessage" class="alert alert-danger">
    {{ errorMessage }}
  </div>
  <div v-if="successMessage" class="alert alert-success">
    {{ successMessage }}
  </div>
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Cookies from "js-cookie";
import {
  profileimage,
  updateProfileImage,
} from "@/plugins/services/authService";

export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModalFormItems",
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const localUserData = ref(props.userData);
    return { t, localUserData };
  },
  data() {
    return {
      localName: "",
      localEmail: "",
      localImage: require("@/assets/default-user-image.jpg"),
      selectedFile: null,
      uploading: false,
      errorMessage: "",
      successMessage: "",
      mediaId: null,
    };
  },
  methods: {
    updateImage(event) {
      const file = event.target.files[0];
      if (file?.type?.startsWith("image/")) {
        if (file.size > 2 * 1024 * 1024) {
          this.errorMessage = this.t(
            "image-size-error",
            "Image size must be less than 2MB"
          );
          this.successMessage = "";
          return;
        }
        this.selectedFile = file;
        this.errorMessage = "";
        this.successMessage = "";
        const reader = new FileReader();
        reader.onload = (e) => {
          this.localImage = e.target.result;
          this.$forceUpdate();
        };
        reader.readAsDataURL(file);
      }
    },

    async updateProfileImage() {
      console.log(
        "updateProfileImage called, selectedFile:",
        this.selectedFile
      );
      if (!this.selectedFile) {
        this.errorMessage = this.t(
          "select-image-first",
          "Please select an image first"
        );
        return;
      }

      this.uploading = true;
      this.errorMessage = "";
      this.successMessage = "";

      try {
        const formData = new FormData();
        formData.append("image", this.selectedFile);

        const response = await updateProfileImage(formData);

        if (response.data && response.data.data) {
          this.successMessage = this.t(
            "image-updated-success",
            "Profile image updated successfully!"
          );

          // Get the new avatar ID from response
          const newAvatarId =
            response.data.data.id || response.data.data.avatar_id;
          const userId = Cookies.get("user_id");

          // Update cookies with new avatar ID
          if (newAvatarId) {
            Cookies.set("avatar", newAvatarId);
          }

          // Clear old cached image
          if (userId) {
            localStorage.removeItem(`profile_image_${userId}`);
            localStorage.removeItem(`profile_image_id_${userId}`);
          }

          // If we have a direct URL, use it and cache it
          if (response.data.data.url) {
            this.localImage = response.data.data.url;

            // Optionally, download and cache the new image
            if (newAvatarId && userId) {
              try {
                const newImageResponse = await this.downloadAndCacheImage(
                  newAvatarId,
                  userId
                );
                if (newImageResponse) {
                  this.localImage = newImageResponse;
                }
              } catch (cacheError) {
                console.warn("Failed to cache new image:", cacheError);
                // Continue using the URL from response
              }
            }
          } else if (newAvatarId && userId) {
            // If no direct URL, download the new image
            try {
              const newImageBase64 = await this.downloadAndCacheImage(
                newAvatarId,
                userId
              );
              if (newImageBase64) {
                this.localImage = newImageBase64;
              }
            } catch (downloadError) {
              console.error("Failed to download new image:", downloadError);
              this.errorMessage = this.t(
                "image-download-failed",
                "Image updated but failed to display. Please refresh the page."
              );
            }
          }

          // Emit updated user data to parent component
          this.$emit("profile-updated", {
            ...this.userData,
            avatar: newAvatarId,
            profile_image_url: response.data.data.url,
            profile_image_thumb: response.data.data.thumbnail,
            profile_image_small: response.data.data.small,
          });

          this.selectedFile = null;
          document.getElementById("profileImage").value = "";
          console.log("Image updated successfully");
          return response.data;
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Update error:", error);
        this.errorMessage =
          error.response?.data?.message ||
          this.t("update-failed", "Failed to update image. Please try again.");
      } finally {
        this.uploading = false;
      }
    },

    cancelUpdate() {
      console.log("This buttons is triggered");
      this.selectedFile = null;
      const userId = Cookies.get("user_id");
      const cachedImage = localStorage.getItem(`profile_image_${userId}`);

      if (cachedImage) {
        // Ensure the cached image has the data URL format
        if (cachedImage.startsWith("data:image/")) {
          this.localImage = cachedImage;
        } else {
          this.localImage = `data:image/jpeg;base64,${cachedImage}`;
        }
      } else {
        this.localImage =
          this.userData?.profile_image_url ||
          require("@/assets/default-user-image.jpg");
      }

      document.getElementById("profileImage").value = "";
      this.errorMessage = "";
      this.successMessage = "";
    },

    clearMessages() {
      setTimeout(() => {
        this.errorMessage = "";
        this.successMessage = "";
      }, 5000);
    },

    blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    },

    // Updated method to handle both blob and string responses
    async downloadAndCacheImage(avatarId, userId) {
      try {
        const profileImageResponse = await profileimage(avatarId, {
          responseType: "blob",
        });

        console.log("Response type:", typeof profileImageResponse.data);
        console.log("Is Blob:", profileImageResponse.data instanceof Blob);

        let base64Image;

        // Handle different response formats
        if (typeof profileImageResponse.data === "string") {
          // Convert binary string to Uint8Array
          const binaryString = profileImageResponse.data;
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Determine MIME type from response headers
          const contentType =
            profileImageResponse.headers?.["content-type"] || "image/jpeg";

          // Create blob from binary data
          const imageBlob = new Blob([bytes], { type: contentType });
          base64Image = await this.blobToBase64(imageBlob);
        } else if (profileImageResponse.data instanceof Blob) {
          // Handle proper Blob response
          base64Image = await this.blobToBase64(profileImageResponse.data);
        } else {
          throw new Error("Unexpected response format");
        }

        // Cache the image
        localStorage.setItem(`profile_image_${userId}`, base64Image);
        localStorage.setItem(`profile_image_id_${userId}`, avatarId);

        return base64Image;
      } catch (error) {
        console.error("Failed to download and cache image:", error);
        return null;
      }
    },

    // Method to refresh profile image if needed
    async refreshProfileImage() {
      const userId = Cookies.get("user_id");
      const avatarId = Cookies.get("avatar");

      if (userId && avatarId) {
        const base64Image = await this.downloadAndCacheImage(avatarId, userId);
        if (base64Image) {
          this.localImage = base64Image;
          console.log("Profile image refreshed");
        }
      }
    },

    // Method to clear image cache (useful for logout)
    clearImageCache() {
      const userId = Cookies.get("user_id");
      if (userId) {
        localStorage.removeItem(`profile_image_${userId}`);
        localStorage.removeItem(`profile_image_id_${userId}`);
      }
    },
  },

  async mounted() {
    try {
      const userId = Cookies.get("user_id");
      const avatarId = Cookies.get("avatar");

      console.log("User ID:", userId, "Avatar ID:", avatarId);

      if (userId) {
        // Try to get cached profile image first
        const cachedImage = localStorage.getItem(`profile_image_${userId}`);

        if (cachedImage) {
          console.log("Using cached profile image");
          console.log(
            "Cached image starts with:",
            cachedImage.substring(0, 30)
          );
          console.log("Cached image length:", cachedImage.length);

          // Ensure the cached image has the data URL format
          if (cachedImage.startsWith("data:image/")) {
            this.localImage = cachedImage;
          } else {
            console.warn("Cached image missing data URL prefix, fixing...");
            this.localImage = `data:image/jpeg;base64,${cachedImage}`;
          }
        } else if (avatarId) {
          // If no cached image, try to download it
          console.log("No cached image found, downloading...");
          const base64Image = await this.downloadAndCacheImage(
            avatarId,
            userId
          );

          if (base64Image) {
            this.localImage = base64Image;
            console.log("Profile image downloaded and cached");
          } else {
            console.log("Failed to download image, using default");
            this.localImage = require("@/assets/default-user-image.jpg");
          }
        } else {
          console.log("No avatar ID found");
          this.localImage = require("@/assets/default-user-image.jpg");
        }

        // Set other profile data
        this.localName = Cookies.get("name");
        this.localEmail = Cookies.get("email");
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
      this.localImage = require("@/assets/default-user-image.jpg");
    }
  },

  watch: {
    userData(newVal) {
      console.log("User Data Updated:", newVal);
      this.localName = newVal.name;
      this.localEmail = newVal.email;

      // Only update image from userData if we don't have a cached version
      const userId = Cookies.get("user_id");
      const cachedImage = localStorage.getItem(`profile_image_${userId}`);

      if (!cachedImage) {
        this.localImage =
          newVal.profile_image_url && newVal.profile_image_url !== ""
            ? newVal.profile_image_url
            : require("@/assets/default-user-image.jpg");
      }
    },
  },
};
</script>

<style scoped>
select:focus,
input:focus {
  box-shadow: none;
  outline: none;
}
</style>
