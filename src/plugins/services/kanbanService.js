import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getDealsKanbanBase = async (params = {}) => {
  return axios.get("/kanban/deals", {
    params,
  });
};

const getTasksKanbanBase = async (params) => {
  return await axios.get("/kanban/tasks", {
    params,
  });
};

const getEmrKanbanBase = async (params) => {
  return await axios.get("/kanban/emr", {
    params,
  });
};

const getKanbanBroadcastsBase = async () => {
  return await axios.get("/kanban/broadcasts");
};

const getKanbanQuestionsBase = async (deal_id) => {
  return await axios.get(`/kanban/qa/${deal_id}`);
};

export const getDealsKanban = withErrorLogging(
  getDealsKanbanBase,
  "getDealsKanban"
);
export const getTasksKanban = withErrorLogging(
  getTasksKanbanBase,
  "getTasksKanban"
);
export const getEmrKanban = withErrorLogging(getEmrKanbanBase, "getEmrKanban");
export const getKanbanBroadcasts = withErrorLogging(
  getKanbanBroadcastsBase,
  "getKanbanBroadcasts"
);
export const getKanbanQuestions = withErrorLogging(
  getKanbanQuestionsBase,
  "getKanbanQuestions"
);

// export const getAfterSalesKanban = async (params = {}) => {
//   return axios.get("/kanban/after-sales", {
//     params,
//   });
// };
