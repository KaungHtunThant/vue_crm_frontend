<template>
  <div
    :class="`${
      direction ? 'rightArrow' : 'leftArrow'
    } text-white position-absolute bg-primary p-2 opacity-25 z-3`"
  >
    <i
      :class="`fa-solid fa-chevron-${direction ? 'right' : 'left'} fs-1 p-3`"
    ></i>
  </div>
</template>
<script>
export default {
  name: "ScrollButton",
  props: {
    direction: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
<style scoped>
.rightArrow,
.leftArrow {
  transform: translateY(-50%);
  cursor: pointer;
  transition: all 0.5s;
  pointer-events: auto;
  width: fit-content;
}
.rightArrow:hover,
.leftArrow:hover {
  cursor: pointer;
  opacity: 0.8 !important;
}
.rightArrow {
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  right: 0%;
  z-index: 9999;
}
.leftArrow {
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  left: 0%;
  z-index: 9999;
}
</style>
