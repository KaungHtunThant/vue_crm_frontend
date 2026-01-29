import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _createTask = (formData) => {
  return axios.post("/tasks", formData);
};

const _updateTask = async (id, formData) => {
  return await axios.patch(`/tasks/${id}`, formData);
};

const _getTasksByDealId = async (dealId) => {
  return await axios.get(`/tasks/${dealId}`);
};

const _getTasksByDate = async (start_date, end_date) => {
  return await axios.get("/tasks/calendar", {
    params: {
      start_date: start_date,
      end_date: end_date,
    },
  });
};

const _bulkDeleteTasks = async (ids) => {
  return await axios.post("/tasks/bulk-delete", {
    ids: ids,
  });
};

const _setTasksProcessing = async (id) => {
  return await axios.post(`/tasks/set-processing/${id}`);
};

export const createTask = withErrorLogging(
  _createTask,
  "taskService/createTask"
);
export const updateTask = withErrorLogging(
  _updateTask,
  "taskService/updateTask"
);
export const getTasksByDealId = withErrorLogging(
  _getTasksByDealId,
  "taskService/getTasksByDealId"
);
export const getTasksByDate = withErrorLogging(
  _getTasksByDate,
  "taskService/getTasksByDate"
);
export const bulkDeleteTasks = withErrorLogging(
  _bulkDeleteTasks,
  "taskService/bulkDeleteTasks"
);
export const setTasksProcessing = withErrorLogging(
  _setTasksProcessing,
  "taskService/setTasksProcessing"
);
