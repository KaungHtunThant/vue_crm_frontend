import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/plugins/errorLogger";

// get All users
const getUserFn = async (params = {}) => {
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
export const getUser = withErrorLogging(getUserFn, "userService.getUser");

// Get User by ID
const getUserByIdFn = (userId) => {
  const token = Cookies.get("authToken");
  return axios.get(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getUserById = withErrorLogging(getUserByIdFn, "userService.getUserById");

// Create New User //
const createUserFn = (formData) => {
  return axios.post("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createUser = withErrorLogging(createUserFn, "userService.createUser");

// Update User
const updateUserFn = (userId, userData) => {
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
export const updateUser = withErrorLogging(updateUserFn, "userService.updateUser");

// Delete User
const deleteUserFn = (userId) => {
  const token = Cookies.get("authToken");
  return axios.delete(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteUser = withErrorLogging(deleteUserFn, "userService.deleteUser");

const getAllUsersFn = async () => {
  return await axios.get("/users/all");
};
export const getAllUsers = withErrorLogging(getAllUsersFn, "userService.getAllUsers");

const updateUserRatingFn = async (userId, ratingId) => {
  return await axios.patch(`/users/${userId}/rating`, { rating_id: ratingId });
};
export const updateUserRating = withErrorLogging(updateUserRatingFn, "userService.updateUserRating");

const updateUserPackageFn = async (user_id, package_id) => {
  return await axios.patch(`/users/${user_id}/package`, {
    package_id: package_id,
  });
};
export const updateUserPackage = withErrorLogging(updateUserPackageFn, "userService.updateUserPackage");

// Get All Roles
const getRolesFn = () => axios.get("/roles");
export const getRoles = withErrorLogging(getRolesFn, "userService.getRoles");

const getUserLoginLogsFn = (userId) => {
  const token = Cookies.get("authToken");
  return axios.get(`/logs/login-logs/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getUserLoginLogs = withErrorLogging(getUserLoginLogsFn, "userService.getUserLoginLogs");
