<template>
  <div class="vh-100 w-100 overflow-hidden bg-light">
    <div class="row h-100">
      <div class="col-10 col-md-5 col-lg-4 m-auto">
        <div class="card">
          <form class="card-body" @submit.prevent="handleLogin">
            <div class="mb-3 text-center">
              <img :src="logo" class="img-fluid profile-image-pic" alt="logo" />
            </div>
            <p v-if="errors.message" class="text-danger text-center">
              {{ errors.message }}
            </p>
            <div class="mb-3" v-show="!otp_phase">
              <label>Email <span class="text-danger">*</span></label>
              <input
                type="email"
                class="form-control"
                v-model="email"
                placeholder="Enter Email"
                required
                @keydown.enter.prevent="handleLogin"
              />
              <p v-if="errors.email" class="text-danger fs-6">
                {{ errors.email }}
              </p>
            </div>
            <div class="mb-3" v-show="!otp_phase">
              <div
                class="d-flex justify-content-between align-items-center pb-1"
              >
                <label>Password <span class="text-danger">*</span></label>
                <a href="#" class="text-decoration-none">Forgot Password?</a>
              </div>
              <input
                type="password"
                class="form-control"
                v-model="password"
                placeholder="Enter Password"
                @keydown.enter.prevent="handleLogin"
              />
              <p v-if="errors.password" class="text-danger fs-6">
                {{ errors.password }}
              </p>
            </div>
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                v-show="otp_phase"
                type="button"
                class="btn btn-link mb-4 end"
                @click="otp_phase = false"
              >
                <i class="fas fa-arrow-left"></i> Back to Login
              </button>
            </div>
            <div class="mb-3" v-show="otp_phase">
              <label>OTP <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="otp_code"
                v-model="otp_code"
                placeholder="Enter OTP"
              />
              <p v-if="errors.otp_code" class="text-danger fs-6">
                {{ errors.otp_code }}
              </p>
            </div>
            <!-- <div class="mb-3" v-show="otp_phase">
              <input
                type="checkbox"
                class="form-check-input shadow-none"
                id="rememberMe"
                v-model="rememberMe"
              />
              <label class="form-check-label ms-2" for="rememberMe">
                Remember Me
              </label>
            </div> -->
            <div class="text-center mb-2" v-show="!otp_phase">
              <button
                type="button"
                class="btn w-100 bg-black text-white"
                @click="handleLogin"
              >
                Login
              </button>
            </div>
            <div class="text-center mb-2" v-show="otp_phase">
              <button type="submit" class="btn w-100 bg-black text-white">
                Submit OTP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "@/plugins/services/authService";
import { getBackgroundId } from "@/plugins/services/backgroundService";
import Cookies from "js-cookie";
import { PERMISSIONS, usePermissionStore } from "@/stores/PermissionStore";
import { useRouter } from "vue-router";
import { initializeTranslations } from "@/i18n";
import { useLoadingStore } from "@/plugins/loadingStore";
import { useSettingStore } from "@/stores/SettingStore";
import { useUserStore } from "@/stores/UserStore";

export default {
  name: "LoginView",
  setup() {
    const permissionStore = usePermissionStore();
    const router = useRouter();
    const loadingStore = useLoadingStore();
    const settingStore = useSettingStore();
    const userStore = useUserStore();

    return {
      PERMISSIONS,
      permissionStore,
      router,
      loadingStore,
      settingStore,
      userStore,
    };
  },

  data() {
    return {
      logo: require("@/assets/" + process.env.VUE_APP_LOGO_NAME),
      email: "",
      password: "",
      rememberMe: false,
      loginSuccess: false,
      errors: {
        email: "",
        password: "",
        message: "",
      },
      otp_code: "",
      otp_phase: false,
    };
  },

  methods: {
    async handleOTP() {
      this.otp_phase = true;
      const otp_code_input = document.getElementById("otp_code");
      this.$nextTick(() => {
        if (otp_code_input) {
          otp_code_input.focus();
        }
      });
    },

    async handleLogin() {
      try {
        this.loadingStore.startLoading();
        this.resetErrors();
        if (!this.validateInputs()) {
          return;
        }
        const response = await login({
          email: this.email,
          password: this.password,
          // otp_code: this.otp_code,
        });

        if (response.status === 200) {
          this.userStore.setCurrentUser(response.data.user);
          const cookieOptions = {
            secure: true,
            sameSite: "Strict",
            path: "/",
            expires: 7,
          };
          Cookies.set("authToken", response.data.token, cookieOptions);
          Cookies.set("name", response.data.user.name, cookieOptions);
          Cookies.set("email", response.data.user.email, cookieOptions);
          Cookies.set("image", response.data.user.image || "", cookieOptions);
          Cookies.set("user_role", response.data.user.role, cookieOptions);
          Cookies.set("user_id", response.data.user.id, cookieOptions);
          Cookies.set("currency", response.data.user.currency, cookieOptions);
          localStorage.setItem(
            "backgroundImage_id",
            response.data.user.bg_image_id
          );
          localStorage.setItem("locale", response.data.user.locale);
          const locale = localStorage.getItem("locale") || "en";
          await initializeTranslations(locale);
          this.$i18n.locale = locale;
          this.email = "";
          this.password = "";
          this.loginSuccess = true;
          let defaultRedirect = "/crm-kanban";
          if (response.data.user.role === "after-sales") {
            defaultRedirect = "/crm-after-sales";
          } else if (response.data.user.role === "emr-admin") {
            defaultRedirect = "/emr-kanban";
          }
          this.permissionStore.setPermissions(response.data.user.permissions);
          this.$emit("loginSuccess");
          let bg_fetch = await getBackgroundId(response.data.user.bg_image_id);
          let imageUrl = bg_fetch.data.data.url;
          document.body.style.backgroundImage = `url(${imageUrl})`;
          document.body.style.backgroundSize = "cover";
          document.body.style.backgroundPosition = "center";
          this.$router.replace(defaultRedirect);
          if (!this.permissionStore.hasPermission(PERMISSIONS.STAY_IDLE)) {
            this.settingStore.startIdleTimer();
            this.settingStore.setupUserActivityListeners();
          }
        } else {
          this.errors.message = response.message;
        }
      } catch (error) {
        this.errors.message = error.message;
        this.otp_code = "";
        this.otp_phase = false;
      }
      this.loadingStore.stopLoading();
    },

    resetErrors() {
      this.errors = {
        email: "",
        password: "",
        message: "",
        otp_code: "",
      };
    },

    validateInputs() {
      let valid = true;

      if (!this.email) {
        this.errors.email = "Email is required.";
        valid = false;
      }

      if (!this.password) {
        this.errors.password = "Password is required.";
        valid = false;
      }

      return valid;
    },

    mounted() {
      if (Cookies.get("authToken")) {
        let defaultRedirect =
          Cookies.get("user_role") === "after-sales"
            ? "/crm-after-sales"
            : "/crm-kanban";
        this.$router.push(defaultRedirect);
      }
    },
  },
};
</script>

<style scoped>
.form-control:focus {
  box-shadow: none;
  border-color: #ced4da;
}

.profile-image-pic {
  height: 80px;
  width: 80px;
}
</style>
