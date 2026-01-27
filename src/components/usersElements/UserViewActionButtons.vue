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
import { useUserStore } from "@/stores/UserStore";
import router from "@/router";
export default {
  name: "UserViewActionButtons",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const userStore = useUserStore();
    const editItem = () => {
      userStore.fetchSelectedUser(props.item.id);
      emit("edit", props.item.id);
    };
    return {
      editItem,
      userStore,
    };
  },
  emits: ["edit", "remove", "getsalary", "error", "showLoginDetails"],
  methods: {
    async getsalary() {
      await this.userStore.fetchSelectedUser(this.item.id);
      router.push({
        name: "UsersSalaryView",
        params: {
          userId: this.item.id,
        },
      });
    },
    removeItem() {
      this.$emit("remove", this.item.id);
    },
    async getLoginDetails() {
      await this.userStore.fetchSelectedUser(this.item.id);
      const selectedUser = this.userStore.getSelectedUser;
      this.$emit("showLoginDetails", selectedUser);
    },
  },
};
</script>
