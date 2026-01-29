import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getDealsKanban = async (params = {}) => {
  return axios.get("/kanban/deals", {
    params,
  });
};

const _getTasksKanban = async (params) => {
  return await axios.get("/kanban/tasks", {
    params,
  });
};

const _getEmrKanban = async (params) => {
  return await axios.get("/kanban/emr", {
    params,
  });
};

const _getKanbanBroadcasts = async () => {
  return await axios.get("/kanban/broadcasts");
};

const _getKanbanQuestions = async (deal_id) => {
  return await axios.get(`/kanban/qa/${deal_id}`);
};

export const getDealsKanban = withErrorLogging(
  _getDealsKanban,
  "kanbanService/getDealsKanban"
);
export const getTasksKanban = withErrorLogging(
  _getTasksKanban,
  "kanbanService/getTasksKanban"
);
export const getEmrKanban = withErrorLogging(
  _getEmrKanban,
  "kanbanService/getEmrKanban"
);
export const getKanbanBroadcasts = withErrorLogging(
  _getKanbanBroadcasts,
  "kanbanService/getKanbanBroadcasts"
);
export const getKanbanQuestions = withErrorLogging(
  _getKanbanQuestions,
  "kanbanService/getKanbanQuestions"
);

// export const getAfterSalesKanban = async (params = {}) => {
//   return axios.get("/kanban/after-sales", {
//     params,
//   });
// };
