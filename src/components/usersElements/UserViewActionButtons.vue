<template>
  <div>
    <button @click="editItem" class="btn btn-link p-0">
      <i class="fas fa-edit text-primary"></i>
    </button>
    <button @click="removeItem" class="btn btn-link text-danger ps-2">
      <i class="fas fa-trash"></i>
    </button>
  </div>
</template>

<script>
import { getUserById } from "@/plugins/services/userService";

export default {
  name: "UserViewActionButtons",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  emits: ["edit", "remove"],
  methods: {
    async editItem() {
      const response = await getUserById(this.item.id);
      if (response.status !== 200) {
        this.$emit("error", response.data.message);
        return;
      } else {
        this.$emit("edit", response.data.data);
      }
    },
    removeItem() {
      this.$emit("remove", this.item.id);
    },
  },
};
</script>
