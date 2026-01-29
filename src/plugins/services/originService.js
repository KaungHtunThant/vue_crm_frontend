import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getIndexBase = async () => {
  return await axios.get("/origins");
};

const getAllBase = async () => {
  return await axios.get("/origins/all");
};

const getByIdBase = async (id) => {
  return await axios.get(`/origins/${id}`);
};

const createBase = async (data) => {
  return await axios.post("/origins", data);
};

const updateBase = async (id, data) => {
  return await axios.put(`/origins/${id}`, data);
};

const removeBase = async (id) => {
  return await axios.delete(`/origins/${id}`);
};

export const getIndex = withErrorLogging(getIndexBase, "getIndex");
export const getAll = withErrorLogging(getAllBase, "getAll");
export const getById = withErrorLogging(getByIdBase, "getById");
export const create = withErrorLogging(createBase, "create");
export const update = withErrorLogging(updateBase, "update");
export const remove = withErrorLogging(removeBase, "remove");
