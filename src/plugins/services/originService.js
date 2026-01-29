import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getIndexFn = async () => {
  return await axios.get("/origins");
};
export const getIndex = withErrorLogging(getIndexFn, "originService.getIndex");

const getAllFn = async () => {
  return await axios.get("/origins/all");
};
export const getAll = withErrorLogging(getAllFn, "originService.getAll");

const getByIdFn = async (id) => {
  return await axios.get(`/origins/${id}`);
};
export const getById = withErrorLogging(getByIdFn, "originService.getById");

const createFn = async (data) => {
  return await axios.post("/origins", data);
};
export const create = withErrorLogging(createFn, "originService.create");

const updateFn = async (id, data) => {
  return await axios.put(`/origins/${id}`, data);
};
export const update = withErrorLogging(updateFn, "originService.update");

const removeFn = async (id) => {
  return await axios.delete(`/origins/${id}`);
};
export const remove = withErrorLogging(removeFn, "originService.remove");
