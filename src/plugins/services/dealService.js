import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/plugins/errorLogger";

// Get All Deals
const getDealsFn = async (params = {}) => {
  const token = Cookies.get("authToken");

  const { filters, ...restParams } = params;

  return axios.get("/deals", {
    params: {
      page: params.page || 1,
      per_page: params.per_page || 10,
      sort_by: params.sort_by || "created_at",
      sort_type: params.sort_type || "desc",
      ...filters,
      ...restParams,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getDeals = withErrorLogging(getDealsFn, "dealService.getDeals");

const fetchAdditionalDealsByStageIdFn = (
  stageId,
  limit,
  offset,
  filters = {}
) => {
  return axios.get(`/deals/get-more`, {
    params: {
      stage_id: stageId,
      limit: limit,
      offset: offset,
      ...filters,
    },
  });
};
export const fetchAdditionalDealsByStageId = withErrorLogging(
  fetchAdditionalDealsByStageIdFn,
  "dealService.fetchAdditionalDealsByStageId"
);

// Show Deal id //
const showDealFn = (dealId) => axios.get(`/deals/${dealId}`);
export const showDeal = withErrorLogging(showDealFn, "dealService.showDeal");

const createDealFn = (formData) => {
  return axios.post("/deals", formData);
};
export const createDeal = withErrorLogging(
  createDealFn,
  "dealService.createDeal"
);

const bulkUpdateDealsFn = async (ids, key, value) => {
  return await axios.patch("/deals/bulk-update", {
    ids,
    key: String(key),
    value: value,
  });
};
export const bulkUpdateDeals = withErrorLogging(
  bulkUpdateDealsFn,
  "dealService.bulkUpdateDeals"
);

const bulkDeleteDealsFn = async (ids) => {
  return await axios.delete("/deals/bulk-delete", {
    data: { ids },
  });
};
export const bulkDeleteDeals = withErrorLogging(
  bulkDeleteDealsFn,
  "dealService.bulkDeleteDeals"
);

const deleteDealsFn = (ids) => axios.delete(`/deals/${ids}`);
export const deleteDeals = withErrorLogging(
  deleteDealsFn,
  "dealService.deleteDeals"
);

const updateDealStageFn = (dealId, stageId) => {
  return axios.patch(`/deals/${dealId}`, {
    stage_id: stageId,
  });
};
export const updateDealStage = withErrorLogging(
  updateDealStageFn,
  "dealService.updateDealStage"
);

const addTagToDealFn = (dealId, tags) => {
  return axios.post(`/deals/${dealId}/add-tags`, {
    tags: tags,
  });
};
export const addTagToDeal = withErrorLogging(
  addTagToDealFn,
  "dealService.addTagToDeal"
);

const updateDealFn = (dealId, formData) => {
  const data = {
    ...formData,
    _method: "PUT",
  };
  return axios.post(`/deals/${dealId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const updateDeal = withErrorLogging(
  updateDealFn,
  "dealService.updateDeal"
);

const importDealsFn = (formData) => {
  return axios.post("/deals/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const importDeals = withErrorLogging(
  importDealsFn,
  "dealService.importDeals"
);

const addViewCountFn = (dealId) => {
  return axios.post(`/deals/add-view-count/${dealId}`);
};
export const addViewCount = withErrorLogging(
  addViewCountFn,
  "dealService.addViewCount"
);

const toggleHighlightFn = async (dealId) => {
  return await axios.post(`/deals/highlight/${dealId}`);
};
export const toggleHighlight = withErrorLogging(
  toggleHighlightFn,
  "dealService.toggleHighlight"
);

const pullDealsFromOldSystemFn = async () => {
  return await axios.get("/deals/pull-random");
};
export const pullDealsFromOldSystem = withErrorLogging(
  pullDealsFromOldSystemFn,
  "dealService.pullDealsFromOldSystem"
);

const mergeDealsFn = async (ids) => {
  return await axios.post("/deals/merge", {
    ids: ids,
  });
};
export const mergeDeals = withErrorLogging(
  mergeDealsFn,
  "dealService.mergeDeals"
);

const getAfterSalesKanbanFn = async (params = {}) => {
  return axios.get("/kanban/after-sales", {
    params,
  });
};
export const getAfterSalesKanban = withErrorLogging(
  getAfterSalesKanbanFn,
  "dealService.getAfterSalesKanban"
);

const moveToSalesEndStageFn = async (deal_id) => {
  return await axios.patch(`/deals/sales-end-stage/${deal_id}`);
};
export const moveToSalesEndStage = withErrorLogging(
  moveToSalesEndStageFn,
  "dealService.moveToSalesEndStage"
);

const updateHospitalPackageFn = async (data) => {
  return await axios.put(`/deals/updateHospitalPackage`, data);
};
export const updateHospitalPackage = withErrorLogging(
  updateHospitalPackageFn,
  "dealService.updateHospitalPackage"
);

const distributeInactiveDealsFn = async () => {
  return await axios.post(`/deals/force-roll`);
};
export const distributeInactiveDeals = withErrorLogging(
  distributeInactiveDealsFn,
  "dealService.distributeInactiveDeals"
);

const getRecontactCountsFn = async () => {
  return await axios.get(`/deals/recontact-counts`);
};
export const getRecontactCounts = withErrorLogging(
  getRecontactCountsFn,
  "dealService.getRecontactCounts"
);
