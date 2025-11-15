<template>
  <div class="dropdown-menu position-absolute d-block pb-1 border-0">
    <h5 class="text-center noneMessage">{{ t("kanban-no-notification") }}</h5>
    <div class="titleNot border-top p-2 d-none">
      <h5>Title</h5>
      <span class="date">18/4/2000</span>
    </div>
  </div>
</template>
<script>
import { useI18n } from "vue-i18n";

export default {
  name: "TheTopHeaderNotificationsHeader",
  setup() {
    const { t } = useI18n();
    return { t };
  },
};
</script>
<style scoped>
.dropdown-menu {
  top: 40px;
  left: -300%;
  width: 300px !important;
}
.noneMessage {
  font-size: 14px;
}
</style>
