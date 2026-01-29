import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/plugins/errorLogger";

const getStagesFn = () => axios.get("/stages");
export const getStages = withErrorLogging(getStagesFn, "stageService.getStages");

const getAllStagesFn = () => {
  return axios.get("/stages/all");
};
export const getAllStages = withErrorLogging(getAllStagesFn, "stageService.getAllStages");

const getAvailableStagesFn = (stage = "deals") =>
  axios.get("/stages/" + stage);
export const getAvailableStages = withErrorLogging(getAvailableStagesFn, "stageService.getAvailableStages");

const getStagesChildrenFn = (parentId, limit, offset, filters = {}) =>
  axios.get(`/kanban/deals/${parentId}/children`, {
    params: {
      parentId: parentId,
      limit: limit,
      offset: offset,
      ...filters,
    },
  });
export const getStagesChildren = withErrorLogging(getStagesChildrenFn, "stageService.getStagesChildren");

const getTrashStagesFn = () => axios.get("/stages/trash");
export const getTrashStages = withErrorLogging(getTrashStagesFn, "stageService.getTrashStages");

const getAvailableAfterSalesStagesFn = () =>
  axios.get("/stages/after-sales");
export const getAvailableAfterSalesStages = withErrorLogging(getAvailableAfterSalesStagesFn, "stageService.getAvailableAfterSalesStages");

const getStageTimersFn = async () => {
  return await axios.get("/settings/stages/timers");
};
export const getStageTimers = withErrorLogging(getStageTimersFn, "stageService.getStageTimers");

const updateStageFn = async (id, params) => {
  return await axios.patch(`/stages/${id}`, params);
};
export const updateStage = withErrorLogging(updateStageFn, "stageService.updateStage");

const createStageFn = async (params) => {
  return await axios.post("/stages", params);
};
export const createStage = withErrorLogging(createStageFn, "stageService.createStage");

const deleteStageFn = async (id) => {
  return await axios.delete(`/stages/${id}`);
};
export const deleteStage = withErrorLogging(deleteStageFn, "stageService.deleteStage");

const getStagesTasksFn = async () => {
  return await axios.get("/stages/tasks");
};
export const getStagesTasks = withErrorLogging(getStagesTasksFn, "stageService.getStagesTasks");

const fetchTasksCountByStageNameFn = (stageName) => {
  const token = Cookies.get("authToken");
  return axios.get(`/tasks/count/${stageName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const fetchTasksCountByStageName = withErrorLogging(fetchTasksCountByStageNameFn, "stageService.fetchTasksCountByStageName");

const getStagesByBoardIdFn = (board_id) => {
  return axios.get(`/stages/board/${board_id}`);
};
export const getStagesByBoardId = withErrorLogging(getStagesByBoardIdFn, "stageService.getStagesByBoardId");
