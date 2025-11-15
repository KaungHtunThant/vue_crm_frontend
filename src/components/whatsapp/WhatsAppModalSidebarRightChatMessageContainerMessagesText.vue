<template>
  <div class="message-text" style="white-space: pre-line">
    {{ message.text }}
  </div>
</template>
<script>
export default { props: { message: Object } };
</script>
