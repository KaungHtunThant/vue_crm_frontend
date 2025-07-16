import {
  createTask,
  fetchTasksCountByStageName,
  getTasksByDealId,
} from "@/plugins/services/authService";
import { defineStore } from "pinia";

export const useTaskStore = defineStore("task", {
  state: () => ({
    overdue_count: 0,
    today_count: 0,
    tomorrow_count: 0,
    idle_count: 0,
    task: [],
  }),
  getters: {
    getOverdueCount: (state) => state.overdue_count,
    getTodayCount: (state) => state.today_count,
    getTomorrowCount: (state) => state.tomorrow_count,
    getIdleCount: (state) => state.idle_count,
    getCurrentTasks: (state) => state.task,
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
    async fetchCurrentTasks(deal_id) {
      try {
        await getTasksByDealId(deal_id).then((res) => {
          if (res.status !== 200) {
            throw new Error(res.data.message);
          }
          this.task = res.data.data || [];
        });
      } catch (error) {
        console.error("Error fetching current tasks:", error);
        throw error;
      }
    },
    async addTaskToCurrentTasks(description, duedate, duetime, deal_id) {
      const tempId = Date.now();
      const optimisticTask = {
        id: tempId,
        decription: description,
        duedate: duedate,
        duetime: duetime,
        deal_id: deal_id,
      };
      this.task.push(optimisticTask);
      try {
        const formData = new FormData();
        formData.append("description", description);
        formData.append("duedate", duedate);
        formData.append("duetime", duetime);
        formData.append("deal_id", deal_id);
        const response = await createTask(formData);
        if (response.status !== 201 && response.status !== 200) {
          throw new Error(response.data.message);
        }
        const index = this.task.findIndex((task) => task.id === tempId);
        if (index !== -1) {
          this.task[index] = { ...response.data.data };
        }
        const duedate_stage = this._determineDuedate(duedate);
        if (duedate_stage) {
          this.addCount(duedate_stage);
        } else {
          throw new Error("Invalid due date");
        }
      } catch (error) {
        // Rollback optimistic update if API call fails
        this.task = this.task.filter((task) => task.id !== tempId);
        throw error;
      }
    },
    removeTaskFromCurrentTasks(task_id) {
      this.task = this.task.filter((task) => task.id !== task_id);
    },
    updateTaskInCurrentTasks(updated_task) {
      const index = this.task.findIndex((task) => task.id === updated_task.id);
      if (index !== -1) {
        this.task[index] = updated_task;
      } else {
        console.warn(
          `Task with ID ${updated_task.id} not found in current tasks`
        );
      }
    },
    _determineDuedate(duedate) {
      const date = new Date(duedate);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      if (!date) {
        return "idle";
      } else if (date === today) {
        return "today";
      } else if (date === tomorrow) {
        return "tomorrow";
      } else if (date < today) {
        return "overdue";
      } else {
        return false;
      }
    },
  },
});
