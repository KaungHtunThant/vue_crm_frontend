import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const createTaskFn = (formData) => {
  return axios.post("/tasks", formData);
};
export const createTask = withErrorLogging(createTaskFn, "taskService.createTask");

const updateTaskFn = async (id, formData) => {
  return await axios.patch(`/tasks/${id}`, formData);
};
export const updateTask = withErrorLogging(updateTaskFn, "taskService.updateTask");

const getTasksByDealIdFn = async (dealId) => {
  return await axios.get(`/tasks/${dealId}`);
};
export const getTasksByDealId = withErrorLogging(getTasksByDealIdFn, "taskService.getTasksByDealId");

const getTasksByDateFn = async (start_date, end_date) => {
  return await axios.get("/tasks/calendar", {
    params: {
      start_date: start_date,
      end_date: end_date,
    },
  });
};
export const getTasksByDate = withErrorLogging(getTasksByDateFn, "taskService.getTasksByDate");

const bulkDeleteTasksFn = async (ids) => {
  return await axios.post("/tasks/bulk-delete", {
    ids: ids,
  });
};
export const bulkDeleteTasks = withErrorLogging(bulkDeleteTasksFn, "taskService.bulkDeleteTasks");

const setTasksProcessingFn = async (id) => {
  return await axios.post(`/tasks/set-processing/${id}`);
};
export const setTasksProcessing = withErrorLogging(setTasksProcessingFn, "taskService.setTasksProcessing");
