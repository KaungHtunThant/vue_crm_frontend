<template>
  <div class="form-text">
    <textarea
      :placeholder="t('modals.additionalNote')"
      class="form-control w-100 p-2"
      :value="local_answer"
      :name="`q-${question_id}`"
    ></textarea>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  name: "TextArea",
  setup() {
    const { t } = useI18n();
    return { t };
  },
  props: {
    answers: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    local_answer() {
      return this.answers[0]?.extra || "";
    },
  },
};
</script>
