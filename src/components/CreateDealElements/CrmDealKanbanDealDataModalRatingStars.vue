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
import { ref } from "vue";
import { useDealStore } from "@/stores/DealStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useI18n } from "vue-i18n";
export default {
  name: "CrmDealKanbanDealDataModalRatingStars",
  props: {
    modelValue: {
      type: Number,
      default: 0,
      required: true,
    },
    dealId: {
      type: Number,
      required: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const dealStore = useDealStore();
    const notificationStore = useNotificationStore();
    const tmp_rating = ref(null);
    const handleClick = async (index) => {
      try {
        tmp_rating.value = props.modelValue;
        emit("update:modelValue", index);
        await dealStore.updateDeal(props.dealId, { rating: index });
        notificationStore.success("Rating updated successfully");
      } catch (error) {
        emit("update:modelValue", tmp_rating.value); // Revert on error
        notificationStore.error("Failed to update rating");
      }
    };
    return { t, handleClick };
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
