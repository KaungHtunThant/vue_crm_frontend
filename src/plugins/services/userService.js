import axios from "@/plugins/axios";
import Cookies from "js-cookie";

// get All users
export const getUser = async (params = {}) => {
  const token = Cookies.get("authToken");
  return axios.get("/users", {
    params: {
      page: params.page || 1,
      per_page: params.per_page || 10,
      sort_by: params.sort_by || "id",
      sort_type: params.sort_type || "desc",
      ...params,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get User by ID
export const getUserById = (userId) => {
  const token = Cookies.get("authToken");
  return axios.get(`/users/${userId}`, {
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

// Delete User by ID
export const deleteUser = (userId) => {
  const token = Cookies.get("authToken");
  return axios.delete(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get All Users
export const getAllUsers = async () => {
  return await axios.get("/users/all");
};

// Save User Language
export const saveUserLanguage = async (locale) => {
  const token = Cookies.get("authToken");
  return await axios.patch(`/translations/locale/${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
