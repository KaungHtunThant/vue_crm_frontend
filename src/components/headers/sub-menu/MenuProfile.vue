<template>
  <div class="dropdown-menu my-2 position-absolute d-block end-0 border-0">
    <div
      class="image my-2 d-flex justify-content-start align-items-center w-100 p-2"
    >
      <div class="profileImage me-2 border border-2 rounded-5">
        <img
          :src="userImage || require('@/assets/default-user-image.jpg')"
          class="img-fluid rounded-5"
          alt="profile image"
        />
      </div>
      <div class="data">
        <span class="">{{ name }}</span
        ><br />
        <span class="text-secondary">{{ userEmail }}</span>
      </div>
    </div>
    <hr />
    <ul class="list-unstyled mb-0 lh-lg">
      <ProfileMenuItem
        icon="fa-user"
        title="Edit Profile"
        @click="openEditProfileModal"
      />
      <ProfileMenuItem
        icon="fa-calendar-days"
        title="Calender"
        @click="openCalenderModal"
      />
      <ProfileMenuItem
        icon="fa-image"
        title="Customize Background"
        @click="changeBackground"
      />
      <ProfileMenuItem icon="fa-rotate" title="Reload" @click="reloadPage" />
      <ProfileMenuItem
        icon="fa-lock"
        title="Change Password"
        @click="openChangePasswordModal"
      />
      <ProfileMenuItem
        icon="fa-globe"
        title="Change Language"
        @click="openChangeLangModal"
      />
      <ProfileMenuItem
        icon="fa-right-from-bracket"
        title="Logout"
        @click="handleLogout"
      />
    </ul>
  </div>
  <EditProfile ref="editProfileModal" />
  <ChangePassword ref="changePasswordModal" />
  <ChangeLang ref="changeLangModal" />
  <CalenderModal ref="CalenderModal" />
</template>
<script>
import Cookies from "js-cookie";
import axiosInstance from "@/plugins/axios";
import ProfileMenuItem from "@/components/headers/sub-menu/profileMenuItems/ProfileMenuItem.vue";
import EditProfile from "@/components/modals/EditProfile.vue";
import ChangePassword from "@/components/modals/ChangePassword.vue";
import ChangeLang from "@/components/modals/ChangeLang.vue";
import CalenderModal from "@/components/modals/CalenderModal.vue";

export default {
  name: "MenuProfile",
  components: {
    ProfileMenuItem,
    EditProfile,
    ChangePassword,
    ChangeLang,
    CalenderModal,
  },
  data() {
    return {
      name: Cookies.get("name") || "User",
      userEmail: Cookies.get("email") || "test@email",
      userImage: Cookies.get("image") || "",
      images: [
        "/images/bg1.jpg",
        "/images/bg2.jpg",
        "/images/bg3.jpg",
        "/images/bg4.jpg",
        "/images/bg5.jpg",
        "/images/bg6.jpg",
        "/images/bg7.jpg",
        "/images/bg8.jpg",
        "/images/bg9.jpg",
        "/images/bg10.jpg",
        "/images/bg11.jpg",
        "/images/bg12.jpg",
      ],
    };
  },
  methods: {
    async handleLogout() {
      try {
        Cookies.remove("authToken");
        Cookies.remove("name");
        Cookies.remove("image");
        Cookies.remove("email");

        delete axiosInstance.defaults.headers["Authorization"];

        this.$emit("logout");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
    changeBackground() {
      const randomImage =
        this.images[Math.floor(Math.random() * this.images.length)];

      document.body.style.backgroundImage = `url(${randomImage})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";

      localStorage.setItem("backgroundImage", randomImage);
    },
    openEditProfileModal() {
      this.$refs.editProfileModal.openEditProfile();
    },
    openChangePasswordModal() {
      this.$refs.changePasswordModal.openChangePassword();
    },
    openChangeLangModal() {
      this.$refs.changeLangModal.openChangeLang();
    },
    openCalenderModal() {
      this.$refs.CalenderModal.openCalenderModal();
    },
    reloadPage() {
      location.reload();
    },
  },
};
</script>
<style scoped>
.dropdown-menu {
  top: 40px;
  left: -105px;
  width: fit-content !important;
}
.profileImage img {
  width: 55px;
  height: 55px;
}
.dropdown-item {
  cursor: pointer;
}
</style>
