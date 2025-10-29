<template>
  <div class="dropdown-menu my-2 position-absolute d-block end-0 border-0">
    <div
      class="image mt-1 d-flex justify-content-start align-items-center w-100 px-1"
    >
      <div class="profileImage me-1 border border-2 rounded-5">
        <img
          :src="userImage || require('@/assets/default-avatar-profile.webp')"
          class="img-fluid rounded-5"
          alt="profile image"
        />
      </div>
      <div class="data w-100">
        <div
          class="profileStatus d-flex justify-content-between align-items-center w-100"
        >
          <span class="">{{ name }}</span>
          <div class="form-check form-switch" @click.stop>
            <input
              ref="customSwitchInput"
              class="form-check-input shadow-none custom-switch"
              style="padding: 10px 20px; cursor: pointer"
              type="checkbox"
              @change="handleSwitchClick"
              checked
            />
          </div>
        </div>
        <!-- <span class="text-secondary userEmail">{{ userEmail }}</span> -->
      </div>
    </div>
    <hr class="my-2" />
    <div class="ms-3 pe-1 d-flex justify-content-between align-items-center">
      <div>
        <i class="fa-solid fa-bell text-secondary"></i>
        <span class="ms-2">{{ t("header-user-menu-item-notification") }}</span>
      </div>
      <div class="form-check form-switch" @click.stop>
        <input
          ref="notificationSwitch"
          type="checkbox"
          v-model="isNotificationsEnabled"
          class="form-check-input shadow-none custom-switch"
          style="padding: 10px 20px; cursor: pointer"
          @change="handleNotificationSwitchClick"
        />
      </div>
    </div>
    <ul class="list-unstyled mb-0 lh-lg">
      <profile-menu-item
        icon="fa-user"
        :title="t('header-user-menu-item-profile')"
        @click="openEditProfileModal"
      />
      <profile-menu-item
        icon="fa-calendar-days"
        :title="t('header-user-menu-item-calendar')"
        @click="openCalenderModal"
      />
      <profile-menu-item
        icon="fa-image"
        :title="t('header-user-menu-item-background')"
        @click="changeBackground"
      />
      <profile-menu-item
        icon="fa-rotate"
        :title="t('header-user-menu-item-refresh')"
        @click="reloadPage"
      />
      <profile-menu-item
        icon="fa-lock"
        :title="t('header-user-menu-item-password')"
        @click="openChangePasswordModal"
      />
      <profile-menu-item
        icon="fa-globe"
        :title="t('header-user-menu-item-language')"
        @click="openChangeLangModal"
      />
      <profile-menu-item
        icon="fa-right-from-bracket"
        :title="t('header-user-menu-item-logout')"
        @click="handleLogout"
      />
    </ul>
  </div>
  <edit-profile ref="editProfileModal" />
  <change-password ref="changePasswordModal" />
  <change-lang ref="changeLangModal" />
  <calender-modal ref="CalenderModal" />
  <custom-background />
</template>
<script>
import Cookies from "js-cookie";
import ProfileMenuItem from "@/components/headers/sub-menu/profileMenuItems/TheTopHeaderDropDownMenuProfileMenuItem.vue";
import EditProfile from "@/components/modals/TheTopHeaderDropDownMenuProfileEditProfileModal.vue";
import ChangePassword from "@/components/modals/TheTopHeaderDropDownMenuProfileEditProfileModalChangePasswordModal.vue";
import ChangeLang from "@/components/modals/TheTopHeaderDropDownMenuProfileEditProfileModalChangeLangModal.vue";
import CalenderModal from "@/components/modals/TheTopHeaderDropDownMenuProfileEditProfileModalCalenderModal.vue";
import CustomBackground from "@/components/headers/sub-menu/profileMenuItems/TheTopHeaderDropDownMenuProfileEditProfileModalCustmBackgroundModal.vue";
// import { useToast } from "vue-toastification";
// import { showSuccess, showError } from "@/plugins/services/toastService";

import { useI18n } from "vue-i18n";
import { Modal } from "bootstrap";
import {
  ref,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";
import { useNotificationStore } from "@/stores/notificationStore";

export default {
  name: "TheTopHeaderDropDownMenuProfile",
  components: {
    ProfileMenuItem,
    EditProfile,
    ChangePassword,
    ChangeLang,
    CalenderModal,
    CustomBackground,
  },
  setup() {
    const notificationStore = useNotificationStore();
    const isNotificationsEnabled = ref(notificationStore.enabled);
    const { t } = useI18n();

    const handleNotificationSwitchClick = async () => {
      try {
        notificationStore.set(isNotificationsEnabled.value);
        if (isNotificationsEnabled.value) {
          notificationStore.success(t("notifications.enabled"));
        } else {
          notificationStore.info(t("notifications.disabled"));
        }
      } catch (err) {
        console.error(err);
        notificationStore.error(t("notifications.error"));
      }
    };

    watch(
      () => notificationStore.enabled,
      (newVal) => {
        isNotificationsEnabled.value = newVal;
      }
    );
    // const toast = useToast();
    // const { t } = useI18n();
    const notificationSwitch = ref(null);
    // const customSwitchInput = ref(null);
    // const isNotificationsEnabled = ref(null);

    const handleSwitchClick = () => {
      nextTick(() => {
        if (notificationSwitch.value) {
          notificationSwitch.value.blur();
        }
      });
    };
    // const handleNotificationSwitchClick = () => {
    //   nextTick(() => {
    //     if (isNotificationsEnabled.value) {
    //       isNotificationsEnabled.value.blur();
    //     }
    //   });
    // };
    onMounted(() => {
      isNotificationsEnabled.value = notificationStore.enabled;
    });

    onUnmounted(() => {
      // ... باقي الـ onUnmounted
    });

    onBeforeUnmount(() => {
      // ... باقي الـ onBeforeUnmount
    });

    return {
      t,
      isNotificationsEnabled,
      handleNotificationSwitchClick,
      handleSwitchClick,
      notificationSwitch,
    };
  },
  data() {
    return {
      name: Cookies.get("name") || "User",
      userEmail: Cookies.get("email") || "test@email",
      userImage: Cookies.get("image") || "",
      notificationStore: useNotificationStore(),
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
        this.$emit("logout");
      } catch (error) {
        console.error("Error logging out:", error);
        this.notificationStore.error(this.t("topHeader.logoutError"), {
          timeout: 3000,
        });
      }
    },
    changeBackground() {
      const modal = new Modal(document.getElementById("customBackgroundModal"));
      modal.show();
    },
    openEditProfileModal() {
      const modal = new Modal(document.getElementById("EditProfileModal"));
      modal.show();
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
  top: 35px;
  right: 100%;
  width: 250px !important;
  min-width: 250px !important;
}
.profileImage img {
  min-width: 45px;
  width: 45px;
  min-height: 45px;
  height: 45px;
}
.dropdown-item {
  cursor: pointer;
}
.userEmail {
  font-size: 14px;
}
@media (max-width: 900px) {
  .userEmail {
    font-size: 12px;
  }
  .profileImage img {
    min-width: 45px;
    width: 45px;
    min-height: 45px;
    height: 45px;
  }
}
</style>
