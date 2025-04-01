<template>
  <div class="vh-100 w-100 overflow-hidden bg-light">
    <div class="row h-100">
      <div class="col-10 col-md-5 col-lg-4 m-auto">
        <div class="card">
          <form class="card-body" @submit.prevent="handleLogin">
            <div class="mb-3 text-center">
              <img
                src="../../public/images/new-nokta-logo.png"
                class="img-fluid profile-image-pic"
                alt="logo"
              />
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
import { login } from "@/plugins/services/authService";
import Cookies from "js-cookie";
import { usePermissionStore } from "@/stores/permissionStore";
import { useRouter } from "vue-router";
import { initializeTranslations } from "@/i18n";
// import axiosInstance from "@/plugins/axios";

export default {
  name: "LoginView",
  setup() {
    const permissionStore = usePermissionStore();
    const router = useRouter();

    return {
      permissionStore,
      router,
    };
  },
  data() {
    return {
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
          Cookies.set("id", response.data.user.id, cookieOptions);
          Cookies.set("authToken", response.data.token, cookieOptions);
          Cookies.set("name", response.data.user.name, cookieOptions);
          Cookies.set("email", response.data.user.email, cookieOptions);
          Cookies.set("image", response.data.user.image || "", cookieOptions);

          // تحميل الترجمات بعد تسجيل الدخول
          const locale = response.data.user.locale;
          await initializeTranslations(locale);

          this.email = "";
          this.password = "";
          this.loginSuccess = true;
          const redirect = this.$route.query.redirect || "/dashboard";
          this.$router.replace(redirect);
          this.$emit("loginSuccess");
          if (response.data.permissions) {
            this.permissionStore.setPermissions(response.data.permissions);
          }
        }
      } catch (error) {
        console.error("Login failed:", error);
        this.errors.message = "Login failed. Please try again.";
        this.email = "";
        this.password = "";
      }
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
        this.$router.push("/dashboard");
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
