<template>
  <div>
    <a
      :href="message.fileDownloadUrl"
      target="_blank"
      class="text-decoration-none text-primary"
    >
      <i class="fa-solid fa-file-lines"></i> {{ message.fileName }}
    </a>
  </div>
</template>
<script>
export default { props: { message: Object } };
</script>
