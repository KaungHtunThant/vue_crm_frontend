<template>
  <div class="dropdown-menu my-2 position-absolute d-block end-0 border-0">
    <div
      class="image mt-1 d-flex justify-content-start align-items-center w-100 px-1"
    >
      <div class="profileImage me-1 border border-2 rounded-5">
        <img :src="userImage" class="img-fluid rounded-5" alt="profile image" />
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
    <hr class="my-2" />
    <div class="container-fluid w-100 text-center">
      <p class="text-secondary">
        <small>
          {{ t("header-user-menu-item-client-version") }}: {{ appVersion }}
        </small>
      </p>
      <p class="text-secondary">
        <small>
          {{ t("header-user-menu-item-server-version") }}:
          {{ backendAppVersion }}
        </small>
      </p>
    </div>
  </div>
  <edit-profile-modal ref="editProfileModal" />
  <change-password ref="changePasswordModal" />
  <change-lang ref="changeLangModal" />
  <calender-modal ref="CalenderModal" />
  <custom-background />
</template>
<script>
import Cookies from "js-cookie";
import ProfileMenuItem from "@/components/headers/sub-menu/profileMenuItems/TheTopHeaderDropDownMenuProfileMenuItem.vue";
import EditProfileModal from "@/components/modals/TheTopHeaderDropDownMenuProfileEditProfileModal.vue";
import ChangePassword from "@/components/modals/TheTopHeaderDropDownMenuProfileEditProfileModalChangePasswordModal.vue";
import ChangeLang from "@/components/modals/TheTopHeaderDropDownMenuProfileEditProfileModalChangeLangModal.vue";
import CalenderModal from "@/components/modals/TheTopHeaderDropDownMenuProfileEditProfileModalCalenderModal.vue";
import CustomBackground from "@/components/headers/sub-menu/profileMenuItems/TheTopHeaderDropDownMenuProfileEditProfileModalCustmBackgroundModal.vue";
import { useI18n } from "vue-i18n";
import { Modal } from "bootstrap";
import { ref, onMounted, nextTick, watch, computed } from "vue";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/AuthStore";
import { useUserStore } from "@/stores/UserStore";
import { useSettingStore } from "@/stores/SettingStore";

export default {
  name: "TheTopHeaderDropDownMenuProfile",
  components: {
    ProfileMenuItem,
    EditProfileModal,
    ChangePassword,
    ChangeLang,
    CalenderModal,
    CustomBackground,
  },
  setup() {
    const settingStore = useSettingStore();
    const notificationStore = useNotificationStore();
    const appVersion = process.env.VUE_APP_VERSION || "0.0.0";
    const backendAppVersion = computed(() => settingStore.getBackendAppVersion);
    const isNotificationsEnabled = ref(notificationStore.enabled);
    const { t } = useI18n();
    const authStore = useAuthStore();
    const userStore = useUserStore();
    const userImage = computed(() => userStore.getCurrentUser?.image || "");
    const handleNotificationSwitchClick = async () => {
      try {
        notificationStore.set(isNotificationsEnabled.value);
        if (isNotificationsEnabled.value) {
          notificationStore.success("Notifications enabled");
        } else {
          notificationStore.info("Notifications disabled");
        }
      } catch (err) {
        
        notificationStore.error(err.message);
      }
    };

    watch(
      () => notificationStore.enabled,
      (newVal) => {
        isNotificationsEnabled.value = newVal;
      }
    );
    const notificationSwitch = ref(null);

    const handleSwitchClick = () => {
      nextTick(() => {
        if (notificationSwitch.value) {
          notificationSwitch.value.blur();
        }
      });
    };
    onMounted(() => {
      isNotificationsEnabled.value = notificationStore.enabled;
      if (!backendAppVersion.value) {
        settingStore.fetchServerVersion();
      }
    });

    return {
      t,
      isNotificationsEnabled,
      handleNotificationSwitchClick,
      handleSwitchClick,
      notificationSwitch,
      authStore,
      notificationStore,
      userImage,
      appVersion,
      backendAppVersion,
    };
  },
  data() {
    return {
      name: Cookies.get("name") || "User",
      userEmail: Cookies.get("email") || "test@email",
    };
  },
  methods: {
    async handleLogout() {
      try {
        this.authStore.initLogout();
      } catch (error) {
        
        this.notificationStore.error(error.message, {
          timeout: 3000,
        });
      }
    },
    changeBackground() {
      const modal = new Modal(document.getElementById("customBackgroundModal"));
      modal.show();
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
