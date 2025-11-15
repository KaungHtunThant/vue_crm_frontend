<template>
  <div>
    <img
      :src="message.fileUrl"
      alt="صورة مرسلة"
      class="img-fluid rounded-2"
      @click="$emit('open-fullscreen', message.fileUrl)"
    />
  </div>
</template>
<script>
export default { props: { message: Object } };
</script>
