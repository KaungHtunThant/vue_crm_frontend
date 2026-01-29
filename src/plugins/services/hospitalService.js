import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const indexBase = () => {
  return axios.get("/hospitals");
};

const allBase = () => {
  return axios.get("/hospitals/all");
};

const showBase = (hospitalId) => {
  return axios.get(`/hospitals/${hospitalId}`);
};

const createBase = (formData) => {
  return axios.post("/hospitals", formData);
};

const updateBase = (hospitalId, formData) => {
  return axios.put(`/hospitals/${hospitalId}`, formData);
};

const destroyBase = (hospitalId) => {
  return axios.delete(`/hospitals/${hospitalId}`);
};

export const index = withErrorLogging(indexBase, "index");
export const all = withErrorLogging(allBase, "all");
export const show = withErrorLogging(showBase, "show");
export const create = withErrorLogging(createBase, "create");
export const update = withErrorLogging(updateBase, "update");
export const destroy = withErrorLogging(destroyBase, "destroy");
