import axios from "@/plugins/axios";
import Cookies from "js-cookie";
// login
export const login = (credentials) => {
  return axios.post("/login", credentials);
};
// logout
export const logout = () => {
  const token = Cookies.get("authToken");
  axios.post("/logout", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// get All users
export const getUser = (filters) => {
  const token = Cookies.get("authToken");
  return axios.get("/users", {
    params: filters,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Create New User
export const createUser = (formData) => {
  return axios.post("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
// Update User
export const updateUser = (userId, userData) =>
  axios.patch(`/users/${userId}`, userData);
// Delete User
export const deleteUser = (userId) => {
  const token = Cookies.get("authToken");
  return axios.delete(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Get All Roles
export const getRoles = () => axios.get("/roles");
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
  filters
) => {
  return axios.get(`/deals/get-more`, {
    params: {
      stage_id: stageId,
      limit: limit,
      offset: offset,
      filters: filters,
    },
  });
};

export const fetchTasksCountByStageName = (stageName) => {
  const token = Cookies.get("authToken");
  return axios.get(`/tasks/count/${stageName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Show Deal id
export const showDeal = (dealId) => axios.get(`/deals/${dealId}`);
// Create New Deal
export const createDeal = (formData) => {
  return axios.post("/deals", formData);
};

// action deals updated
export const bulkUpdateDeals = async (ids, key, value) => {
  return await axios.patch("/deals/bulk-update", {
    ids,
    key: String(key),
    value: String(value),
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

// Get All Sources
export const getSources = () => axios.get("/sources");

// Get All Stages
export const getStages = () => axios.get("/stages");

export const getSpecialStages = () => axios.get("/stages/specials");

export const getStageTimers = async () => {
  return await axios.get("/settings/stages/timers");
};

export const updateStage = async (id, params) => {
  return await axios.patch(`/stages/${id}`, params);
};
// ------------------------------------------------------------
// Contacts
// get all contacts
export const getContacts = async (params = {}) => {
  const token = Cookies.get("authToken");
  return axios.get("/contacts", {
    params: {
      page: params.page || 1,
      per_page: params.per_page || 10,
      sort_by: params.sort_by || "id",
      sort_type: params.sort_type || "asc",
      ...params,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// create new contact
export const createContact = (formData) => {
  return axios.post("/contacts", formData);
};
// update contact
export const updateContact = (contactId, formData) =>
  axios.put(`/contacts/${contactId}`, formData);
// delete contact
export const deleteContact = (contactId) =>
  axios.delete(`/contacts/${contactId}`);

export const showContact = async (id) => {
  return await axios.get(`/contacts/${id}`);
};

export const getBackgroundImages = async () => {
  return await axios.get("/bg-images");
};
export const saveBackgroundId = async (id) => {
  return await axios.patch(`/bg-images/${id}`);
};
export const getBackgroundId = async (id) => {
  return await axios.get(`/bg-images/${id}`);
};
// Get All Translations
export const getTranslations = (locale) => {
  const token = Cookies.get("authToken");
  return axios.get(`/translations/all?locale=${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const saveUserLanguage = async (locale) => {
  const token = Cookies.get("authToken");
  return await axios.patch(`/translations/locale/${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDocuments = async () => {
  return await axios.get("/documents");
};
export const getAllUsers = async () => {
  return await axios.get("/users/all");
};

export const createDocuments = async (formData) => {
  try {
    const response = await axios.post("/documents", formData);
    return response;
  } catch (error) {
    console.error("❌ خطأ أثناء إنشاء المجلد:", error);
    throw error;
  }
};
// update Documents
export const updateDocuments = (documentsId, formData) =>
  axios.put(`/documents/${documentsId}`, formData);

// Delete documents
export const deleteDocuments = (documentsId) =>
  axios.delete(`/documents/${documentsId}`);

// update Files
export const updateFiles = (filesId, formData) =>
  axios.put(`/documents/files/${filesId}`, formData);

// Delete Files
export const deleteFiles = (filesId) =>
  axios.delete(`/documents/files/${filesId}`);

export const showDocuments = async (folderName) => {
  return await axios.get(`/documents/${folderName}`);
};

export const uploadFiles = async (formData) => {
  return await axios.post("/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
//getDealsKanban
// export const getDealsKanban = (searchText) => {
//   return axios.get("/kanban/deals", {
//     params: {
//       search: searchText ?? "",
//     },
//   });
// };
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
// Get Conversations
export const getconversations = (search, rating, stage) =>
  axios.get("/whatsapp", {
    params: { search: search, filters: { rating: rating, stage: stage } },
  });
// Get Conversation by contact id
export const fetchConversationByDealId = (id) =>
  axios.get(`/whatsapp/conversation/${id}`);
// Create Conversation by contact id
export const createConversation = (deal_id) => {
  return axios.post("/whatsapp/conversation", {
    deal_id: deal_id,
  });
};
// Get message by Conversation id
export const getMessageConv = async (id, params) => {
  return await axios.get(`/whatsapp/${id}`, {
    params: params,
  });
};
// send message
export const sendMessage = (messageData) => {
  const formData = new FormData();
  if (messageData.text_body) {
    formData.append("text_body", messageData.text_body);
  }
  if (messageData.file) {
    formData.append("file", messageData.file); // Assuming messageData.file is a Blob
  }
  if (messageData.conversation_id) {
    formData.append("conversation_id", messageData.conversation_id);
  }

  return axios.post("/whatsapp/send", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const sendInitMessage = (deal_id, conversation_id, init_message_id) => {
  return axios.post("/whatsapp/send-init", {
    deal_id: deal_id,
    conversation_id: conversation_id,
    init_message_id: init_message_id,
  });
};

export const sendGreetingMessage = (deal_id, conversation_id) => {
  return axios.post("/whatsapp/send-greeting", {
    deal_id: deal_id,
    conversation_id: conversation_id,
  });
};

export const getInitMessages = (type = "marketing") => {
  return axios.get(`/whatsapp/init-messages/${type}`);
};

export const changePinStatus = (id) => {
  return axios.post(`/whatsapp/conversation/pin/${id}`);
};

export const getMoreConversations = (offset, limit, filters, search) => {
  return axios.get("/whatsapp/conversations/more", {
    params: {
      offset: offset,
      limit: limit,
      filters: filters,
      search: search,
    },
  });
};
// create new comment
export const createComment = (formData) => {
  return axios.post("/comments", formData);
};
// create new task
export const createTask = (formData) => {
  return axios.post("/tasks", formData);
};
export const updateTask = async (id, formData) => {
  return await axios.patch(`/tasks/${id}`, formData);
};
// update deal
export const updateDeal = (dealId, formData) =>
  axios.put(`/deals/${dealId}`, formData);
export const importDeals = (formData) => {
  return axios.post("/deals/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getStagesTasks = async () => {
  return await axios.get("/stages/tasks");
};
export const addViewCount = (dealId) => {
  return axios.post(`/deals/add-view-count/${dealId}`);
};

// Broadcast services
export const getBroadcasts = async () => {
  return await axios.get("/settings/broadcasts");
};

export const getKanbanBroadcasts = async () => {
  return await axios.get("/kanban/broadcasts");
};

export const createBroadcast = async (description) => {
  return await axios.post("/settings/broadcasts", {
    description: description,
  });
};

export const updateBroadcastPosition = async (id, direction) => {
  return await axios.patch(`/settings/broadcasts/position/${id}/${direction}`);
};

export const updateBroadcast = async (id, description, status, important) => {
  return await axios.patch(`/settings/broadcasts/${id}`, {
    description: description,
    status: status,
    important: important,
  });
};

export const deleteBroadcast = async (id) => {
  return await axios.delete(`/settings/broadcasts/${id}`);
};

export const getLogsByDealId = async (dealId) => {
  return await axios.get(`/logs/deal/${dealId}`);
};
