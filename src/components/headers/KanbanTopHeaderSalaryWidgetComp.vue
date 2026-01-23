<template>
  <div class="d-flex align-items-center">
    <div
      class="bg-custom d-flex align-items-center rounded-0 rounded-start p-1-5"
    >
      <span class="me-2 text-white">{{
        $t("kanban-salary-widget-label-salary")
      }}</span>
      <span
        class="badge bg-secondary-subtle fw-bold fs-6 py-1 px-2"
        :class="show && salary ? 'text-primary' : 'text-secondary'"
        >{{ show ? salary : "$$$$" }}</span
      >
    </div>
    <div class="bg-custom d-flex align-items-center rounded-0 p-1-5">
      <span class="me-2 text-white">{{
        $t("kanban-salary-widget-label-bonus")
      }}</span>
      <span
        class="badge bg-secondary-subtle fw-bold fs-6 py-1 px-2"
        :class="show && bonus ? 'text-success' : 'text-secondary'"
        >{{ show ? bonus : "$$$$" }}</span
      >
    </div>
    <div class="bg-custom d-flex align-items-center rounded-0 p-1-5">
      <span class="me-2 text-white">{{
        $t("kanban-salary-widget-label-deductions")
      }}</span>
      <span
        class="badge bg-secondary-subtle text-secondary fw-bold fs-6 py-1 px-2"
        :class="show && deductions ? 'text-danger' : 'text-secondary'"
        >{{ show ? deductions : "$$$" }}</span
      >
    </div>
    <div class="bg-custom d-flex align-items-center rounded-0 p-1-5">
      <span class="me-2 text-white">{{
        $t("kanban-salary-widget-label-total")
      }}</span>
      <span
        class="badge bg-secondary-subtle fw-bold fs-6 py-1 px-2"
        :class="show && total ? 'text-primary' : 'text-secondary'"
        >{{ show ? total : "$$$$" }}</span
      >
    </div>
    <button
      class="btn btn-hover p-2-5 d-flex rounded-0 rounded-end align-items-center"
      @click="toggleShow"
    >
      <i class="fa-solid fs-7" :class="show ? 'fa-eye' : 'fa-eye-slash'"></i>
    </button>
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  name: "SalaryWidgetComp",
  setup() {
    const show = ref(false);
    const salary = "$5,000";
    const bonus = "$500";
    const deductions = "$200";
    const total = "$5,300";
    const toggleShow = () => {
      show.value = !show.value;
    };
    return {
      show,
      salary,
      bonus,
      deductions,
      total,
      toggleShow,
    };
  },
};
</script>
<style scoped>
.bg-custom {
  background-color: #55555551;
}
.p-1-5 {
  padding: 0.375rem 0.375rem;
}
.p-2-5 {
  padding: 0.57rem 0.375rem;
}
.btn-hover {
  /* background-color: rgba(128, 128, 128, 0.8) !important; */
  background-color: #55555551 !important;
  color: #ffffff;
}
.btn-hover:hover {
  background-color: #ffffff !important;
  color: #333333 !important;
}
</style>
