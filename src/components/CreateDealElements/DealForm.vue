<template>
  <div class="modal-body">
    <div class="row">
      <div class="col-12">
        <div class="mb-3">
          <label for="name" class="form-label">{{
            t("documents-modal-edit-label-name")
          }}</label>
          <input
            type="text"
            class="form-control"
            id="userName"
            v-model="localFormData.contact.name"
            :placeholder="t('documents-modal-edit-placeholder-name')"
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">{{
            t("users-modal-add-label-email")
          }}</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="localFormData.contact.email"
            :placeholder="t('users-modal-add-placeholder-email')"
          />
        </div>
        <div class="form-group mb-3">
          <label for="phone1">{{ t("contacts-table-header-phone") }}</label>
          <div class="d-flex align-items-center">
            <input
              type="text"
              id="phone1"
              class="form-control rounded-end-0"
              v-model="localFormData.contact.phone1"
              :placeholder="t('contacts-placeholder-phone')"
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
        <div class="form-group mb-3" v-if="showPhone2">
          <label for="phone2">phone 2</label><br />
          <input
            type="text"
            id="phone2"
            class="form-control"
            v-model="localFormData.contact.phone2"
            :placeholder="t('contacts-placeholder-phone2')"
          />
        </div>
        <!-- <div class="mb-3">
          <label for="phone1" class="form-label">{{
            t("users-modal-add-label-phone")
          }}</label>
          <input
            type="text"
            class="form-control"
            id="phone1"
            v-model="localFormData.contact.phone1"
            :placeholder="t('users-modal-add-placeholder-phone')"
          />
        </div>
        <div class="mb-3">
          <label for="phone2" class="form-label">{{
            t("users-modal-add-label-phone")
          }}</label>
          <input
            type="text"
            class="form-control"
            id="phone2"
            v-model="localFormData.contact.phone2"
            :placeholder="t('users-modal-add-placeholder-phone')"
          />
        </div> -->
        <div class="mb-3">
          <label for="note" class="form-label">{{
            t("kanban-modal-create-label-notes")
          }}</label>
          <input
            type="text"
            class="form-control"
            id="note"
            v-model="localFormData.note"
            :placeholder="t('kanban-modal-create-placeholder-notes')"
          />
        </div>
        <div class="mb-3">
          <label for="source" class="form-label">{{
            t("kanban-modal-create-label-source")
          }}</label>
          <select
            class="form-select"
            id="source"
            v-model="localFormData.source_id"
          >
            <option value="" disabled selected>
              {{ t("kanban-modal-create-placeholder-source") }}
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
        <div class="mb-3">
          <label for="stage" class="form-label">Stage</label>
          <select
            class="form-select"
            id="stage"
            v-model="localFormData.stage_id"
          >
            <option value="" disabled selected>Select Stage</option>
            <option
              v-for="stage in stages"
              :key="stage.value"
              :value="stage.value"
            >
              {{ stage.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="responsible" class="form-label">{{
            t("crmlist-table-header-responsible")
          }}</label>
          <select
            class="form-select"
            id="responsible"
            v-model="localFormData.responsible_user_id"
          >
            <option value="" disabled selected>
              {{ t("crmlist-table-header-responsible") }}
            </option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <RatingStars v-model="localFormData.rating" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { getSources, getStages } from "@/plugins/services/authService";
import RatingStars from "@/components/CreateDealElements/RatingStars.vue";
import { useI18n } from "vue-i18n";
export default {
  name: "DealForm",
  components: {
    RatingStars,
  },
  props: {
    formData: Object,
  },
  emit: ["update:formData"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const localFormData = ref({
      ...props.formData,
      rating: props.formData.rating || 0,
      contact: {
        ...props.formData.contact,
        phone1: props.formData.contact.phone1 || "",
        phone2: props.formData.contact.phone2 || "",
      },
    });
    const showPhone2 = ref(false);
    const sources = ref([]);
    const stages = ref([]);
    const fetchSources = async () => {
      try {
        const response = await getSources();
        if (response.status === 200) {
          sources.value = response.data.data.map((source) => ({
            value: source.id,
            name: source.name,
          }));
        } else {
          // alert("Failed to fetch sources");
        }
      } catch (error) {
        console.error("Error fetching sources:", error);
        // alert("Failed to fetch sources");
      }
    };
    const fetchStages = async () => {
      try {
        const response = await getStages();
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
      fetchSources();
      fetchStages();
    });
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
    };
  },
};
</script>
