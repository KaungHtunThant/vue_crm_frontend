import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getIndex = async () => {
  return await axios.get("/origins");
};

const _getAll = async () => {
  return await axios.get("/origins/all");
};

const _getById = async (id) => {
  return await axios.get(`/origins/${id}`);
};

const _create = async (data) => {
  return await axios.post("/origins", data);
};

const _update = async (id, data) => {
  return await axios.put(`/origins/${id}`, data);
};

const _remove = async (id) => {
  return await axios.delete(`/origins/${id}`);
};

export const getIndex = withErrorLogging(_getIndex, "originService/getIndex");
export const getAll = withErrorLogging(_getAll, "originService/getAll");
export const getById = withErrorLogging(_getById, "originService/getById");
export const create = withErrorLogging(_create, "originService/create");
export const update = withErrorLogging(_update, "originService/update");
export const remove = withErrorLogging(_remove, "originService/remove");
