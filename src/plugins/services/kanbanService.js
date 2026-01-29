import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getDealsKanbanFn = async (params = {}) => {
  return axios.get("/kanban/deals", {
    params,
  });
};
export const getDealsKanban = withErrorLogging(getDealsKanbanFn, "kanbanService.getDealsKanban");

const getTasksKanbanFn = async (params) => {
  return await axios.get("/kanban/tasks", {
    params,
  });
};
export const getTasksKanban = withErrorLogging(getTasksKanbanFn, "kanbanService.getTasksKanban");

const getEmrKanbanFn = async (params) => {
  return await axios.get("/kanban/emr", {
    params,
  });
};
export const getEmrKanban = withErrorLogging(getEmrKanbanFn, "kanbanService.getEmrKanban");

const getKanbanBroadcastsFn = async () => {
  return await axios.get("/kanban/broadcasts");
};
export const getKanbanBroadcasts = withErrorLogging(getKanbanBroadcastsFn, "kanbanService.getKanbanBroadcasts");

const getKanbanQuestionsFn = async (deal_id) => {
  return await axios.get(`/kanban/qa/${deal_id}`);
};
export const getKanbanQuestions = withErrorLogging(getKanbanQuestionsFn, "kanbanService.getKanbanQuestions");

// export const getAfterSalesKanban = async (params = {}) => {
//   return axios.get("/kanban/after-sales", {
//     params,
//   });
// };
