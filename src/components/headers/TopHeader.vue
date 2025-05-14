<template>
  <div class="top-bar pe-1 position-relative pt-2 me-2">
    <div class="row">
      <div
        class="col-3 col-md-4 d-flex align-items-center text-white fs-6 pt-1"
      >
        <img
          v-show="user_role === 'sales'"
          class="me-2"
          src="@/assets/new-nokta-logo.png"
          style="width: 40px; height: 40px"
          alt=""
        />
        <span>{{ pageTitle }}</span>
        <router-link
          v-if="
            ($route.path === '/general-settings' ||
              $route.path === '/broadcast-settings') &&
            permissionStore.hasPermission(PERMISSIONS.ROLES_SETTINGS)
          "
          to="/role-settings"
          class="text-decoration-none ms-3 border-3 border-start border-white"
        >
          <span class="text-white px-3">{{
            $t("header-subnav-item-settings-role")
          }}</span>
        </router-link>
        <router-link
          v-if="
            ($route.path === '/role-settings' ||
              $route.path === '/broadcast-settings') &&
            permissionStore.hasPermission(PERMISSIONS.GENERAL_SETTINGS)
          "
          to="/general-settings"
          class="text-decoration-none ms-3 border-3 border-start border-white"
        >
          <span class="text-white px-3">{{
            $t("header-subnav-item-settings-general")
          }}</span>
        </router-link>
        <router-link
          v-if="
            ($route.path === '/general-settings' ||
              $route.path === '/role-settings') &&
            permissionStore.hasPermission(PERMISSIONS.BROADCAST_SETTINGS)
          "
          to="/broadcast-settings"
          class="text-decoration-none ms-3 border-3 border-start border-white"
        >
          <span class="text-white px-3">{{
            $t("header-subnav-item-settings-broadcast")
          }}</span>
        </router-link>
      </div>
      <div
        class="col-3 col-md-3 d-flex justify-content-end align-items-center g-3 pt-0 mt-0"
      >
        <span class="fs-2 text-white">{{ currentTime }}</span>
        <button
          class="border-0 bg-transparent position-relative"
          ref="notifiButton"
          @click="toggleMenu('notifications', $refs.notifiButton)"
        >
          <i class="fa-solid fa-bell fs-4 ms-2 pt-1 text-white"></i>
          <transition name="fade">
            <NotificationsHead
              v-if="activeMenu === 'notifications'"
              :style="listNotifiStyle"
            />
          </transition>
        </button>
      </div>
      <div class="col d-flex justify-content-end align-items-center">
        <div class="user-info d-flex justify-content-end align-items-center">
          <button
            v-if="hasNewChanges"
            class="refresh border-0 d-flex align-items-center gap-2 text-white rounded-2 mt-1 me-2"
            style="padding: 5px 7px"
            @click="refreshPage"
          >
            <i class="fa-solid fa-rotate"></i>
            <span class="refresh-text" style="font-size: 14px">{{
              $t("header-refresh-button")
            }}</span>
          </button>
          <div class="lang">
            <button
              class="btnLang border-0 bg-transparent d-flex align-items-center justify-content-center gap-2 text-white position-relative rounded-2 mt-1"
              @click="toggleLanguage"
            >
              <span
                class=""
                style="font-size: 14px; padding-top: 4px; padding-bottom: 3px"
                >{{ nextLanguage.toUpperCase() }}</span
              >
              <span class="dropdown-icon text-secondary flageImage">
                <img
                  :src="flagIcon"
                  alt="English"
                  style="width: 26px; height: 16px"
                />
              </span>
            </button>
          </div>

          <div class="profile ps-2">
            <button
              type="button"
              class="border-0 bg-transparent d-flex justify-content-end align-items-center text-white position-relative p-0"
              ref="profileButton"
              @click="toggleMenu('profile', $refs.profileButton)"
            >
              <div class="userImg">
                <img
                  :src="userImage || require('@/assets/default-user-image.jpg')"
                  class="img-fluid user-img rounded-5 me-2"
                  alt="user image"
                />
              </div>
              <span class="me-1">{{ name }}</span>
              <i class="fa-solid fa-chevron-down"></i>

              <transition name="fade">
                <MenuProfile
                  v-if="activeMenu === 'profile'"
                  :style="listProfileStyle"
                  @logout="$emit('logout')"
                />
              </transition>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import ListLang from "@/components/headers/sub-menu/ListLang.vue";
import MenuProfile from "@/components/headers/sub-menu/MenuProfile.vue";
import NotificationsHead from "@/components/headers/sub-menu/NotificationsHead.vue";
import Cookies from "js-cookie";
import { changeLanguage } from "@/i18n";
import { useLoadingStore } from "@/plugins/loadingStore";
import { useKanbanStore } from "@/stores/kanbanStore";
import {
  ref,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  computed,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { usePermissionStore, PERMISSIONS } from "@/stores/permissionStore";

export default {
  name: "HeaderComponent",
  components: {
    MenuProfile,
    NotificationsHead,
  },
  data() {
    return {
      activeMenu: null,
      listLangStyle: {},
      listProfileStyle: {},
      listNotifiStyle: {},
      name: Cookies.get("name") || "User",
      userImage: Cookies.get("image") || "",
      currentLanguage: localStorage.getItem("locale") || "en",
    };
  },
  setup() {
    const kanbanStore = useKanbanStore();
    const hasNewChanges = computed(() => kanbanStore.hasNewChanges);
    const user_role = Cookies.get("user_role");
    const loadingStore = useLoadingStore();
    const currentTime = ref("");
    const updateTime = () => {
      const now = new Date();

      currentTime.value = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    };

    let interval;

    const handleRightClick = (event) => {
      event.preventDefault();
      const modalElements = document.querySelectorAll(".modal");
      modalElements.forEach((modal) => {
        if (modal.classList.contains("show")) {
          const closeButton = modal.querySelector('[data-bs-dismiss="modal"]');
          if (closeButton) {
            closeButton.click();
          }
        }
      });
    };

    // upload data
    onMounted(async () => {
      window.addEventListener("contextmenu", handleRightClick);
      updateTime();
      interval = setInterval(updateTime, 1000);
    });
    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    onBeforeUnmount(() => {
      clearInterval(interval);
    });

    // view name page
    const route = useRoute();

    const pageTitle = computed(() => route.meta.title || "CRM Staging");

    watch(route, () => {
      document.title = pageTitle.value;
    });
    const showRoleSettings = computed(() => {
      return route.path === "/general-settings";
    });
    const showGeneralSettings = computed(() => {
      return route.path === "/role-settings";
    });

    const permissionStore = usePermissionStore();
    function refreshPage() {
      kanbanStore.setHasNewChanges(false);
      window.location.reload();
    }
    return {
      currentTime,
      pageTitle,
      showRoleSettings,
      showGeneralSettings,
      permissionStore,
      PERMISSIONS,
      loadingStore,
      user_role,
      refreshPage,
      hasNewChanges,
    };
  },
  methods: {
    async toggleLanguage() {
      const newLang = this.currentLanguage === "en" ? "ar" : "en";

      try {
        this.loadingStore.startLoading();

        const response = await changeLanguage(newLang);
        if (response.status === 200) {
          localStorage.setItem("locale", newLang);
          this.currentLanguage = newLang;

          this.toast.success(response.data.message, { timeout: 3000 });
        } else {
          throw new Error("Error fetching language change");
        }
      } catch (error) {
        console.error("Error changing language:", error);
        this.toast.error("حدث خطأ أثناء حفظ اللغة!", { timeout: 3000 });
      }
    },
    toggleMenu(menu) {
      if (this.activeMenu === menu) {
        this.activeMenu = null;
      } else {
        this.activeMenu = menu;
      }
    },

    handleClickOutside(event) {
      if (
        this.activeMenu &&
        !this.$refs.langButton?.contains(event.target) &&
        !this.$refs.profileButton?.contains(event.target) &&
        !this.$refs.notifiButton?.contains(event.target)
      ) {
        this.activeMenu = null;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    this.currentLanguage = localStorage.getItem("locale") || "en";
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  computed: {
    nextLanguage() {
      return this.currentLanguage === "ar" ? "en" : "ar";
    },
    flagIcon() {
      return this.currentLanguage === "ar"
        ? require("@/assets/flag-usa.png")
        : require("@/assets/Flag_of_Saudi_Arabia.svg");
    },
  },
};
</script>
<style scoped>
.logo-img {
  height: 60px;
}
.user-img {
  min-height: 40px;
  min-width: 40px;
  height: 40px;
  width: 40px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.btn-header {
  background-color: rgba(128, 128, 128, 0.8) !important;
}
.btnLang {
  background-color: hsla(0, 0%, 100%, 0.322) !important;
}
.refresh {
  background-color: white;
  animation: bgrefresh 2s ease-in-out infinite;
}
.refresh i {
  animation: rotateRefresh 5s linear infinite;
}
@keyframes bgrefresh {
  0% {
    background-color: rgb(235, 191, 14);
  }
  50% {
    background-color: hsla(0, 0%, 100%, 0.322);
  }
  100% {
    background-color: rgb(250, 179, 0);
  }
}
@keyframes rotateRefresh {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
