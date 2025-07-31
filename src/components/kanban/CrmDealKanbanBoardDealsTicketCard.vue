<template>
  <div
    class="deal-card position-relative"
    @click="openDealDataCard"
    :style="{
      borderLeft:
        deal.responsible_user && getUserColor(deal.responsible_user?.id)
          ? `3px solid ${getUserColor(deal.responsible_user?.id)}`
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
        <span class="ms-2 fw-semibold fs-7 d-flex align-items-center">
          <country-flag-avatar
            v-if="deal.phone"
            :phone="deal.phone"
            style="width: 22px; height: 20px !important"
          />
          {{ deal.name.length > 20 ? deal.name.slice(0, 20) + "…" : deal.name }}
        </span>
        <span class="text-dark fs-7">
          {{ deal.view_count }} <i class="fa-solid fa-eye"></i>
        </span>
      </div>

      <!-- الهاتف والواتساب -->
      <div
        class="col-12 d-flex justify-content-between align-items-center fs-7 mb-1 p-0"
      >
        <span
          class="fw-normal text-dark phone-number d-flex align-items-center"
          @click.stop="copyPhoneNumber"
          :title="t('click-to-copy')"
        >
          <span class="d-flex align-items-center">
            <i class="ms-2 fa-solid fa-phone me-1 opacity-100 text-dark"></i>
            {{ deal.phone ?? "************" }}
          </span>
          <i class="fa-solid fa-copy ms-1"></i>
        </span>
        <span class="fw-normal text-dark">
          <i :class="getIcon(deal.source_id)"></i>
        </span>
      </div>

      <!-- النجوم -->
      <div
        class="col-12 fs-8 mb-1 p-0 d-flex justify-content-between align-items-center"
      >
        <div class="">
          <span class="ms-2 text-secondary">Rating: </span>
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

      <!-- persuasion progress  -->
      <!-- <div class="col-12 persuasion-progress">
        <div class="d-flex align-items-center gap-1" style="font-size: 12px">
          <i class="fa-solid fa-bullseye text-secondary"></i>
          <span class="fw-medium text-secondary">
            {{ deal.persuasion_status || 85 }}%
          </span>
          <div class="progress flex-grow-1" style="height: 6px">
            <div
              class="progress-bar rounded-5"
              :class="getPersuasionColorClass(deal.persuasion_status)"
              role="progressbar"
              :style="{ width: `${deal.persuasion_status || 85}%` }"
              :aria-valuenow="deal.persuasion_status || 85"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </div> -->

      <div
        class="d-flex gap-1 align-items-center p-0 flex-wrap"
        v-if="deal.tags && deal.tags.length && userRole !== 'sales'"
      >
        <span
          v-for="tag in deal.tags"
          :key="tag.id"
          class="p-0 badge p-1"
          :style="{
            backgroundColor: tag.color_code,
            color: getContrastColor(tag.color_code),
          }"
          data-toggle="tooltip"
          data-placement="top"
          :title="tag.name"
        >
          <i :class="`fa-solid fa-${tag.icon} me-1`"></i>
          <span class="fw-normal">{{
            tag.name.length > 20 ? tag.name.slice(0, 20) + "…" : tag.name
          }}</span>
        </span>
      </div>
    </div>

    <!-- ملاحظة إدارية -->
    <!-- <div v-if="deal.has_admin_comment" class="col-12 pt-1">
      <div class="notes">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span class="px-2">{{ t("kanban-deal-alert-attention") }}</span>
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
    </div> -->

    <!-- التواريخ -->
    <div class="col-12 mt-2 d-flex justify-content-between align-items-center">
      <span class="text-dark fs-7 bg-secondary-50 rounded px-1"
        ><i class="ms-1 mt-1 fa-solid fa-square-plus fs-6"></i>
        {{ formatDate(deal.created_at) }}</span
      >
      <span class="text-dark fs-7 bg-secondary-50 rounded px-1"
        ><i class="ms-1 mt-1 fa-solid fa-square-pen fs-6"></i>
        {{ formatDate(deal.updated_at) }}</span
      >
    </div>
    <div class="col-12 mt-1" v-if="deal.responsible_user">
      <span
        class="badge fw-medium text-white py-1 px-2"
        :style="{
          backgroundColor: deal.responsible_user?.color_code ?? '#292929',
          color: getContrastColor(
            deal.responsible_user?.color_code || '#292929'
          ),
        }"
        >{{ deal.responsible_user?.name }}</span
      >
    </div>
    <div
      class="mt-1"
      v-if="deal.has_admin_comment"
      :title="t('kanban-deal-alert-attention')"
    >
      <i class="mx-1 fa-solid fa-comment-dots fs-6 text-warning"></i>
      <span class="fs-7">Attention Required</span>
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import CountryFlagAvatar from "@/components/whatsapp/WhatsAppModalSidebarLeftCountryFlagAvatar.vue";
import Cookies from "js-cookie";

export default {
  name: "CrmDealKanbanBoardDealsTicketCard",
  props: {
    deal: {
      type: Object,
      required: true,
    },
  },
  components: {
    CountryFlagAvatar,
  },
  setup(props, { emit }) {
    const userRole = Cookies.get("user_role");
    const { t } = useI18n();
    const toast = useToast();

    const formatDate = (dateString) => {
      if (!dateString) return "";

      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(2);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
    const formatDateUpdate = (dateString) => {
      if (!dateString) return "";

      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      // const year = date.getFullYear();

      return `${day}/${month}`;
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
          return "fa-solid fa-recycle";
      }
    };
    const tagIcon = (tagName) => {
      switch (tagName.toLowerCase()) {
        case "new":
          return "fa-plus";
        case "hot":
          return "fa-fire";
        case "idle":
          return "fa-snowflake";
        case "medicine":
          return "fa-capsules";
        case "no response":
          return "fa-phone-slash";
        case "stopped responding":
          return "fa-moon";
        case "reference":
          return "fa-street-view";
        case "re-contact":
          return "fa-repeat";
        case "low potential":
          return "fa-user-slash";
        case "trash":
          return "fa-trash";
        default:
          return "fa-recycle";
      }
    };
    const getContrastColor = (hexColor) => {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 170 ? "#000000" : "#FFFFFF";
    };
    const copyPhoneNumber = async () => {
      try {
        await navigator.clipboard.writeText(props.deal.phone);
        toast.success(t("phone-copied"));
      } catch (err) {
        toast.error(t("copy-failed"));
      }
    };
    const getPersuasionColorClass = (persuasion_status) => {
      const status = persuasion_status || 85;
      if (status <= 25) return "bg-danger";
      if (status <= 50) return "bg-warning";
      if (status <= 75) return "bg-info";
      return "bg-success";
    };
    return {
      t,
      formatDate,
      openDealDataCard,
      getUserColor,
      borderRight,
      getIcon,
      tagIcon,
      getContrastColor,
      copyPhoneNumber,
      formatDateUpdate,
      getPersuasionColorClass,
      userRole,
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
.bg-Tages {
  background-color: rgba(76, 74, 74, 0.453);
}

.bg-Tages i {
  margin-inline-end: 1px;
}

.phone-number {
  cursor: pointer;
  transition: all 0.2s ease;
}

.phone-number i {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.phone-number:hover i {
  opacity: 1;
}

.persuasion-progress {
  padding: 0 4px;
}

.persuasion-progress .progress {
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin: 0;
}

.persuasion-progress .progress-bar {
  transition: width 0.3s ease;
}

.bg-secondary-50 {
  background-color: #f3f3f3;
}
</style>
