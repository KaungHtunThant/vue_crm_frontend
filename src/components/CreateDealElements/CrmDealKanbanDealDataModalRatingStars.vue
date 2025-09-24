<template>
  <div class="rating-container d-flex align-items-center gap-1">
    <div class="stars d-flex justify-content-center align-items-center">
      <span class="fs-6 me-2"
        >{{ t("kanban-modal-edit-rating-heading") }}:</span
      >
      <span
        v-for="index in 7"
        :key="index"
        class="star"
        :class="{ filled: index <= modelValue, hovered: index <= hoveredStar }"
        @mouseover="handleHover(index)"
        @mouseleave="handleLeave"
        @click="handleClick(index)"
      >
        <i class="fa-star" :class="[index <= modelValue ? 'fas' : 'far']"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  name: "CrmDealKanbanDealDataModalRatingStars",
  props: {
    modelValue: {
      type: Number,
      default: 0,
      required: true,
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      hoveredStar: 0,
    };
  },
  methods: {
    handleHover(index) {
      if (!this.isEditable) return;
      this.hoveredStar = index;
    },
    handleLeave() {
      if (!this.isEditable) return;
      this.hoveredStar = 0;
    },
    handleClick(index) {
      if (!this.isEditable) return;
      this.$emit("update:modelValue", index);
    },
  },
};
</script>

<style scoped>
.stars {
  gap: 0.35rem;
}

.star {
  cursor: pointer;
  font-size: 1.3rem;
  color: #ddd;
  transition: all 0.2s ease;
}

.star.filled {
  color: #ffd700;
}

.star.hovered {
  color: #ffd700;
  transform: scale(1.1);
}

.rating-amount {
  font-size: 1rem;
  font-weight: bold;
  color: #666;
  min-width: 60px; /* لضمان ثبات العرض */
}
</style>
