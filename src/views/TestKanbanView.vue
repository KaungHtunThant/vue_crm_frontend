<template>
  <test-kanban-top-header />
  <test-kanban-board />
</template>

<script>
import testKanbanBoard from "@/components/kanban/TestKanbanBoard.vue";
import TestKanbanTopHeader from "@/components/kanban/TestKanbanTopHeader.vue";
export default {
  name: "TestKanbanView",

  components: {
    testKanbanBoard,
    TestKanbanTopHeader,
  },
};
</script>
