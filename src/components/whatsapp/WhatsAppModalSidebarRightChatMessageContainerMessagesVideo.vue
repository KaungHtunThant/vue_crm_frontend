<template>
  <div>
    <video :src="message.fileUrl" controls class="img-fluid rounded-2"></video>
  </div>
</template>
<script>
export default { props: { message: Object } };
</script>
