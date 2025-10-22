import axios from "@/plugins/axios";
import Cookies from "js-cookie";

export const getStages = () => axios.get("/stages");
export const getAllStages = () => {
  return axios.get("/stages/all");
};
export const getAvailableStages = (stage = "deals") =>
  axios.get("/stages/" + stage);

export const getStagesChildren = (parentId, limit, offset, filters = {}) =>
  axios.get(`/kanban/deals/${parentId}/children`, {
    params: {
      parentId: parentId,
      limit: limit,
      offset: offset,
      ...filters,
    },
  });

export const getTrashStages = () => axios.get("/stages/trash");
export const getAvailableAfterSalesStages = () =>
  axios.get("/stages/after-sales");

export const getStageTimers = async () => {
  return await axios.get("/settings/stages/timers");
};
export const updateStage = async (id, params) => {
  return await axios.patch(`/stages/${id}`, params);
};
export const createStage = async (params) => {
  return await axios.post("/stages", params);
};
export const deleteStage = async (id) => {
  return await axios.delete(`/stages/${id}`);
};
export const getStagesTasks = async () => {
  return await axios.get("/stages/tasks");
};

export const fetchTasksCountByStageName = (stageName) => {
  const token = Cookies.get("authToken");
  return axios.get(`/tasks/count/${stageName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
