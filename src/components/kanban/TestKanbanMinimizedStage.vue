<template>
  <div class="kanban-stage position-relative">
    <div class="linePulse"></div>
    <button
      class="btn btn-sm btn-light mt-2 d-flex justify-content-center align-items-center btn-minimized"
      @click="stage_store.toggleMinimizedById(local_stage.id)"
    >
      <span>+</span>
    </button>
  </div>
</template>
<script>
import { useStageStore } from "@/stores/StageStore";
import { ref } from "vue";

export default {
  name: "MinimizedStage",
  props: {
    stage: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const stage_store = useStageStore();
    const local_stage = ref(props.stage);
    return {
      stage_store,
      local_stage,
    };
  },
};
</script>
<style scoped>
.kanban-stage {
  position: absolute;
  right: 0px;
  bottom: 0;
  height: 93%;
  background-color: transparent;
  border-right: 2px dashed #eee;
  width: 30px;
  min-width: 30px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: flex-start;
  justify-content: flex-start;
}
.btn-minimized {
  font-size: 14px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  align-self: flex-start;
}
</style>
