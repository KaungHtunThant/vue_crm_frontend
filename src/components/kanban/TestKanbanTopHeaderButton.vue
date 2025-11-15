<template>
  <button class="btn text-white fs-7 btn-hover px-2 py-2 d-inline-block">
    <i
      :class="`fa-solid fa-${local_icon} ${
        local_icon && local_text ? 'me-2' : ''
      }`"
    ></i>
    {{ t(local_text) }}
  </button>
</template>
<script>
import { useI18n } from "vue-i18n";
import { ref } from "vue";

export default {
  name: "TestKanbanTopHeaderButton",
  props: {
    icon: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const { t } = useI18n();
    const local_icon = ref(props.icon);
    const local_text = ref(props.text);
    return {
      t,
      local_icon,
      local_text,
    };
  },
};
</script>
<style scoped>
.btn-hover {
  /* background-color: rgba(128, 128, 128, 0.8) !important; */
  background-color: #55555551 !important;
  min-width: 120px;
}
.btn-hover:hover {
  background-color: #ffffff !important;
  color: #333333 !important;
}
.fs-7 {
  font-size: 0.85rem;
}
</style>
