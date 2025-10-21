import axios from "@/plugins/axios";
import Cookies from "js-cookie";

// Get All Deals
export const getDeals = async (params = {}) => {
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

// Fetch Additional Deals by Stage ID
export const fetchAdditionalDealsByStageId = (
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

// Show Deal id
export const showDeal = (dealId) => axios.get(`/deals/${dealId}`);
// Create New Deal
export const createDeal = (formData) => {
  return axios.post("/deals", formData);
};

// update deal
export const updateDeal = (dealId, formData) => {
  const data = {
    ...formData,
    _method: "PUT", // This is to ensure the server recognizes it as an update
  };
  return axios.post(`/deals/${dealId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// update deal stage
export const updateDealStage = (dealId, stageId) => {
  return axios.patch(`/deals/${dealId}`, {
    stage_id: stageId,
  });
};

// add tag to deal
export const addTagToDeal = (dealId, tags) => {
  return axios.post(`/deals/${dealId}/add-tags`, {
    tags: tags,
  });
};

// action deals updated
export const bulkUpdateDeals = async (ids, key, value) => {
  return await axios.patch("/deals/bulk-update", {
    ids,
    key: String(key),
    value: value,
  });
};

// bulk delete deals
export const bulkDeleteDeals = async (ids) => {
  return await axios.delete("/deals/bulk-delete", {
    data: { ids },
  });
};

// delete deal by id
export const deleteDeals = (ids) => axios.delete(`/deals/${ids}`);

// toggle highlight
export const toggleHighlight = async (dealId) => {
  return await axios.post(`/deals/highlight/${dealId}`);
};

// add view count
export const addViewCount = (dealId) => {
  return axios.post(`/deals/add-view-count/${dealId}`);
};

// import deals
export const importDeals = (formData) => {
  return axios.post("/deals/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// pull deals from old system
export const pullDealsFromOldSystem = async () => {
  return await axios.get("/deals/pull-random");
};

// get deals kanban
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

// Get All Sources
export const getSources = () => axios.get("/sources");

export const mergeDeals = async (ids) => {
  return await axios.post("/deals/merge", {
    ids: ids,
  });
};
