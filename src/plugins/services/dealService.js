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

// Show Deal id //
export const showDeal = (dealId) => axios.get(`/deals/${dealId}`);

export const createDeal = (formData) => {
  return axios.post("/deals", formData);
};

export const bulkUpdateDeals = async (ids, key, value) => {
  return await axios.patch("/deals/bulk-update", {
    ids,
    key: String(key),
    value: value,
  });
};

export const bulkDeleteDeals = async (ids) => {
  return await axios.delete("/deals/bulk-delete", {
    data: { ids },
  });
};

export const deleteDeals = (ids) => axios.delete(`/deals/${ids}`);

export const updateDealStage = (dealId, stageId) => {
  return axios.patch(`/deals/${dealId}`, {
    stage_id: stageId,
  });
};

export const addTagToDeal = (dealId, tags) => {
  return axios.post(`/deals/${dealId}/add-tags`, {
    tags: tags,
  });
};

export const updateDeal = (dealId, formData) => {
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

export const importDeals = (formData) => {
  return axios.post("/deals/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const addViewCount = (dealId) => {
  return axios.post(`/deals/add-view-count/${dealId}`);
};

export const toggleHighlight = async (dealId) => {
  return await axios.post(`/deals/highlight/${dealId}`);
};

export const pullDealsFromOldSystem = async () => {
  return await axios.get("/deals/pull-random");
};

export const mergeDeals = async (ids) => {
  return await axios.post("/deals/merge", {
    ids: ids,
  });
};

export const getAfterSalesKanban = async (params = {}) => {
  return axios.get("/kanban/after-sales", {
    params,
  });
};
