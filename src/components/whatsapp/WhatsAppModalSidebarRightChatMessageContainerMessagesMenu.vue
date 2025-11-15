<template>
  <div
    class="menu-list position-absolute bg-light border rounded shadow-sm z-3 bottom-100"
  >
    <ul class="list-unstyled mb-0 m-auto px-2 lh-lg">
      <li v-if="message.fileDownloadUrl">
        <a
          class="text-decoration-none text-primary"
          :href="message.fileDownloadUrl"
          :download="message.fileName"
          target="_blank"
          >Download</a
        >
      </li>
      <li>
        <a
          class="text-decoration-none text-primary"
          href="#"
          @click.prevent="$emit('copy')"
          >Copy</a
        >
      </li>
      <li>
        <a
          class="text-decoration-none text-primary"
          href="#"
          @click.prevent="$emit('reply')"
          >Reply</a
        >
      </li>
      <li>
        <a
          class="text-decoration-none text-primary"
          href="#"
          @click.prevent="$emit('delete')"
          >Delete</a
        >
      </li>
    </ul>
  </div>
</template>
<script>
export default { props: { message: Object, index: Number } };
</script>
