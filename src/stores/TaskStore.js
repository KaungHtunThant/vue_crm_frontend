import { fetchTasksCountByStageName } from "@/plugins/services/authService";
import { defineStore } from "pinia";

export const useTaskStore = defineStore("task", {
  state: () => ({
    overdue_count: 0,
    today_count: 0,
    tomorrow_count: 0,
    idle_count: 0,
  }),
  getters: {
    getOverdueCount: (state) => state.overdue_count,
    getTodayCount: (state) => state.today_count,
    getTomorrowCount: (state) => state.tomorrow_count,
    getIdleCount: (state) => state.idle_count,
  },
  actions: {
    async fetchTaskCounts() {
      try {
        const task_stages = ["Overdue", "Today", "Tomorrow", "Idle"];
        for (const stage of task_stages) {
          console.log(`Fetching count for stage: ${stage}`);
          await fetchTasksCountByStageName(stage).then((res) => {
            if (res.status !== 200) {
              throw new Error(res.data.message);
            }
            switch (stage) {
              case "Today":
                this.today_count = res.data.data || 0;
                break;
              case "Tomorrow":
                this.tomorrow_count = res.data.data || 0;
                break;
              case "Idle":
                this.idle_count = res.data.data || 0;
                break;
              case "Overdue":
                this.overdue_count = res.data.data || 0;
                break;
              default:
                console.warn(`Unknown stage: ${stage}`);
                break;
            }
          });
        }
      } catch (error) {
        console.error("Error fetching task counts:", error);
        throw error;
      }
    },
    addCount(stage_name) {
      switch (stage_name) {
        case "today":
          this.today_count += 1;
          break;
        case "tomorrow":
          this.tomorrow_count += 1;
          break;
        case "idle":
          this.idle_count += 1;
          break;
        case "overdue":
          this.overdue_count += 1;
          break;
        default:
          console.warn(`Unknown stage name: ${stage_name}`);
          break;
      }
    },
    removeCount(stage_name) {
      switch (stage_name) {
        case "today":
          this.today_count -= 1;
          break;
        case "tomorrow":
          this.tomorrow_count -= 1;
          break;
        case "idle":
          this.idle_count -= 1;
          break;
        case "overdue":
          this.overdue_count -= 1;
          break;
        default:
          console.warn(`Unknown stage name: ${stage_name}`);
          break;
      }
    },
  },
});
