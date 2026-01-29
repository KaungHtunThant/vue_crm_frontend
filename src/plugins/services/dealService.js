import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/utils/errorLogger";

// Get All Deals
const getDealsBase = async (params = {}) => {
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

const fetchAdditionalDealsByStageIdBase = (
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

// Show Deal id //
const showDealBase = (dealId) => axios.get(`/deals/${dealId}`);

const createDealBase = (formData) => {
  return axios.post("/deals", formData);
};

const bulkUpdateDealsBase = async (ids, key, value) => {
  return await axios.patch("/deals/bulk-update", {
    ids,
    key: String(key),
    value: value,
  });
};

const bulkDeleteDealsBase = async (ids) => {
  return await axios.delete("/deals/bulk-delete", {
    data: { ids },
  });
};

const deleteDealsBase = (ids) => axios.delete(`/deals/${ids}`);

const updateDealStageBase = (dealId, stageId) => {
  return axios.patch(`/deals/${dealId}`, {
    stage_id: stageId,
  });
};

const addTagToDealBase = (dealId, tags) => {
  return axios.post(`/deals/${dealId}/add-tags`, {
    tags: tags,
  });
};

const updateDealBase = (dealId, formData) => {
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

const importDealsBase = (formData) => {
  return axios.post("/deals/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const addViewCountBase = (dealId) => {
  return axios.post(`/deals/add-view-count/${dealId}`);
};

const toggleHighlightBase = async (dealId) => {
  return await axios.post(`/deals/highlight/${dealId}`);
};

const pullDealsFromOldSystemBase = async () => {
  return await axios.get("/deals/pull-random");
};

const mergeDealsBase = async (ids) => {
  return await axios.post("/deals/merge", {
    ids: ids,
  });
};

const getAfterSalesKanbanBase = async (params = {}) => {
  return axios.get("/kanban/after-sales", {
    params,
  });
};

const moveToSalesEndStageBase = async (deal_id) => {
  return await axios.patch(`/deals/sales-end-stage/${deal_id}`);
};

const updateHospitalPackageBase = async (data) => {
  return await axios.put(`/deals/updateHospitalPackage`, data);
};

const distributeInactiveDealsBase = async () => {
  return await axios.post(`/deals/force-roll`);
};

const getRecontactCountsBase = async () => {
  return await axios.get(`/deals/recontact-counts`);
};

export const getDeals = withErrorLogging(getDealsBase, "getDeals");
export const fetchAdditionalDealsByStageId = withErrorLogging(
  fetchAdditionalDealsByStageIdBase,
  "fetchAdditionalDealsByStageId"
);
export const showDeal = withErrorLogging(showDealBase, "showDeal");
export const createDeal = withErrorLogging(createDealBase, "createDeal");
export const bulkUpdateDeals = withErrorLogging(
  bulkUpdateDealsBase,
  "bulkUpdateDeals"
);
export const bulkDeleteDeals = withErrorLogging(
  bulkDeleteDealsBase,
  "bulkDeleteDeals"
);
export const deleteDeals = withErrorLogging(deleteDealsBase, "deleteDeals");
export const updateDealStage = withErrorLogging(
  updateDealStageBase,
  "updateDealStage"
);
export const addTagToDeal = withErrorLogging(addTagToDealBase, "addTagToDeal");
export const updateDeal = withErrorLogging(updateDealBase, "updateDeal");
export const importDeals = withErrorLogging(importDealsBase, "importDeals");
export const addViewCount = withErrorLogging(addViewCountBase, "addViewCount");
export const toggleHighlight = withErrorLogging(
  toggleHighlightBase,
  "toggleHighlight"
);
export const pullDealsFromOldSystem = withErrorLogging(
  pullDealsFromOldSystemBase,
  "pullDealsFromOldSystem"
);
export const mergeDeals = withErrorLogging(mergeDealsBase, "mergeDeals");
export const getAfterSalesKanban = withErrorLogging(
  getAfterSalesKanbanBase,
  "getAfterSalesKanban"
);
export const moveToSalesEndStage = withErrorLogging(
  moveToSalesEndStageBase,
  "moveToSalesEndStage"
);
export const updateHospitalPackage = withErrorLogging(
  updateHospitalPackageBase,
  "updateHospitalPackage"
);
export const distributeInactiveDeals = withErrorLogging(
  distributeInactiveDealsBase,
  "distributeInactiveDeals"
);
export const getRecontactCounts = withErrorLogging(
  getRecontactCountsBase,
  "getRecontactCounts"
);
