import {
  createTask,
  fetchTasksCountByStageName,
  getTasksByDealId,
  updateTask,
} from "@/plugins/services/authService";
import { defineStore } from "pinia";

export const useTaskStore = defineStore("task", {
  state: () => ({
    overdue_count: 0,
    today_count: 0,
    tomorrow_count: 0,
    idle_count: 0,
    tasks: [],
  }),
  getters: {
    getOverdueCount: (state) => state.overdue_count,
    getTodayCount: (state) => state.today_count,
    getTomorrowCount: (state) => state.tomorrow_count,
    getIdleCount: (state) => state.idle_count,
    getCurrentTasks: (state) =>
      state.tasks.filter((task) => task.tatus !== "completed"),
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
          this.tasks = res.data.data || [];
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
      this.tasks.push(optimisticTask);
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
        const index = this.tasks.findIndex((task) => task.id === tempId);
        if (index !== -1) {
          this.tasks[index] = { ...response.data.data };
        }
        const duedate_stage = this._determineDuedate(duedate);
        if (duedate_stage) {
          this.addCount(duedate_stage);
        } else {
          throw new Error("Invalid due date");
        }
      } catch (error) {
        // Rollback optimistic update if API call fails
        this.tasks = this.tasks.filter((task) => task.id !== tempId);
        throw error;
      }
    },
    removeTaskFromCurrentTasks(task_id) {
      const index = this.tasks.findIndex((task) => task.id === task_id);
      if (index === -1) {
        console.warn(`Task with ID ${task_id} not found in current tasks`);
        return;
      }
      const removedTask = this.tasks[index];
      this.tasks.splice(index, 1);
      const duedate_stage = this._determineDuedate(removedTask.duedate);
      if (duedate_stage) {
        this.removeCount(duedate_stage);
      } else {
        console.warn("Invalid due date for removed task");
      }
    },
    updateTaskInCurrentTasks(task_id, duedate, duetime, description, status) {
      const index = this.tasks.findIndex((task) => task.id === task_id);
      const backup_task = this.tasks[index];
      const formData = new FormData();
      formData.append("duedate", duedate ?? backup_task.duedate);
      formData.append("duetime", duetime ?? backup_task.duetime);
      formData.append("description", description ?? backup_task.description);
      formData.append("status", status ?? backup_task.status);
      const optimisticTask = {
        decription: description ?? backup_task.description,
        duedate: duedate ?? backup_task.duedate,
        duetime: duetime ?? backup_task.duetime,
      };
      if (index === -1) {
        console.warn(`Task with ID ${task_id} not found in current tasks`);
        return;
      }
      this.tasks[index] = { ...backup_task, ...optimisticTask };
      try {
        updateTask(formData).then((res) => {
          if (res.status !== 200) {
            throw new Error(res.data.message);
          }
          this.tasks[index] = { ...res.data.data };
        });
      } catch (error) {
        console.error("Error updating task:", error);
        this.tasks[index] = backup_task;
        throw error;
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
