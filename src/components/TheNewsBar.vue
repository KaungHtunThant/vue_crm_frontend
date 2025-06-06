<template>
  <div class="w-100">
    <div
      class="toggle-button position-fixed arrowColor text-white p-1 cursor-pointer"
      :style="toggleButtonStyle"
      @click="toggleNewsBar"
    >
      <i :class="`fa-solid fa-chevron-${isNewsBarVisible ? 'down' : 'up'}`"></i>
    </div>
    <transition name="slide">
      <div
        v-if="isNewsBarVisible"
        class="marquee-container bg-body-secondary text-primary fw-bold position-fixed bottom-0 left-0 right-0 overflow-hidden w-100"
      >
        <div
          ref="marquee"
          class="messages-marquee d-inline-flex p-1"
          :style="{ transform: `translateX(${translateX}px)` }"
        >
          <span
            v-for="(news, index) in repeatedNewsList"
            :key="index"
            class="marquee_margin px-4"
            :class="{ important: news.important }"
          >
            {{ news.text }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getKanbanBroadcasts } from "@/plugins/services/authService";
import { ref, onMounted, onUnmounted, computed } from "vue";

export default {
  name: "TheNewsBar",
  setup() {
    const newsList = ref([]);
    const marquee = ref(null);
    const translateX = ref(0);
    let animationFrame;
    let contentWidth = 0;
    const speed = 1;
    const isNewsBarVisible = ref(true);
    const toggleNewsBar = () => {
      isNewsBarVisible.value = !isNewsBarVisible.value;
    };
    const repeatedNewsList = ref([]);

    const messages_length = computed(() => {
      let length = 0;
      newsList.value.forEach((item) => {
        length += item.text.length;
      });
      return length;
    });

    const startAnimation = () => {
      if (!marquee.value) return;
      contentWidth = marquee.value.scrollWidth / 2;
      translateX.value = -contentWidth;
      const step = () => {
        translateX.value += speed;
        if (translateX.value >= 0) {
          translateX.value = contentWidth - messages_length.value * 25;
          repeatedNewsList.value = [
            ...repeatedNewsList.value,
            ...newsList.value,
          ];
        }
        animationFrame = requestAnimationFrame(step);
      };
      step();
    };

    const fetchBroadcasts = async () => {
      try {
        const response = await getKanbanBroadcasts();
        if (!response.data && !response.data.data) {
          throw new Error("Network response was not ok");
        }
        newsList.value = response.data.data.map((item) => ({
          text: item.description,
          important: item.important,
        }));
        repeatedNewsList.value = [...newsList.value, ...newsList.value];
      } catch (error) {
        console.error("Error fetching broadcasts:", error);
      }
    };

    onMounted(() => {
      fetchBroadcasts();
      startAnimation();
    });

    onUnmounted(() => {
      cancelAnimationFrame(animationFrame);
    });

    const toggleButtonStyle = computed(() => {
      return {
        bottom: isNewsBarVisible.value ? "29px" : "0",
        left: "0",
        transition: "bottom 0.5s ease",
      };
    });

    return {
      newsList,
      translateX,
      marquee,
      isNewsBarVisible,
      toggleNewsBar,
      toggleButtonStyle,
      repeatedNewsList,
      messages_length,
    };
  },
};
</script>

<style scoped>
.marquee-container {
  z-index: 1000;
  white-space: nowrap;
}

.messages-marquee {
  white-space: nowrap;
}

.marquee_margin {
  margin-right: 20px;
  margin-left: 20px;
  font-size: 14px;
}

.important {
  background-color: #ed2424;
  color: white;
}
.toggle-button {
  z-index: 1001;
  cursor: pointer;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.toggle-button:hover {
  background-color: #0056b3;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}
.arrowColor {
  background-color: rgba(128, 128, 128, 0.8) !important;
}
</style>
