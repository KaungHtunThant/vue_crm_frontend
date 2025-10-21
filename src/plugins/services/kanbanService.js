import axios from "@/plugins/axios";

export const getDealsKanban = async (params = {}) => {
  return axios.get("/kanban/deals", {
    params,
  });
};

export const getTasksKanban = async (params) => {
  return await axios.get("/kanban/tasks", {
    params,
  });
};

export const getEmrKanban = async (params) => {
  return await axios.get("/kanban/emr", {
    params,
  });
};

export const getKanbanBroadcasts = async () => {
  return await axios.get("/kanban/broadcasts");
};

export const getKanbanQuestions = async (deal_id) => {
  return await axios.get(`/kanban/qa/${deal_id}`);
};

// export const getAfterSalesKanban = async (params = {}) => {
//   return axios.get("/kanban/after-sales", {
//     params,
//   });
// };
