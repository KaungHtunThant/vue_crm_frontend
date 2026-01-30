<template>
  <Multiselect
    name="rating"
    v-model="local_rating"
    :options="ratings"
    label="name"
    track-by="id"
    :placeholder="t('users-table-rating-norating')"
    :searchable="true"
    required
    @select="onChangeRating"
  />
</template>
<script>
import { onMounted, ref, watch } from "vue";
import { useRatingStore } from "@/stores/RatingStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import Multiselect from "vue-multiselect";
export default {
  name: "RatingSelector",
  components: {
    Multiselect,
  },
  props: {
    user_id: {
      type: Number,
      required: false,
    },
    rating: {
      type: Number,
      required: false,
      default: null,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const local_rating = ref(props.rating);
    const ratingStore = useRatingStore();

    const onChangeRating = () => {
      emit(
        "rating-changed",
        {
          id: local_rating.value["id"],
          name: local_rating.value["name"],
          slug: local_rating.value["slug"],
        },
        props.user_id
      );
    };

    watch(
      () => props.rating,
      (newVal) => {
        if (newVal !== local_rating.value) {
          local_rating.value = newVal;
        }
      }
    );

    const ratings = computed(() => ratingStore.getRatings);

    onMounted(() => {
      if (ratings.value.length === 0) {
        ratingStore.fetchRatings();
      }
    });

    return {
      local_rating,
      ratings,
      t,
      onChangeRating,
    };
  },
};
</script>
