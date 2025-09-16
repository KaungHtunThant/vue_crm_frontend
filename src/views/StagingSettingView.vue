<template>
  <div class="mt-4 me-2 bg-white pb-0 pt-4 rounded-3 tableStage">
    <form>
      <h5 class="mb-4 ps-4">{{ $t("role-setting-title-stage") }}</h5>
      <div class="row my-3 border-bottom pb-2 mb-4 headerStage p-4">
        <div class="col-4">{{ $t("role-setting-stage-name") }}</div>
        <div class="col-4">{{ $t("role-setting-stage-status") }}</div>
        <div class="col-4">{{ $t("role-setting-stage-days") }}</div>
      </div>
      <div
        v-for="(stage, index) in stages"
        :key="index"
        class="row mb-3 px-4 py-2"
      >
        <div class="col-12">
          <div
            class="row align-items-center mb-3 border-bottom pb-2"
            :style="{
              borderLeft: `4px solid ${stage.color_code}`,
            }"
          >
            <div class="col-4 text-start">
              <span class="py-2 pe-4 ps-1 text-start">{{ stage.name }}</span>
            </div>
            <div class="col-4">
              <div class="form-group">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input shadow-none custom-switch"
                    type="checkbox"
                    :checked="stage.timer_status"
                    @change="changeStageStatus(stage.id)"
                  />
                </div>
              </div>
            </div>
            <div class="col-4">
              <input
                type="number"
                lang="en"
                v-model="stage.timer_allowed"
                placeholder="Days Counts"
                class="form-control"
                @change="updateStageTimer(stage.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { getStageTimers, updateStage } from "@/plugins/services/authService";
import { ref, onMounted } from "vue";

export default {
  name: "StageingSettingsView",
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const stages = ref([]);

    const getAllStages = async () => {
      try {
        const response = await getStageTimers();
        stages.value = response.data.data;
      } catch (error) {
        toast.error("Error loading stages");
      }
    };

    const changeStageStatus = async (id) => {
      try {
        const stage = stages.value.find((stage) => stage.id == id);
        if (stage) {
          stage.timer_status = stage.timer_status ? 0 : 1;
          console.log("Stage status:", stage.timer_status);
          await updateStage(id, { timer_status: stage.timer_status });
          toast.success("Stage status updated successfully");
        }
      } catch (error) {
        toast.error("Error updating stage status");
      }
    };

    const updateStageTimer = async (id) => {
      try {
        const stage = stages.value.find((stage) => stage.id == id);
        if (stage) {
          await updateStage(id, { timer_allowed: stage.timer_allowed });
          toast.success("Stage timer updated successfully");
        }
      } catch (error) {
        toast.error("Error updating stage timer");
      }
    };

    onMounted(() => {
      getAllStages();
    });

    return {
      t,
      toast,
      stages,
      getAllStages,
      changeStageStatus,
      updateStageTimer,
    };
  },
};
</script>

<style scoped>
.tableStage {
  max-height: 91vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.headerStage {
  position: sticky;
  top: -4%;
  background-color: #fff;
  width: 100% !important;
  z-index: 99;
}
.form-check-input:checked {
  background-color: #09b103 !important;
  border-color: #09b103 !important;
  box-shadow: none !important;
}
.custom-switch {
  width: 2.5rem !important;
  height: 1.4rem !important;
  cursor: pointer;
}
input {
  background-color: #f8f9fa !important;
}
input:focus {
  background-color: #f8f9fa !important;
  box-shadow: none !important;
  border-color: #b9b9b9 !important;
}
</style>
