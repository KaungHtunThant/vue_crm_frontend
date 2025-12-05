<template>
  <div class="question bg-light ps-2 py-2 mb-2 rounded-3">
    <p class="fw-medium">{{ local_question.question }}</p>
    <span v-if="local_question.type == 'radio'">
      <radio-button
        v-for="(choice, index) in local_question.choices"
        :key="index"
        :choice="choice"
        :answers="local_question.answers"
        :question_id="local_question.id"
        @change="handleChange"
      />
    </span>
    <span v-else-if="local_question.type == 'checkbox'">
      <checkbox-button
        v-for="(choice, index) in local_question.choices"
        :key="index"
        :choice="choice"
        :answers="local_question.answers"
        :question_id="local_question.id"
        @change="handleChange"
      />
    </span>
    <span v-else-if="local_question.type == 'text'">
      <text-area :answers="local_question.answers" @change="handleChange" />
    </span>
    <div
      v-for="(childQuestion, index) in local_question.child_questions"
      class="mx-2 mt-2 mb-0 border-start border-2 border-secondary-subtle"
      :key="index"
    >
      <questions-div
        v-show="answerSelected(childQuestion.required_choice)"
        :question="childQuestion"
      />
    </div>
  </div>
</template>

<script>
import RadioButton from "./CrmDealKanbanDealDataModalReportModalQuestionsRadioButton.vue";
import CheckboxButton from "./CrmDealKanbanDealDataModalReportModalQuestionsCheckbox.vue";
// import TextInput from "./CrmDealKanbanDealDataModalReportModalQuestionsTextInput.vue";
import TextArea from "./CrmDealKanbanDealDataModalReportModalQuestionsTextArea.vue";
// import DateInput from "./CrmDealKanbanDealDataModalReportModalQuestionsDateInput.vue";
// import NumberInput from "./CrmDealKanbanDealDataModalReportModalQuestionsNumberInput.vue";
// import SelectInput from "./CrmDealKanbanDealDataModalReportModalQuestionsSelectInput.vue";
export default {
  name: "QuestionsDiv",
  components: {
    RadioButton,
    CheckboxButton,
    // TextInput,
    TextArea,
    // DateInput,
    // NumberInput,
    // SelectInput,
  },
  props: {
    question: {
      type: String,
      required: true,
    },
  },
  computed: {
    answerSelected() {
      return (requiredChoice) => {
        if (this.local_question.answers) {
          return this.local_question.answers.some(
            (answer) => answer.choice_id == requiredChoice
          );
        }
        return false;
      };
    },
  },
  data() {
    return {
      local_question: this.question,
    };
  },
  methods: {
    handleAgeChange(event) {
      this.selectedAge = event.target.value;
    },
    handleChange(event) {
      if (this.local_question.type == "checkbox") {
        this.handleCheckboxChange(event);
      } else if (this.local_question.type == "radio") {
        this.handleRadioChange(event);
      } else if (this.local_question.type == "text") {
        this.handleTextInputChange(event);
      }
    },
    handleRadioChange(event) {
      if (!this.local_question.answers[0]) {
        this.local_question.answers[0] = {};
      }
      this.local_question.answers[0].choice_id = event.target.value;
    },
    handleCheckboxChange(event) {
      const choiceId = event.target.value;
      if (!this.local_question.answers) {
        this.local_question.answers = [];
      }
      const index = this.local_question.answers.findIndex(
        (answer) => answer.choice_id == choiceId
      );
      if (index > -1) {
        this.local_question.answers.splice(index, 1);
      } else {
        this.local_question.answers.push({ choice_id: choiceId });
      }
    },
    handleTextInputChange(event) {
      if (!this.local_question.answers[0]) {
        this.local_question.answers[0] = {};
      }
      this.local_question.answers[0].extra = event.target.value;
    },
  },
};
</script>
