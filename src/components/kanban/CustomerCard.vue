<template>
  <div
    class="deal-card position-relative"
    @click="openDealDataCard"
    :style="{
      borderLeft:
        deal.responsible_user && getUserColor(deal.responsible_user.id)
          ? `4px solid ${getUserColor(deal.responsible_user.id)}`
          : '',
    }"
  >
    <div
      v-if="deal.unread_count && deal.unread_count > 0"
      class="unread_count px-2 bg-danger rounded position-absolute mb-2 me-1"
    >
      <span class="text-white">{{ deal.unread_count }}</span>
    </div>
    <div
      class="row"
      style="background: linear-gradient(to left, white, rgb(231, 227, 227))"
    >
      <!-- العنوان -->
      <div
        class="col-12 d-flex justify-content-between align-items-center mb-1 p-0"
      >
        <span class="fw-semibold fs-7">{{ deal.name }}</span>
        <span class="text-secondary fs-7">
          {{ deal.view_count }} <i class="fa-regular fa-eye"></i>
        </span>
      </div>

      <!-- الهاتف والواتساب -->
      <div
        class="col-12 d-flex justify-content-between align-i tems-center fs-7 mb-1 p-0"
      >
        <span class="fw-normal text-secondary">{{ deal.phone }}</span>
        <svg
          style="width: 14px; padding-bottom: 3px"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
            fill="green"
          />
        </svg>
        <!-- {{ deal.source_id }} -->
      </div>

      <!-- النجوم -->
      <div class="col-12 fs-8 mb-1 p-0">
        <!-- <i class="fa-solid fa-star text-gold"></i>
        <i class="fa-solid fa-star text-gold"></i>
        <i class="fa-solid fa-star text-gold"></i>
        <i class="fa-solid fa-star text-gold"></i>
        <i class="fa-solid fa-star text-gold"></i>
        <i class="fa-solid fa-star text-lightgray"></i>
        <i class="fa-solid fa-star text-lightgray"></i> -->
        <template v-for="index in 7" :key="index">
          <i
            class="fa-solid fa-star"
            :class="
              index <= (deal.rating || 0) ? 'text-gold' : 'text-lightgray'
            "
          ></i>
        </template>
      </div>
    </div>

    <!-- ملاحظة إدارية -->
    <div v-if="deal.note" class="col-12 pt-1">
      <div class="notes">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span class="px-2">{{ t("kanban-deal-alert-attention") }}</span>
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
    </div>

    <!-- التواريخ -->
    <div class="col-12 mt-2 d-flex">
      <span class="text-success fs-7 pe-1"
        ><i class="fa-regular fa-clock"></i>
        {{ t("kanban-deal-label-createdat") }}:</span
      >
      <span class="fs-7"> {{ formatDate(deal.created_at) }}</span>
    </div>
    <div class="col-12 d-flex pt-1">
      <span class="text-black-50 fs-7 pe-1"
        ><i class="fa-regular fa-clock"></i>
        {{ t("kanban-deal-label-updatedat") }}:</span
      >
      <span class="fs-7">{{ formatDate(deal.updated_at) }}</span>
    </div>

    <div class="col-12 mt-1">
      <span
        class="badge fw-medium text-white py-1 px-2"
        :style="{
          backgroundColor:
            deal.responsible_user && getUserColor(deal.responsible_user.id)
              ? getUserColor(deal.responsible_user.id)
              : '#292929',
        }"
        >{{ deal.responsible_user?.name }}</span
      >
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
// import { ref, onMounted } from "vue";
// import { getUser } from "@/plugins/services/authService";
export default {
  name: "CustomerCard",
  props: {
    deal: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    // const responsibleUserName = ref("...");

    const formatDate = (dateString) => {
      if (!dateString) return "";

      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    };
    const openDealDataCard = () => {
      emit("open-deal-data-card", props.deal.id);
    };
    const getUserColor = (userId) => {
      return localStorage.getItem(`user_${userId}_color`) || "#292929";
    };
    const borderRight = (userId) => {
      return localStorage.getItem(`user_${userId}_color`) || "#292929";
    };
    return { t, formatDate, openDealDataCard, getUserColor, borderRight };
  },
  methods: {},
};
</script>

<style scoped>
.deal-card {
  background: white;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: move;
  transition: all 0.3s ease;
}

.deal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.notes {
  background-color: #fff3cd;
  color: #856404;
  border-radius: 4px;
  padding: 4px 8px;
  text-align: center;
  font-size: 0.875rem;
}

.text-gold {
  color: #ffd700;
}

.text-lightgray {
  color: #d3d3d3;
}

.fs-7 {
  font-size: 0.875rem;
}

.fs-8 {
  font-size: 0.75rem;
}

.row {
  border-radius: 6px 6px 0 0;
  padding: 8px;
  margin: -12px -12px 8px -12px;
}
.unread_count {
  bottom: 5px;
  right: 5px;
  font-size: 14px;
}
</style>
