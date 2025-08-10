<template>
  <div
    class="modal fade"
    id="calenderModal"
    tabindex="-1"
    aria-labelledby="calenderModalLabel"
    aria-hidden="true"
    ref="calenderModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="calenderModalLabel">
            {{ t("modals.calenderModal") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeCalenderModal"
          ></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <calender-form v-model="calender" />
          </div>
          <calender-buttons :loading="loading" @close="closeCalenderModal" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import CalenderForm from "@/components/calenderElements/TheTopHeaderDropDownMenuProfileEditProfileModalCalenderModalFormItems.vue";
import CalenderButtons from "@/components/calenderElements/TheTopHeaderDropDownMenuProfileEditProfileModalCalenderModalFormButtonsItems.vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModalCalenderModal",
  components: { CalenderForm, CalenderButtons },
  setup() {
    const { t } = useI18n();
    const loading = ref(false);
    const calender = ref("");

    const openCalenderModal = () => {
      const modal = document.getElementById("calenderModal");
      const modalInstance = new Modal(modal);
      modalInstance.show();
    };

    const closeCalenderModal = () => {
      const modal = document.getElementById("calenderModal");
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    };

    const submitForm = () => {
      closeCalenderModal();
    };

    return {
      calender,
      loading,
      openCalenderModal,
      closeCalenderModal,
      submitForm,
      t,
    };
  },
};
</script>
