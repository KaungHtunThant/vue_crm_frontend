<template>
  <li>
    <button
      type="button"
      class="btn dropdown-item"
      @click="$emit('click')"
      :title="title"
    >
      <span class="dropdown-icon me-2 text-secondary">
        <i :class="`fa-solid ${icon}`"></i>
      </span>
      <span style="font-size: 15px"
        ><slot>{{ label }}</slot></span
      >
    </button>
  </li>
</template>

<script>
export default {
  name: "TheTopHeaderDropDownMenuProfileMenuItem",
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
};
</script>
