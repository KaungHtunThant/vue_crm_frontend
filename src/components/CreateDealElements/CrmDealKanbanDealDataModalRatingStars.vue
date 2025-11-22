<template>
  <label class="fs-6 w-100 mx-2">
    {{ t("kanban-modal-edit-rating-heading") }}
  </label>
  <div class="w-100 d-flex align-items-center">
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
      this.hoveredStar = index;
    },
    handleLeave() {
      this.hoveredStar = 0;
    },
    handleClick(index) {
      this.$emit("update:modelValue", index);
    },
  },
};
</script>

<style scoped>
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
