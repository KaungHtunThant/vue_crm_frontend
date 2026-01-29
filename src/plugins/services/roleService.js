import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getIndex = async () => {
  return await axios.get("/roles");
};

const _getAll = async () => {
  return await axios.get("/roles/all");
};

const _getRoleById = async (id) => {
  return await axios.get(`/roles/${id}`);
};

const _createRole = async (data) => {
  return await axios.post("/roles", data);
};

const _updateRole = async (id, data) => {
  return await axios.put(`/roles/${id}`, data);
};

const _deleteRole = async (id) => {
  return await axios.delete(`/roles/${id}`);
};

export const getIndex = withErrorLogging(_getIndex, "roleService/getIndex");
export const getAll = withErrorLogging(_getAll, "roleService/getAll");
export const getRoleById = withErrorLogging(
  _getRoleById,
  "roleService/getRoleById"
);
export const createRole = withErrorLogging(
  _createRole,
  "roleService/createRole"
);
export const updateRole = withErrorLogging(
  _updateRole,
  "roleService/updateRole"
);
export const deleteRole = withErrorLogging(
  _deleteRole,
  "roleService/deleteRole"
);
