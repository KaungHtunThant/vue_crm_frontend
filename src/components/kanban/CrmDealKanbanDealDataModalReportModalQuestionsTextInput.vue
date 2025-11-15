<template>
  <div class="form-text">
    <input
      type="text"
      :placeholder="t('modals.additionalNote')"
      class="note w-100 rounded-3 p-2"
      :value="local_answer"
      :name="`q-${question_id}`"
    />
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  name: "TextInput",
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
