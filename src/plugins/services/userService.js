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

// Create New User //
export const createUser = (formData) => {
  return axios.post("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update User
export const updateUser = (userId, userData) => {
  const token = Cookies.get("authToken");
  return axios.post(
    `/users/${userId}`,
    {
      ...userData,
      _method: "PUT",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// Delete User
export const deleteUser = (userId) => {
  const token = Cookies.get("authToken");
  return axios.delete(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllUsers = async () => {
  return await axios.get("/users/all");
};

export const updateUserRating = async (userId, ratingId) => {
  return await axios.patch(`/users/${userId}/rating`, { rating_id: ratingId });
};

// Get All Roles
export const getRoles = () => axios.get("/roles");
