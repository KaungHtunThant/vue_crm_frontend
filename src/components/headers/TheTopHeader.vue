<template>
  <div class="top-bar pe-1 position-relative pt-1 me-2">
    <div class="row">
      <div class="col-4 d-flex align-items-center text-white fs-6">
        <!-- v-show="user_role === 'sales'" -->

        <img class="me-2 rounded-1 p-1 btnHeaderBg" :src="logo" alt="" />
        <span
          class="rounded-1 btnHeaderBg d-flex justify-content-center align-items-center me-2"
          style="font-size: 14px; padding: 0 45px"
          >{{ $t($route.meta.titleKey || "sidebar-heading") }}</span
        >

        <div class="toggleMenuBar position-relative">
          <div
            ref="menuButton"
            class="btnShowMenu px-3 rounded-1 text-white d-flex justify-content-center align-items-center gap-1 btnHeaderBg"
            @click="showMainMenu"
          >
            <i :class="currentPageIcon"></i>
          </div>
          <transition name="dropdown-fade">
            <div
              v-if="showDropdown"
              ref="dropdownMenu"
              class="dropdown-menu-custom"
            >
              <router-link
                to="/crm-kanban"
                class="text-decoration-none text-black mb-2"
                @click="closeDropdown"
              >
                <div class="dropdown-link">
                  <div
                    class="sidebar-item d-flex align-items-center"
                    :title="$t('sidebar-nav-item-kanban')"
                  >
                    <i class="fa-solid fa-chart-line fs-5 me-2"></i>
                    <span>{{ $t("sidebar-nav-item-kanban") }}</span>
                  </div>
                </div>
              </router-link>
              <router-link
                v-if="permissionStore.hasPermission(PERMISSIONS.DEALS_LIST)"
                to="/crmlist"
                class="text-decoration-none text-black mb-2"
                @click="closeDropdown"
              >
                <div class="dropdown-link">
                  <div
                    class="sidebar-item d-flex align-items-center"
                    :title="$t('sidebar-nav-item-crmlist')"
                  >
                    <i class="fa-solid fa-table-list fs-5 me-2"></i>
                    <span>{{ $t("sidebar-nav-item-crmlist") }}</span>
                  </div>
                </div>
              </router-link>
              <router-link
                to="/crm-tasks"
                class="text-decoration-none text-black mb-2"
                @click="closeDropdown"
              >
                <div class="dropdown-link">
                  <div
                    class="sidebar-item d-flex align-items-center"
                    :title="$t('header-subnav-item-kanban-tasks')"
                  >
                    <i class="fa-solid fa-chart-simple fs-5 me-2"></i>
                    <span>{{ $t("header-subnav-item-kanban-tasks") }}</span>
                  </div>
                </div>
              </router-link>
              <router-link
                to="/crm-after-sales"
                class="text-decoration-none text-black mb-2"
                @click="closeDropdown"
              >
                <div class="dropdown-link">
                  <div
                    class="sidebar-item d-flex align-items-center"
                    :title="$t('sidebar-nav-item-after-sales-kanban')"
                  >
                    <i class="fa-solid fa-chart-simple fs-5 me-2"></i>
                    <span>{{ $t("sidebar-nav-item-after-sales-kanban") }}</span>
                  </div>
                </div>
              </router-link>
              <router-link
                v-if="permissionStore.hasPermission(PERMISSIONS.USERS)"
                to="/users"
                class="text-decoration-none text-black mb-2"
                @click="closeDropdown"
              >
                <div class="dropdown-link">
                  <div
                    class="sidebar-item d-flex align-items-center"
                    :title="$t('sidebar-nav-item-users')"
                  >
                    <i class="fa-solid fa-users fs-5 me-2"></i>
                    <span>{{ $t("sidebar-nav-item-users") }}</span>
                  </div>
                </div>
              </router-link>
              <router-link
                v-if="permissionStore.hasPermission(PERMISSIONS.USERS)"
                to="/approvals"
                class="text-decoration-none text-black mb-2"
                @click="closeDropdown"
              >
                <div class="dropdown-link">
                  <div
                    class="sidebar-item d-flex align-items-center"
                    :title="$t('sidebar-nav-item-approvals')"
                  >
                    <i class="fa-solid fa-stamp fs-5 me-2"></i>
                    <span>{{ $t("sidebar-nav-item-approvals") }}</span>
                  </div>
                </div>
              </router-link>
              <router-link
                v-if="permissionStore.hasPermission(PERMISSIONS.CONTACTS)"
                to="/contacts"
                class="text-decoration-none text-black mb-2"
                @click="closeDropdown"
              >
                <div class="dropdown-link">
                  <div
                    class="sidebar-item d-flex align-items-center"
                    :title="$t('sidebar-nav-item-contacts')"
                  >
                    <i class="fa-regular fa-address-book fs-5 me-2"></i>
                    <span>{{ $t("sidebar-nav-item-contacts") }}</span>
                  </div>
                </div>
              </router-link>
              <router-link
                v-if="permissionStore.hasPermission(PERMISSIONS.DOCUMENTS)"
                to="/documents"
                class="text-decoration-none text-black mb-2"
                @click="closeDropdown"
              >
                <div class="dropdown-link">
                  <div
                    class="sidebar-item d-flex align-items-center"
                    :title="$t('sidebar-nav-item-documents')"
                  >
                    <i class="fa-regular fa-folder-open fs-5 me-2"></i>
                    <span>{{ $t("sidebar-nav-item-documents") }}</span>
                  </div>
                </div>
              </router-link>
              <router-link
                v-if="permissionStore.hasPermission(PERMISSIONS.DASHBOARD)"
                to="/dashboard"
                class="text-decoration-none text-black mb-2"
                @click="closeDropdown"
              >
                <div class="dropdown-link">
                  <div
                    class="sidebar-item d-flex align-items-center"
                    :title="$t('sidebar-nav-item-dashboard')"
                  >
                    <i class="fa-solid fa-chart-pie fs-5 me-2"></i>

                    <span>{{ $t("sidebar-nav-item-dashboard") }}</span>
                  </div>
                </div>
              </router-link>
              <router-link
                v-if="
                  permissionStore.hasPermission(PERMISSIONS.GENERAL_SETTINGS)
                "
                to="/general-settings"
                class="text-decoration-none text-black mb-2"
                @click="closeDropdown"
              >
                <div class="dropdown-link">
                  <div
                    class="sidebar-item d-flex align-items-center"
                    :title="$t('sidebar-nav-item-settings')"
                  >
                    <i class="fa-solid fa-cog fs-5 me-2"></i>
                    <span>{{ $t("sidebar-nav-item-settings") }}</span>
                  </div>
                </div>
              </router-link>
              <router-link
                v-if="
                  permissionStore.hasPermission(PERMISSIONS.GENERAL_SETTINGS)
                "
                to="/stage-settings"
                class="text-decoration-none text-black mb-2"
                @click="closeDropdown"
              >
                <div class="dropdown-link">
                  <div
                    class="sidebar-item d-flex align-items-center"
                    :title="$t('sidebar-nav-item-rules')"
                  >
                    <i class="fa-solid fa-sliders fs-5 me-2"></i>
                    <span>{{ $t("sidebar-nav-item-rules") }}</span>
                  </div>
                </div>
              </router-link>
              <router-link
                v-if="
                  permissionStore.hasPermission(PERMISSIONS.GENERAL_SETTINGS)
                "
                to="/patient-registration"
                class="text-decoration-none text-black mb-2"
                @click="closeDropdown"
              >
                <div class="dropdown-link">
                  <div
                    class="sidebar-item d-flex align-items-center"
                    :title="$t('sidebar-nav-item-settings')"
                  >
                    <i class="fa-solid fa-user-group fs-5 me-2"></i>
                    <span>Patient Reg...</span>
                  </div>
                </div>
              </router-link>
              <router-link
                v-if="permissionStore.hasPermission(PERMISSIONS.EMRKANBAN)"
                to="/emr-kanban"
                class="text-decoration-none text-black mb-2"
                @click="closeDropdown"
              >
                <div class="dropdown-link">
                  <div
                    class="sidebar-item d-flex align-items-center"
                    :title="$t('sidebar-nav-item-emr-kanban')"
                  >
                    <i class="fa-regular fa-folder-open fs-5 me-2"></i>
                    <span>{{ $t("sidebar-nav-item-emr-kanban") }}</span>
                  </div>
                </div>
              </router-link>
            </div>
          </transition>
        </div>
      </div>
      <div
        class="col-4 d-flex justify-content-center align-items-center pt-0 mt-0"
      >
        <button
          class="border-0 btnHeaderBg position-relative rounded-1 px-3 me-2"
          ref="notifiButton"
          @click="toggleMenu('notifications', $refs.notifiButton)"
        >
          <i class="fa-solid fa-bell fs-5 text-white"></i>
          <transition name="fade">
            <notifications-head
              v-if="activeMenu === 'notifications'"
              :style="listNotifiStyle"
            />
          </transition>
        </button>
        <button
          v-if="hasNewChanges"
          class="refresh border-0 d-flex align-items-center gap-2 text-white rounded-1 me-2 h-100 px-2"
          style="font-size: 14px"
          @click="refreshPage"
        >
          <i class="fa-solid fa-rotate"></i>
          <span class="refresh-text">{{ $t("header-refresh-button") }}</span>
        </button>
        <span
          v-else
          class="fs-4 text-white btnHeaderBg d-flex justify-content-center align-items-center px-4 rounded-1 me-2"
          >{{ currentTime }}</span
        >
        <div
          class="btnHeaderBg px-3 text-white d-flex justify-content-center align-items-center rounded-1"
        >
          <i class="fa-solid fa-calendar-days"></i>
        </div>
      </div>
      <div class="col-4 d-flex justify-content-end align-items-center">
        <div
          class="user-info d-flex justify-content-end align-items-center h-100"
        >
          <div
            class="btnHeaderBg userImg d-flex justify-content-center align-items-center px-2 rounded-1 me-2"
          >
            <img
              :src="
                userImage || require('@/assets/default-avatar-profile.webp')
              "
              class="img-fluid user-img rounded-5 me-1"
              alt="user image"
            />
          </div>
          <div
            class="d-flex justify-content-center align-items-center btnHeaderBg rounded-1 px-4"
          >
            <ScoureUser />
            <span class="me-1 text-white pt-1" style="font-size: 12px">{{
              name
            }}</span>
          </div>
          <div class="profile ps-2">
            <button
              type="button"
              class="border-0 btnHeaderBg d-flex justify-content-end align-items-center text-white position-relative px-3 rounded-1"
              ref="profileButton"
              @click="toggleMenu('profile', $refs.profileButton)"
            >
              <i class="fa-solid fa-bars"></i>

              <transition name="fade">
                <menu-profile
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
import MenuProfile from "@/components/headers/sub-menu/TheTopHeaderDropDownMenuProfile.vue";
import NotificationsHead from "@/components/headers/sub-menu/TheTopHeaderNotificationsHeader.vue";
import Cookies from "js-cookie";
import { changeLanguage } from "@/i18n";
import { useLoadingStore } from "@/plugins/loadingStore";
import { useKanbanStore } from "@/stores/KanbanStore";
import ScoureUser from "@/components/headers/ScoureUser.vue";
import {
  ref,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  computed,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { usePermissionStore, PERMISSIONS } from "@/stores/PermissionStore";
import { useI18n } from "vue-i18n";

export default {
  name: "TheTopHeader",
  components: {
    MenuProfile,
    NotificationsHead,
    ScoureUser,
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
      showDropdown: false,
    };
  },
  setup() {
    const kanbanStore = useKanbanStore();
    const hasNewChanges = computed(() => kanbanStore.hasNewChanges);
    const user_role = Cookies.get("user_role");
    const loadingStore = useLoadingStore();
    const currentTime = ref("");
    const { t, locale } = useI18n();
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
    const logo = require("@/assets/" + process.env.VUE_APP_LOGO_NAME);
    return {
      logo,
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
      t,
      locale,
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
        this.activeMenu === "profile" &&
        this.$refs.profileButton &&
        !this.$refs.profileButton.contains(event.target)
      ) {
        this.activeMenu = null;
      }

      if (
        this.activeMenu === "notifications" &&
        this.$refs.notifiButton &&
        !this.$refs.notifiButton.contains(event.target)
      ) {
        this.activeMenu = null;
      }

      if (
        this.showDropdown &&
        this.$refs.dropdownMenu &&
        !this.$refs.dropdownMenu.contains(event.target) &&
        this.$refs.menuButton &&
        !this.$refs.menuButton.contains(event.target)
      ) {
        this.showDropdown = false;
      }
    },
    showMainMenu() {
      this.showDropdown = !this.showDropdown;
      if (this.showDropdown) {
        document.addEventListener("mousedown", this.handleClickOutside);
      } else {
        document.removeEventListener("mousedown", this.handleClickOutside);
      }
    },
    closeDropdown() {
      this.showDropdown = false;
      document.removeEventListener("mousedown", this.handleClickOutside);
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
    currentPageIcon() {
      const route = this.$route.path;
      const icons = {
        "/crm-kanban": "fa-solid fa-bars",
        "/crmlist": "fa-solid fa-table-list",
        "/users": "fa-solid fa-users",
        "/contacts": "fa-regular fa-address-book",
        "/documents": "fa-regular fa-folder-open",
        "/dashboard": "fa-solid fa-chart-pie",
        "/general-settings": "fa-solid fa-cog",
        "/stage-settings": "fa-solid fa-sliders",
        "/patient-registration": "fa-solid fa-user-group",
        "/broadcast-settings": "fa-solid fa-broadcast-tower",
      };
      return icons[route] || "fa-solid fa-bars";
    },
  },
};
</script>
<style scoped>
.top-bar {
  max-height: 40px !important;
  height: 40px !important;
}
.logo-img {
  height: 60px;
}
.user-img {
  min-height: 30px;
  min-width: 30px;
  height: 30px;
  width: 30px;
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
.btn-menu {
  background-color: rgba(128, 128, 128, 0.458) !important;
}
.btnLang {
  background-color: hsla(0, 0%, 100%, 0.322) !important;
}
.refresh {
  background-color: #555555;
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
    background-color: hsla(0, 0%, 44%, 0.322);
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

/* main menu dropdown */

.toggleMenuBar {
  position: relative;
  display: inline-block;
}
.toggleMenuBar .btnShowMenu {
  cursor: pointer;
}
.dropdown-menu-custom {
  position: absolute;
  top: 45px !important;
  right: -10px;
  min-width: 230px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
  padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: dropdownIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-menu-custom .router-link,
.dropdown-menu-custom .dropdown-link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.3rem 1.3rem;
  color: #222;
  text-decoration: none;
  font-weight: 500;
  border-radius: 10px;
  background: transparent;
  position: relative;
  transition: background 0.22s, color 0.22s, box-shadow 0.22s;
  box-shadow: none;
}

.dropdown-menu-custom .router-link:not(:last-child),
.dropdown-menu-custom .dropdown-link:not(:last-child) {
  margin-bottom: 0.15rem;
}

.dropdown-menu-custom .router-link:hover,
.dropdown-menu-custom .dropdown-link:hover {
  background: linear-gradient(90deg, #e3f0ff 0%, #f7faff 100%);
  color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
}

.dropdown-menu-custom .router-link:hover::after,
.dropdown-menu-custom .dropdown-link:hover::after {
  content: "\f054"; /* FontAwesome arrow-right */
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  font-size: 0.9em;
  color: #1976d2;
  margin-left: auto;
  transition: opacity 0.2s, transform 0.2s;
  opacity: 1;
  transform: translateX(4px);
}

.dropdown-menu-custom .router-link::after,
.dropdown-menu-custom .dropdown-link::after {
  content: "";
  opacity: 0;
  margin-left: auto;
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-18px) scale(0.95);
}
.dropdown-fade-enter-to,
.dropdown-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.fs-75 {
  font-size: 0.75rem;
}
@media (max-width: 600px) {
  .dropdown-menu-custom {
    min-width: 140px;
    font-size: 15px;
    left: 0;
    right: auto;
    padding: 0.7rem 0.2rem 0.7rem 0.2rem;
    border-radius: 10px;
  }
  .dropdown-menu-custom .router-link,
  .dropdown-menu-custom .dropdown-link {
    padding: 0.7rem 0.7rem;
    font-size: 15px;
  }
}

.menu-anim-icon {
  display: inline-block;
  transition: transform 0.8s cubic-bezier(0.4, 2, 0.6, 1), opacity 0.5s;
}
.menu-anim-icon.fa-xmark {
  transform: rotate(90deg) scale(1.1);
  opacity: 1;
}
.menu-anim-icon.fa-bars-staggered {
  transform: rotate(0deg) scale(1);
  opacity: 1;
}
.btnHeaderBg {
  height: 38px;
  display: flex;
  align-items: center;
  background-color: #55555551;
  transition: 0.5s ease-in-out;
}
.btnHeaderBg:hover {
  background-color: #55555590;
  transition: 0.5s ease-in-out;
}
</style>
