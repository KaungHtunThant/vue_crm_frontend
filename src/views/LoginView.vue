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
            <div class="mb-3">
              <label>Email <span class="text-danger">*</span></label>
              <input
                type="email"
                class="form-control"
                v-model="email"
                placeholder="Enter Email"
                required
              />
              <p v-if="errors.email" class="text-danger fs-6">
                {{ errors.email }}
              </p>
            </div>
            <div class="mb-3">
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
              />
              <p v-if="errors.password" class="text-danger fs-6">
                {{ errors.password }}
              </p>
            </div>

            <div class="mb-3">
              <input
                type="checkbox"
                class="form-check-input shadow-none"
                id="rememberMe"
                v-model="rememberMe"
              />
              <label class="form-check-label ms-2" for="rememberMe">
                Remember Me
              </label>
            </div>
            <div class="text-center mb-2">
              <button type="submit" class="btn w-100 bg-black text-white">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBackgroundId, login } from "@/plugins/services/authService";
import Cookies from "js-cookie";
import { usePermissionStore } from "@/stores/PermissionStore";
import { useRouter } from "vue-router";
import { initializeTranslations } from "@/i18n";
import { useLoadingStore } from "@/plugins/loadingStore";

export default {
  name: "LoginView",
  setup() {
    const permissionStore = usePermissionStore();
    const router = useRouter();
    const loadingStore = useLoadingStore();

    return {
      permissionStore,
      router,
      loadingStore,
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
    };
  },

  methods: {
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
        });

        if (response.data.token) {
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
          localStorage.setItem(
            "backgroundImage_id",
            response.data.user.bg_image_id
          );
          localStorage.setItem("locale", response.data.user.locale);
          const locale = localStorage.getItem("locale") || "en";
          console.log("Locale:", locale);
          await initializeTranslations(locale);
          this.$i18n.locale = locale;
          this.email = "";
          this.password = "";
          this.loginSuccess = true;
          let defaultRedirect =
            response.data.user.role === "after-sales"
              ? "/crm-after-sales"
              : "/crm-kanban";
          console.log("Default Redirect:", defaultRedirect);
          this.permissionStore.setPermissions(response.data.user.permissions);
          this.$emit("loginSuccess");
          let bg_fetch = await getBackgroundId(response.data.user.bg_image_id);
          let imageUrl = bg_fetch.data.data.url;
          document.body.style.backgroundImage = `url(${imageUrl})`;
          document.body.style.backgroundSize = "cover";
          document.body.style.backgroundPosition = "center";
          this.$router.replace(defaultRedirect);
        } else {
          this.errors.message = "Invalid email or password.";
        }
      } catch (error) {
        console.error("Login failed:", error);
        this.errors.message = "Login failed. Please try again.";
        this.email = "";
        this.password = "";
      }
      this.loadingStore.stopLoading();
    },

    resetErrors() {
      this.errors = {
        email: "",
        password: "",
        message: "",
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
