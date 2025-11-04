<template>
  <div class="modal-body">
    <div class="row gy-3">
      <div class="col-6">
        <label for="name" class="form-label">{{
          t("crmlist-modal-add-deal-label-name")
        }}</label>
        <input
          type="text"
          class="form-control"
          id="userName"
          v-model="localFormData.contact.name"
          :placeholder="t('crmlist-modal-add-deal-placeholder-name')"
        />
      </div>
      <div class="col-6">
        <label for="email" class="form-label">{{
          t("users-modal-add-label-email")
        }}</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="localFormData.contact.email"
          :placeholder="t('crmlist-modal-add-deal-placeholder-email')"
        />
      </div>
      <div class="col-12">
        <div class="form-group">
          <label for="phone1">{{
            t("crmlist-modal-add-deal-label-phone")
          }}</label>
          <div class="d-flex align-items-center">
            <input
              type="text"
              id="phone1"
              class="form-control rounded-end-0"
              v-model="localFormData.contact.phone1"
              :placeholder="t('crmlist-modal-add-deal-placeholder-phone')"
            />
            <button
              type="button"
              class="btn btn-primary add-phone-btn rounded-start-0"
              @click="togglePhone2"
            >
              {{ showPhone2 ? "-" : "+" }}
            </button>
          </div>
        </div>
        <div class="form-group mt-2" v-show="showPhone2">
          <label for="phone2">{{
            t("crmlist-modal-add-deal-label-phone2")
          }}</label
          ><br />
          <input
            type="text"
            id="phone2"
            class="form-control"
            v-model="localFormData.contact.phone2"
            :placeholder="t('crmlist-modal-add-deal-placeholder-phone')"
          />
        </div>
      </div>
      <div class="col-12">
        <label for="note" class="form-label">{{
          t("crmlist-modal-add-deal-label-description")
        }}</label>
        <input
          type="text"
          class="form-control"
          id="note"
          v-model="localFormData.note"
          :placeholder="t('crmlist-modal-add-deal-placeholder-description')"
        />
      </div>
      <div class="col-6">
        <label for="source" class="form-label">{{
          t("crmlist-modal-add-deal-label-source")
        }}</label>
        <select
          class="form-select"
          id="source"
          v-model="localFormData.source_id"
        >
          <option value="" disabled selected>
            {{ t("crmlist-modal-add-deal-placeholder-source") }}
          </option>
          <option
            v-for="source in sources"
            :key="source.value"
            :value="source.value"
          >
            {{ source.name }}
          </option>
        </select>
      </div>
      <div class="col-6">
        <label for="stage" class="form-label">{{
          t("crmlist-modal-add-deal-label-stage")
        }}</label>
        <select class="form-select" id="stage" v-model="localFormData.stage_id">
          <option value="" disabled selected>
            {{ t("crmlist-modal-add-deal-placeholder-stage") }}
          </option>
          <option
            v-for="stage in stages"
            :key="stage.value"
            :value="stage.value"
          >
            {{ stage.name }}
          </option>
        </select>
      </div>
      <div class="col-6">
        <label for="responsible" class="form-label">{{
          t("crmlist-modal-add-deal-label-assign")
        }}</label>
        <select
          class="form-select"
          id="responsible"
          v-model="localFormData.responsible_user_id"
        >
          <option value="" disabled selected>
            {{ t("crmlist-modal-add-deal-placeholder-assign") }}
          </option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }} ({{
              user.role
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())
            }})
          </option>
        </select>
      </div>
      <div class="col-6">
        <RatingStars v-model="localFormData.rating" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { getAvailableStages } from "@/plugins/services/stageService";
import RatingStars from "@/components/CreateDealElements/CrmDealKanbanDealDataModalRatingStars.vue";
import { useI18n } from "vue-i18n";
import { useSourceStore } from "@/stores/SourceStore";
import Cookies from "js-cookie";
import { useUserStore } from "@/stores/UserStore";
export default {
  name: "CrmListViewCreateDealModalFormItems",
  components: {
    RatingStars,
  },
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },
  emit: ["update:formData"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const localFormData = ref({
      ...props.formData,
      rating: props.formData.rating || 0,
      source_id: null,
      stage_id: null,
      responsible_user_id: null,
      contact: {
        ...props.formData.contact,
        phone1: props.formData.contact.phone1 || null,
        phone2: props.formData.contact.phone2 || null,
        phones: [],
      },
    });
    const showPhone2 = ref(false);
    const sourceStore = useSourceStore();
    const sources = computed(() => sourceStore.getAllSources);
    const stages = ref([]);
    const userStore = useUserStore();
    const users = computed(() => userStore.getAllUsers);
    const fetchStages = async () => {
      try {
        const user_role = Cookies.get("user_role");
        const response = await getAvailableStages(
          user_role == "after-sales" ? "after-sales" : "deals"
        );
        if (response.status === 200) {
          stages.value = response.data.data.map((stage) => ({
            value: stage.id,
            name: stage.name,
          }));
        }
      } catch (error) {
        console.error("Error fetching stages:", error);
      }
    };
    const togglePhone2 = () => {
      showPhone2.value = !showPhone2.value;
    };

    onMounted(() => {
      fetchStages();
      if (!userStore.getAllUsers.length) {
        userStore.fetchAllUsers();
      }
      if (!sourceStore.getAllSources.length) {
        sourceStore.fetchSources();
      }
    });
    watch(
      () => [
        localFormData.value.contact.phone1,
        localFormData.value.contact.phone2,
      ],
      ([newPhone1, newPhone2]) => {
        const phones = [];
        if (newPhone1) phones.push(newPhone1);
        if (newPhone2) phones.push(newPhone2);
        localFormData.value.contact.phones = phones;
      },
      { deep: true }
    );
    watch(
      localFormData,
      (newValue) => {
        emit("update:formData", newValue);
      },
      { deep: true }
    );
    return {
      localFormData,
      sources,
      stages,
      t,
      showPhone2,
      togglePhone2,
      users,
    };
  },
};
</script>
