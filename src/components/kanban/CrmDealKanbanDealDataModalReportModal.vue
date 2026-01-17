<template>
  <div
    class="modal fade"
    id="questionsModal"
    aria-labelledby="questionsModalLabel"
    ref="questionsModal"
    data-bs-backdrop="false"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-scrollable position-fixed end-0"
    >
      <div class="modal-content ps-3">
        <div class="modal-header border-bottom-0">
          <h6 class="modal-title fw-semibold" id="questionsModalLabel">
            {{ t("kanban-modal-questions-heading") }}
          </h6>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h6 class="mb-3">
            {{ t("kanban-modal-questions-subheading-questions-list")
            }}<span class="text-danger">*</span>
          </h6>
          <form>
            <patient-notes-component />
            <questions-div
              v-for="(question, index) in questions"
              :key="index"
              :question="question"
            />
            <hr class="my-3" />
            <h6 class="mb-3">
              {{ t("kanban-modal-questions-subheading-package-information") }}
            </h6>
            <initial-diagnosis-component />
            <sales-packages-component />
            <hospital-component />
            <add-ons-component />
            <warrenty-component />
            <div class="d-flex justify-content-end gap-2 mt-4 mb-2">
              <button
                type="button"
                class="btn btn-success text-white"
                @click="submitForm"
                data-bs-dismiss="modal"
              >
                {{ t("kanban-modal-questions-button-submit") }}
              </button>
              <button
                type="button"
                class="btn btn-danger text-white"
                data-bs-dismiss="modal"
              >
                {{ t("kanban-modal-questions-button-reset") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateAnswersByDealId } from "@/plugins/services/answerService";
import { getKanbanQuestions } from "@/plugins/services/kanbanService";
import { useI18n } from "vue-i18n";
import QuestionsDiv from "./CrmDealKanbanDealDataModalReportModalQuestions.vue";
import InitialDiagnosisComponent from "./CrmDealKanbanDealDataModalReportModalInitialDiagnosisComponent.vue";
import { useNotificationStore } from "@/stores/notificationStore";
import { useDealStore } from "@/stores/DealStore";
import { computed } from "vue";
import SalesPackagesComponent from "./CrmDealKanbanDealDataModalReportModalSalesPackagesComponent.vue";
import AddOnsComponent from "./CrmDealKanbanDealDataModalReportModalAddOnsComponent.vue";
import WarrentyComponent from "./CrmDealKanbanDealDataModalReportModalWarrentyComponent.vue";
import PatientNotesComponent from "./CrmDealKanbanDealDataModalReportModalPatientNotesComponent.vue";
import HospitalComponent from "./CrmDealKanbanDealDataModalReportModalHospitalComponent.vue";
export default {
  name: "CrmDealKanbanDealDataModalReportModal",
  props: {
    deal_id: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();
    const notificationStore = useNotificationStore();
    const deal_store = useDealStore();
    const current_deal = computed(() => deal_store.getCurrentDeal);
    return { t, notificationStore, deal_store, current_deal };
  },
  components: {
    QuestionsDiv,
    InitialDiagnosisComponent,
    SalesPackagesComponent,
    AddOnsComponent,
    WarrentyComponent,
    PatientNotesComponent,
    HospitalComponent,
  },
  data() {
    return {
      showDiseases: null,
      selectedDiseases: [],
      showSurgeriesInput: null,
      surgeriesDetails: "",
      showStimulantsDetails: null,
      selectedViagraDosages: [],
      selectedCialisDosages: [],
      questions: [],
      answers: [],
      toast: null,
    };
  },
  methods: {
    async fetchQuestions() {
      const response = await getKanbanQuestions(this.deal_id);
      if (response.status === 200) {
        this.questions = response.data.data;
        this.answers = this.questions.map((question) => {
          return {
            question_id: question.id,
            answers: question.answers,
          };
        });
      } else {
        console.error(response.data.message);
        this.notificationStore.error(response.data.message);
      }
    },
    async submitForm() {
      try {
        console.log("Submitting form...");
        let formData = [];
        this.questions.forEach((question) => {
          const questionAnswers = this.getFormDataByQuestion(question);
          formData.push(...questionAnswers);
        });
        const response_1 = await updateAnswersByDealId(this.deal_id, formData);
        if (response_1.status === 200) {
          const response_2 = await this.deal_store.updateDeal(this.deal_id, {
            note: this.current_deal.note,
            diagnosis: this.current_deal.diagnoses,
            kanban_packages: this.current_deal.kanban_packages,
            additional_services: this.current_deal.additional_services,
            add_on_total_cost: this.current_deal.add_on_total_cost,
            warranty: this.current_deal.warranty,
            hospital_id: this.current_deal.hospital_id,
          });
          if (!response_2.success) {
            throw new Error(response_2.message);
          }
          this.notificationStore.success(response_2.message, {
            timeout: 3000,
          });
        } else {
          throw new Error(response_1.data.message);
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        this.notificationStore.error(error.message, {
          timeout: 3000,
        });
      }
    },

    getFormDataByQuestion(question) {
      let formData = [];
      if (question) {
        formData = [
          {
            question_id: question.id,
            answers: question.answers,
          },
        ];
      }
      if (question.child_questions && question.child_questions.length > 0) {
        question.child_questions.forEach((childQuestion) => {
          const childFormData = this.getFormDataByQuestion(childQuestion);
          formData.push(...childFormData);
        });
      }
      return formData;
    },
    handleQuestionsModalContextMenu(e) {
      e.stopPropagation();
      const closeBtn = document
        .getElementById("questionsModal")
        ?.querySelector('[data-bs-dismiss="modal"]');
      if (closeBtn) {
        closeBtn.click();
        e.preventDefault();
      }
    },
  },
  mounted() {
    this.fetchQuestions();
    this.$nextTick(() => {
      const modalEl = document.getElementById("questionsModal");
      if (modalEl) {
        modalEl.addEventListener(
          "contextmenu",
          this.handleQuestionsModalContextMenu
        );
      }
    });
  },
  beforeUnmount() {
    const modalEl = document.getElementById("questionsModal");
    if (modalEl) {
      modalEl.removeEventListener(
        "contextmenu",
        this.handleQuestionsModalContextMenu
      );
    }
  },
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.159);
}

.modal-dialog {
  bottom: -5%;
  width: 100%;
  height: 80vh;
}

.form-check-input:checked {
  background-color: black !important;
  border-color: black;
}

input:focus {
  box-shadow: none;
}
input.note {
  border: 1px solid #eee;
  height: 35px;
}
label {
  font-size: 14px;
}

.modal-body {
  scrollbar-width: thin;
  scrollbar-color: #eee #f0f0f000;
}

.modal-body::-webkit-scrollbar {
  width: 5px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background-color: #eee;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-button {
  display: none;
}
input::placeholder {
  font-size: 14px;
}
</style>
