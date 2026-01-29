import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _index = () => {
  return axios.get("/import-labels");
};

const _all = () => {
  return axios.get("/import-labels/all");
};

const _show = (import_label_id) => {
  return axios.get(`/import-labels/${import_label_id}`);
};

const _create = (data) => {
  return axios.post("/import-labels", data);
};

const _update = (import_label_id, data) => {
  return axios.put(`/import-labels/${import_label_id}`, data);
};

const _destroy = (import_label_id) => {
  return axios.delete(`/import-labels/${import_label_id}`);
};

export const index = withErrorLogging(_index, "importLabelService/index");
export const all = withErrorLogging(_all, "importLabelService/all");
export const show = withErrorLogging(_show, "importLabelService/show");
export const create = withErrorLogging(_create, "importLabelService/create");
export const update = withErrorLogging(_update, "importLabelService/update");
export const destroy = withErrorLogging(_destroy, "importLabelService/destroy");
