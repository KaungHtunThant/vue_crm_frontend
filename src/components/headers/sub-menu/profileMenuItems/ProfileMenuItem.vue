<template>
  <li>
    <button type="button" class="btn dropdown-item" @click="$emit('click')">
      <span class="dropdown-icon me-2 text-secondary">
        <i :class="`fa-solid ${icon}`"></i>
      </span>
      <span style="font-size: 15px"
        ><slot>{{ title }}</slot></span
      >
    </button>
  </li>
</template>

<script>
export default {
  props: {
    title: String,
    icon: String,
  },
};
</script>
