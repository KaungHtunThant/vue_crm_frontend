<template>
  <div
    class="modal fade"
    id="questionsModal"
    tabindex="-1"
    aria-labelledby="questionsModalLabel"
    aria-hidden="true"
    ref="questionsModal"
    data-bs-backdrop="true"
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
          <form @submit.prevent="submitForm">
            <questions-div
              v-for="(question, index) in questions"
              :key="index"
              :question="question"
            />
            <div class="d-flex justify-content-end gap-2 mt-4 mb-2">
              <button
                type="submit"
                class="btn btn-success text-white"
                data-bs-dismiss="modal"
              >
                {{ t("buttons.submit") }}
              </button>
              <button
                type="button"
                class="btn btn-danger text-white"
                data-bs-dismiss="modal"
              >
                {{ t("buttons.close") }}
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
// import { useToast } from "vue-toastification";
// import { showSuccess, showError } from "@/plugins/services/toastService";
import { useNotificationStore } from "@/stores/notificationStore";

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
    return { t, notificationStore };
  },
  components: {
    QuestionsDiv,
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
        console.error("Failed to fetch questions: ", response.data.message);
      }
    },
    async submitForm() {
      let formData = [];
      this.questions.forEach((question) => {
        const questionAnswers = this.getFormDataByQuestion(question);
        formData.push(...questionAnswers);
      });
      const response = await updateAnswersByDealId(this.deal_id, formData);
      if (response.status === 200) {
        this.notificationStore.success(response.data.message, {
          timeout: 3000,
        });
      } else {
        console.error("Failed to update answers: ", response.data.message);
        this.notificationStore.error(response.data.message, {
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
    // this.toast = useToast();
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
