import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const indexBase = () => {
  return axios.get("/import-labels");
};

const allBase = () => {
  return axios.get("/import-labels/all");
};

const showBase = (import_label_id) => {
  return axios.get(`/import-labels/${import_label_id}`);
};

const createBase = (data) => {
  return axios.post("/import-labels", data);
};

const updateBase = (import_label_id, data) => {
  return axios.put(`/import-labels/${import_label_id}`, data);
};

const destroyBase = (import_label_id) => {
  return axios.delete(`/import-labels/${import_label_id}`);
};

export const index = withErrorLogging(indexBase, "index");
export const all = withErrorLogging(allBase, "all");
export const show = withErrorLogging(showBase, "show");
export const create = withErrorLogging(createBase, "create");
export const update = withErrorLogging(updateBase, "update");
export const destroy = withErrorLogging(destroyBase, "destroy");
