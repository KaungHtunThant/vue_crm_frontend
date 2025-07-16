<template>
  <button class="btn fs-7 btn-hover px-2 py-1">
    <span :class="`badge bg-secondary-subtle fw-bold fs-6 ${local_color}`">
      {{ local_count }}
    </span>
    {{ t(local_text) }}
  </button>
</template>
<script>
import { useI18n } from "vue-i18n";
import { ref } from "vue";

export default {
  name: "TestKanbanTopheaderTaskCountButton",
  props: {
    text: {
      type: String,
      default: "",
    },
    count: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: "text-secondary",
    },
  },
  setup(props) {
    const { t } = useI18n();
    const local_text = ref(props.text);
    const local_count = ref(props.count);
    const local_color = ref(props.color);
    return {
      t,
      local_text,
      local_count,
      local_color,
    };
  },
};
</script>
<style scoped>
.btn-hover {
  background-color: #55555551 !important;
  color: #ffffff;
}
.btn-hover:hover {
  background-color: #ffffff !important;
  color: #333333;
}
.fs-7 {
  font-size: 0.85rem;
}
</style>
