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
import { useUserStore } from "@/stores/UserStore";

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
    };
  },
  emits: ["edit", "remove"],
  methods: {
    removeItem() {
      this.$emit("remove", this.item.id);
    },
  },
};
</script>
