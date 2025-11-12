<template>
  <div>
    <button @click="editItem" class="btn btn-link p-0">
      <i class="fas fa-edit text-primary"></i>
    </button>
    <button @click="getsalary" class="btn btn-link text-primary px-2">
      <i class="fas fa-file-invoice-dollar"></i>
    </button>
    <button @click="getLoginDetails" class="btn btn-link text-primary px-2">
      <i class="fas fa-history"></i>
    </button>
    <button @click="removeItem" class="btn btn-link text-danger p-0">
      <i class="fas fa-trash"></i>
    </button>
  </div>
</template>

<script>
import { getUserById } from "@/plugins/services/userService";
import router from "@/router";
export default {
  name: "UserViewActionButtons",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  emits: ["edit", "remove", "getsalary", "error", "showLoginDetails"],
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
    async getsalary() {
      const response = await getUserById(this.item.id);
      if (response.status !== 200) {
        this.$emit("error", response.data.message);
        return;
      } else {
        router.push({
          name: "UsersSalaryView",
          params: {
            userId: this.item.id,
          },
        });
        this.$emit("getsalary", response.data.data);
      }
    },
    removeItem() {
      this.$emit("remove", this.item.id);
    },
    async getLoginDetails() {
      const res = await getUserById(this.item.id);
      if (res.status !== 200) {
        this.$emit("error", res.data.message);
        return;
      } else {
        this.$emit("showLoginDetails", res.data.data);
      }
    },
  },
};
</script>
