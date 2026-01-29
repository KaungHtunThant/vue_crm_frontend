import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/utils/errorLogger";

// Get All Deals
const _getDeals = async (params = {}) => {
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

const _fetchAdditionalDealsByStageId = (
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
const _showDeal = (dealId) => axios.get(`/deals/${dealId}`);

const _createDeal = (formData) => {
  return axios.post("/deals", formData);
};

const _bulkUpdateDeals = async (ids, key, value) => {
  return await axios.patch("/deals/bulk-update", {
    ids,
    key: String(key),
    value: value,
  });
};

const _bulkDeleteDeals = async (ids) => {
  return await axios.delete("/deals/bulk-delete", {
    data: { ids },
  });
};

const _deleteDeals = (ids) => axios.delete(`/deals/${ids}`);

const _updateDealStage = (dealId, stageId) => {
  return axios.patch(`/deals/${dealId}`, {
    stage_id: stageId,
  });
};

const _addTagToDeal = (dealId, tags) => {
  return axios.post(`/deals/${dealId}/add-tags`, {
    tags: tags,
  });
};

const _updateDeal = (dealId, formData) => {
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

const _importDeals = (formData) => {
  return axios.post("/deals/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const _addViewCount = (dealId) => {
  return axios.post(`/deals/add-view-count/${dealId}`);
};

const _toggleHighlight = async (dealId) => {
  return await axios.post(`/deals/highlight/${dealId}`);
};

const _pullDealsFromOldSystem = async () => {
  return await axios.get("/deals/pull-random");
};

const _mergeDeals = async (ids) => {
  return await axios.post("/deals/merge", {
    ids: ids,
  });
};

const _getAfterSalesKanban = async (params = {}) => {
  return axios.get("/kanban/after-sales", {
    params,
  });
};

const _moveToSalesEndStage = async (deal_id) => {
  return await axios.patch(`/deals/sales-end-stage/${deal_id}`);
};

const _updateHospitalPackage = async (data) => {
  return await axios.put(`/deals/updateHospitalPackage`, data);
};

const _distributeInactiveDeals = async () => {
  return await axios.post(`/deals/force-roll`);
};

const _getRecontactCounts = async () => {
  return await axios.get(`/deals/recontact-counts`);
};

export const getDeals = withErrorLogging(_getDeals, "dealService/getDeals");
export const fetchAdditionalDealsByStageId = withErrorLogging(
  _fetchAdditionalDealsByStageId,
  "dealService/fetchAdditionalDealsByStageId"
);
export const showDeal = withErrorLogging(_showDeal, "dealService/showDeal");
export const createDeal = withErrorLogging(
  _createDeal,
  "dealService/createDeal"
);
export const bulkUpdateDeals = withErrorLogging(
  _bulkUpdateDeals,
  "dealService/bulkUpdateDeals"
);
export const bulkDeleteDeals = withErrorLogging(
  _bulkDeleteDeals,
  "dealService/bulkDeleteDeals"
);
export const deleteDeals = withErrorLogging(
  _deleteDeals,
  "dealService/deleteDeals"
);
export const updateDealStage = withErrorLogging(
  _updateDealStage,
  "dealService/updateDealStage"
);
export const addTagToDeal = withErrorLogging(
  _addTagToDeal,
  "dealService/addTagToDeal"
);
export const updateDeal = withErrorLogging(
  _updateDeal,
  "dealService/updateDeal"
);
export const importDeals = withErrorLogging(
  _importDeals,
  "dealService/importDeals"
);
export const addViewCount = withErrorLogging(
  _addViewCount,
  "dealService/addViewCount"
);
export const toggleHighlight = withErrorLogging(
  _toggleHighlight,
  "dealService/toggleHighlight"
);
export const pullDealsFromOldSystem = withErrorLogging(
  _pullDealsFromOldSystem,
  "dealService/pullDealsFromOldSystem"
);
export const mergeDeals = withErrorLogging(
  _mergeDeals,
  "dealService/mergeDeals"
);
export const getAfterSalesKanban = withErrorLogging(
  _getAfterSalesKanban,
  "dealService/getAfterSalesKanban"
);
export const moveToSalesEndStage = withErrorLogging(
  _moveToSalesEndStage,
  "dealService/moveToSalesEndStage"
);
export const updateHospitalPackage = withErrorLogging(
  _updateHospitalPackage,
  "dealService/updateHospitalPackage"
);
export const distributeInactiveDeals = withErrorLogging(
  _distributeInactiveDeals,
  "dealService/distributeInactiveDeals"
);
export const getRecontactCounts = withErrorLogging(
  _getRecontactCounts,
  "dealService/getRecontactCounts"
);
