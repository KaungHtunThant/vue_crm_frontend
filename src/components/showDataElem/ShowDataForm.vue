<template>
  <div class="modal-body">
    <div class="row">
      <div class="col-6">
        <div class="mb-3">
          <label for="name" class="form-label">{{ $t("modals.name") }}</label>
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="localFormData.name"
            disabled
          />
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label for="phone" class="form-label">{{ $t("modals.phone") }}</label>
          <input
            type="text"
            class="form-control"
            id="phone"
            v-model="localFormData.phone"
            disabled
          />
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label for="note" class="form-label">{{ $t("modals.note") }}</label>
          <input
            type="text"
            class="form-control"
            id="note"
            v-model="localFormData.note"
            disabled
          />
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label for="created_at" class="form-label">{{
            $t("modals.created_at")
          }}</label>
          <input
            type="date"
            lang="en"
            class="form-control"
            id="created_at"
            v-model="localFormData.created_at"
            disabled
          />
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label for="source" class="form-label">{{
            $t("modals.source")
          }}</label>
          <input
            type="text"
            class="form-control"
            id="source"
            v-model="localFormData.source"
            disabled
          />
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label for="stage" class="form-label">{{ $t("modals.stage") }}</label>
          <input
            type="text"
            class="form-control"
            id="stage"
            v-model="localFormData.stage"
            disabled
          />
        </div>
      </div>
      <div class="col-12">
        <div class="mb-3">
          <label for="responsablePerson" class="form-label">{{
            $t("modals.responsablePerson")
          }}</label>
          <input
            type="text"
            class="form-control"
            id="responsablePerson"
            v-model="localFormData.responsablePerson"
            disabled
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";

export default {
  name: "ShowDataForm",
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      localFormData: {
        name: "",
        phone: "",
        note: "",
        created_at: "",
        source: "",
        stage: "",
        responsablePerson: "",
      },
    };
  },
  watch: {
    formData: {
      handler(newData) {
        if (newData) {
          this.localFormData = { ...newData };
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
