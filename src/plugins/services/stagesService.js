import axios from "@/plugins/axios";

// get all stages
export const getStages = () => axios.get("/stages");
// get available stages
export const getAvailableStages = () => axios.get("/stages/deals");

// Get All Stages
// getStagesChildren
export const getStagesChildren = (parentId, limit, offset, filters = {}) =>
  axios.get(`/kanban/deals/${parentId}/children`, {
    params: {
      parentId: parentId,
      limit: limit,
      offset: offset,
      ...filters,
    },
  });

// get trash stages
export const getTrashStages = () => axios.get("/stages/trash");

// get stage timers
export const getStageTimers = async () => {
  return await axios.get("/settings/stages/timers");
};

// update stage
export const updateStage = async (id, params) => {
  return await axios.patch(`/stages/${id}`, params);
};

// get stages tasks
export const getStagesTasks = async () => {
  return await axios.get("/stages/tasks");
};
export const getAfterSalesKanban = async (params = {}) => {
  return axios.get("/kanban/after-sales", {
    params,
  });
};
