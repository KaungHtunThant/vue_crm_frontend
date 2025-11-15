<template>
  <div>
    <audio controls>
      <source :src="message.fileUrl" :type="message.fileMimeType" />
      Your browser does not support the audio element.
    </audio>
  </div>
</template>
<script>
export default { props: { message: Object } };
</script>
