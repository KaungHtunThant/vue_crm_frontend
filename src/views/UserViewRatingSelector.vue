<template>
  <select v-model="local_rating_id" class="form-select">
    <option value="" disabled>
      {{ t("users-table-rating-placeholder") }}
    </option>
    <option v-for="rating in ratings" :key="rating.id" :value="rating.id">
      {{ rating.name }}
    </option>
  </select>
</template>
<script>
import { ref, watch } from "vue";
import { useRatingStore } from "@/stores/RatingStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
export default {
  name: "RatingSelector",
  props: {
    user_id: {
      type: Number,
      required: false,
    },
    rating_id: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const local_rating_id = ref(props.rating_id);
    const ratingStore = useRatingStore();
    watch(local_rating_id, (newVal) => {
      emit("rating-changed", newVal, props.user_id);
    });

    watch(
      () => props.rating_id,
      (newVal) => {
        local_rating_id.value = newVal;
      }
    );

    const ratings = computed(() => {
      return ratingStore.getRatings;
    });

    return {
      local_rating_id,
      ratings,
      t,
    };
  },
};
</script>
