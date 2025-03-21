import axios from "@/plugins/axios";
import Cookies from "js-cookie";
// login
export const login = (credentials) => {
  return axios.post("/login", credentials);
};
// logout
export const logout = () => axios.post("/logout");
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
  axios.put(`/users/${userId}`, userData);
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
export const getDeals = () => axios.get("/deals");
// Show Deal id
export const showDeal = (dealId) => axios.get(`/deals/${dealId}`);
// Create New Deal
export const createDeal = (formData) => {
  return axios.post("/deals", formData);
};

// Add these functions to your service file
export const updateDealsStage = async (ids, stage) => {
  return await axios.post("/api/deals/update-stage", { ids, stage });
};

export const updateDealsSupervisor = async (ids, supervisor) => {
  return await axios.post("/api/deals/update-supervisor", { ids, supervisor });
};

export const updateDealsRepresentative = async (ids, representative) => {
  return await axios.post("/api/deals/update-representative", {
    ids,
    representative,
  });
};

export const updateDealsSource = async (ids, source) => {
  return await axios.post("/api/deals/update-source", { ids, source });
};

export const deleteDeals = async (ids) => {
  try {
    const response = await axios.delete("/api/deals/delete", {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error("Delete API Error:", error);
    throw error;
  }
};

// Get All Sources
export const getSources = () => axios.get("/sources");

// Get All Stages
export const getStages = () => axios.get("/stages");
// ------------------------------------------------------------
// Contacts
// get all contacts
// export const getContacts = () => axios.get("/contacts");
export const getContacts = async (params = {}) => {
  const token = Cookies.get("authToken");
  console.log("Fetching contacts with params:", params);

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

// Get All Translations
export const getTranslations = (locale) => {
  const token = Cookies.get("authToken");
  return axios.get(`/translations/all?locale=${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
