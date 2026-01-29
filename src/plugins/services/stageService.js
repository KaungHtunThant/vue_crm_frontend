import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/utils/errorLogger";

const getStagesBase = () => axios.get("/stages");

const getAllStagesBase = () => {
  return axios.get("/stages/all");
};

const getAvailableStagesBase = (stage = "deals") =>
  axios.get("/stages/" + stage);

const getStagesChildrenBase = (parentId, limit, offset, filters = {}) =>
  axios.get(`/kanban/deals/${parentId}/children`, {
    params: {
      parentId: parentId,
      limit: limit,
      offset: offset,
      ...filters,
    },
  });

const getTrashStagesBase = () => axios.get("/stages/trash");

const getAvailableAfterSalesStagesBase = () => axios.get("/stages/after-sales");

const getStageTimersBase = async () => {
  return await axios.get("/settings/stages/timers");
};

const updateStageBase = async (id, params) => {
  return await axios.patch(`/stages/${id}`, params);
};

const createStageBase = async (params) => {
  return await axios.post("/stages", params);
};

const deleteStageBase = async (id) => {
  return await axios.delete(`/stages/${id}`);
};

const getStagesTasksBase = async () => {
  return await axios.get("/stages/tasks");
};

const fetchTasksCountByStageNameBase = (stageName) => {
  const token = Cookies.get("authToken");
  return axios.get(`/tasks/count/${stageName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getStagesByBoardIdBase = (board_id) => {
  return axios.get(`/stages/board/${board_id}`);
};

export const getStages = withErrorLogging(getStagesBase, "getStages");
export const getAllStages = withErrorLogging(getAllStagesBase, "getAllStages");
export const getAvailableStages = withErrorLogging(
  getAvailableStagesBase,
  "getAvailableStages"
);
export const getStagesChildren = withErrorLogging(
  getStagesChildrenBase,
  "getStagesChildren"
);
export const getTrashStages = withErrorLogging(
  getTrashStagesBase,
  "getTrashStages"
);
export const getAvailableAfterSalesStages = withErrorLogging(
  getAvailableAfterSalesStagesBase,
  "getAvailableAfterSalesStages"
);
export const getStageTimers = withErrorLogging(
  getStageTimersBase,
  "getStageTimers"
);
export const updateStage = withErrorLogging(updateStageBase, "updateStage");
export const createStage = withErrorLogging(createStageBase, "createStage");
export const deleteStage = withErrorLogging(deleteStageBase, "deleteStage");
export const getStagesTasks = withErrorLogging(
  getStagesTasksBase,
  "getStagesTasks"
);
export const fetchTasksCountByStageName = withErrorLogging(
  fetchTasksCountByStageNameBase,
  "fetchTasksCountByStageName"
);
export const getStagesByBoardId = withErrorLogging(
  getStagesByBoardIdBase,
  "getStagesByBoardId"
);
