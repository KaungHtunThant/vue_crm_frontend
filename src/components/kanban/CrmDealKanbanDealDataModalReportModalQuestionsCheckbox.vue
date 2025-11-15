<template>
  <div class="form-check">
    <input
      class="form-check-input p-2"
      type="checkbox"
      :value="choice.id"
      :checked="answer_included"
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
  name: "CheckboxButton",
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
      type: Array,
      required: true,
    },
  },
  computed: {
    answer_included() {
      if (this.answers) {
        return this.answers.some(
          (answer) => answer.choice_id == this.choice.id
        );
      }
      return false;
    },
  },
  data() {
    return {
      selectedValue: null,
      selectedViagraDosages: [],
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
