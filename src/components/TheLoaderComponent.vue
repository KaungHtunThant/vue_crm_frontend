<template>
  <div
    v-if="isLoading"
    class="loader vh-100 w-100"
    :style="{ '--color': loaderColor }"
  >
    <div class="position-absolute top-50 start-50 boxLoading">
      <div class="img text-center w-100">
        <img :src="loaderImage" alt="Loader Image" />
      </div>
      <div
        class="circles d-flex justify-content-center align-items-center m-auto"
      >
        <div
          class="circle d-flex justify-content-center align-items-center position-relative rounded-5"
          v-for="(color, n) in loaderColors"
          :key="n"
          :style="{ '--color': color }"
        >
          <div class="dot position-absolute rounded-5"></div>
          <div class="outline position-absolute rounded-5"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";

defineProps({
  isLoading: Boolean,
  loaderImage: String,
  loaderColors: Array,
});
</script>
<style scoped>
.loader {
  --color: #9e2929;
  --animation: 2s ease-in-out infinite;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}
.boxLoading {
  transform: translate(-50%, -50%);
}
.loader .img {
  height: 80px;
  margin-bottom: 25px;
}
.loader .img img {
  width: 90px;
  height: 90px;
  animation: imgScales 2s linear infinite;
  -webkit-animation: imgScales 2s linear infinite;
}
.loader .circle {
  width: 20px;
  height: 20px;
  border: solid 2px var(--color);
  margin: 0 10px;
  background-color: transparent;
  animation: circle-keys var(--animation);
}

.loader .circle .dot {
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background-color: var(--color);
  animation: dot-keys var(--animation);
}

.loader .circle .outline {
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  animation: outline-keys var(--animation);
}

.circle:nth-child(2) {
  animation-delay: 0.3s;
}

.circle:nth-child(3) {
  animation-delay: 0.6s;
}

.circle:nth-child(4) {
  animation-delay: 0.9s;
}

.circle:nth-child(5) {
  animation-delay: 1.2s;
}

.circle:nth-child(2) .dot {
  animation-delay: 0.3s;
}

.circle:nth-child(3) .dot {
  animation-delay: 0.6s;
}

.circle:nth-child(4) .dot {
  animation-delay: 0.9s;
}

.circle:nth-child(5) .dot {
  animation-delay: 1.2s;
}

.circle:nth-child(1) .outline {
  animation-delay: 0.9s;
}

.circle:nth-child(2) .outline {
  animation-delay: 1.2s;
}

.circle:nth-child(3) .outline {
  animation-delay: 1.5s;
}

.circle:nth-child(4) .outline {
  animation-delay: 1.8s;
}

.circle:nth-child(5) .outline {
  animation-delay: 2.1s;
}

@keyframes circle-keys {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes dot-keys {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes outline-keys {
  0% {
    transform: scale(0);
    outline: solid 20px var(--color);
    outline-offset: 0;
    opacity: 1;
  }

  100% {
    transform: scale(1);
    outline: solid 0 transparent;
    outline-offset: 20px;
    opacity: 0;
  }
}

@keyframes imgScales {
  0% {
    transform: scale(0.9);
    -webkit-transform: scale(0.9);
    -moz-transform: scale(0.9);
    -ms-transform: scale(0.9);
    -o-transform: scale(0.9);
  }
  50% {
    transform: scale(1.1);
    -webkit-transform: scale(1.1);
    -moz-transform: scale(1.1);
    -ms-transform: scale(1.1);
    -o-transform: scale(1.1);
  }

  100% {
    transform: scale(1.3);
    -webkit-transform: scale(1.3);
    -moz-transform: scale(1.3);
    -ms-transform: scale(1.3);
    -o-transform: scale(1.3);
  }
}
</style>
