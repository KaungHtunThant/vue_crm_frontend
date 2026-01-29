import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/utils/errorLogger";

// get All users
const _getUser = async (params = {}) => {
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
const _getUserById = (userId) => {
  const token = Cookies.get("authToken");
  return axios.get(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Create New User //
const _createUser = (formData) => {
  return axios.post("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update User
const _updateUser = (userId, userData) => {
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
const _deleteUser = (userId) => {
  const token = Cookies.get("authToken");
  return axios.delete(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const _getAllUsers = async () => {
  return await axios.get("/users/all");
};

const _updateUserRating = async (userId, ratingId) => {
  return await axios.patch(`/users/${userId}/rating`, { rating_id: ratingId });
};

const _updateUserPackage = async (user_id, package_id) => {
  return await axios.patch(`/users/${user_id}/package`, {
    package_id: package_id,
  });
};

// Get All Roles
const _getRoles = () => axios.get("/roles");

const _getUserLoginLogs = (userId) => {
  const token = Cookies.get("authToken");
  return axios.get(`/logs/login-logs/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUser = withErrorLogging(_getUser, "userService/getUser");
export const getUserById = withErrorLogging(
  _getUserById,
  "userService/getUserById"
);
export const createUser = withErrorLogging(
  _createUser,
  "userService/createUser"
);
export const updateUser = withErrorLogging(
  _updateUser,
  "userService/updateUser"
);
export const deleteUser = withErrorLogging(
  _deleteUser,
  "userService/deleteUser"
);
export const getAllUsers = withErrorLogging(
  _getAllUsers,
  "userService/getAllUsers"
);
export const updateUserRating = withErrorLogging(
  _updateUserRating,
  "userService/updateUserRating"
);
export const updateUserPackage = withErrorLogging(
  _updateUserPackage,
  "userService/updateUserPackage"
);
export const getRoles = withErrorLogging(_getRoles, "userService/getRoles");
export const getUserLoginLogs = withErrorLogging(
  _getUserLoginLogs,
  "userService/getUserLoginLogs"
);
