<template>
  <div class="form-check form-switch">
    <input
      class="form-check-input"
      type="checkbox"
      role="switch"
      :checked="modelValue"
      @change="toggleSwitch"
      style="width: 2.5rem; height: 1.3rem"
    />
  </div>
</template>

<script>
export default {
  name: "UserViewStatusAccount",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    toggleSwitch(event) {
      this.$emit("update:modelValue", event.target.checked);
    },
  },
};
</script>
