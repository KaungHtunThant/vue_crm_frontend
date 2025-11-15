<template>
  <div class="unauthorized-container">
    <div class="unauthorized-content text-center">
      <div class="error-icon mb-4">
        <i
          class="fa-solid fa-triangle-exclamation text-danger"
          style="font-size: 5rem"
        ></i>
      </div>
      <h1 class="display-4 fw-bold text-danger mb-3">403</h1>
      <h2 class="h3 mb-4">غير مصرح بالوصول</h2>
      <p class="lead mb-4">عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
      <div class="d-flex justify-content-center gap-3">
        <router-link to="/home" class="btn btn-primary px-4 py-2">
          <i class="fas fa-home me-2"></i>
          العودة للرئيسية
        </router-link>
        <button @click="goBack" class="btn btn-outline-secondary px-4 py-2">
          <i class="fas fa-arrow-left me-2"></i>
          رجوع
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UnauthorizedView",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.unauthorized-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.unauthorized-content {
  background: white;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 1001;
}

.error-icon {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}
</style>
