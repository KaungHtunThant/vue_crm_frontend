import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/utils/errorLogger";

const _getStages = () => axios.get("/stages");
const _getAllStages = () => {
  return axios.get("/stages/all");
};
const _getAvailableStages = (stage = "deals") =>
  axios.get("/stages/" + stage);

const _getStagesChildren = (parentId, limit, offset, filters = {}) =>
  axios.get(`/kanban/deals/${parentId}/children`, {
    params: {
      parentId: parentId,
      limit: limit,
      offset: offset,
      ...filters,
    },
  });

const _getTrashStages = () => axios.get("/stages/trash");
const _getAvailableAfterSalesStages = () =>
  axios.get("/stages/after-sales");

const _getStageTimers = async () => {
  return await axios.get("/settings/stages/timers");
};
const _updateStage = async (id, params) => {
  return await axios.patch(`/stages/${id}`, params);
};
const _createStage = async (params) => {
  return await axios.post("/stages", params);
};
const _deleteStage = async (id) => {
  return await axios.delete(`/stages/${id}`);
};
const _getStagesTasks = async () => {
  return await axios.get("/stages/tasks");
};

const _fetchTasksCountByStageName = (stageName) => {
  const token = Cookies.get("authToken");
  return axios.get(`/tasks/count/${stageName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const _getStagesByBoardId = (board_id) => {
  return axios.get(`/stages/board/${board_id}`);
};

export const getStages = withErrorLogging(_getStages, "stageService/getStages");
export const getAllStages = withErrorLogging(_getAllStages, "stageService/getAllStages");
export const getAvailableStages = withErrorLogging(_getAvailableStages, "stageService/getAvailableStages");
export const getStagesChildren = withErrorLogging(_getStagesChildren, "stageService/getStagesChildren");
export const getTrashStages = withErrorLogging(_getTrashStages, "stageService/getTrashStages");
export const getAvailableAfterSalesStages = withErrorLogging(_getAvailableAfterSalesStages, "stageService/getAvailableAfterSalesStages");
export const getStageTimers = withErrorLogging(_getStageTimers, "stageService/getStageTimers");
export const updateStage = withErrorLogging(_updateStage, "stageService/updateStage");
export const createStage = withErrorLogging(_createStage, "stageService/createStage");
export const deleteStage = withErrorLogging(_deleteStage, "stageService/deleteStage");
export const getStagesTasks = withErrorLogging(_getStagesTasks, "stageService/getStagesTasks");
export const fetchTasksCountByStageName = withErrorLogging(_fetchTasksCountByStageName, "stageService/fetchTasksCountByStageName");
export const getStagesByBoardId = withErrorLogging(_getStagesByBoardId, "stageService/getStagesByBoardId");
