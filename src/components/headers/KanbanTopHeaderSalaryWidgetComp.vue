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
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";
import { calculatecommission } from "@/plugins/services/salaryService";
export default {
  name: "SalaryWidgetComp",
  setup() {
    const show = ref(false);
    const salary = ref(0);
    const bonus = ref(0);
    const deductions = ref(0);
    const total = ref(0);
    const toggleShow = () => {
      show.value = !show.value;
    };
    const CommissionAndSalary = async () => {
      const userId = Cookies.get("user_id");
      const commission = await calculatecommission(userId);
      if (commission && commission.status === 200) {
        const salaryData = commission?.data?.data?.original?.data;
        const finalBasicPay = Number(salaryData?.basic_pay) || 0;
        const deductions = Number(salaryData?.deductions) || 0;
        const calculated_commission =
          Number(salaryData?.calculated_commission) || 0;
        const bonuses = Number(salaryData?.bonuses) || 0;
        const calculatedCommission = calculated_commission + bonuses;
        const totalSalary = finalBasicPay + calculatedCommission - deductions;
        return {
          salary: finalBasicPay || 0,
          bonus: calculatedCommission || 0,
          total: totalSalary || 0,
          deductions: salaryData?.deductions || 0,
        };
      } else {
        return {
          salary: 0,
          bonus: 0,
          total: 0,
          deductions: 0,
        };
      }
    };
    onMounted(async () => {
      const data = await CommissionAndSalary();
      salary.value = data.salary;
      bonus.value = data.bonus;
      total.value = data.total;
      deductions.value = data.deductions;
    });
    return {
      show,
      salary,
      bonus,
      deductions,
      total,
      toggleShow,
      CommissionAndSalary,
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
