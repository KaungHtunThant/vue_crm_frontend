import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const createTaskBase = (formData) => {
  return axios.post("/tasks", formData);
};

const updateTaskBase = async (id, formData) => {
  return await axios.patch(`/tasks/${id}`, formData);
};

const getTasksByDealIdBase = async (dealId) => {
  return await axios.get(`/tasks/${dealId}`);
};

const getTasksByDateBase = async (start_date, end_date) => {
  return await axios.get("/tasks/calendar", {
    params: {
      start_date: start_date,
      end_date: end_date,
    },
  });
};

const bulkDeleteTasksBase = async (ids) => {
  return await axios.post("/tasks/bulk-delete", {
    ids: ids,
  });
};

const setTasksProcessingBase = async (id) => {
  return await axios.post(`/tasks/set-processing/${id}`);
};

export const createTask = withErrorLogging(createTaskBase, "createTask");
export const updateTask = withErrorLogging(updateTaskBase, "updateTask");
export const getTasksByDealId = withErrorLogging(getTasksByDealIdBase, "getTasksByDealId");
export const getTasksByDate = withErrorLogging(getTasksByDateBase, "getTasksByDate");
export const bulkDeleteTasks = withErrorLogging(bulkDeleteTasksBase, "bulkDeleteTasks");
export const setTasksProcessing = withErrorLogging(setTasksProcessingBase, "setTasksProcessing");
