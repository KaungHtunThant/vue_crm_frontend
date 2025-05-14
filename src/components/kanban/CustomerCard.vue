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
        <span class="fw-normal text-secondary">
          <i :class="getIcon(deal.source_id)"></i>
        </span>
      </div>

      <!-- النجوم -->
      <div class="col-12 fs-8 mb-1 p-0">
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
    <div v-if="deal.has_admin_comment" class="col-12 pt-1">
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
    const getIcon = (sourceId) => {
      switch (sourceId) {
        case 1:
          return "fab fa-facebook";
        case 2:
          return "fab fa-whatsapp";
        case 3:
          return "fab fa-google";
        case 4:
          return "fab fa-instagram";
        case 5:
          return "fab fa-twitter";
        case 6:
          return "fab fa-tiktok";
        case 7:
          return "fab fa-snapchat";
        case 8:
          return "fa-brands fa-vk";
        case 9:
          return "fab fa-telegram";
        default:
          return "fa-brands fa-microsoft";
      }
    };
    return {
      t,
      formatDate,
      openDealDataCard,
      getUserColor,
      borderRight,
      getIcon,
    };
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
