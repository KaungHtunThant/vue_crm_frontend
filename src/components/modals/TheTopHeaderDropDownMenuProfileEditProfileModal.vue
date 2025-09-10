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
            <profile-form :userData="userData" />
          </div>
          <profile-buttons :loading="loading" @close="closeEditProfile" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import ProfileForm from "@/components/editProfileElements/TheTopHeaderDropDownMenuProfileEditProfileModalFormItems.vue";
import ProfileButtons from "@/components/editProfileElements/TheTopHeaderDropDownMenuProfileEditProfileModalButtonsItems.vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { getUserById, updateUser } from "@/plugins/services/authService";
import Cookies from "js-cookie";
export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModal",
  components: { ProfileForm, ProfileButtons },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    return { toast, t };
  },
  data() {
    return {
      modalInstance: null,
      loading: false,
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
        }
        document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
          backdrop.remove();
        });
        document.body.classList.remove("modal-open");
      } catch (error) {
        this.toast.error(this.t("error.closeModal"), {
          timeout: 3000,
          id: "edit-profile-close-error",
          singleton: true,
        });
      }
    },
    async submitForm() {
      try {
        this.loading = true;
        const form = this.$refs.EditProfileForm;
        const formData = new FormData(form);
        const name_en = formData.get("name_en");
        const name_ar = formData.get("name_ar");
        const email = formData.get("email");
        const image = formData.get("image");

        const response = await updateUser({
          name_en,
          name_ar,
          email,
          image,
        });
        if (response.status !== 200) {
          throw new Error(response.data.message);
        }
        // هنا يتم إضافة المنطق الخاص بحفظ البيانات
        this.toast.success(response.data.message, {
          timeout: 3000,
          id: "edit-profile-success",
          singleton: true,
        });
        this.closeEditProfile();
      } catch (error) {
        this.toast.error(error.message, {
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
  },
  mounted() {
    this.fetchUserData();
  },
};
</script>
