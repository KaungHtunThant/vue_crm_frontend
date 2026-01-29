import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/utils/errorLogger";

// get All users
const getUserBase = async (params = {}) => {
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
const getUserByIdBase = (userId) => {
  const token = Cookies.get("authToken");
  return axios.get(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Create New User //
const createUserBase = (formData) => {
  return axios.post("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update User
const updateUserBase = (userId, userData) => {
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
const deleteUserBase = (userId) => {
  const token = Cookies.get("authToken");
  return axios.delete(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAllUsersBase = async () => {
  return await axios.get("/users/all");
};

const updateUserRatingBase = async (userId, ratingId) => {
  return await axios.patch(`/users/${userId}/rating`, { rating_id: ratingId });
};

const updateUserPackageBase = async (user_id, package_id) => {
  return await axios.patch(`/users/${user_id}/package`, {
    package_id: package_id,
  });
};

// Get All Roles
const getRolesBase = () => axios.get("/roles");

const getUserLoginLogsBase = (userId) => {
  const token = Cookies.get("authToken");
  return axios.get(`/logs/login-logs/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUser = withErrorLogging(getUserBase, "getUser");
export const getUserById = withErrorLogging(getUserByIdBase, "getUserById");
export const createUser = withErrorLogging(createUserBase, "createUser");
export const updateUser = withErrorLogging(updateUserBase, "updateUser");
export const deleteUser = withErrorLogging(deleteUserBase, "deleteUser");
export const getAllUsers = withErrorLogging(getAllUsersBase, "getAllUsers");
export const updateUserRating = withErrorLogging(
  updateUserRatingBase,
  "updateUserRating"
);
export const updateUserPackage = withErrorLogging(
  updateUserPackageBase,
  "updateUserPackage"
);
export const getRoles = withErrorLogging(getRolesBase, "getRoles");
export const getUserLoginLogs = withErrorLogging(
  getUserLoginLogsBase,
  "getUserLoginLogs"
);
