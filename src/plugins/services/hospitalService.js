import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const indexFn = () => {
  return axios.get("/hospitals");
};
export const index = withErrorLogging(indexFn, "hospitalService.index");

const allFn = () => {
  return axios.get("/hospitals/all");
};
export const all = withErrorLogging(allFn, "hospitalService.all");

const showFn = (hospitalId) => {
  return axios.get(`/hospitals/${hospitalId}`);
};
export const show = withErrorLogging(showFn, "hospitalService.show");

const createFn = (formData) => {
  return axios.post("/hospitals", formData);
};
export const create = withErrorLogging(createFn, "hospitalService.create");

const updateFn = (hospitalId, formData) => {
  return axios.put(`/hospitals/${hospitalId}`, formData);
};
export const update = withErrorLogging(updateFn, "hospitalService.update");

const destroyFn = (hospitalId) => {
  return axios.delete(`/hospitals/${hospitalId}`);
};
export const destroy = withErrorLogging(destroyFn, "hospitalService.destroy");
