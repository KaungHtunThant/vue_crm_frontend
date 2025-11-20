import {
  createTask,
  getTasksByDate,
  getTasksByDealId,
  updateTask,
  bulkDeleteTasks as bulkDelete,
} from "@/plugins/services/taskService";
import { fetchTasksCountByStageName } from "@/plugins/services/stageService";
import { defineStore } from "pinia";

export const useTaskStore = defineStore("task", {
  state: () => ({
    overdue_count: 0,
    today_count: 0,
    tomorrow_count: 0,
    idle_count: 0,
    tasks: [],
    calendar_tasks: [],
    status_change_trigger: false, // temporary solution
  }),
  getters: {
    getOverdueCount: (state) => state.overdue_count,
    getTodayCount: (state) => state.today_count,
    getTomorrowCount: (state) => state.tomorrow_count,
    getIdleCount: (state) => state.idle_count,
    getCurrentTasks: (state) =>
      state.tasks.filter((task) => task.status !== "completed"),
    getCalendarTasks: (state) => state.calendar_tasks,
    getStatusChangeTrigger: (state) => state.status_change_trigger,
  },
  actions: {
    async fetchTaskCounts() {
      try {
        const task_stages = ["Overdue", "Today", "Tomorrow", "Idle"];
        for (const stage of task_stages) {
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
    async addTaskToCurrentTasks(
      description,
      duedate,
      duetime,
      deal_id,
      type = "sales"
    ) {
      const tempId = Date.now();
      const optimisticTask = {
        id: tempId,
        decription: description,
        duedate: duedate,
        duetime: duetime,
        deal_id: deal_id,
        type: type,
      };
      this.tasks.push(optimisticTask);
      try {
        const formData = new FormData();
        formData.append("description", description);
        formData.append("duedate", duedate);
        formData.append("duetime", duetime);
        formData.append("deal_id", deal_id);
        formData.append("type", type);
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
    async updateTask(
      id,
      duedate,
      duetime = null,
      description = null,
      status = null
    ) {
      try {
        const response = await updateTask(id, {
          duedate: duedate,
          duetime: duetime,
          description: description,
          status: status,
        });
        if (response.status !== 200) {
          throw new Error(response.data.message);
        }
        return {
          success: true,
          message: response.data.message || "Task updated successfully",
        };
      } catch (error) {
        console.error("Error updating task:", error);
        return {
          success: false,
          message: error.message || "Error updating task",
        };
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
    async fetchCalendarTasksByDate(start_date, end_date) {
      try {
        const response = await getTasksByDate(start_date, end_date);
        if (response.status !== 200) {
          throw new Error(response.data.message);
        }
        this.calendar_tasks = response.data.data || [];
        return response.data.data;
      } catch (error) {
        console.error("Error fetching calendar tasks:", error);
        return {
          success: false,
          message: error.message || "Error fetching calendar tasks",
        };
      }
    },
    toggleStatusChangeTrigger() {
      this.status_change_trigger = !this.status_change_trigger;
    },
    async bulkDeleteTasks(task_ids) {
      try {
        const response = await bulkDelete(task_ids);
        if (response.status === 200 || response.status === 204) {
          return {
            success: true,
            message: response.data.message,
          };
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error bulk deleting tasks:", error);
        return {
          success: false,
          message: error.message || "Error bulk deleting tasks",
        };
      }
    },
  },
});
