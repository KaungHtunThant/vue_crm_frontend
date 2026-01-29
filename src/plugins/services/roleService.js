import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getIndexBase = async () => {
  return await axios.get("/roles");
};

const getAllBase = async () => {
  return await axios.get("/roles/all");
};

const getRoleByIdBase = async (id) => {
  return await axios.get(`/roles/${id}`);
};

const createRoleBase = async (data) => {
  return await axios.post("/roles", data);
};

const updateRoleBase = async (id, data) => {
  return await axios.put(`/roles/${id}`, data);
};

const deleteRoleBase = async (id) => {
  return await axios.delete(`/roles/${id}`);
};

export const getIndex = withErrorLogging(getIndexBase, "getIndex");
export const getAll = withErrorLogging(getAllBase, "getAll");
export const getRoleById = withErrorLogging(getRoleByIdBase, "getRoleById");
export const createRole = withErrorLogging(createRoleBase, "createRole");
export const updateRole = withErrorLogging(updateRoleBase, "updateRole");
export const deleteRole = withErrorLogging(deleteRoleBase, "deleteRole");
