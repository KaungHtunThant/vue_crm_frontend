import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _index = () => {
  return axios.get("/hospitals");
};

const _all = () => {
  return axios.get("/hospitals/all");
};

const _show = (hospitalId) => {
  return axios.get(`/hospitals/${hospitalId}`);
};

const _create = (formData) => {
  return axios.post("/hospitals", formData);
};

const _update = (hospitalId, formData) => {
  return axios.put(`/hospitals/${hospitalId}`, formData);
};

const _destroy = (hospitalId) => {
  return axios.delete(`/hospitals/${hospitalId}`);
};

export const index = withErrorLogging(_index, "hospitalService/index");
export const all = withErrorLogging(_all, "hospitalService/all");
export const show = withErrorLogging(_show, "hospitalService/show");
export const create = withErrorLogging(_create, "hospitalService/create");
export const update = withErrorLogging(_update, "hospitalService/update");
export const destroy = withErrorLogging(_destroy, "hospitalService/destroy");
