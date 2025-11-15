<template>
  <div class="form-check">
    <input
      class="form-check-input p-2"
      type="radio"
      :value="choice.id"
      :checked="is_answer"
      :id="`q-${question_id}-c-${choice.id}`"
      :name="`q-${question_id}`"
    />
    <label class="form-check-label" :for="`q-${question_id}-c-${choice.id}`">{{
      choice.value
    }}</label>
  </div>
</template>

<script>
export default {
  name: "RadioButton",
  props: {
    question_id: {
      type: Number,
      required: true,
    },
    choice: {
      type: Object,
      required: true,
    },
    answers: {
      type: String,
      required: false,
    },
  },
  computed: {
    is_answer() {
      if (this.answers) {
        const answers = this.answers;
        if (Array.isArray(answers)) {
          return answers.some((answer) => {
            return answer.choice_id == this.choice.id;
          });
        } else {
          return false;
        }
      }
      return false;
    },
  },
  data() {
    return {
      selectedValue: null,
    };
  },
};
</script>

<style scoped>
.form-check-input:checked {
  background-color: var(--bs-dark);
  border-color: var(--bs-dark-subtle);
}
</style>
