<template>
  <button class="btn fs-6 px-2 btn-whatsapp py-auto align-items-center">
    <i class="fa-brands fa-whatsapp me-1 fs-5"></i>
    {{ $t("kanban-modal-edit-whatsapp") }}
  </button>
</template>
<script>
export default {
  name: "TestWhatsappButton",
};
</script>
<style scoped>
.btn-whatsapp {
  background-color: #25d366;
  color: white;
  border: none;
  min-width: 110px;
  transition: 0.3s;
}
.btn-whatsapp:hover {
  background-color: white;
  color: #333333;
  transition: 0.3s;
}
.fs-7 {
  font-size: 0.85rem;
}
</style>
