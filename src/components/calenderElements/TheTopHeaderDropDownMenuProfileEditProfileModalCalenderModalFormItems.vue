<template>
  <div class="mb-3">
    <label for="calender" class="form-label">{{ t("modals.addDate") }}</label>
    <input
      type="date"
      lang="en"
      class="form-control"
      placeholder="Date"
      id="calender"
      v-model="calender"
      @input="$emit('update:modelValue', $event)"
    />
  </div>

  <div v-if="errorMessage" class="alert alert-danger">
    {{ errorMessage }}
  </div>
  <div v-if="successMessage" class="alert alert-success">
    {{ successMessage }}
  </div>
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModalCalenderModalFormItems",
  props: {
    modelValue: { type: String, default: "", required: true },
  },
  setup() {
    const { t } = useI18n();
    const calender = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");

    const validateCalender = () => {
      if (calender.value === "") {
        errorMessage.value = t("modals.pleaseSelectDate");
        successMessage.value = "";
      } else {
        successMessage.value = t("modals.dateSelectedSuccessfully");
        errorMessage.value = "";

        setTimeout(() => {
          successMessage.value = "";
        }, 3000);
      }
    };

    return {
      calender,
      errorMessage,
      successMessage,
      validateCalender,
      t,
    };
  },
};
</script>

<style scoped>
input:focus {
  box-shadow: none;
  outline: none;
}
</style>
