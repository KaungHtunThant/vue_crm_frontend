import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getIndexFn = async () => {
  return await axios.get("/roles");
};
export const getIndex = withErrorLogging(getIndexFn, "roleService.getIndex");

const getAllFn = async () => {
  return await axios.get("/roles/all");
};
export const getAll = withErrorLogging(getAllFn, "roleService.getAll");

const getRoleByIdFn = async (id) => {
  return await axios.get(`/roles/${id}`);
};
export const getRoleById = withErrorLogging(
  getRoleByIdFn,
  "roleService.getRoleById"
);

const createRoleFn = async (data) => {
  return await axios.post("/roles", data);
};
export const createRole = withErrorLogging(
  createRoleFn,
  "roleService.createRole"
);

const updateRoleFn = async (id, data) => {
  return await axios.put(`/roles/${id}`, data);
};
export const updateRole = withErrorLogging(
  updateRoleFn,
  "roleService.updateRole"
);

const deleteRoleFn = async (id) => {
  return await axios.delete(`/roles/${id}`);
};
export const deleteRole = withErrorLogging(
  deleteRoleFn,
  "roleService.deleteRole"
);
